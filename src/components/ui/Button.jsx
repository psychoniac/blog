
/**
 * Composant Bouton universel et réutilisable (Style brutaliste / 90s).
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Texte ou icônes à l'intérieur du bouton
 * @param {Function} [props.onClick] - Fonction déclenchée au clic
 * @param {'primary'|'secondary'|'danger'} [props.variant='primary'] - Style visuel du bouton
 * @param {string} [className=''] - Classes CSS additionnelles pour la mise en page
 * @param {'button'|'submit'|'reset'} [props.type='button'] - Type HTML du bouton
 * @param {boolean} [props.disabled=false] - État désactivé
 */
export const Button = ({
    children,
    onClick,
    variant = 'primary',
    className = '',
    type = 'button',
    disabled = false
}) => {
    // Styles de base communs à tous les boutons (bordure franche, police fanzine, effet d'ombre dure)
    const baseStyles = "px-4 py-2 font-mono font-bold uppercase transition-all duration-150 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"

    // Variantes graphiques inspirées de l'esthétique underground
    const variants = {
        primary: "bg-yellow-400 text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300",
        secondary: "bg-black text-white border-2 border-white shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:bg-zinc-900",
        danger: "bg-red-600 text-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-red-700"
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
        >
            {children}
        </button>
    )
}