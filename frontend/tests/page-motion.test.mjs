import test from 'node:test'
import assert from 'node:assert/strict'
import { createPageMotion, motionDelay } from '../src/page-motion.js'

function fixture(reduced = false) {
  const calls = [], observed = [], cancelled = []
  let pending, listener, observerCallback, disconnected = 0
  const animate = function(frames,options) {
    calls.push({target:this,frames,options})
    return {finished:new Promise(()=>{}),cancel(){cancelled.push(true)}}
  }
  const target = top => ({animate,parentElement:{closest:()=>null},getBoundingClientRect:()=>({top,bottom:top+40,height:40})})
  const heading = target(100), paragraph = target(200), below = target(1100)
  const root = {animate,isConnected:true,querySelectorAll:()=>[heading,paragraph,below]}
  const preference = {matches:reduced,addEventListener:(name,fn)=>listener=fn,removeEventListener:()=>listener=undefined}
  const environment = {innerHeight:800,matchMedia:()=>preference,requestAnimationFrame:fn=>(pending=fn,1),cancelAnimationFrame:()=>pending=undefined,
    IntersectionObserver:class {constructor(fn){observerCallback=fn}observe(target){observed.push(target)}unobserve(){}disconnect(){disconnected++}}}
  return {root,environment,calls,observed,cancelled,heading,paragraph,below,preference,
    flush(){const fn=pending;pending=undefined;fn?.()},intersect(entries){observerCallback(entries)},reduce(){preference.matches=true;listener?.()},disconnected:()=>disconnected}
}
test('page and visible text animate with a short, capped stagger', () => {
  const f = fixture(), motion = createPageMotion(f.root,f.environment)
  motion.enter(); f.flush()
  assert.equal(f.calls.length,3)
  assert.equal(f.calls[0].target,f.root)
  assert.equal(f.calls[1].options.delay,0)
  assert.equal(f.calls[2].options.delay,60)
  assert.equal(motionDelay(100),240)
  assert.deepEqual(f.observed,[f.below])
  motion.dispose()
})
test('offscreen content reveals once when scrolling into view', () => {
  const f = fixture(), motion = createPageMotion(f.root,f.environment)
  motion.enter(); f.flush()
  f.intersect([{target:f.below,isIntersecting:true}]); f.intersect([{target:f.below,isIntersecting:true}])
  assert.equal(f.calls.filter(c=>c.target===f.below).length,1)
  motion.dispose()
})
test('rapid navigation cancels old animation and observers', () => {
  const f = fixture(), motion = createPageMotion(f.root,f.environment)
  motion.enter(); f.flush(); motion.enter()
  assert.equal(f.cancelled.length,3)
  assert.equal(f.disconnected(),1)
  motion.dispose(); f.flush()
  assert.equal(f.calls.length,3)
})
test('reduced motion bypasses effects and changing preference cancels them', () => {
  const f = fixture(true), motion = createPageMotion(f.root,f.environment)
  motion.enter(); f.flush(); assert.equal(f.calls.length,0); motion.dispose()
  const active = fixture(), other = createPageMotion(active.root,active.environment)
  other.enter(); active.flush(); active.reduce()
  assert.equal(active.cancelled.length,3); assert.equal(active.disconnected(),1)
  other.dispose()
})
test('unsupported APIs or disconnected content never require hidden styles', () => {
  const f = fixture(); delete f.environment.IntersectionObserver; delete f.root.animate
  const motion = createPageMotion(f.root,f.environment)
  motion.enter(); f.flush(); assert.equal(f.calls.length,2)
  f.root.isConnected=false; motion.enter(); f.flush(); assert.equal(f.calls.length,2)
  motion.dispose()
})
