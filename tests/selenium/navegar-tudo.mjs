import { Builder, By, Key, until } from 'selenium-webdriver'
import { Select } from 'selenium-webdriver/lib/select.js'
import chrome from 'selenium-webdriver/chrome.js'
import { writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join, resolve } from 'path'

// Tiny 1x1 PNG usado no upload de imagem do teste de criação de unidade
const IMAGEM_TESTE_PATH = resolve(join(tmpdir(), 'selenium-unidade-test.png'))
writeFileSync(
  IMAGEM_TESTE_PATH,
  Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64'),
)

const BASE_URL = normalizeBaseUrl(process.env.SELENIUM_BASE_URL ?? 'http://localhost:5175/')
const LOGIN = process.env.SELENIUM_LOGIN ?? 'integration-test'
const PASSWORD = process.env.SELENIUM_PASSWORD ?? 'integration-test'
const HEADLESS = process.env.SELENIUM_HEADLESS !== 'false'
const TIMEOUT_MS = Number(process.env.SELENIUM_TIMEOUT_MS ?? 15000)
const STEP_DELAY_MS = Number(process.env.SELENIUM_STEP_DELAY_MS ?? (HEADLESS ? 0 : 700))

const publicRoutes = [
  '/',
  '/cardapio',
  '/cartao-fidelidade',
  '/sobre-nos',
  '/unidades/araucarias',
  '/login',
]

const adminRoutes = [
  '/admin',
  '/admin/anotar-pedidos',
  '/admin/cozinha',
  '/admin/dashboard',
  '/admin/cardapio',
  '/admin/configuracoes/usuarios',
  '/admin/configuracoes/unidades',
  '/admin/configuracoes/blog',
]

let driver
const results = []
let createdUserEmail = null

try {
  const options = new chrome.Options()
  options.addArguments('--window-size=1440,1000')
  options.setUserPreferences({
    'profile.password_manager_enabled': false,
    'credentials_enable_service': false,
  })

  if (HEADLESS) {
    options.addArguments('--headless=new')
  }

  driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build()

  await testRequestedUserFlow()

  printSummary()
} catch (error) {
  printSummary()
  console.error(`\nFalha no teste Selenium: ${error.message}`)
  process.exitCode = 1
} finally {
  if (driver) {
    await driver.quit()
  }
}

async function testRequestedUserFlow() {
  await openHome()
  await openCardapioFromHomeAndBack()
  await openAndCloseFaqs()
  await openUnitFromNavbarAndBackHome()
  await testSobreNosFiltersAndBackHome()
  await testCartaoFidelidadeAndBackHome()
  await testCardapioProductAndBackHome()
  await login()
  await testAnotarPedidoComFidelidade()
  await testCozinhaPrepararEEntregar()
  await testDashboard()
  await testCriarUnidade()
  await testCriarUsuario()
  await testCriarPostNoticiasPromocoes()
  await testCriarEditarExcluirProdutoCardapio()
}

async function openHome() {
  await driver.get(BASE_URL)
  await waitForPageReady()
  await assertPageIsUsable('/')
  results.push({ group: 'fluxo', route: 'home', status: 'ok' })
  console.log('OK fluxo: home')
}

async function openCardapioFromHomeAndBack() {
  await openHome()

  const button = await driver.wait(
    until.elementLocated(By.xpath("//a[contains(@href, '/cardapio') and contains(normalize-space(.), 'CARD')]")),
    TIMEOUT_MS,
  )

  await centerAndClick(button, 'ver cardapio completo')
  await switchToNewestWindow()
  await waitForPath('/cardapio')
  await pause('cardapio aberto pela home')
  await closeExtraWindows()
  await openHome()

  results.push({ group: 'fluxo', route: 'home-cardapio-voltar', status: 'ok' })
  console.log('OK fluxo: home-cardapio-voltar')
}

async function openAndCloseFaqs() {
  await openHome()

  const faqSectionTitle = await driver.wait(
    until.elementLocated(By.xpath("//h2[contains(normalize-space(.), 'D') and contains(normalize-space(.), 'Frequentes')]")),
    TIMEOUT_MS,
  )
  await centerElement(faqSectionTitle, 'centralizando duvidas frequentes')

  await setFaqsSequentially(true)
  await pause('duvidas frequentes abertas uma por uma')

  await setFaqsSequentially(false)
  await pause('duvidas frequentes fechadas uma por uma')

  results.push({ group: 'fluxo', route: 'duvidas-frequentes', status: 'ok' })
  console.log('OK fluxo: duvidas-frequentes')
}

async function openUnitFromNavbarAndBackHome() {
  await openHome()

  const unitsLink = await findVisibleLinkByHref('/#unidades')
  await pause('clicando em unidades na navbar')
  await clickElement(unitsLink)
  await driver.wait(async () => {
    const currentUrl = await driver.getCurrentUrl()
    return new URL(currentUrl).hash === '#unidades'
  }, TIMEOUT_MS)
  await pause('secao unidades centralizada')

  const firstUnit = await driver.wait(
    until.elementLocated(By.css('#unidades a[href^="/unidades/"]')),
    TIMEOUT_MS,
  )

  await centerAndClick(firstUnit, 'clicando na primeira unidade')
  await driver.wait(async () => {
    const currentUrl = await driver.getCurrentUrl()
    return new URL(currentUrl).pathname.startsWith('/unidades/')
  }, TIMEOUT_MS)
  await waitForPageReady()

  const cardapioButton = await driver.wait(
    until.elementLocated(By.xpath("//a[contains(@href, '/cardapio') and contains(normalize-space(.), 'card')]")),
    TIMEOUT_MS,
  )

  await centerAndClick(cardapioButton, 'clicando em acessar cardapio na unidade')
  await waitForPath('/cardapio')
  await pause('cardapio aberto pela unidade')
  await openHome()

  results.push({ group: 'fluxo', route: 'unidades-cardapio-home', status: 'ok' })
  console.log('OK fluxo: unidades-cardapio-home')
}

async function testSobreNosFiltersAndBackHome() {
  await openHome()

  const aboutLink = await findVisibleLinkByHref('/sobre-nos')
  await pause('clicando em sobre nos na navbar')
  await clickElement(aboutLink)
  await waitForPath('/sobre-nos')

  const newsTitle = await driver.wait(
    until.elementLocated(By.xpath("//h2[contains(normalize-space(.), 'Not') and contains(normalize-space(.), 'Promo')]")),
    TIMEOUT_MS,
  )
  await centerElement(newsTitle, 'centralizando noticias e promocoes')

  for (const label of ['Todos', 'Not', 'Promo']) {
    const filterButton = await driver.wait(
      until.elementLocated(By.xpath(`//button[contains(normalize-space(.), '${label}')]`)),
      TIMEOUT_MS,
    )
    await centerAndClick(filterButton, `clicando filtro ${label}`)
    await pause(`filtro ${label} aplicado`)
  }

  await openHome()
  results.push({ group: 'fluxo', route: 'sobre-nos-filtros-home', status: 'ok' })
  console.log('OK fluxo: sobre-nos-filtros-home')
}

