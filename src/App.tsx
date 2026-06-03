import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Inicio from './telas/usuario/Inicio'
import Login from './telas/usuario/Login'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}
