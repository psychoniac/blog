import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import { Layout } from './components/layouts/Layout'
import { AuthModal } from './features/auth/AuthModal'

export function App() {
  const [session, setSession] = useState(null)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [currentView, setCurrentView] = useState('feed')

  // Synchronisation de la session Supabase
  useEffect(() => {
    // 1. Récupérer la session courante au chargement
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // 2. Écouter les changements d'état d'authentification (connexion, déconnexion)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Déconnexion
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
      {/* Contenu principal selon la vue */}
      <div className="border-2 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-2xl font-black uppercase mb-2">
          // ESPACE {currentView.toUpperCase()}
        </h2>
        <p className="font-mono text-sm text-zinc-700">
          {session ? (
            <span>Connecté en tant que : <strong>{session.user.email}</strong></span>
          ) : (
            <span>Mode visiteur non connecté.</span>
          )}
        </p>
      </div>

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