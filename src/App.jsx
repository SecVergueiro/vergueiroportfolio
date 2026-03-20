import Cursor      from './components/Cursor'
import Particles   from './components/Particles'
import Nav         from './components/Nav'
import Hero        from './components/Hero'
import Sobre       from './components/Sobre'
import Experiencia from './components/Experiencia'
import Stack       from './components/Stack'
import Projetos    from './components/Projetos'
import Contato     from './components/Contato'
import Footer      from './components/Footer'

function Divider() {
  return (
    <>
      <div className="divider" />
      <div className="divider-symbol">✦ ✦ ✦</div>
      <div className="divider" />
    </>
  )
}

function SlashBg() {
  return <div className="slash-bg" aria-hidden="true" />
}

export default function App() {
  return (
    <>
      {/* Elementos de background globais */}
      <Cursor />
      <Particles />
      <SlashBg />

      {/* Navegação */}
      <Nav />

      {/* Seções */}
      <Hero />
      <Divider />
      <Sobre />
      <Divider />
      <Experiencia />
      <Divider />
      <Stack />
      <Divider />
      <Projetos />
      <Divider />
      <Contato />

      {/* Footer */}
      <Footer />
    </>
  )
}
