import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { PostCard } from '../../components/ui/PostCard'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { generateStreetUsername, AVATAR_STYLES } from '../../utils/generators'
import { Loader2, Sparkles, CheckCircle, AlertCircle, Lock } from 'lucide-react'

/**
 * Page de profil avec formulaire d'édition intégré directement si c'est le propriétaire.
 * 
 * @param {Object} props
 * @param {string} props.userId - ID de l'utilisateur dont on affiche le profil
 * @param {Object} props.currentSession - Session Supabase de l'utilisateur connecté
 */
export const ProfilePage = ({ userId, currentSession }) => {
    const [profile, setProfile] = useState(null)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    // États du formulaire d'édition (directement sur la page)
    const [username, setUsername] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')
    const [bio, setBio] = useState('')
    const [age, setAge] = useState('')
    const [gender, setGender] = useState('')
    const [job, setJob] = useState('')
    const [hobbies, setHobbies] = useState('')
    const [newPassword, setNewPassword] = useState('')

    const [saving, setSaving] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)

    // Indique si le profil affiché est celui de l'utilisateur connecté
    const isOwner = Boolean(currentSession?.user?.id && currentSession.user.id === userId)

    // Chargement des données du profil et de ses posts
    const fetchProfileData = async () => {
        setLoading(true)
        try {
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()

            if (profileError) throw profileError

            setProfile(profileData)
            // Initialisation des champs du formulaire avec les données actuelles
            setUsername(profileData.username || '')
            setAvatarUrl(profileData.avatar_url || AVATAR_STYLES[0].url)
            setBio(profileData.bio || '')
            setAge(profileData.age || '')
            setGender(profileData.gender || '')
            setJob(profileData.job || '')
            setHobbies(profileData.hobbies || '')

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
            console.error('Erreur lors du chargement du profil :', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (userId) {
            fetchProfileData()
        }
    }, [userId])

    // Générer un pseudo aléatoire
    const handleSuggestUsername = () => {
        setUsername(generateStreetUsername())
    }

    /**
   * Action de suppression définitive du profil et déconnexion
   */
    const handleDeleteAccount = async () => {
        const confirmation = window.confirm(
            "⚠️ ATTENTION : Es-tu sûr de vouloir supprimer définitivement ton compte ?\nToutes tes publications, commentaires et photos seront effacés sans retour possible."
        )
        if (!confirmation) return

        try {
            // 1. Suppression dans la table profiles (cascade automatique sur posts, likes, comments)
            const { error: profileDeleteError } = await supabase
                .from('profiles')
                .delete()
                .eq('id', userId)

            if (profileDeleteError) throw profileDeleteError

            // 2. Déconnexion de l'utilisateur
            await supabase.auth.signOut()
            alert("Ton compte et toutes tes données ont été supprimés.")
            window.location.reload()
        } catch (err) {
            alert("Erreur lors de la suppression du compte : " + err.message)
        }
    }
    // Sauvegarde des modifications
    const handleSaveProfile = async (e) => {
        e.preventDefault()
        setSaving(true)
        setErrorMessage(null)
        setSuccessMessage(null)

        try {
            if (!username.trim()) {
                throw new Error('Le pseudo est obligatoire.')
            }

            // 1. Mise à jour de la table profiles
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    username: username.trim(),
                    avatar_url: avatarUrl,
                    bio: bio.trim() || null,
                    age: age ? parseInt(age, 10) : null,
                    gender: gender.trim() || null,
                    job: job.trim() || null,
                    hobbies: hobbies.trim() || null,
                })
                .eq('id', userId)

            if (profileError) throw profileError

            // 2. Mise à jour optionnelle du mot de passe
            if (newPassword.trim()) {
                if (newPassword.length < 6) {
                    throw new Error('Le mot de passe doit faire au moins 6 caractères.')
                }
                const { error: passwordError } = await supabase.auth.updateUser({
                    password: newPassword.trim(),
                })
                if (passwordError) throw passwordError
                setNewPassword('')
            }

            setSuccessMessage('Profil mis à jour avec succès !')
            fetchProfileData()
        } catch (err) {
            setErrorMessage(err.message || 'Erreur lors de la mise à jour.')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 font-mono text-sm">
                <Loader2 className="animate-spin mr-2" size={20} />
                <span>CHARGEMENT DU PROFIL...</span>
            </div>
        )
    }


    return (
        <div className="space-y-8">

            {/* SECTION FORMULAIRE (Si c'est notre profil) ou AFFICHAGE (Si c'est un autre membre) */}
            {isOwner ? (
                <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="text-2xl font-black uppercase mb-1">// MON PROFIL & PARAMÈTRES</h2>
                    <p className="font-mono text-xs text-zinc-600 mb-6">
                        Modifie tes informations en direct. Seul le pseudo est obligatoire.
                    </p>

                    {errorMessage && (
                        <div className="mb-4 p-3 bg-red-100 border-2 border-red-600 text-red-800 font-mono text-xs flex items-center gap-2">
                            <AlertCircle size={18} className="shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-4 p-3 bg-green-100 border-2 border-green-600 text-green-800 font-mono text-xs flex items-center gap-2">
                            <CheckCircle size={18} className="shrink-0" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    <form onSubmit={handleSaveProfile} className="space-y-6">

                        {/* Choix de l'avatar DiceBear */}
                        <div className="border-2 border-black p-4 bg-zinc-50">
                            <label className="font-mono text-xs font-bold uppercase block mb-3 text-black">
                // CHOISIR TON AVATAR
                            </label>
                            <div className="flex flex-wrap items-center gap-3">
                                {AVATAR_STYLES.map((style) => (
                                    <button
                                        key={style.id}
                                        type="button"
                                        onClick={() => setAvatarUrl(style.url)}
                                        className={`p-1 border-2 transition-all cursor-pointer ${avatarUrl === style.url
                                            ? 'border-yellow-400 bg-black scale-105 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                                            : 'border-black bg-white hover:bg-zinc-100'
                                            }`}
                                    >
                                        <img src={style.url} alt="Avatar option" className="w-12 h-12 bg-white" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Pseudo avec générateur */}
                        <div className="border-2 border-black p-4 bg-zinc-50">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2 mb-2">
                                <label className="font-mono text-xs font-bold uppercase text-black">
                                    PSEUDO <span className="text-red-600">*</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={handleSuggestUsername}
                                    className="font-mono text-[11px] font-bold text-black hover:text-yellow-600 flex items-center gap-1 uppercase underline cursor-pointer"
                                >
                                    <Sparkles size={12} />
                                    <span>Suggérer un pseudo underground</span>
                                </button>
                            </div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full px-3 py-2 bg-white text-black font-mono text-sm border-2 border-black focus:outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            />
                        </div>

                        {/* Infos optionnelles */}
                        <div className="border-2 border-black p-4 bg-zinc-50 space-y-4">
                            <span className="font-mono text-xs font-bold uppercase block border-b-2 border-dashed border-zinc-300 pb-1 text-zinc-700">
                // INFORMATIONS LIBRES
                            </span>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input label="Âge" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="ex: 30" />
                                <Input label="Genre / Pronoms" type="text" value={gender} onChange={(e) => setGender(e.target.value)} placeholder="ex: Non-binaire / Homme" />
                            </div>

                            <Input label="Travail / Occupation" type="text" value={job} onChange={(e) => setJob(e.target.value)} placeholder="ex: En reconversion / Développeur" />
                            <Input label="Hobbies / Passions" type="text" value={hobbies} onChange={(e) => setHobbies(e.target.value)} placeholder="ex: Musique, Peinture, Marche" />

                            <div className="flex flex-col gap-1.5">
                                <label className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                                    Biographie / Mon parcours
                                </label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={4}
                                    className="px-3 py-2 bg-white text-black font-mono text-sm border-2 border-black focus:outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] resize-none"
                                    placeholder="Raconte ton histoire..."
                                />
                            </div>
                        </div>

                        {/* Mot de passe */}
                        <div className="border-2 border-black p-4 bg-zinc-50">
                            <label className="font-mono text-xs font-bold uppercase flex items-center gap-1.5 text-black mb-2">
                                <Lock size={14} />
                                <span>Nouveau mot de passe (optionnel)</span>
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Laisser vide pour ne pas changer"
                                className="w-full px-3 py-2 bg-white text-black font-mono text-sm border-2 border-black focus:outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            />
                        </div>

                        <Button type="submit" variant="primary" className="w-full">
                            {saving ? 'ENREGISTREMENT...' : 'SAUVEGARDER LES MODIFICATIONS'}
                        </Button>

                    </form>

                    {/* ZONE DANGEREUSE : SUPPRESSION DE COMPTE */}
                    <div className="border-2 border-red-600 p-4 bg-red-50 mt-8">
                        <span className="font-mono text-xs font-bold uppercase text-red-800 block mb-2">
    // ZONE DANGEREUSE
                        </span>
                        <p className="font-mono text-xs text-red-700 mb-4">
                            La suppression de ton compte est définitive. Tes articles, photos et commentaires seront tous effacés.
                        </p>
                        <button
                            type="button"
                            onClick={handleDeleteAccount}
                            className="px-4 py-2 bg-red-600 text-white font-mono font-bold text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black transition-colors cursor-pointer"
                        >
                            Supprimer mon profil définitivement
                        </button>
                    </div>
                </div>
            ) : (
                /* Affichage en mode lecture si c'est le profil d'un autre utilisateur */
                <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex gap-6 items-start">
                    <div className="border-2 border-black p-2 bg-zinc-100 shrink-0">
                        <img src={profile?.avatar_url || AVATAR_STYLES[0].url} alt="Avatar" className="w-24 h-24 object-cover border border-black grayscale" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black uppercase">@{profile?.username}</h2>
                        <p className="font-mono text-xs text-zinc-600 mt-1">Inscrit le {new Date(profile?.created_at).toLocaleDateString('fr-FR')}</p>
                        <p className="font-sans text-sm text-zinc-800 mt-3">{profile?.bio || "Aucune biographie."}</p>
                    </div>
                </div>
            )}

            {/* Liste des publications de l'auteur */}
            <div className="border-b-4 border-black pb-2 mt-12 mb-6">
                <h3 className="text-xl font-black uppercase tracking-wide">
          // PUBLICATIONS DE @{profile?.username || 'MEMBRE'} ({posts.length})
                </h3>
            </div>

            {posts.length > 0 ? (
                posts.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        onCommentClick={() => alert(`Commentaires du post ${post.id}`)}
                        onShareClick={() => {
                            navigator.clipboard.writeText(window.location.href)
                            alert("Lien copié dans le presse-papier !")
                        }}
                    />
                ))
            ) : (
                <div className="bg-white border-2 border-black p-8 text-center font-mono text-sm text-zinc-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    Aucune publication pour le moment.
                </div>
            )}

        </div>
    )
}