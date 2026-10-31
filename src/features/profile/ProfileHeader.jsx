import { User, Calendar, Edit3, FileText } from 'lucide-react'
import { Button } from '../../components/ui/Button'

/**
 * Composant d'affichage de l'en-tête de profil (Style Polaroid / Fanzine 90s).
 * Responsabilité unique : Présenter les données d'identité et de statistiques de l'auteur.
 * 
 * @param {Object} props
 * @param {Object} props.profile - Données du profil (username, bio, avatar_url, created_at)
 * @param {number} props.postsCount - Nombre total de publications de l'auteur
 * @param {boolean} props.isOwner - Indique si le visiteur est le propriétaire du profil
 * @param {Function} props.onEdit - Callback pour ouvrir la modale d'édition
 */

export const ProfileHeader = ({ profile, postsCount = 0, isOwner = false, onEdit }) => {
    return (
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 relative">

            <div className="flex flex-col md:flex-row gap-6 items-start">

                {/* Cadre Avatar Style Polaroid */}
                <div className="border-2 border-black p-2 bg-zinc-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] shrink-0 self-center md:self-start">
                    {profile?.avatar_url ? (
                        <img
                            src={profile.avatar_url}
                            alt={`Avatar de ${profile.username}`}
                            className="w-32 h-32 object-cover border border-black grayscale hover:grayscale-0 transition-all"
                        />
                    ) : (
                        <div className="w-32 h-32 bg-black text-yellow-400 flex items-center justify-center border border-black">
                            <User size={64} />
                        </div>
                    )}
                    <span className="block text-center font-mono text-[10px] font-bold uppercase mt-1 text-zinc-600">
                        [ ID_MEMBER ]
                    </span>
                </div>

                {/* Informations Textuelles */}
                <div className="flex-grow w-full">

                    <div className="flex flex-wrap justify-between items-start gap-3 border-b-2 border-black pb-3 mb-4">
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-wider">
                                @{profile?.username || 'Membre'}
                            </h2>
                            <div className="flex items-center gap-2 font-mono text-xs text-zinc-600 mt-1">
                                <Calendar size={14} />
                                <span>
                                    Inscrit le {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('fr-FR') : 'Inconnu'}
                                </span>
                            </div>
                        </div>

                        {/* Bouton d'édition réservé au propriétaire du profil */}
                        {isOwner && (
                            <Button variant="primary" onClick={onEdit} className="text-xs flex items-center gap-1.5">
                                <Edit3 size={14} />
                                <span>Modifier mon profil</span>
                            </Button>
                        )}
                    </div>

                    {/* Bio */}
                    <div className="mb-4">
                        <span className="font-mono text-xs font-bold uppercase text-zinc-500 block mb-1">
              // BIOGRAPHIE :
                        </span>
                        <p className="font-sans text-sm text-zinc-800 bg-zinc-50 p-3 border-2 border-dashed border-zinc-400 leading-relaxed whitespace-pre-line">
                            {profile?.bio || "Aucune biographie renseignée pour le moment."}
                        </p>
                    </div>

                    {/* Statistiques rapides */}
                    <div className="flex items-center gap-4 font-mono text-xs font-bold">
                        <div className="bg-yellow-400 text-black border-2 border-black px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5">
                            <FileText size={14} />
                            <span>{postsCount} PUBLICATION{postsCount > 1 ? 'S' : ''}</span>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
}