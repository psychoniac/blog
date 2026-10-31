import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { generateStreetUsername, AVATAR_STYLES } from '../../utils/generators'
import { X, Sparkles, AlertCircle, CheckCircle, Lock } from 'lucide-react'

/**
 * Modale complète de mise à jour du profil et des identifiants.
 * 
 * @param {Object} props
 * @param {Object} props.currentProfile - Les données actuelles du profil
 * @param {Function} props.onClose - Annuler / Fermer
 * @param {Function} props.onSuccess - Callback de mise à jour réussie
 */
export const EditProfileModal = ({ currentProfile, onClose, onSuccess }) => {
    // Champs obligatoires
    const [username, setUsername] = useState(currentProfile?.username || '')

    // Champs optionnels
    const [avatarUrl, setAvatarUrl] = useState(currentProfile?.avatar_url || AVATAR_STYLES[0].url)
    const [bio, setBio] = useState(currentProfile?.bio || '')
    const [age, setAge] = useState(currentProfile?.age || '')
    const [gender, setGender] = useState(currentProfile?.gender || '')
    const [job, setJob] = useState(currentProfile?.job || '')
    const [hobbies, setHobbies] = useState(currentProfile?.hobbies || '')

    // Sécurité (Changement de mot de passe)
    const [newPassword, setNewPassword] = useState('')

    // États UI
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)

    /**
     * Suggérer un pseudo aléatoire
     */
    const handleSuggestUsername = () => {
        const suggested = generateStreetUsername()
        setUsername(suggested)
    }

    /**
     * Traitement de la mise à jour globale
     */
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrorMessage(null)
        setSuccessMessage(null)

        try {
            // 1. Validation de la donnée obligatoire (Pseudo)
            if (!username.trim()) {
                throw new Error('Le pseudo est obligatoire.')
            }

            // 2. Mise à jour de la table public.profiles dans Supabase
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
                .eq('id', currentProfile.id)

            if (profileError) throw profileError

            // 3. Mise à jour du mot de passe dans Supabase Auth (si renseigné)
            if (newPassword.trim()) {
                if (newPassword.length < 6) {
                    throw new Error('Le nouveau mot de passe doit contenir au moins 6 caractères.')
                }

                const { error: passwordError } = await supabase.auth.updateUser({
                    password: newPassword.trim(),
                })

                if (passwordError) throw passwordError
            }

            setSuccessMessage('Profil mis à jour avec succès !')
            setTimeout(() => {
                if (onSuccess) onSuccess()
                onClose()
            }, 1000)

        } catch (err) {
            setErrorMessage(err.message || 'Une erreur est survenue lors de la mise à jour.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#f4f4f0] border-4 border-black p-6 max-w-2xl w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative my-8 max-h-[90vh] overflow-y-auto">

                {/* Bouton fermeture */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-1 bg-black text-white hover:bg-yellow-400 hover:text-black transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-black uppercase mb-1">// CONFIGURATION DU PROFIL</h2>
                <p className="font-mono text-xs text-zinc-600 mb-6">
                    Seul le pseudo est obligatoire. Le reste est libre pour raconter qui tu es.
                </p>

                {/* Notifications */}
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

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* SECTION 1 : AVATAR */}
                    <div className="border-2 border-black p-4 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        <label className="font-mono text-xs font-bold uppercase block mb-3 text-black">
              // CHOISIR UN AVATAR (DICEBEAR GENERATIVE)
                        </label>

                        <div className="flex flex-wrap items-center gap-3">
                            {AVATAR_STYLES.map((style) => (
                                <button
                                    key={style.id}
                                    type="button"
                                    onClick={() => setAvatarUrl(style.url)}
                                    className={`p-1 border-2 transition-all cursor-pointer ${avatarUrl === style.url
                                        ? 'border-yellow-400 bg-black scale-105 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                                        : 'border-black bg-zinc-100 hover:bg-zinc-200'
                                        }`}
                                >
                                    <img src={style.url} alt="Option Avatar" className="w-12 h-12 bg-white" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* SECTION 2 : IDENTITÉ (PSEUDO) */}
                    <div className="border-2 border-black p-4 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
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
                                <span>Trouver une idée de pseudo</span>
                            </button>
                        </div>

                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-3 py-2 bg-white text-black font-mono text-sm border-2 border-black focus:outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            placeholder="ex: Asphalte_Rider_94"
                        />
                    </div>

                    {/* SECTION 3 : INFORMATIONS PERSONNELLES (OPTIONNELLES) */}
                    <div className="border-2 border-black p-4 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-4">
                        <span className="font-mono text-xs font-bold uppercase block border-b-2 border-dashed border-zinc-300 pb-1 text-zinc-700">
              // INFORMATIONS OPTIONNELLES
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Âge"
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                placeholder="ex: 28"
                            />

                            <Input
                                label="Genre / Pronoms"
                                type="text"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                placeholder="ex: Homme / Non-binaire"
                            />
                        </div>

                        <Input
                            label="Travail / Occupation"
                            type="text"
                            value={job}
                            onChange={(e) => setJob(e.target.value)}
                            placeholder="ex: Développeur web / En reconversion"
                        />

                        <Input
                            label="Hobbies / Passions"
                            type="text"
                            value={hobbies}
                            onChange={(e) => setHobbies(e.target.value)}
                            placeholder="ex: Graff, Musique, Lecture, Photographie"
                        />

                        <div className="flex flex-col gap-1.5">
                            <label className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                                Biographie / Récit personnel
                            </label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={4}
                                className="px-3 py-2 bg-white text-black font-mono text-sm border-2 border-black focus:outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] resize-none"
                                placeholder="Partage quelques lignes sur ton parcours..."
                            />
                        </div>
                    </div>

                    {/* SECTION 4 : SÉCURITÉ (CHANGEMENT MOT DE PASSE) */}
                    <div className="border-2 border-black p-4 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        <label className="font-mono text-xs font-bold uppercase flex items-center gap-1.5 text-black mb-2">
                            <Lock size={14} />
                            <span>Changer le mot de passe (Laisser vide si inchangé)</span>
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-3 py-2 bg-white text-black font-mono text-sm border-2 border-black focus:outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="secondary" onClick={onClose} className="w-1/2">
                            Annuler
                        </Button>
                        <Button type="submit" variant="primary" className="w-1/2">
                            {loading ? 'ENREGISTREMENT...' : 'SAUVEGARDER'}
                        </Button>
                    </div>

                </form>

            </div>
        </div>
    )
}