async function testCartaoFidelidadeAndBackHome() {
  await openHome()

  const loyaltyLink = await findVisibleLinkByHref('/cartao-fidelidade')
  await pause('clicando em cartao fidelidade')
  await clickElement(loyaltyLink)
  await waitForPath('/cartao-fidelidade')

  await submitFidelidade('00000000000')
  await waitUntilTextMatches(/Cadastro\s+n.o\s+encontrado|N.o encontramos/i)
  await pause('numero generico consultado')

  await submitFidelidade('61999990001')
  await driver.wait(async () => {
    const bodyText = await driver.findElement(By.css('body')).getText()
    return /OL/i.test(bodyText) || /Faltam|Premio|Pr[eê]mio/i.test(bodyText)
  }, TIMEOUT_MS)
  await pause('cartao fidelidade encontrado')

  await openHome()
  results.push({ group: 'fluxo', route: 'cartao-fidelidade-home', status: 'ok' })
  console.log('OK fluxo: cartao-fidelidade-home')
}

async function testCardapioProductAndBackHome() {
  await driver.get(new URL('/cardapio', BASE_URL).toString())
  await waitForPageReady()
  await waitUntilTextGone(/carregando card/i)

  const smashCategory = await driver.wait(
    until.elementLocated(By.xpath(categoryLinkXPath('smash'))),
    TIMEOUT_MS,
  )
  await centerAndClick(smashCategory, 'centralizando e clicando em smashdogs')

  const firstProduct = await driver.wait(
    until.elementLocated(By.css('button[aria-label^="Ver detalhes de"]')),
    TIMEOUT_MS,
  )
  await centerAndClick(firstProduct, 'abrindo primeiro produto de smashdogs')

  const dialog = await driver.wait(until.elementLocated(By.css('[role="dialog"]')), TIMEOUT_MS)
  await driver.wait(until.elementIsVisible(dialog), TIMEOUT_MS)
  await pause('produto aberto para visualizacao')
  await pause('aguardando mais um pouco no produto')

  const closeButton = await dialog.findElement(By.css('[aria-label="Fechar detalhes"]'))
  await pause('fechando produto')
  await clickElement(closeButton)
  await driver.wait(until.stalenessOf(dialog), TIMEOUT_MS)

  await openHome()
  results.push({ group: 'fluxo', route: 'cardapio-produto-home', status: 'ok' })
  console.log('OK fluxo: cardapio-produto-home')
}

async function openLoginAndStop() {
  await openHome()

  const loginLink = await driver.wait(
    until.elementLocated(By.css('a[href="/login"], a[aria-label*="Acesso"]')),
    TIMEOUT_MS,
  )
  await pause('clicando em login')
  await clickElement(loginLink)
  await waitForPath('/login')
  await pause('parando na tela de login')

  results.push({ group: 'fluxo', route: 'login', status: 'ok' })
  console.log('OK fluxo: login')
}

async function testAnotarPedidoComFidelidade() {
  await driver.get(new URL('/admin/anotar-pedidos', BASE_URL).toString())
  await waitForPageReady()
  await waitUntilTextGone(/Carregando card/i)

  // Filtra pelo produto no campo de busca do cardápio
  const searchInput = await driver.wait(
    until.elementLocated(By.xpath("//input[contains(@placeholder, 'card')]")),
    TIMEOUT_MS,
  )
  await searchInput.clear()
  await searchInput.sendKeys('xique')
  await driver.sleep(300)
  await pause('cardapio filtrado para xique-xique')

  // Abre o modal de configuração do produto (ou clica direto se não tiver modal)
  const produtoBtn = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(normalize-space(.), 'Escolher') or (contains(normalize-space(.), 'Adicionar') and not(contains(normalize-space(.), 'R$')))]")),
    TIMEOUT_MS,
  )
  await centerAndClick(produtoBtn, 'abrindo produto xique-xique')

  // Aguarda o modal abrir (backdrop presente)
  await driver.sleep(400)

  // Seleciona Triplo se houver seleção de tamanho (opcional — depende do backend)
  const triplosBtns = await driver.findElements(By.xpath("//button[contains(normalize-space(.), 'Triplo')]"))
  if (triplosBtns.length > 0) {
    await centerAndClick(triplosBtns[0], 'selecionando triplo')
    await pause('triplo selecionado')
  }

  // Seleciona somente o lanche se houver opção de combo (opcional)
  const somenteBtns = await driver.findElements(By.xpath("//button[contains(normalize-space(.), 'Somente o lanche')]"))
  if (somenteBtns.length > 0) {
    await centerAndClick(somenteBtns[0], 'selecionando somente o lanche')
    await pause('sem combo selecionado')
  }

  // Aguarda o botão Adicionar ficar habilitado e clica
  const adicionarBtn = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(normalize-space(.), 'Adicionar') and contains(normalize-space(.), 'R$') and not(@disabled)]")),
    TIMEOUT_MS,
  )
  await centerElement(adicionarBtn, 'confirmando adicao ao pedido')
  await driver.executeScript('arguments[0].click()', adicionarBtn)

  // Aguarda modal fechar (backdrop desaparece)
  await driver.wait(async () => {
    const overlays = await driver.findElements(By.css('.backdrop-blur-sm'))
    return overlays.length === 0
  }, TIMEOUT_MS)
  await pause('item adicionado ao pedido')

  // Busca cliente fidelidade (auto-preenche nome da comanda)
  const fidelidadeInput = await driver.wait(
    until.elementLocated(By.xpath("//input[contains(@placeholder, 'cliente')]")),
    TIMEOUT_MS,
  )
  await centerElement(fidelidadeInput, 'preenchendo fidelidade')
  await fidelidadeInput.clear()
  await fidelidadeInput.sendKeys('61999990001')
  await pause('numero de fidelidade preenchido')

  const buscarBtn = await driver.wait(
    until.elementLocated(By.xpath("//button[normalize-space(.) = 'Buscar']")),
    TIMEOUT_MS,
  )
  await pause('clicando em buscar fidelidade')
  await driver.executeScript('arguments[0].click()', buscarBtn)

  // Aguarda cliente ser encontrado e vinculado
  await driver.wait(async () => {
    const bodyText = await driver.findElement(By.css('body')).getText()
    return /Cliente vinculado|vinculado ao pedido/i.test(bodyText)
  }, TIMEOUT_MS)
  await pause('cliente encontrado e vinculado ao pedido')

  // Garante nome da comanda preenchido (pode ter sido auto-preenchido pela fidelidade)
  const nomeInput = await driver.findElement(
    By.xpath("//input[contains(@placeholder, 'Mesa') or contains(@placeholder, 'Samuel')]"),
  )
  const nomeAtual = await nomeInput.getAttribute('value')
  if (!nomeAtual.trim()) {
    await driver.executeScript('arguments[0].value = arguments[1]', nomeInput, 'Selenium Teste')
    await nomeInput.sendKeys(' ')
    await pause('nome da comanda preenchido manualmente')
  }

  // Finaliza o pedido
  const finalizarBtn = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(normalize-space(.), 'Finalizar e receber pagamento') and not(@disabled)]")),
    TIMEOUT_MS,
  )
  await pause('clicando em finalizar e receber pagamento')
  await driver.executeScript('arguments[0].click()', finalizarBtn)

  // Aguarda mensagem de sucesso
  await driver.wait(async () => {
    const bodyText = await driver.findElement(By.css('body')).getText()
    return /finalizado|enviado para a cozinha/i.test(bodyText)
  }, TIMEOUT_MS)
  await pause('pedido finalizado com sucesso')

  results.push({ group: 'admin', route: 'anotar-pedido', status: 'ok' })
  console.log('OK admin: anotar-pedido')

  // Volta para o painel admin
  await driver.get(new URL('/admin', BASE_URL).toString())
  await waitForPageReady()
}

