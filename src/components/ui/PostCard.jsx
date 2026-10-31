import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { CommentSection } from '../../features/comments/CommentSection'
import { Heart, MessageSquare, Share2 } from 'lucide-react'

export const PostCard = ({ post, currentSession }) => {
    const [likesCount, setLikesCount] = useState(0)
    const [isLiked, setIsLiked] = useState(false)
    const [showComments, setShowComments] = useState(false)

    const isOwnPost = currentSession?.user?.id === post.user_id

    // Charger les likes du post
    const fetchLikes = async () => {
        const { data } = await supabase.from('likes').select('user_id').eq('post_id', post.id)
        if (data) {
            setLikesCount(data.length)
            if (currentSession) {
                setIsLiked(data.some((l) => l.user_id === currentSession.user.id))
            }
        }
    }

    useEffect(() => {
        fetchLikes()
    }, [post.id, currentSession])

    // Gestion du Clic sur Like
    const handleToggleLike = async () => {
        if (!currentSession) {
            alert('Connecte-toi pour aimer une publication.')
            return
        }
        if (isOwnPost) {
            alert('Tu ne peux pas aimer ton propre message.')
            return
        }

        if (isLiked) {
            await supabase.from('likes').delete().eq('post_id', post.id).eq('user_id', currentSession.user.id)
        } else {
            await supabase.from('likes').insert([{ post_id: post.id, user_id: currentSession.user.id }])
        }
        fetchLikes()
    }

    // Partager le post
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
                <span className="font-mono font-bold text-xs bg-black text-white px-2 py-1">
                    @{post.author?.username || 'Anonyme'}
                </span>
                <span className="font-mono text-xs text-zinc-600">
                    {new Date(post.created_at).toLocaleDateString('fr-FR')}
                </span>
            </div>

            {/* Titre & Contenu */}
            {post.title && <h3 className="text-xl font-black uppercase mb-2">{post.title}</h3>}
            <p className="font-sans text-zinc-800 leading-relaxed mb-4 whitespace-pre-line">{post.content}</p>

            {/* Image */}
            {post.image_url && (
                <div className="mb-4 border-2 border-black overflow-hidden bg-zinc-100">
                    <img src={post.image_url} alt="Post" className="w-full h-auto object-cover max-h-96 grayscale hover:grayscale-0 transition-all" />
                </div>
            )}

            {/* Barre d'actions (Like, Commentaires, Partage) */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t-2 border-dashed border-zinc-400">

                {/* Bouton Like */}
                <button
                    onClick={handleToggleLike}
                    disabled={isOwnPost}
                    title={isOwnPost ? "Tu ne peux pas liker tes propres posts" : "J'aime"}
                    className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs font-bold uppercase border-2 border-black transition-all cursor-pointer ${isOwnPost
                        ? 'opacity-50 cursor-not-allowed bg-zinc-100 text-zinc-400'
                        : isLiked
                            ? 'bg-red-500 text-white'
                            : 'bg-white hover:bg-yellow-400'
                        }`}
                >
                    <Heart size={14} className={isLiked ? 'fill-white' : ''} />
                    <span>{likesCount}</span>
                </button>

                {/* Bouton Commentaires */}
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white font-mono text-xs font-bold uppercase border-2 border-black hover:bg-yellow-400 cursor-pointer"
                >
                    <MessageSquare size={14} />
                    <span>Commentaires</span>
                </button>

                {/* Bouton Partage */}
                <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white font-mono text-xs font-bold uppercase border-2 border-black hover:bg-yellow-400 cursor-pointer ml-auto"
                >
                    <Share2 size={14} />
                    <span>Partager</span>
                </button>
            </div>

            {/* Zone des Commentaires déliée */}
            {showComments && <CommentSection postId={post.id} currentSession={currentSession} />}

        </article>
    )
}