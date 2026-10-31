/**
 * Générateur de pseudos au style underground / 90s / street.
 * Responsabilité unique : Combiner des préfixes et suffixes pour suggérer un pseudo unique.
 * 
 * @returns {string} Pseudo généré aléatoirement
 */

export const generateStreetUsername = () => {
  const prefixes = [
    'Bitume', 'Asphalte', 'Subway', 'Fanzine', 'Neon', 'Echo', 
    'Graff', 'LigneB', 'Pavé', 'Brique', 'Vinyl', 'Roc'
  ]
  
  const suffixes = [
    'Rider', 'Poet', 'Soul', '94', '90s', 'Wanderer', 
    'Ghost', 'Artist', 'Writer', 'Echo', 'Vibe', 'Walker'
  ]

  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)]
  const randomNumber = Math.floor(Math.random() * 89) + 10

  return `${randomPrefix}_${randomSuffix}_${randomNumber}`
}

/**
 * Collection d'avatars prédéfinis via DiceBear API
 */
export const AVATAR_STYLES = [
  { id: 'bottts-1', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Asphalte' },
  { id: 'bottts-2', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Subway90' },
  { id: 'shapes-1', url: 'https://api.dicebear.com/7.x/shapes/svg?seed=NeonVibe' },
  { id: 'shapes-2', url: 'https://api.dicebear.com/7.x/shapes/svg?seed=BitumeArt' },
  { id: 'pixel-1', url: 'https://api.dicebear.com/7.x/pixel-art/seed=Fanzine94' },
]