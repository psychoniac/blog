import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Image, Send, AlertCircle, X } from 'lucide-react'

/**
 * Composant de création de publication (Texte + Photo optionnelle).
 * Responsabilité unique : Gérer la saisie d'un nouveau post et son enregistrement dans Supabase.
 * 
 * @param {Object} props
 * @param {string} props.userId - L'ID de l'utilisateur connecté (auteur du post)
 * @param {Function} props.onSuccess - Callback exécuté après la publication réussie
 * @param {Function} props.onCancel - Callback pour annuler et revenir en arrière
 */
export const CreatePostForm = ({ userId, onSuccess, onCancel }) => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    /**
     * Gestion de la sélection d'une image locale avec génération d'un aperçu visuel
     */
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Vérification rapide de la taille (ex: max 5 Mo)
            if (file.size > 5 * 1024 * 1024) {
                setErrorMessage("L'image est trop lourde (maximum 5 Mo).")
                return
            }
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
            setErrorMessage(null)
        }
    }

    /**
     * Suppression de l'image sélectionnée
     */
    const handleRemoveImage = () => {
        setImageFile(null)
        setImagePreview(null)
    }

    /**
     * Soumission du formulaire vers Supabase (Storage + Base de données)
     */
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrorMessage(null)

        try {
            if (!content.trim()) {
                throw new Error("Le contenu textuel de la publication ne peut pas être vide.")
            }

            let publicImageUrl = null

            // Étape 1 : Si une image a été sélectionnée, on l'uploade dans Supabase Storage
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop()
                const fileName = `${userId}-${Date.now()}.${fileExt}`
                const filePath = `${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('post-images')
                    .upload(filePath, imageFile)

                if (uploadError) {
                    throw new Error("Erreur lors de l'upload de l'image : " + uploadError.message)
                }

                // Récupération de l'URL publique de l'image stockée
                const { data: publicURLData } = supabase.storage
                    .from('post-images')
                    .getPublicUrl(filePath)

                publicImageUrl = publicURLData.publicUrl
            }

            // Étape 2 : Insertion de la publication dans la table posts
            const { error: insertError } = await supabase
                .from('posts')
                .insert([
                    {
                        user_id: userId,
                        title: title.trim() || null,
                        content: content.trim(),
                        image_url: publicImageUrl,
                    }
                ])

            if (insertError) {
                throw new Error("Erreur lors de l'enregistrement de la publication : " + insertError.message)
            }

            // Succès : Nettoyage et déclenchement du callback
            setTitle('')
            setContent('')
            setImageFile(null)
            setImagePreview(null)

            if (onSuccess) onSuccess()
        } catch (err) {
            setErrorMessage(err.message || "Une erreur est survenue lors de la publication.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">

            <div className="flex justify-between items-center border-b-2 border-black pb-3 mb-6">
                <h2 className="text-xl font-black uppercase tracking-tight">
          // NOUVELLE PUBLICATION
                </h2>
                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="p-1 bg-black text-white hover:bg-yellow-400 hover:text-black transition-colors"
                        title="Annuler"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Message d'erreur éventuel */}
            {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 border-2 border-red-600 text-red-800 font-mono text-xs flex items-center gap-2">
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSubmit}>
                <Input
                    label="Titre du récit (Optionnel)"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ex: Première nuit à la belle étoile..."
                />

                <div className="flex flex-col gap-1.5 mb-4">
                    <label className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                        Contenu / Ton histoire <span className="text-red-600">*</span>
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={6}
                        required
                        className="px-3 py-2 bg-white text-black font-mono text-sm border-2 border-black focus:outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors resize-none leading-relaxed"
                        placeholder="Partage ton vécu, tes pensées, ton parcours..."
                    />
                </div>

                {/* Section Upload d'image */}
                <div className="mb-6">
                    <label className="font-mono text-xs font-bold uppercase tracking-wider text-black block mb-1.5">
                        Ajouter une photo (Optionnel)
                    </label>

                    {!imagePreview ? (
                        <label className="border-2 border-dashed border-black p-4 flex flex-col items-center justify-center gap-2 bg-zinc-50 hover:bg-yellow-50 cursor-pointer transition-colors">
                            <Image size={28} className="text-zinc-700" />
                            <span className="font-mono text-xs font-bold uppercase text-zinc-700">
                                Clique pour sélectionner une image (Max 5 Mo)
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    ) : (
                        <div className="relative border-2 border-black p-2 bg-zinc-100 inline-block">
                            <img
                                src={imagePreview}
                                alt="Aperçu avant publication"
                                className="max-h-48 object-cover border border-black"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-3 right-3 p-1.5 bg-black text-white hover:bg-red-600 transition-colors"
                                title="Supprimer l'image"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-3 pt-2">
                    {onCancel && (
                        <Button type="button" variant="secondary" onClick={onCancel} className="w-1/2">
                            Annuler
                        </Button>
                    )}
                    <Button
                        type="submit"
                        variant="primary"
                        className={onCancel ? "w-1/2" : "w-full"}
                    >
                        {loading ? (
                            'PUBLICATION EN COURS...'
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <Send size={16} />
                                <span>PUBLIER</span>
                            </span>
                        )}
                    </Button>
                </div>
            </form>

        </div>
    )
}