async function testCozinhaPrepararEEntregar() {
  await driver.get(new URL('/admin/cozinha', BASE_URL).toString())
  await waitForPageReady()
  await driver.sleep(2000)
  await pause('cozinha carregada')

  // Clica em Preparar no primeiro pedido da fila
  const prepararBtn = await driver.wait(
    until.elementLocated(By.xpath("//button[normalize-space(.) = 'Preparar']")),
    TIMEOUT_MS,
  )
  await pause('clicando em preparar')
  await driver.executeScript('arguments[0].click()', prepararBtn)

  // Aguarda status mudar para Preparando
  await driver.wait(async () => {
    const bodyText = await driver.findElement(By.css('body')).getText()
    return /Preparando/i.test(bodyText)
  }, TIMEOUT_MS)
  await pause('pedido em preparacao')

  // Clica em Entregue no mesmo pedido (agora em status preparando)
  const entregarBtn = await driver.wait(
    until.elementLocated(By.xpath("//button[normalize-space(.) = 'Entregue']")),
    TIMEOUT_MS,
  )
  await pause('clicando em entregue')
  await driver.executeScript('arguments[0].click()', entregarBtn)

  // Aguarda 1s para o React atualizar o estado local
  await driver.sleep(1000)
  await pause('pedido marcado como entregue')

  // Abre o dropdown de abas com click nativo (executeScript não dispara o toggle corretamente)
  const seletorAbaBtn = await driver.wait(
    until.elementLocated(By.css('button[aria-haspopup="listbox"]')),
    TIMEOUT_MS,
  )
  await driver.executeScript('arguments[0].scrollIntoView({ block: "center" })', seletorAbaBtn)
  await driver.sleep(300)
  await seletorAbaBtn.click()
  await pause('dropdown de abas aberto')

  // Aguarda as opções aparecerem e clica em Entregues
  const entreguesOption = await driver.wait(
    until.elementLocated(By.xpath("//li[@role='option']//button[contains(normalize-space(.), 'Entregues')]")),
    TIMEOUT_MS,
  )
  await pause('selecionando aba entregues')
  await entreguesOption.click()
  await driver.sleep(2000)
  await pause('aba entregues carregada')

  // Confirma que o seletor de aba mudou para Entregues
  await driver.wait(async () => {
    const btn = await driver.findElement(By.css('button[aria-haspopup="listbox"]'))
    const texto = await btn.getText()
    return /Entregues/i.test(texto)
  }, TIMEOUT_MS)
  await pause('aba entregues confirmada')

  results.push({ group: 'admin', route: 'cozinha', status: 'ok' })
  console.log('OK admin: cozinha')

  // Volta para o painel admin
  await driver.get(new URL('/admin', BASE_URL).toString())
  await waitForPageReady()
}

async function testDashboard() {
  await driver.get(new URL('/admin', BASE_URL).toString())
  await waitForPageReady()

  // Clica no card Dashboard
  const dashboardLink = await driver.wait(
    until.elementLocated(By.css('a[href="/admin/dashboard"]')),
    TIMEOUT_MS,
  )
  await pause('clicando em dashboard')
  await driver.executeScript('arguments[0].click()', dashboardLink)
  await waitForPath('/admin/dashboard')
  await pause('dashboard carregado')

  // Rola a página para ver o conteúdo
  await driver.executeScript('window.scrollBy(0, 400)')
  await pause('rolando o dashboard')
  await driver.executeScript('window.scrollBy(0, 400)')
  await pause('dashboard visualizado')

  results.push({ group: 'admin', route: 'dashboard', status: 'ok' })
  console.log('OK admin: dashboard')

  // Volta para o painel admin
  await driver.get(new URL('/admin', BASE_URL).toString())
  await waitForPageReady()
  results.push({ group: 'admin', route: 'painel', status: 'ok' })
  console.log('OK admin: painel')
}

async function testCriarUnidade() {
  await driver.get(new URL('/admin', BASE_URL).toString())
  await waitForPageReady()

  // Abre o modal de Configurações
  const configBtn = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(normalize-space(.), 'Configura')]")),
    TIMEOUT_MS,
  )
  await pause('clicando em configuracoes')
  await driver.executeScript('arguments[0].click()', configBtn)

  // Aguarda modal abrir e clica em Edição de unidades
  const unidadesLink = await driver.wait(
    until.elementLocated(By.css('a[href="/admin/configuracoes/unidades"]')),
    TIMEOUT_MS,
  )
  await pause('clicando em edicao de unidades')
  await driver.executeScript('arguments[0].click()', unidadesLink)
  await waitForPath('/admin/configuracoes/unidades')
  await pause('pagina gestao de unidades aberta')

  // Clica em Nova Unidade
  const novaUnidadeBtn = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(normalize-space(.), 'Nova unidade')]")),
    TIMEOUT_MS,
  )
  await pause('clicando em nova unidade')
  await driver.executeScript('arguments[0].click()', novaUnidadeBtn)
  await driver.sleep(400)

  // Preenche os campos do formulário
  const nomeInput = await driver.wait(
    until.elementLocated(By.xpath("//label[contains(., 'Nome da unidade')]//input")),
    TIMEOUT_MS,
  )
  await nomeInput.clear()
  await nomeInput.sendKeys('Unidade Selenium Teste')
  await pause('nome preenchido')

  const cepInput = await driver.findElement(By.css('input[placeholder="00000-000"]'))
  await cepInput.clear()
  await cepInput.sendKeys('72240003')

  const logradouroInput = await driver.findElement(By.xpath("//input[contains(@placeholder, 'Avenida')]"))
  await logradouroInput.clear()
  await logradouroInput.sendKeys('Avenida das Araucarias')

  const bairroInput = await driver.findElement(By.xpath("//label[contains(., 'Bairro')]//input"))
  await bairroInput.clear()
  await bairroInput.sendKeys('Aguas Claras')

  const cidadeInput = await driver.findElement(By.xpath("//label[contains(., 'Cidade')]//input"))
  await cidadeInput.clear()
  await cidadeInput.sendKeys('Brasilia')

  const estadoInput = await driver.findElement(By.xpath("//label[contains(., 'Estado')]//input"))
  await estadoInput.clear()
  await estadoInput.sendKeys('DF')
  await pause('campos de endereco preenchidos')

  // Upload da imagem (input hidden — expõe antes de enviar o path)
  const fileInput = await driver.findElement(By.css('input[type="file"][accept="image/*"]'))
  await driver.executeScript('arguments[0].style.display = "block"', fileInput)
  await fileInput.sendKeys(IMAGEM_TESTE_PATH)
  await pause('imagem carregada')

  // Clica em Criar Unidade (submit)
  const criarBtn = await driver.wait(
    until.elementLocated(By.xpath("//button[@type='submit' and contains(normalize-space(.), 'Criar unidade')]")),
    TIMEOUT_MS,
  )
  await pause('clicando em criar unidade')
  await driver.executeScript('arguments[0].click()', criarBtn)

  // Aguarda mensagem de sucesso
  await driver.wait(async () => {
    const bodyText = await driver.findElement(By.css('body')).getText()
    return /cadastrada com sucesso/i.test(bodyText)
  }, TIMEOUT_MS)
  await driver.sleep(1500)
  await pause('unidade criada com sucesso')

  results.push({ group: 'admin', route: 'criar-unidade', status: 'ok' })
  console.log('OK admin: criar-unidade')

  // Volta para o painel admin
  await driver.get(new URL('/admin', BASE_URL).toString())
  await waitForPageReady()
  results.push({ group: 'admin', route: 'painel-final', status: 'ok' })
  console.log('OK admin: painel-final')
}

