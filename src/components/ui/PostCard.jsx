import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { CommentSection } from '../../features/comments/CommentSection'
import { Heart, MessageSquare, Share2, Trash2 } from 'lucide-react'

export const PostCard = ({ post, currentSession, onDeleteSuccess, onAuthorClick }) => {
    const [likesCount, setLikesCount] = useState(0)
    const [isLiked, setIsLiked] = useState(false)
    const [showComments, setShowComments] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const isOwnPost = currentSession?.user?.id === post.user_id

    // Fonction mémorisée pour charger les likes
    const fetchLikes = useCallback(async () => {
        const { data } = await supabase.from('likes').select('user_id').eq('post_id', post.id)
        if (data) {
            setLikesCount(data.length)
            if (currentSession) {
                setIsLiked(data.some((l) => l.user_id === currentSession.user.id))
            }
        }
    }, [post.id, currentSession])

    useEffect(() => {
        if (post.id) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchLikes()
        }
    }, [fetchLikes, post.id])

    // Suppression d'une publication
    const handleDeletePost = async () => {
        const confirmDelete = window.confirm("Es-tu sûr de vouloir supprimer cette publication ?")
        if (!confirmDelete) return

        setIsDeleting(true)
        try {
            if (post.image_url) {
                const urlParts = post.image_url.split('/')
                const fileName = urlParts[urlParts.length - 1]
                await supabase.storage.from('post-images').remove([fileName])
            }

            const { error } = await supabase.from('posts').delete().eq('id', post.id)
            if (error) throw error

            if (onDeleteSuccess) onDeleteSuccess(post.id)
        } catch (err) {
            alert("Erreur lors de la suppression : " + err.message)
        } finally {
            setIsDeleting(false)
        }
    }

    // Like / Unlike
    const handleToggleLike = async () => {
        if (!currentSession) return alert('Connecte-toi pour aimer une publication.')
        if (isOwnPost) return alert('Tu ne peux pas aimer ton propre message.')

        if (isLiked) {
            await supabase.from('likes').delete().eq('post_id', post.id).eq('user_id', currentSession.user.id)
        } else {
            await supabase.from('likes').insert([{ post_id: post.id, user_id: currentSession.user.id }])
        }
        fetchLikes()
    }

    // Partager
    const handleShare = () => {
        const shareUrl = `${window.location.origin}/#post-${post.id}`
        if (navigator.share) {
            navigator.share({ title: post.title || 'Publication', url: shareUrl })
        } else {
            navigator.clipboard.writeText(shareUrl)
            alert('Lien de la publication copié dans le presse-papier !')
        }
    }

    return (
        <article className="bg-white border-2 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-6">

            {/* En-tête */}
            <div className="flex justify-between items-center border-b-2 border-black pb-3 mb-4">
                <button
                    onClick={() => {
                        if (onAuthorClick && post.user_id) onAuthorClick(post.user_id)
                    }}
                    className="flex items-center gap-2 group cursor-pointer text-left"
                >
                    {post.author?.avatar_url && (
                        <img src={post.author.avatar_url} alt="Avatar" className="w-6 h-6 object-cover border border-black grayscale group-hover:grayscale-0 transition-all" />
                    )}
                    <span className="font-mono font-bold text-xs bg-black text-white px-2 py-1 group-hover:bg-yellow-400 group-hover:text-black transition-colors">
                        @{post.author?.username || 'Anonyme'}
                    </span>
                </button>

                <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-zinc-600">
                        {new Date(post.created_at).toLocaleDateString('fr-FR')}
                    </span>

                    {isOwnPost && (
                        <button
                            onClick={handleDeletePost}
                            disabled={isDeleting}
                            title="Supprimer"
                            className="p-1 bg-red-600 text-white hover:bg-black transition-colors cursor-pointer"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>
            </div>

            {post.title && <h3 className="text-xl font-black uppercase mb-2">{post.title}</h3>}
            <p className="font-sans text-zinc-800 leading-relaxed mb-4 whitespace-pre-line">{post.content}</p>

            {post.image_url && (
                <div className="mb-4 border-2 border-black overflow-hidden bg-zinc-100">
                    <img src={post.image_url} alt="Post" className="w-full h-auto object-cover max-h-96 grayscale hover:grayscale-0 transition-all" />
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t-2 border-dashed border-zinc-400">
                <button
                    onClick={handleToggleLike}
                    disabled={isOwnPost}
                    className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs font-bold uppercase border-2 border-black cursor-pointer ${isOwnPost ? 'opacity-50 bg-zinc-100 text-zinc-400 cursor-not-allowed' : isLiked ? 'bg-red-500 text-white' : 'bg-white hover:bg-yellow-400'
                        }`}
                >
                    <Heart size={14} className={isLiked ? 'fill-white' : ''} />
                    <span>{likesCount}</span>
                </button>

                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white font-mono text-xs font-bold uppercase border-2 border-black hover:bg-yellow-400 cursor-pointer"
                >
                    <MessageSquare size={14} />
                    <span>Commentaires</span>
                </button>

                <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white font-mono text-xs font-bold uppercase border-2 border-black hover:bg-yellow-400 cursor-pointer ml-auto"
                >
                    <Share2 size={14} />
                    <span>Partager</span>
                </button>
            </div>

            {showComments && <CommentSection postId={post.id} currentSession={currentSession} />}

        </article>
    )
}