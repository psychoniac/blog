import { Terminal, PlusSquare, User, Briefcase, LogOut } from 'lucide-react'
import { Button } from '../ui/Button'

/**
 * En-tête et barre de navigation principale du site.
 * Responsabilité unique : Afficher l'identité du fanzine et les liens de navigation globaux.
 * 
 * @param {Object} props
 * @param {boolean} props.isAuthenticated - Indique si l'utilisateur est connecté
 * @param {Function} props.onNavigate - Fonction pour changer de page ('feed', 'portfolio', 'profile', 'create')
 * @param {Function} props.onOpenAuth - Fonction pour ouvrir la modale de connexion
 * @param {Function} props.onLogout - Fonction pour déconnecter l'utilisateur
 */
export const Header = ({ isAuthenticated, onNavigate, onOpenAuth, onLogout }) => {
    return (
        <header className="border-b-4 border-black bg-white sticky top-0 z-50 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">

                {/* Logo / Titre du Fanzine (Retour au Feed) */}
                <button
                    onClick={() => onNavigate('feed')}
                    className="flex items-center gap-2 text-left group cursor-pointer"
                >
                    <div className="bg-black text-yellow-400 p-2 border-2 border-black group-hover:bg-yellow-400 group-hover:text-black transition-colors">
                        <Terminal size={22} />
                    </div>
                    <div>
                        <h1 className="font-black text-base md:text-lg uppercase tracking-wider">
                            Blog de Jlnko
                        </h1>
                        <span className="font-mono text-[10px] text-zinc-600 block">
                            [chroniques de rue & reconstruction]
                        </span>
                    </div>
                </button>

                {/* Liens de navigation & Actions */}
                <div className="flex flex-wrap items-center gap-3">

                    {/* Lien Portfolio accessible à tous */}
                    <button
                        onClick={() => onNavigate('portfolio')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white font-mono font-bold text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-zinc-100 cursor-pointer"
                    >
                        <Briefcase size={14} />
                        <span>Portfolio</span>
                    </button>

                    {isAuthenticated ? (
                        <>
                            {/* Bouton de création de post */}
                            <Button
                                variant="primary"
                                onClick={() => onNavigate('create')}
                                className="text-xs flex items-center gap-1.5 py-1.5 px-3"
                            >
                                <PlusSquare size={14} />
                                <span>Publier</span>
                            </Button>

                            {/* Bouton vers le profil */}
                            <Button
                                variant="secondary"
                                onClick={() => onNavigate('profile')}
                                className="text-xs flex items-center gap-1.5 py-1.5 px-3"
                            >
                                <User size={14} />
                                <span>Mon Profil</span>
                            </Button>

                            {/* Bouton de déconnexion */}
                            <button
                                onClick={onLogout}
                                title="Se déconnecter"
                                className="p-2 bg-black text-white border-2 border-black hover:bg-red-600 transition-colors cursor-pointer"
                            >
                                <LogOut size={16} />
                            </button>
                        </>
                    ) : (
                        <Button
                            variant="secondary"
                            onClick={onOpenAuth}
                            className="text-xs py-1.5 px-3"
                        >
                            Connexion / Inscription
                        </Button>
                    )}

                </div>

            </div>
        </header>
    )
}