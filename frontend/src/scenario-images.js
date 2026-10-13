const images = import.meta.glob('./assets/applications/*.webp', {eager:true,query:'?url',import:'default'})
export function scenarioPhoto(name) {
  return images[`./assets/applications/${name}.webp`]
}
export const applicationCovers = {
  'marine-fishing':'aquaculture', 'textile-apparel':'textile',
  'chemical-filtration':'refining', 'automotive-industrial':'automotive',
  'protective-outdoor':'occupational',
}
