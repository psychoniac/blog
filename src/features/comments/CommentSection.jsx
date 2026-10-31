import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Button } from '../../components/ui/Button'
import { MessageSquare, Reply, CornerDownRight, Send, AlertCircle } from 'lucide-react'

/**
 * Composant de gestion des commentaires et des réponses.
 * Responsabilité unique : Charger, afficher et ajouter des commentaires/réponses sous un post.
 * 
 * @param {Object} props
 * @param {string} props.postId - L'ID du post concerné
 * @param {Object} props.currentSession - Session de l'utilisateur connecté
 */
export const CommentSection = ({ postId, currentSession }) => {
    const [comments, setComments] = useState([])
    const [newCommentText, setNewCommentText] = useState('')
    const [replyToId, setReplyToId] = useState(null) // Contient l'ID du commentaire auquel on répond
    const [replyText, setReplyText] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)

    // Chargement des commentaires avec leurs auteurs
    const fetchComments = async () => {
        try {
            const { data, error } = await supabase
                .from('comments')
                .select(`
          *,
          author:profiles(username, avatar_url)
        `)
                .eq('post_id', postId)
                .order('created_at', { ascending: true })

            if (error) throw error
            setComments(data || [])
        } catch (err) {
            console.error('Erreur chargement commentaires:', err)
        }
    }

    useEffect(() => {
        if (postId) fetchComments()
    }, [postId])

    // Publier un commentaire principal ou une réponse
    const handleAddComment = async (parentId = null, text = '') => {
        if (!text.trim()) return
        if (!currentSession) {
            setErrorMsg('Tu dois être connecté pour écrire un commentaire.')
            return
        }

        setLoading(true)
        setErrorMsg(null)

        try {
            const { error } = await supabase.from('comments').insert([
                {
                    post_id: postId,
                    user_id: currentSession.user.id,
                    parent_id: parentId,
                    content: text.trim(),
                },
            ])

            if (error) throw error

            if (parentId) {
                setReplyToId(null)
                setReplyText('')
            } else {
                setNewCommentText('')
            }

            fetchComments()
        } catch (err) {
            setErrorMsg(err.message || 'Erreur lors de l\'envoi du commentaire.')
        } finally {
            setLoading(false)
        }
    }

    // Filtrage des commentaires principaux (parent_id = null) et des réponses
    const rootComments = comments.filter((c) => !c.parent_id)
    const getReplies = (parentId) => comments.filter((c) => c.parent_id === parentId)

    return (
        <div className="mt-4 pt-4 border-t-2 border-dashed border-black bg-zinc-50 p-4">
            <h4 className="font-mono text-xs font-bold uppercase flex items-center gap-1.5 mb-4">
                <MessageSquare size={14} />
                <span>Espace de discussion ({comments.length})</span>
            </h4>

            {errorMsg && (
                <div className="mb-3 p-2 bg-red-100 border border-red-600 text-red-800 font-mono text-xs flex items-center gap-1">
                    <AlertCircle size={14} />
                    <span>{errorMsg}</span>
                </div>
            )}

            {/* Formulaire de nouveau commentaire principal */}
            {currentSession ? (
                <div className="flex gap-2 mb-6">
                    <input
                        type="text"
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Écris un commentaire libre..."
                        className="flex-grow px-3 py-1.5 bg-white text-black font-mono text-xs border-2 border-black focus:outline-none focus:bg-yellow-50"
                    />
                    <Button
                        variant="primary"
                        onClick={() => handleAddComment(null, newCommentText)}
                        className="text-xs shrink-0"
                    >
                        <Send size={14} />
                    </Button>
                </div>
            ) : (
                <p className="font-mono text-xs text-zinc-500 mb-4 italic">
                    Connecte-toi pour intervenir dans la discussion.
                </p>
            )}

            {/* Arborescence des commentaires */}
            <div className="space-y-4">
                {rootComments.length > 0 ? (
                    rootComments.map((comment) => (
                        <div key={comment.id} className="border-l-2 border-black pl-3 py-1">

                            {/* En-tête commentaire */}
                            <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                                <span className="font-bold bg-black text-white px-1.5 py-0.5">
                                    @{comment.author?.username || 'Anonyme'}
                                </span>
                                <span className="text-zinc-500">
                                    {new Date(comment.created_at).toLocaleDateString('fr-FR')}
                                </span>
                            </div>

                            {/* Contenu */}
                            <p className="font-sans text-xs text-zinc-800 mb-2">{comment.content}</p>

                            {/* Bouton Répondre */}
                            {currentSession && (
                                <button
                                    onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)}
                                    className="font-mono text-[10px] font-bold uppercase text-zinc-600 hover:text-black flex items-center gap-1 cursor-pointer"
                                >
                                    <Reply size={12} />
                                    <span>Répondre</span>
                                </button>
                            )}

                            {/* Champ de réponse sous ce commentaire */}
                            {replyToId === comment.id && (
                                <div className="flex gap-2 mt-2 ml-4">
                                    <input
                                        type="text"
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder={`Répondre à @${comment.author?.username}...`}
                                        className="flex-grow px-2 py-1 bg-white font-mono text-xs border border-black focus:outline-none"
                                    />
                                    <Button
                                        variant="primary"
                                        onClick={() => handleAddComment(comment.id, replyText)}
                                        className="text-[10px] py-1 px-2"
                                    >
                                        Envoyer
                                    </Button>
                                </div>
                            )}

                            {/* Affichage des réponses imbriquées */}
                            {getReplies(comment.id).map((reply) => (
                                <div key={reply.id} className="mt-2 ml-4 pl-3 border-l-2 border-dashed border-zinc-400">
                                    <div className="flex items-center gap-1 text-[10px] font-mono mb-0.5">
                                        <CornerDownRight size={10} className="text-zinc-500" />
                                        <span className="font-bold uppercase text-zinc-800">
                                            @{reply.author?.username}
                                        </span>
                                    </div>
                                    <p className="font-sans text-xs text-zinc-700">{reply.content}</p>
                                </div>
                            ))}

                        </div>
                    ))
                ) : (
                    <p className="font-mono text-xs text-zinc-500 italic">Aucun commentaire pour le moment.</p>
                )}
            </div>
        </div>
    )
}