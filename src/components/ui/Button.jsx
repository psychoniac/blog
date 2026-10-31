
/**
 * Composant de bouton réutilisable avec un style underground / brutaliste 90s.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Le contenu textuel ou icône du bouton
 * @param {Function} props.onClick - Fonction exécutée au clic
 * @param {'primary'|'secondary'} [props.variant='primary'] - Style visuel du bouton
 * @param {string} [props.className=''] - Classes CSS additionnelles éventuelles
 */
export const Button = ({
    children,
    onClick,
    variant = 'primary',
    className = '',
    type = 'button'
}) => {
    // Styles de base communs à tous les boutons (bordures franches, typographie grasse)
    const baseStyles = "px-4 py-2 font-mono font-bold uppercase transition-transform active:translate-x-1 active:translate-y-1 cursor-pointer"

    // Variantes de couleurs inspirées de l'esthétique fanzine
    const variants = {
        primary: "bg-yellow-400 text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300",
        secondary: "bg-black text-white border-2 border-white shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:bg-zinc-900"
    }

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    )
}