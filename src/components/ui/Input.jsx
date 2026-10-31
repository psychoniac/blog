
/**
 * Composant de champ de saisie réutilisable style fanzine / 90s.
 * 
 * @param {Object} props
 * @param {string} props.label - Libellé affiché au-dessus du champ
 * @param {string} props.type - Type de l'input ('text', 'email', 'password', etc.)
 * @param {string} props.value - Valeur actuelle du champ
 * @param {Function} props.onChange - Handler de changement de valeur
 * @param {string} [props.placeholder=''] - Texte indicatif
 * @param {boolean} [props.required=false] - Indique si le champ est obligatoire
 */

export const Input = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder = '',
    required = false
}) => {
    return (
        <div className="flex flex-col gap-1.5 mb-4">
            {label && (
                <label className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                    {label} {required && <span className="text-red-600">*</span>}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="px-3 py-2 bg-white text-black font-mono text-sm border-2 border-black focus:outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors"
            />
        </div>
    )
}