import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex space-x-4">
        <ul>
            <li>
                <Link to='/' className="text-lg hover:text-yellow-500 transition duration-200">Accueil</Link>
            </li>
            <li>
                <Link to='/login' className="text-lg hover:text-yellow-500 transition duration-200">Connexion</Link>
            </li>
            <li>
                <Link to='/signup' className="text-lg hover:text-yellow-500 transition duration-200">Inscription</Link>
            </li>
        </ul>
    </nav>
  )
}