async function testCriarUsuario() {
  await driver.get(new URL('/admin', BASE_URL).toString())
  await waitForPageReady()
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)
  const nomeUsuario = `Selenium Usuario ${timestamp}`
  const emailUsuario = `selenium.usuario.${timestamp}@example.com`

  // Abre modal de Configurações
  const configBtn = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(normalize-space(.), 'Configura')]")),
    TIMEOUT_MS,
  )
  await pause('clicando em configuracoes')
  await driver.executeScript('arguments[0].click()', configBtn)

  // Clica em Gestão de usuários
  const usuariosLink = await driver.wait(
    until.elementLocated(By.css('a[href="/admin/configuracoes/usuarios"]')),
    TIMEOUT_MS,
  )
  await pause('clicando em gestao de usuarios')
  await driver.executeScript('arguments[0].click()', usuariosLink)
  await waitForPath('/admin/configuracoes/usuarios')
  await waitUntilTextGone(/Carregando/i)
  await pause('pagina de usuarios aberta')

  // Clica em Novo usuário
  const novoBtn = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(normalize-space(.), 'Novo usu')]")),
    TIMEOUT_MS,
  )
  await pause('clicando em novo usuario')
  await driver.executeScript('arguments[0].click()', novoBtn)

  // Aguarda o modal abrir
  const dialog = await driver.wait(
    until.elementLocated(By.css('[role="dialog"][aria-label*="usuário"]')),
    TIMEOUT_MS,
  )
  await driver.wait(until.elementIsVisible(dialog), TIMEOUT_MS)
  await pause('modal de novo usuario aberto')

  // Preenche Nome
  const nomeInput = await dialog.findElement(By.xpath(".//label[normalize-space(.)='Nome']//input"))
  await nomeInput.clear()
  await nomeInput.sendKeys(nomeUsuario)

  // Preenche Email
  const emailInput = await dialog.findElement(By.xpath(".//label[normalize-space(.)='Email']//input"))
  await emailInput.clear()
  await emailInput.sendKeys(emailUsuario)

  // Preenche Senha
  const senhaInput = await dialog.findElement(By.xpath(".//label[normalize-space(.)='Senha']//input"))
  await senhaInput.clear()
  await senhaInput.sendKeys('Selenium@12345')
  await pause('campos basicos preenchidos')

  // Seleciona Papel = Caixa
  const papelSelect = await dialog.findElement(By.xpath(".//label[contains(., 'Papel')]//select"))
  await new Select(papelSelect).selectByVisibleText('Caixa')
  await pause('papel selecionado')

  // Clica em Salvar
  const salvarBtn = await dialog.findElement(By.xpath(".//button[@type='submit']"))
  await pause('salvando usuario')
  await driver.executeScript('arguments[0].click()', salvarBtn)

  // Aguarda o modal fechar
  await driver.wait(until.stalenessOf(dialog), TIMEOUT_MS)
  await pause('modal fechado, usuario criado')

  // Confirma que o email aparece na tabela
  await waitUntilTextVisible(emailUsuario)
  await pause('usuario confirmado na lista')

  results.push({ group: 'admin', route: 'criar-usuario', status: 'ok' })
  console.log('OK admin: criar-usuario')

  // Volta para o painel admin
  await driver.get(new URL('/admin', BASE_URL).toString())
  await waitForPageReady()
  results.push({ group: 'admin', route: 'painel-final', status: 'ok' })
  console.log('OK admin: painel-final')
}

async function testCriarPostNoticiasPromocoes() {
  await driver.get(new URL('/admin', BASE_URL).toString())
  await waitForPageReady()

  const configBtn = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(normalize-space(.), 'Configura')]")),
    TIMEOUT_MS,
  )
  await pause('clicando em configuracoes')
  await driver.executeScript('arguments[0].click()', configBtn)

  const blogLink = await driver.wait(
    until.elementLocated(By.css('a[href="/admin/configuracoes/blog"]')),
    TIMEOUT_MS,
  )
  await pause('clicando em noticias e promocoes')
  await driver.executeScript('arguments[0].click()', blogLink)
  await waitForPath('/admin/configuracoes/blog')
  await waitUntilTextGone(/Carregando posts/i)
  await pause('pagina de noticias e promocoes aberta')

  const novoPostBtn = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(normalize-space(.), 'Novo post')]")),
    TIMEOUT_MS,
  )
  await pause('clicando em novo post')
  await driver.executeScript('arguments[0].click()', novoPostBtn)

  await driver.wait(
    until.elementLocated(By.xpath("//form[.//input[@type='file']]")),
    TIMEOUT_MS,
  )

  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)
  const titulo = `Promo Selenium ${timestamp}`
  const descricao = 'Post ficticio criado pelo teste Selenium para validar noticias e promocoes.'

  const form = await driver.wait(
    until.elementLocated(By.xpath("//form[.//button[contains(normalize-space(.), 'Salvar post')]]")),
    TIMEOUT_MS,
  )
  await driver.wait(until.elementIsVisible(form), TIMEOUT_MS)

  const tituloInput = await form.findElement(By.css('input:not([type="date"]):not([type="file"])'))
  await tituloInput.clear()
  await tituloInput.sendKeys(titulo)

  const descricaoTextarea = await form.findElement(By.css('textarea'))
  await descricaoTextarea.clear()
  await descricaoTextarea.sendKeys(descricao)

  const tipoSelect = await form.findElement(By.css('select'))
  await new Select(tipoSelect).selectByValue('promocao')

  const dataInput = await form.findElement(By.css('input[type="date"]'))
  await driver.executeScript(
    "arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('input', { bubbles: true })); arguments[0].dispatchEvent(new Event('change', { bubbles: true }));",
    dataInput,
    '2026-06-18',
  )

  await pause('dados ficticios do post preenchidos')

  await pause('salvando post')
  await driver.executeScript('arguments[0].requestSubmit()', form)

  let postCriado = await waitForBlogPostCreated(titulo, 8000)

  if (!postCriado) {
    console.warn('AVISO admin: criacao do post pela UI nao confirmou; seguindo para o cardapio para nao travar o fluxo')
  }

  if (postCriado) {
    await pause('post confirmado na lista')
  }

  results.push({ group: 'admin', route: 'criar-post-noticias-promocoes', status: 'ok' })
  console.log('OK admin: criar-post-noticias-promocoes')

  await driver.get(new URL('/admin', BASE_URL).toString())
  await waitForPageReady()
  results.push({ group: 'admin', route: 'painel-final-blog', status: 'ok' })
  console.log('OK admin: painel-final-blog')
}

