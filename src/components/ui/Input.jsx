
/**
 * Composant Input universel et réutilisable (Style brutaliste / 90s).
 * 
 * @param {Object} props
 * @param {string} [props.label] - Texte du label au-dessus de l'input
 * @param {string} [props.type='text'] - Type HTML de l'input (text, email, password, url, number, etc.)
 * @param {string} props.value - Valeur actuelle du champ
 * @param {Function} props.onChange - Fonction déclenchée à chaque modification
 * @param {string} [props.placeholder=''] - Texte indicatif (placeholder)
 * @param {boolean} [props.required=false] - Champ obligatoire ou non
 * @param {string} [props.className=''] - Classes CSS additionnelles pour la mise en page
 * @param {React.ReactNode} [props.icon] - Icône optionnelle à intégrer dans le label
 */

export const Input = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder = '',
    required = false,
    className = '',
    icon
}) => {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label className="font-mono text-xs font-bold uppercase flex items-center gap-1.5">
                    {icon && <span className="text-zinc-700">{icon}</span>}
                    <span>{label} {required && <span className="text-red-600">*</span>}</span>
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="px-3 py-2 bg-white font-mono text-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            />
        </div>
    )
}