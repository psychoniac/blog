import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import { Layout } from './components/layouts/Layout'
import { AuthModal } from './features/auth/AuthModal'
import { FeedPage } from './features/feed/FeedPage'
import { ProfilePage } from './features/profile/ProfilePage'
import { CreatePostForm } from './features/posts/CreatePostForm'
import { PublicProfilePage } from './features/profile/PublicProfilePage'
import { PortfolioPage } from './features/portfolio/PortfolioPage'

export function App() {
  const [session, setSession] = useState(null)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [currentView, setCurrentView] = useState('feed') // 'feed', 'profile', 'create', 'public-profile'
  const [selectedAuthorId, setSelectedAuthorId] = useState(null)
  // Écoute de l'état d'authentification Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Gestion de la déconnexion
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setCurrentView('feed')
  }

  return (
    <Layout
      isAuthenticated={!!session}
      onOpenAuth={() => setIsAuthOpen(true)}
      onLogout={handleLogout}
      onNavigate={(view) => setCurrentView(view)}
    >
      {/* Affichage conditionnel des pages selon la navigation */}
      {currentView === 'feed' && (
        <FeedPage
          currentSession={session}
          onNavigateToCreate={() => setCurrentView('create')}
          onAuthorClick={(authorId) => {
            setSelectedAuthorId(authorId)
            setCurrentView('public-profile')
          }}
        />
      )}

      {currentView === 'portfolio' && (
        <PortfolioPage currentSession={session} />
      )}

      {currentView === 'public-profile' && (
        <PublicProfilePage
          userId={selectedAuthorId}
          currentSession={session}
          onBack={() => setCurrentView('feed')}
          onAuthorClick={(authorId) => {
            // Permet de naviguer de profil en profil si on clique sur un auteur depuis un autre profil
            setSelectedAuthorId(authorId)
          }}
        />
      )}

      {currentView === 'profile' && session && (
        <ProfilePage
          userId={session.user.id}
          currentSession={session}
        />
      )}

      {currentView === 'create' && session && (
        <CreatePostForm
          userId={session.user.id}
          onSuccess={() => setCurrentView('feed')}
          onCancel={() => setCurrentView('feed')}
        />
      )}

      {/* Modale d'authentification */}
      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
          onSuccess={() => setIsAuthOpen(false)}
        />
      )}
    </Layout>
  )
}

export default App