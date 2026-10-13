// Progressive enhancement: content remains visible if animation APIs are unavailable.
export const motionTargets = 'h1,h2,h3,p,.industrial-tiles,.catalog-grid,.product-gallery,.facility-grid'
export const motionDelay = index => Math.min(index * 60, 240)

export function createPageMotion(root, environment = window) {
  const preference = environment.matchMedia?.('(prefers-reduced-motion: reduce)')
  const animations = new Set()
  let observer
  let frame
  let disposed = false
  function stop() {
    environment.cancelAnimationFrame(frame)
    observer?.disconnect()
    observer = undefined
    for (const animation of animations) animation.cancel()
    animations.clear()
  }
  function play(element, frames, options) {
    if (!element.animate) return
    const animation = element.animate(frames, options)
    animations.add(animation)
    animation.finished.then(() => animations.delete(animation), () => animations.delete(animation))
  }
  function reveal(element, index) {
    play(element, [{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}],
      {duration:520,delay:motionDelay(index),easing:'cubic-bezier(.22,.61,.36,1)',fill:'backwards'})
  }
  function enter() {
    stop()
    if (disposed || preference?.matches) return
    frame = environment.requestAnimationFrame(() => {
      if (disposed || preference?.matches || !root.isConnected) return
      play(root, [{opacity:.4},{opacity:1}], {duration:260,easing:'ease-out'})
      const targets = [...root.querySelectorAll(motionTargets)].filter(element => {
        // Animate grids as a unit, not the grid and every nested heading twice.
        return !element.parentElement?.closest('.industrial-tiles,.catalog-grid,.product-gallery,.facility-grid')
      })
      const visible = targets.filter(element => {
        const rect = element.getBoundingClientRect()
        return rect.height > 0 && rect.bottom > 0 && rect.top < environment.innerHeight
      })
      visible.forEach(reveal)
      if (!environment.IntersectionObserver) return
      const revealed = new Set(visible)
      observer = new environment.IntersectionObserver(entries => {
        let index = 0
        for (const entry of entries) if (entry.isIntersecting && !revealed.has(entry.target)) {
          revealed.add(entry.target)
          observer?.unobserve(entry.target)
          reveal(entry.target,index++)
        }
      }, {threshold:0,rootMargin:'0px 0px -24px 0px'})
      targets.filter(target => !revealed.has(target)).forEach(target => observer.observe(target))
    })
  }
  const onPreference = () => { if (preference.matches) stop() }
  preference?.addEventListener?.('change',onPreference)
  return { enter, dispose() { disposed = true; stop(); preference?.removeEventListener?.('change',onPreference) } }
}
