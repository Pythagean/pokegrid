export const base = 'https://raw.githubusercontent.com/Pythagean/pokedle_assets/main/images'
export const spritesBase = 'https://raw.githubusercontent.com/Pythagean/pokedle_assets/main/icons'
export const placeholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120"><rect fill="%23eee" width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="12">missing</text></svg>'
export function handleImgError(e) { if (e?.target) e.target.src = placeholder }