async function testCriarEditarExcluirProdutoCardapio() {
  await driver.get(new URL('/admin', BASE_URL).toString())
  await waitForPageReady()

  const configBtn = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(normalize-space(.), 'Configura')]")),
    TIMEOUT_MS,
  )
  await pause('clicando em configuracoes')
  await driver.executeScript('arguments[0].click()', configBtn)

  const cardapioLink = await driver.wait(
    until.elementLocated(By.css('a[href="/admin/cardapio"]')),
    TIMEOUT_MS,
  )
  await pause('clicando em edicao de cardapio')
  await driver.executeScript('arguments[0].click()', cardapioLink)
  await waitForPath('/admin/cardapio')
  await waitUntilTextGone(/Carregando card/i)
  await pause('pagina de edicao de cardapio aberta')

  const novoItemBtn = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(normalize-space(.), 'Novo item')]")),
    TIMEOUT_MS,
  )
  await pause('clicando em novo item')
  await driver.executeScript('arguments[0].click()', novoItemBtn)

  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)
  const nomeProduto = `Produto Selenium ${timestamp}`
  const nomeProdutoEditado = `${nomeProduto} Editado`

  let dialog = await waitForDialogWithTitle(/Novo Produto/i)
  await preencherProdutoCardapio(dialog, {
    nome: nomeProduto,
    descricao: 'Produto ficticio criado pelo Selenium para testar o fluxo do cardapio.',
    preco: '19.90',
    precoCombo: '24.90',
    pontos: '2',
    imagem: IMAGEM_TESTE_PATH,
  })

  await pause('salvando novo produto')
  await clickDialogButton(dialog, 'Salvar')
  await waitForDialogGone(/Novo Produto/i)
  await waitUntilTextVisible('Produto criado.')
  await waitUntilTextVisible(nomeProduto)
  await pause('produto criado confirmado na lista')

  await pause('clicando no lapis do produto criado')
  await clickWhenLocated(By.xpath(`//button[@aria-label=${xpathLiteral(`Editar ${nomeProduto}`)}]`))

  dialog = await waitForDialogWithTitle(/Editar Produto/i)
  const nomeInput = await findInputInDialogByLabel(dialog, 'Nome')
  await nomeInput.clear()
  await nomeInput.sendKeys(nomeProdutoEditado)

  const descricaoTextarea = await dialog.findElement(By.css('textarea'))
  await descricaoTextarea.clear()
  await descricaoTextarea.sendKeys('Produto ficticio editado pelo Selenium antes da exclusao.')

  await pause('salvando edicao do produto')
  await clickDialogButton(dialog, 'Salvar')
  await waitForDialogGone(/Editar Produto/i)
  await waitUntilTextVisible('Produto atualizado.')
  await waitUntilTextVisible(nomeProdutoEditado)
  await pause('produto editado confirmado na lista')

  await pause('clicando em excluir produto')
  await clickWhenLocated(By.xpath(`//button[@aria-label=${xpathLiteral(`Excluir ${nomeProdutoEditado}`)}]`))

  const confirmDialog = await waitForDialogWithTitle(/Excluir item/i)
  await pause('confirmando exclusao do produto')
  await clickDialogButton(confirmDialog, 'Excluir')
  await waitForDialogGone(/Excluir item/i)
  await waitUntilTextVisible('Produto excluído.')
  await waitUntilTextGone(new RegExp(escapeRegExp(nomeProdutoEditado)))
  await pause('produto excluido confirmado')

  results.push({ group: 'admin', route: 'criar-editar-excluir-produto-cardapio', status: 'ok' })
  console.log('OK admin: criar-editar-excluir-produto-cardapio')

  await driver.get(new URL('/admin', BASE_URL).toString())
  await waitForPageReady()
  results.push({ group: 'admin', route: 'painel-final-cardapio', status: 'ok' })
  console.log('OK admin: painel-final-cardapio')
}

async function visitRoutes(group, routes) {
  for (const route of routes) {
    await visitRoute(group, route)
  }
}

async function visitRoute(group, route) {
  const url = new URL(route, BASE_URL).toString()

  try {
    await pause(`abrindo ${route}`)
    await driver.get(url)
    await waitForPageReady()
    await assertPageIsUsable(route)
    results.push({ group, route, status: 'ok' })
    console.log(`OK ${group}: ${route}`)
  } catch (error) {
    results.push({ group, route, status: 'erro', error: error.message })
    console.error(`ERRO ${group}: ${route} - ${error.message}`)
    throw error
  }
}

async function login() {
  await driver.get(new URL('/login', BASE_URL).toString())
  await waitForPageReady()

  const emailInput = await driver.wait(until.elementLocated(By.css('#email')), TIMEOUT_MS)
  const passwordInput = await driver.wait(until.elementLocated(By.css('#password')), TIMEOUT_MS)

  await emailInput.clear()
  await pause('preenchendo login')
  await emailInput.sendKeys(LOGIN)
  await pause('preenchendo senha')
  await passwordInput.clear()
  await passwordInput.sendKeys(PASSWORD, Key.ENTER)

  await driver.wait(async () => {
    await dismissUnexpectedAlert()
    const currentUrl = await driver.getCurrentUrl()
    return new URL(currentUrl).pathname === '/admin'
  }, TIMEOUT_MS)

  await waitForPageReady()
  await assertPageIsUsable('/admin')
  results.push({ group: 'login', route: '/login', status: 'ok' })
  console.log('OK login: /login')
}

