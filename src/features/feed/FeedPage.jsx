import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { PostCard } from '../../components/ui/PostCard'
import { Button } from '../../components/ui/Button'
import { Loader2, RefreshCw, Terminal } from 'lucide-react'

export const FeedPage = ({ currentSession, onNavigateToCreate, onAuthorClick }) => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState(null)

    const fetchGlobalFeed = useCallback(async () => {
        setLoading(true)
        setErrorMessage(null)

        try {
            const { data, error } = await supabase
                .from('posts')
                .select(`
          *,
          author:profiles(username, avatar_url)
        `)
                .order('created_at', { ascending: false })

            if (error) throw error
            setPosts(data || [])
        } catch (err) {
            console.error("Erreur lors du chargement du feed :", err)
            setErrorMessage("Impossible de charger le fil d'actualité pour le moment.")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchGlobalFeed()
    }, [fetchGlobalFeed])

    return (
        <div className="space-y-6">
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-black text-yellow-400 p-1 border border-black"><Terminal size={18} /></span>
                        <h2 className="text-2xl font-black uppercase tracking-tight">// CHRONIQUES EN DIRECT</h2>
                    </div>
                    <p className="font-mono text-xs text-zinc-600">Le flux brut des récits de la communauté.</p>
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={fetchGlobalFeed} title="Rafraîchir" className="p-2.5 bg-white border-2 border-black hover:bg-zinc-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer">
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                    {currentSession && (
                        <Button variant="primary" onClick={onNavigateToCreate} className="text-xs">
                            + Publier un récit
                        </Button>
                    )}
                </div>
            </div>

            {errorMessage && <div className="p-4 bg-red-100 border-2 border-red-600 text-red-800 font-mono text-xs">{errorMessage}</div>}

            {loading && posts.length === 0 ? (
                <div className="flex justify-center items-center py-20 font-mono text-sm bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Loader2 className="animate-spin mr-2" size={20} />
                    <span>SYNCHRONISATION DU FLUX...</span>
                </div>
            ) : (
                <div>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                currentSession={currentSession}
                                onAuthorClick={onAuthorClick}
                                onDeleteSuccess={(id) => setPosts((prev) => prev.filter((p) => p.id !== id))}
                            />
                        ))
                    ) : (
                        <div className="bg-white border-2 border-black p-10 text-center font-mono text-sm text-zinc-600 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            Aucune publication pour l'instant.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}