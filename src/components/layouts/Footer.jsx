
/**
 * Pied de page du blog.
 * Responsabilité unique : Afficher les mentions légales, l'état d'esprit et les crédits.
 */

export const Footer = () => {
    return (
        <footer className="border-t-4 border-black bg-black text-white mt-16 py-8 px-4 font-mono">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                <div>
                    <p className="font-bold uppercase tracking-widest text-yellow-400">
                        Blog de Jlnko
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">
                        Espace de partage libre, sans filtre. Propulsé par React, Tailwind & Supabase.
                    </p>
                </div>
                <div className="text-xs text-zinc-500 border border-zinc-700 px-3 py-1.5 bg-zinc-900">
                    MODE // BRUTALIST 1994 - NY & LA ROCHELLE
                </div>
            </div>
        </footer>
    )
}