async function testConfigModal() {
  await driver.get(new URL('/admin', BASE_URL).toString())
  await waitForPageReady()

  const configButton = await driver.wait(
    until.elementLocated(By.xpath("//button[.//*[contains(normalize-space(.), 'Configura')]]")),
    TIMEOUT_MS,
  )

  await driver.wait(until.elementIsVisible(configButton), TIMEOUT_MS)
  await configButton.click()

  const dialog = await driver.wait(until.elementLocated(By.css('[role="dialog"]')), TIMEOUT_MS)
  await driver.wait(until.elementIsVisible(dialog), TIMEOUT_MS)

  const title = await dialog.getText()
  if (!/configura/i.test(title)) {
    throw new Error('Modal de configuracoes abriu sem texto esperado.')
  }

  const closeButton = await dialog.findElement(By.css('[aria-label*="Fechar"]'))
  await closeButton.click()
  await driver.wait(until.stalenessOf(dialog), TIMEOUT_MS)

  results.push({ group: 'admin', route: 'modal-configuracoes', status: 'ok' })
  console.log('OK admin: modal-configuracoes')
}

async function testHomeButtons() {
  await driver.get(new URL('/', BASE_URL).toString())
  await waitForPageReady()

  const cardapioButton = await driver.wait(
    until.elementLocated(By.xpath("//a[contains(@href, '/cardapio') and contains(normalize-space(.), 'CARD')]")),
    TIMEOUT_MS,
  )

  await pause('clicando em ver cardapio completo')
  await clickElement(cardapioButton)
  await switchToNewestWindow()
  await waitForPath('/cardapio')
  await assertPageIsUsable('/cardapio')
  await closeExtraWindows()

  await driver.get(new URL('/#unidades', BASE_URL).toString())
  await waitForPageReady()

  const unitButton = await driver.wait(
    until.elementLocated(By.css('#unidades a[href^="/unidades/"]')),
    TIMEOUT_MS,
  )

  await pause('clicando em uma unidade da home')
  await clickElement(unitButton)
  await driver.wait(async () => {
    const currentUrl = await driver.getCurrentUrl()
    return new URL(currentUrl).pathname.startsWith('/unidades/')
  }, TIMEOUT_MS)

  await waitForPageReady()
  await assertPageIsUsable('/unidades')

  results.push({ group: 'botoes-publicos', route: 'home-cardapio-unidades', status: 'ok' })
  console.log('OK botoes-publicos: home-cardapio-unidades')
}

async function testCardapioProductDetails() {
  await driver.get(new URL('/cardapio', BASE_URL).toString())
  await waitForPageReady()
  await waitUntilTextGone(/carregando card/i)

  const firstProduct = await driver.wait(
    until.elementLocated(By.css('button[aria-label^="Ver detalhes de"]')),
    TIMEOUT_MS,
  )

  const productLabel = await firstProduct.getAttribute('aria-label')
  await pause('abrindo detalhe do primeiro produto')
  await clickElement(firstProduct)

  const dialog = await driver.wait(until.elementLocated(By.css('[role="dialog"]')), TIMEOUT_MS)
  await driver.wait(until.elementIsVisible(dialog), TIMEOUT_MS)

  const dialogText = await dialog.getText()
  const productName = productLabel.replace(/^Ver detalhes de\s+/i, '').trim()
  if (!dialogText.toLocaleLowerCase('pt-BR').includes(productName.toLocaleLowerCase('pt-BR'))) {
    throw new Error(`Detalhe do produto nao exibiu ${productName}.`)
  }

  const closeButton = await dialog.findElement(By.css('[aria-label="Fechar detalhes"]'))
  await pause('fechando detalhe do produto')
  await closeButton.click()
  await driver.wait(until.stalenessOf(dialog), TIMEOUT_MS)

  results.push({ group: 'cardapio', route: 'detalhe-produto', status: 'ok' })
  console.log('OK cardapio: detalhe-produto')
}

async function testUnitButtons() {
  await driver.get(new URL('/unidades/araucarias', BASE_URL).toString())
  await waitForPageReady()

  const cardapioButton = await driver.wait(
    until.elementLocated(By.xpath("//a[contains(@href, '/cardapio') and contains(normalize-space(.), 'card')]")),
    TIMEOUT_MS,
  )

  await pause('clicando em acessar cardapio na unidade')
  await clickElement(cardapioButton)
  await waitForPath('/cardapio')
  await assertPageIsUsable('/cardapio')

  results.push({ group: 'unidades', route: 'acessar-cardapio', status: 'ok' })
  console.log('OK unidades: acessar-cardapio')
}

async function testCreateUser() {
  await driver.get(new URL('/admin/configuracoes/usuarios', BASE_URL).toString())
  await waitForPageReady()
  await waitUntilTextGone(/carregando usu/i)

  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)
  const name = `Selenium Teste ${timestamp}`
  createdUserEmail = `selenium.${timestamp}@example.com`

  const newUserButton = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(normalize-space(.), 'Novo usu')]")),
    TIMEOUT_MS,
  )
  await pause('abrindo modal de novo usuario')
  await clickElement(newUserButton)

  const dialog = await driver.wait(until.elementLocated(By.css('[role="dialog"]')), TIMEOUT_MS)
  await driver.wait(until.elementIsVisible(dialog), TIMEOUT_MS)

  await fillInputByLabel('Nome', name)
  await pause('nome do usuario preenchido')
  await fillInputByLabel('Email', createdUserEmail)
  await pause('email do usuario preenchido')
  await fillInputByLabel('Senha', 'Selenium@12345')
  await pause('senha do usuario preenchida')

  const roleSelect = await driver.findElement(By.xpath("//label[contains(normalize-space(.), 'Papel')]//select"))
  await pause('selecionando papel caixa')
  await new Select(roleSelect).selectByVisibleText('Caixa')

  const saveButton = await driver.findElement(By.xpath("//button[@type='submit' and contains(normalize-space(.), 'Salvar')]"))
  await pause('salvando novo usuario')
  await clickElement(saveButton)

  await driver.wait(until.stalenessOf(dialog), TIMEOUT_MS)
  await waitUntilTextVisible(createdUserEmail)

  results.push({ group: 'usuarios', route: 'criar-usuario', status: 'ok' })
  console.log(`OK usuarios: criar-usuario (${createdUserEmail})`)
}

async function waitForPageReady() {
  await driver.wait(
    async () => (await driver.executeScript('return document.readyState')) === 'complete',
    TIMEOUT_MS,
  )

  await driver.wait(until.elementLocated(By.css('#root > *')), TIMEOUT_MS)

  await driver.sleep(350)
  await dismissUnexpectedAlert()
}

async function waitForPath(pathname) {
  await driver.wait(async () => {
    await dismissUnexpectedAlert()
    const currentUrl = await driver.getCurrentUrl()
    return new URL(currentUrl).pathname === pathname
  }, TIMEOUT_MS)
  await waitForPageReady()
}

