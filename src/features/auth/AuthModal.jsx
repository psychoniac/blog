import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { AlertCircle, X } from 'lucide-react'

/**
 * Composant de connexion et d'inscription Supabase.
 * Responsabilité unique : Gérer la saisie des identifiants et l'interaction avec Supabase Auth.
 * 
 * @param {Object} props
 * @param {Function} props.onClose - Callback pour fermer la modale
 * @param {Function} props.onSuccess - Callback exécuté une fois connecté
 */

export const AuthModal = ({ onClose, onSuccess }) => {
    // Mode du formulaire : 'login' ou 'register'
    const [isRegisterMode, setIsRegisterMode] = useState(false)

    // Champs du formulaire
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')

    // États d'exécution et d'erreur
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)


    /**
     * Traitement de la soumission du formulaire (Connexion ou Inscription)
     */
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrorMessage(null)

        try {
            if (isRegisterMode) {
                // 1. Validation du pseudo
                if (!username.trim()) {
                    throw new Error('Un pseudo est requis pour créer un profil.')
                }

                // 2. Création du compte utilisateur dans Supabase Auth
                // On passe le pseudo dans 'options.data' pour que le trigger SQL le récupère automatiquement
                const { error: authError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            username: username.trim(),
                        },
                    },
                })

                if (authError) throw authError

            } else {
                // Connexion simple via Supabase Auth
                const { error: loginError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })

                if (loginError) throw loginError
            }

            // Notification de succès et fermeture
            if (onSuccess) onSuccess()
            if (onClose) onClose()
        } catch (err) {
            setErrorMessage(err.message || 'Une erreur est survenue.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#f4f4f0] border-4 border-black p-6 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">

                {/* Bouton fermeture */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-1 bg-black text-white hover:bg-yellow-400 hover:text-black transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Titre du formulaire */}
                <h2 className="text-xl font-black uppercase tracking-tight mb-1">
          // {isRegisterMode ? 'REJOINDRE LE LEAGUE' : 'ACCÈS MEMBRE'}
                </h2>
                <p className="font-mono text-xs text-zinc-600 mb-6">
                    {isRegisterMode
                        ? 'Crée ton profil pour publier tes récits et photos.'
                        : 'Identifie-toi pour accéder à ton espace.'}
                </p>

                {/* Message d'erreur */}
                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-100 border-2 border-red-600 text-red-800 font-mono text-xs flex items-center gap-2">
                        <AlertCircle size={18} className="shrink-0" />
                        <span>{errorMessage}</span>
                    </div>
                )}

                {/* Formulaire */}
                <form onSubmit={handleSubmit}>
                    {isRegisterMode && (
                        <Input
                            label="Pseudo (Visible sur le blog)"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="ex: Bitume_94"
                            required
                        />
                    )}

                    <Input
                        label="Adresse Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        required
                    />

                    <Input
                        label="Mot de passe"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full mt-2"
                    >
                        {loading
                            ? 'CHARGEMENT...'
                            : isRegisterMode ? 'CRÉER MON COMPTE' : 'SE CONNECTER'}
                    </Button>
                </form>

                {/* Bascule Connexion / Inscription */}
                <div className="mt-6 pt-4 border-t-2 border-dashed border-zinc-400 text-center font-mono text-xs">
                    {isRegisterMode ? (
                        <p>
                            Déjà un compte ?{' '}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsRegisterMode(false)
                                    setErrorMessage(null)
                                }}
                                className="font-bold underline uppercase hover:text-yellow-600"
                            >
                                Se connecter
                            </button>
                        </p>
                    ) : (
                        <p>
                            Pas encore inscrit ?{' '}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsRegisterMode(true)
                                    setErrorMessage(null)
                                }}
                                className="font-bold underline uppercase hover:text-yellow-600"
                            >
                                Créer un compte
                            </button>
                        </p>
                    )}
                </div>

            </div>
        </div>
    )
}