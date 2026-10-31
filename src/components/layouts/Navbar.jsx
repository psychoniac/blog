import { Terminal, PlusSquare, User, LogOut } from 'lucide-react'

/**
 * Barre de navigation principale du blog.
 * Responsabilité unique : Afficher l'en-tête, le titre et les liens de navigation globaux.
 * 
 * @param {Object} props
 * @param {boolean} props.isAuthenticated - Indique si l'utilisateur est connecté
 * @param {Function} props.onOpenAuth - Callback pour ouvrir la modale/page de connexion
 * @param {Function} props.onLogout - Callback pour déconnecter l'utilisateur
 * @param {Function} props.onNavigate - Callback pour changer de vue (ex: 'feed', 'create', 'profile')
 */

export const Navbar = ({ isAuthenticated, onOpenAuth, onLogout, onNavigate }) => {
    return (
        <header className="border-b-4 border-black bg-white sticky top-0 z-50 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">

                {/* Logo / Titre du Fanzine */}
                <button
                    onClick={() => onNavigate('feed')}
                    className="flex items-center gap-2 text-left group cursor-pointer"
                >
                    <div className="bg-black text-yellow-400 p-2 border-2 border-black group-hover:bg-yellow-400 group-hover:text-black transition-colors">
                        <Terminal size={24} />
                    </div>
                    <div>
                        <h1 className="font-black text-lg uppercase tracking-wider">
                            Blog de Jlnko
                        </h1>
                        <span className="font-mono text-xs text-zinc-600 block">
                            [chroniques de rue & reconstruction]
                        </span>
                    </div>
                </button>

                {/* Actions de Navigation & Compte */}
                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <>
                            {/* Bouton pour créer un post */}
                            <button
                                onClick={() => onNavigate('create')}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 font-mono font-bold text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                            >
                                <PlusSquare size={16} />
                                <span>Publier</span>
                            </button>

                            {/* Bouton Profil */}
                            <button
                                onClick={() => onNavigate('profile')}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white font-mono font-bold text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-zinc-100 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                            >
                                <User size={16} />
                                <span>Profil</span>
                            </button>

                            {/* portfolio */}
                            <button
                                onClick={() => onNavigate('portfolio')}
                                className="font-mono font-bold text-xs uppercase hover:underline cursor-pointer"
                            >
                                Portfolio
                            </button>

                            {/* Bouton Déconnexion */}
                            <button
                                onClick={onLogout}
                                title="Se déconnecter"
                                className="p-1.5 bg-black text-white border-2 border-black hover:bg-zinc-800 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                            >
                                <LogOut size={16} />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onOpenAuth}
                            className="px-4 py-2 bg-black text-white font-mono font-bold text-xs uppercase border-2 border-black shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:bg-zinc-900 cursor-pointer"
                        >
                            Connexion / Inscription
                        </button>
                    )}
                </div>

            </div>
        </header>
    )
}