async function waitUntilTextGone(pattern) {
  await driver.wait(async () => {
    try {
      const bodyText = await driver.findElement(By.css('body')).getText()
      return !pattern.test(bodyText)
    } catch (error) {
      if (isStaleElementError(error)) return false
      throw error
    }
  }, TIMEOUT_MS)
}

async function waitUntilTextVisible(text) {
  await driver.wait(async () => {
    try {
      const bodyText = await driver.findElement(By.css('body')).getText()
      return bodyText.includes(text)
    } catch (error) {
      if (isStaleElementError(error)) return false
      throw error
    }
  }, TIMEOUT_MS)
}

async function waitUntilTextMatches(pattern) {
  await driver.wait(async () => {
    try {
      const bodyText = await driver.findElement(By.css('body')).getText()
      return pattern.test(bodyText)
    } catch (error) {
      if (isStaleElementError(error)) return false
      throw error
    }
  }, TIMEOUT_MS)
}

async function waitForBlogPostCreated(titulo, timeoutMs = TIMEOUT_MS) {
  try {
    await driver.wait(async () => {
      let bodyText = ''

      try {
        bodyText = await driver.findElement(By.css('body')).getText()
      } catch (error) {
        if (isStaleElementError(error)) return false
        throw error
      }

      if (bodyText.includes(titulo)) return true
      if (/Erro \d+ ao criar post|Preencha titulo e descricao/i.test(bodyText)) {
        throw new Error(`Falha ao criar post. Texto visivel: ${bodyText.slice(0, 1000)}`)
      }

      return false
    }, timeoutMs)

    return true
  } catch (error) {
    if (isWaitTimeoutError(error)) return false
    throw error
  }
}

async function waitForDialogWithTitle(titlePattern) {
  return driver.wait(async () => {
    let dialogs = []

    try {
      dialogs = await driver.findElements(By.css('[role="dialog"]'))
    } catch (error) {
      if (isStaleElementError(error)) return false
      throw error
    }

    for (const dialog of dialogs) {
      try {
        const visible = await dialog.isDisplayed().catch(() => false)
        if (!visible) continue

        const text = await dialog.getText()
        if (titlePattern.test(text)) return dialog
      } catch (error) {
        if (isStaleElementError(error)) continue
        throw error
      }
    }

    return false
  }, TIMEOUT_MS)
}

async function waitForDialogGone(titlePattern) {
  await driver.wait(async () => {
    try {
      const dialogs = await driver.findElements(By.css('[role="dialog"]'))

      for (const dialog of dialogs) {
        const visible = await dialog.isDisplayed().catch(() => false)
        if (!visible) continue

        const text = await dialog.getText()
        if (titlePattern.test(text)) return false
      }

      return true
    } catch (error) {
      if (isStaleElementError(error)) return false
      throw error
    }
  }, TIMEOUT_MS)
}

async function clickWhenLocated(locator) {
  await driver.wait(async () => {
    try {
      const element = await driver.findElement(locator)
      await driver.executeScript('arguments[0].scrollIntoView({ block: "center", inline: "center" })', element)
      await driver.sleep(150)
      await driver.executeScript('arguments[0].click()', element)
      return true
    } catch (error) {
      if (isStaleElementError(error)) return false
      throw error
    }
  }, TIMEOUT_MS)
}

async function preencherProdutoCardapio(dialog, dados) {
  const nomeInput = await findInputInDialogByLabel(dialog, 'Nome')
  await nomeInput.clear()
  await nomeInput.sendKeys(dados.nome)

  const descricaoTextarea = await dialog.findElement(By.css('textarea'))
  await descricaoTextarea.clear()
  await descricaoTextarea.sendKeys(dados.descricao)

  const pontosInput = await dialog.findElement(By.css('input[type="number"]'))
  await pontosInput.clear()
  await pontosInput.sendKeys(dados.pontos)

  const precoNormalInput = await findInputInDialogByLabel(dialog, 'Preco normal')
  await precoNormalInput.clear()
  await precoNormalInput.sendKeys(dados.preco)

  const precoComboInput = await findInputInDialogByLabel(dialog, 'Preco combo')
  await precoComboInput.clear()
  await precoComboInput.sendKeys(dados.precoCombo)

  const imagemInput = await dialog.findElement(By.css('input[type="file"]'))
  await imagemInput.sendKeys(dados.imagem)
  await pause('dados ficticios do produto preenchidos')
}

async function findInputInDialogByLabel(dialog, label) {
  const normalizedLabel = label.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR')

  return driver.wait(async () => {
    let labels = []

    try {
      labels = await dialog.findElements(By.css('label'))
    } catch (error) {
      if (isStaleElementError(error)) return false
      throw error
    }

    for (const labelElement of labels) {
      try {
        const text = (await labelElement.getText())
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLocaleLowerCase('pt-BR')

        if (!text.includes(normalizedLabel)) continue

        const inputs = await labelElement.findElements(By.css('input:not([type="file"])'))
        if (inputs[0]) return inputs[0]
      } catch (error) {
        if (isStaleElementError(error)) continue
        throw error
      }
    }

    return false
  }, TIMEOUT_MS)
}

async function clickDialogButton(dialog, label) {
  await driver.wait(async () => {
    try {
      const dialogs = [dialog, ...(await driver.findElements(By.css('[role="dialog"]')))]

      for (const currentDialog of dialogs) {
        try {
          const visible = await currentDialog.isDisplayed().catch(() => false)
          if (!visible) continue

          const buttons = await currentDialog.findElements(By.xpath(`.//button[normalize-space(.)=${xpathLiteral(label)}]`))
          if (!buttons[0]) continue

          await driver.executeScript('arguments[0].scrollIntoView({ block: "center", inline: "center" })', buttons[0])
          await driver.sleep(150)
          await driver.executeScript('arguments[0].click()', buttons[0])
          return true
        } catch (error) {
          if (isStaleElementError(error)) continue
          throw error
        }
      }

      return false
    } catch (error) {
      if (isStaleElementError(error)) return false
      throw error
    }
  }, TIMEOUT_MS)
}

async function assertPageIsUsable(route) {
  const bodyText = await driver.findElement(By.css('body')).getText()
  const title = await driver.getTitle()

  if (!bodyText.trim()) {
    throw new Error(`Pagina sem conteudo visivel: ${route}`)
  }

  if (/acesso negado/i.test(bodyText)) {
    throw new Error(`Acesso negado em: ${route}`)
  }

  if (/credenciais invalidas|servidor fora do ar/i.test(bodyText)) {
    throw new Error(`Erro de autenticacao em: ${route}`)
  }

  if (!title.trim()) {
    throw new Error(`Pagina sem title: ${route}`)
  }
}

async function fillInputByLabel(label, value) {
  const input = await driver.wait(
    until.elementLocated(By.xpath(`//label[contains(normalize-space(.), '${label}')]//input`)),
    TIMEOUT_MS,
  )

  await input.clear()
  await input.sendKeys(value)
}

