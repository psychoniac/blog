import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { X, Lock, Mail, User, AlertCircle, CheckCircle2 } from 'lucide-react'

/**
 * Modale d'authentification (Connexion / Inscription).
 * Responsabilité unique : Gérer la saisie des identifiants et communiquer avec Supabase Auth.
 * 
 * @param {Object} props
 * @param {Function} props.onClose - Fonction pour fermer la modale
 * @param {Function} props.onSuccess - Callback exécuté après une connexion/inscription réussie
 */
export const AuthModal = ({ onClose, onSuccess }) => {
    const [isSignUp, setIsSignUp] = useState(false) // false = Connexion, true = Inscription
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)
    const [successMsg, setSuccessMsg] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrorMsg(null)
        setSuccessMsg(null)

        try {
            if (isSignUp) {
                // --- INSCRIPTION ---
                if (!username.trim()) {
                    throw new Error("Le pseudo est obligatoire pour l'inscription.")
                }

                const { error: signUpError } = await supabase.auth.signUp({
                    email: email.trim(),
                    password,
                    options: {
                        data: {
                            username: username.trim(),
                        },
                    },
                })

                if (signUpError) throw signUpError

                setSuccessMsg("Compte créé avec succès ! Tu peux maintenant te connecter.")
                setIsSignUp(false) // Basculer vers la connexion
            } else {
                // --- CONNEXION ---
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email: email.trim(),
                    password,
                })

                if (signInError) throw signInError

                if (onSuccess) onSuccess()
                onClose()
            }
        } catch (err) {
            setErrorMsg(err.message || "Une erreur est survenue lors de l'authentification.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-white border-4 border-black max-w-md w-full p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">

                {/* Bouton de fermeture */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                >
                    <X size={18} />
                </button>

                {/* En-tête de la modale */}
                <div className="border-b-2 border-black pb-3 mb-5">
                    <h3 className="text-xl font-black uppercase tracking-wide">
                        {isSignUp ? '// CRÉER UN COMPTE' : '// IDENTIFICATION'}
                    </h3>
                    <p className="font-mono text-xs text-zinc-600 mt-0.5">
                        {isSignUp ? "Rejoins le fanzine et prends part au réseau." : "Bon retour parmi nous, connecte-toi."}
                    </p>
                </div>

                {/* Message d'erreur */}
                {errorMsg && (
                    <div className="mb-4 p-3 bg-red-100 border-2 border-red-600 text-red-800 font-mono text-xs flex items-start gap-2">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <span>{errorMsg}</span>
                    </div>
                )}

                {/* Message de succès */}
                {successMsg && (
                    <div className="mb-4 p-3 bg-green-100 border-2 border-green-600 text-green-800 font-mono text-xs flex items-start gap-2">
                        <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                        <span>{successMsg}</span>
                    </div>
                )}

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Champ Pseudo (Uniquement en mode Inscription) */}
                    {isSignUp && (
                        <div>
                            <label className="font-mono text-xs font-bold uppercase block mb-1 flex items-center gap-1.5">
                                <User size={14} />
                                <span>Pseudo</span>
                            </label>
                            <Input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required={isSignUp}
                                placeholder="ex: rider_94"
                                className="w-full px-3 py-2 bg-white font-mono text-sm border-2 border-black focus:outline-none focus:bg-yellow-50"
                            />
                        </div>
                    )}

                    {/* Champ Email */}
                    <div>
                        <label className="font-mono text-xs font-bold uppercase block mb-1 flex items-center gap-1.5">
                            <Mail size={14} />
                            <span>Adresse Email</span>
                        </label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="toi@exemple.com"
                            className="w-full px-3 py-2 bg-white font-mono text-sm border-2 border-black focus:outline-none focus:bg-yellow-50"
                        />
                    </div>

                    {/* Champ Mot de passe */}
                    <div>
                        <label className="font-mono text-xs font-bold uppercase block mb-1 flex items-center gap-1.5">
                            <Lock size={14} />
                            <span>Mot de passe</span>
                        </label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full px-3 py-2 bg-white font-mono text-sm border-2 border-black focus:outline-none focus:bg-yellow-50"
                        />
                    </div>

                    {/* Bouton de soumission */}
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                        className="w-full py-2.5 mt-2 text-sm"
                    >
                        {loading ? 'TRAITEMENT EN COURS...' : isSignUp ? "S'INSCRIRE" : "SE CONNECTER"}
                    </Button>
                </form>

                {/* Bascule entre Connexion et Inscription */}
                <div className="mt-5 pt-4 border-t-2 border-dashed border-zinc-300 text-center font-mono text-xs">
                    {isSignUp ? (
                        <p>
                            Déjà un compte ?{' '}
                            <button
                                type="button"
                                onClick={() => { setIsSignUp(false); setErrorMsg(null); setSuccessMsg(null); }}
                                className="font-bold underline uppercase hover:text-yellow-600 cursor-pointer"
                            >
                                Se connecter
                            </button>
                        </p>
                    ) : (
                        <p>
                            Pas encore de compte ?{' '}
                            <button
                                type="button"
                                onClick={() => { setIsSignUp(true); setErrorMsg(null); setSuccessMsg(null); }}
                                className="font-bold underline uppercase hover:text-yellow-600 cursor-pointer"
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