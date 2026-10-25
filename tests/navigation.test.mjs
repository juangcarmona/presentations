import test from 'node:test'
import assert from 'node:assert/strict'
import { sceneIndex, nextIndex, handlesShortcut } from '../src/scene-navigation.ts'

test('stable fragments recover safely and boundaries never wrap', () => {
  const scenes = [{ id: 'cover' }, { id: 'end' }]
  assert.equal(sceneIndex(scenes, '#scene=end'), 1)
  for (const hash of ['', '#scene=unknown', '#scene=%', '#other=end']) assert.equal(sceneIndex(scenes, hash), 0)
  assert.equal(nextIndex(0, -1, 2), 0)
  assert.equal(nextIndex(1, 1, 2), 1)
  assert.equal(nextIndex(0, 1, 2), 1)
})

test('only documented, unmodified, non-repeated shortcuts are handled', () => {
  const event = { key: 'ArrowRight', defaultPrevented: false, isComposing: false, repeat: false, altKey: false, ctrlKey: false, metaKey: false, shiftKey: false }
  assert.equal(handlesShortcut(event, false), true)
  assert.equal(handlesShortcut(event, true), false)
  for (const flag of ['defaultPrevented', 'isComposing', 'repeat', 'altKey', 'ctrlKey', 'metaKey', 'shiftKey']) assert.equal(handlesShortcut({ ...event, [flag]: true }, false), false)
  for (const key of [' ', 'ArrowUp', 'ArrowDown', 'Escape']) assert.equal(handlesShortcut({ ...event, key }, false), false)
})