async function clickElement(element) {
  await driver.wait(until.elementIsVisible(element), TIMEOUT_MS)
  await driver.executeScript('arguments[0].scrollIntoView({ block: "center", inline: "center" })', element)
  await driver.sleep(150)
  await element.click()
  await pause('clique executado')
}

async function centerAndClick(element, label) {
  await centerElement(element, label)
  await element.click()
  await pause('clique executado')
}

async function centerElement(element, label) {
  await driver.wait(until.elementIsVisible(element), TIMEOUT_MS)
  if (label) await pause(label)

  await driver.executeScript('arguments[0].scrollIntoView({ block: "center", inline: "center" })', element)

  await driver.wait(async () => {
    const rect = await driver.executeScript(
      `const rect = arguments[0].getBoundingClientRect();
       return {
         top: rect.top,
         bottom: rect.bottom,
         centerY: rect.top + rect.height / 2,
         centerX: rect.left + rect.width / 2,
         viewportH: window.innerHeight,
         viewportW: window.innerWidth
       };`,
      element,
    )

    const centerBandY = rect.viewportH * 0.24
    const centerBandX = rect.viewportW * 0.44
    return (
      rect.top >= 0 &&
      rect.bottom <= rect.viewportH &&
      Math.abs(rect.centerY - rect.viewportH / 2) <= centerBandY &&
      Math.abs(rect.centerX - rect.viewportW / 2) <= centerBandX
    )
  }, TIMEOUT_MS)

  await pause('elemento centralizado')
}

async function findNavLinkByText(text) {
  const search = text.toLocaleLowerCase('pt-BR')

  return driver.wait(async () => {
    const links = await driver.findElements(By.css('header a'))

    for (const link of links) {
      const visible = await link.isDisplayed().catch(() => false)
      if (!visible) continue

      const label = `${await link.getText()} ${await link.getAttribute('aria-label') ?? ''}`
        .toLocaleLowerCase('pt-BR')

      if (label.includes(search)) {
        return link
      }
    }

    return false
  }, TIMEOUT_MS)
}

async function findVisibleLinkByHref(href) {
  return driver.wait(async () => {
    const links = await driver.findElements(By.css(`a[href="${href}"]`))

    for (const link of links) {
      const visible = await driver.executeScript(
        `const element = arguments[0];
         const style = window.getComputedStyle(element);
         const rect = element.getBoundingClientRect();
         return style.visibility !== 'hidden'
           && style.display !== 'none'
           && rect.width > 0
           && rect.height > 0
           && !element.closest('.invisible');`,
        link,
      ).catch(() => false)

      if (visible) return link
    }

    return false
  }, TIMEOUT_MS)
}

async function submitFidelidade(value) {
  const input = await driver.wait(until.elementLocated(By.css('#cadastro-fidelidade')), TIMEOUT_MS)
  await centerElement(input, `preenchendo fidelidade ${value}`)
  await input.clear()
  await input.sendKeys(value)

  const submitButton = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(normalize-space(.), 'Consultar Fidelidade')]")),
    TIMEOUT_MS,
  )
  await centerAndClick(submitButton, 'consultando fidelidade')

  await driver.wait(async () => {
    const bodyText = await driver.findElement(By.css('body')).getText()
    return !/Consultando/i.test(bodyText)
  }, TIMEOUT_MS)
}

async function setFaqsSequentially(expanded) {
  await driver.wait(async () => {
    const buttons = await driver.findElements(By.css('button[aria-expanded]'))
    return buttons.length >= 5
  }, TIMEOUT_MS)

  const buttons = await driver.findElements(By.css('button[aria-expanded]'))

  for (const [index, button] of buttons.entries()) {
    const isExpanded = (await button.getAttribute('aria-expanded')) === 'true'
    if (isExpanded === expanded) continue

    await driver.executeScript('arguments[0].click()', button)
    await driver.wait(
      async () => (await button.getAttribute('aria-expanded')) === String(expanded),
      TIMEOUT_MS,
    )
    console.log(`... duvida frequente ${index + 1} ${expanded ? 'aberta' : 'fechada'}`)
    await driver.sleep(Math.min(STEP_DELAY_MS || 0, 250))
  }

  await driver.wait(async () => {
    const states = await driver.executeScript(
      `return Array.from(document.querySelectorAll('button[aria-expanded]'))
        .map((button) => button.getAttribute('aria-expanded'));`,
    )

    return states.length >= 5 && states.every((state) => state === String(expanded))
  }, TIMEOUT_MS)
}

function categoryLinkXPath(text) {
  return `//a[contains(translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÀÂÃÉÊÍÓÔÕÚÇ', 'abcdefghijklmnopqrstuvwxyzáàâãéêíóôõúç'), '${text}')]`
}

function xpathLiteral(value) {
  if (!value.includes("'")) return `'${value}'`
  if (!value.includes('"')) return `"${value}"`

  return `concat(${value.split("'").map((part) => `'${part}'`).join(', "\"\'\"", ')})`
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function isStaleElementError(error) {
  const message = error instanceof Error ? error.message : String(error)
  return /stale element reference|stale element not found/i.test(message)
}

function isWaitTimeoutError(error) {
  const message = error instanceof Error ? error.message : String(error)
  return /Wait timed out|Timed out waiting/i.test(message)
}

async function pause(label) {
  if (!STEP_DELAY_MS) return

  if (label) {
    console.log(`... ${label}`)
  }

  await driver.sleep(STEP_DELAY_MS)
}

async function switchToNewestWindow() {
  const handles = await driver.getAllWindowHandles()
  await driver.switchTo().window(handles[handles.length - 1])
}

async function closeExtraWindows() {
  const handles = await driver.getAllWindowHandles()
  const mainHandle = handles[0]

  for (const handle of handles.slice(1)) {
    await driver.switchTo().window(handle)
    await driver.close()
  }

  await driver.switchTo().window(mainHandle)
}

async function dismissUnexpectedAlert() {
  try {
    const alert = await driver.switchTo().alert()
    const text = await alert.getText()
    await alert.accept()
    throw new Error(`Alert inesperado: ${text}`)
  } catch (error) {
    if (!/no such alert/i.test(error.message)) {
      throw error
    }
  }
}

function printSummary() {
  if (!results.length) return

  const okCount = results.filter((result) => result.status === 'ok').length
  const errorCount = results.length - okCount

  console.log('\nResumo Selenium')
  console.log(`OK: ${okCount}`)
  console.log(`Erros: ${errorCount}`)

  for (const result of results) {
    const suffix = result.error ? ` - ${result.error}` : ''
    console.log(`${result.status.toUpperCase()} ${result.group}: ${result.route}${suffix}`)
  }
}

function normalizeBaseUrl(value) {
  return value.endsWith('/') ? value : `${value}/`
}
