import { Header } from './Header'
import { Footer } from './Footer'

/**
 * Conteneur de mise en page global.
 * Responsabilité unique : Encadrer le contenu de l'application avec le Header et le Footer.
 */
export const Layout = ({ children, isAuthenticated, onNavigate, onOpenAuth, onLogout }) => {
    return (
        <div className="min-h-screen bg-[#f4f4f0] text-black flex flex-col font-sans selection:bg-yellow-400 selection:text-black">
            <Header
                isAuthenticated={isAuthenticated}
                onNavigate={onNavigate}
                onOpenAuth={onOpenAuth}
                onLogout={onLogout}
            />

            <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-6 md:py-8">
                {children}
            </main>

            <Footer />
        </div>
    )
}