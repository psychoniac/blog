import { Navbar } from './Navbar'
import { Footer } from './Footer'

/**
 * Enveloppe globale de mise en page (Layout).
 * Responsabilité unique : Organiser la structure visuelle principale de l'application.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Les composants de page à afficher au centre
 * @param {boolean} props.isAuthenticated - État de connexion transmis à la Navbar
 * @param {Function} props.onOpenAuth - Callback d'authentification
 * @param {Function} props.onLogout - Callback de déconnexion
 * @param {Function} props.onNavigate - Callback de navigation
 */

export const Layout = ({
    children,
    isAuthenticated,
    onOpenAuth,
    onLogout,
    onNavigate
}) => {
    return (
        <div className="min-h-screen bg-[#f4f4f0] text-black flex flex-col font-sans selection:bg-yellow-400 selection:text-black">
            {/* Barre de navigation fixe en haut */}
            <Navbar
                isAuthenticated={isAuthenticated}
                onOpenAuth={onOpenAuth}
                onLogout={onSoumettreLogout => {
                    if (onLogout) onLogout()
                }}
                onNavigate={onNavigate}
            />

            {/* Contenu principal de la page en cours */}
            <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-6 md:py-8">
                {children}
            </main>

            {/* Pied de page */}
            <Footer />
        </div>
    )
}