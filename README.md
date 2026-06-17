# Frontend do sistema da Paraíba Hot Dog

# Tecnologias

- React
- TypeScript
- Vite
- TailwindCSS

---

# Como rodar o projeto

## Clonar o repositório

```bash
git clone <url-do-repositorio>
```

## Entrar na pasta do projeto

```bash
cd Paraiba-Hot-Dog-Front
```

## Instalar dependências

```bash
npm install
```

## Rodar em ambiente de desenvolvimento

```bash
npm run dev
```

O projeto ficará disponível em:

```bash
http://localhost:5173
```

---

# Scripts disponíveis

## Desenvolvimento

```bash
npm run dev
```

Inicia o servidor de desenvolvimento.

---

## Build de produção

```bash
npm run build
```

Gera a build de produção.

---

## Deploy no Netlify

O arquivo `netlify.toml` configura o build com `npm run build`, publica a pasta `dist` e redireciona rotas do React para `index.html`.

No Netlify, configure a variável de ambiente:

```bash
VITE_API_BASE_URL=https://sua-api.onrender.com
```

Se usar Keycloak em produção, configure também `VITE_KEYCLOAK_URL`, `VITE_KEYCLOAK_REALM` e `VITE_KEYCLOAK_CLIENT_ID`.

Depois do deploy, copie a URL final do Netlify para `CORS_ORIGINS` e `FRONTEND_BASE_URL` no Render.

---

## Preview da build

```bash
npm run preview
```

Executa a build localmente para testes.

---

# Arquitetura do projeto

```bash
componentes/
│
├── globais/
│   ├── Componentes compartilhados entre diferentes áreas do sistema
│
├── usuario/
│   └── Componentes utilizados nas telas do usuário
│
└── administrador/
    └── Componentes utilizados na área administrativa


imagens/
│
├── itens/
│   └── Imagens dos produtos
│
├── local/
│   └── Imagens relacionadas às unidades e localização
│
├── logos/
│   └── Logos da aplicação
│
├── outros/
│   └── Elementos visuais complementares
│
└── social/
    └── Ícones de redes sociais


telas/
│
├── usuario/
│   └── Telas voltadas para os usuários do sistema
│
└── administrador/
    └── Telas voltadas para administração
```
