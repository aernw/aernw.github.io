import { SideProvider, useSide } from './side/SideContext'
import { SideToggle } from './components/SideToggle'
import { SideA } from './faces/SideA'
import { SideB } from './faces/SideB'
import { profile } from './content'
import './App.css'

function Faces() {
  const { side } = useSide()

  return (
    <>
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>

      <main id="contenu" className="page">
        {side === 'a' ? <SideA /> : <SideB />}
      </main>

      <footer className="footer">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
      </footer>

      <SideToggle />
    </>
  )
}

export function App() {
  return (
    <SideProvider>
      <Faces />
    </SideProvider>
  )
}
