import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { PostCard } from '../../components/ui/PostCard'
import { Loader2, Calendar, FileText, ArrowLeft, Briefcase, Heart, User as UserIcon } from 'lucide-react'

/**
 * Page de profil public (Lecture seule) pour un auteur tiers.
 * 
 * @param {Object} props
 * @param {string} props.userId - ID de l'auteur dont on visite le profil
 * @param {Function} props.onBack - Callback pour revenir en arrière (ex: retour au feed)
 * @param {Object} props.currentSession - Session de l'utilisateur connecté (pour les interactions)
 */

export const PublicProfilePage = ({ userId, onBack, currentSession, onAuthorClick }) => {
    const [profile, setProfile] = useState(null)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)



    useEffect(() => {
        if (!userId) return

        const loadPublicProfileData = async () => {
            setLoading(true)
            try {
                // 1. Récupérer le profil de l'auteur
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single()

                if (profileError) throw profileError
                setProfile(profileData)

                // 2. Récupérer les posts de cet auteur
                const { data: postsData, error: postsError } = await supabase
                    .from('posts')
                    .select(`
            *,
            author:profiles(username, avatar_url)
          `)
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false })

                if (postsError) throw postsError
                setPosts(postsData || [])
            } catch (err) {
                console.error("Erreur chargement profil public :", err)
            } finally {
                setLoading(false)
            }
        }

        loadPublicProfileData()
    }, [userId])

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 font-mono text-sm bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Loader2 className="animate-spin mr-2" size={20} />
                <span>CHARGEMENT DU PROFIL DE L'AUTEUR...</span>
            </div>
        )
    }

    return (
        <div className="space-y-6">

            {/* Bouton de retour */}
            {onBack && (
                <button
                    onClick={onBack}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white font-mono text-xs font-bold uppercase border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 cursor-pointer transition-transform active:translate-x-0.5 active:translate-y-0.5"
                >
                    <ArrowLeft size={16} />
                    <span>Retour au fil d'actualité</span>
                </button>
            )}

            {/* Carte d'identité publique (Style Polaroid / Fanzine) */}
            <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row gap-6 items-start">

                {/* Avatar */}
                <div className="border-2 border-black p-2 bg-zinc-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] shrink-0 self-center md:self-start">
                    {profile?.avatar_url ? (
                        <img
                            src={profile.avatar_url}
                            alt={`Avatar de ${profile.username}`}
                            className="w-32 h-32 object-cover border border-black grayscale hover:grayscale-0 transition-all"
                        />
                    ) : (
                        <div className="w-32 h-32 bg-black text-yellow-400 flex items-center justify-center border border-black">
                            <UserIcon size={64} />
                        </div>
                    )}
                    <span className="block text-center font-mono text-[10px] font-bold uppercase mt-1 text-zinc-600">
                        [ AUTEUR ]
                    </span>
                </div>

                {/* Détails du profil */}
                <div className="flex-grow w-full">
                    <div className="border-b-2 border-black pb-3 mb-4">
                        <h2 className="text-2xl font-black uppercase tracking-wider">
                            @{profile?.username || 'Membre'}
                        </h2>
                        <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-zinc-600 mt-1">
                            <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                Inscrit le {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('fr-FR') : 'Inconnu'}
                            </span>
                            {profile?.age && (
                                <span>• Âge : {profile.age} ans</span>
                            )}
                            {profile?.gender && (
                                <span>• Genre : {profile.gender}</span>
                            )}
                        </div>
                    </div>

                    {/* Travail & Hobbies si renseignés */}
                    {(profile?.job || profile?.hobbies) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 font-mono text-xs">
                            {profile?.job && (
                                <div className="bg-zinc-50 border-2 border-black p-2.5 flex items-center gap-2">
                                    <Briefcase size={14} className="text-zinc-700 shrink-0" />
                                    <span><strong>Travail :</strong> {profile.job}</span>
                                </div>
                            )}
                            {profile?.hobbies && (
                                <div className="bg-zinc-50 border-2 border-black p-2.5 flex items-center gap-2">
                                    <Heart size={14} className="text-zinc-700 shrink-0" />
                                    <span><strong>Passions :</strong> {profile.hobbies}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Biographie */}
                    <div className="mb-4">
                        <span className="font-mono text-xs font-bold uppercase text-zinc-500 block mb-1">
              // BIOGRAPHIE :
                        </span>
                        <p className="font-sans text-sm text-zinc-800 bg-zinc-50 p-3 border-2 border-dashed border-zinc-400 leading-relaxed whitespace-pre-line">
                            {profile?.bio || "Aucune biographie renseignée."}
                        </p>
                    </div>

                    {/* Badge statistiques */}
                    <div className="flex items-center gap-4 font-mono text-xs font-bold">
                        <div className="bg-yellow-400 text-black border-2 border-black px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5">
                            <FileText size={14} />
                            <span>{posts.length} PUBLICATION{posts.length > 1 ? 'S' : ''}</span>
                        </div>
                    </div>

                </div>

            </div>

            {/* Liste des publications de cet auteur */}
            <div className="border-b-4 border-black pb-2 mt-8 mb-6">
                <h3 className="text-xl font-black uppercase tracking-wide">
          // PUBLICATIONS DE @{profile?.username}
                </h3>
            </div>

            {posts.length > 0 ? (
                posts.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        currentSession={currentSession}
                        onAuthorClick={onAuthorClick} // <-- Le transmettre ici aussi
                    />
                ))
            ) : (
                <div className="bg-white border-2 border-black p-8 text-center font-mono text-sm text-zinc-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    Cet auteur n'a encore publié aucun article.
                </div>
            )}

        </div>
    )
}