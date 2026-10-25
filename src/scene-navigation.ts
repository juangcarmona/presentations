export function sceneIndex(scenes: readonly { id: string }[], hash: string): number {
  const params = new URLSearchParams(hash.replace(/^#/, ''))
  return Math.max(0, scenes.findIndex(scene => scene.id === params.get('scene')))
}

export function nextIndex(index: number, direction: number, count: number): number {
  return Math.max(0, Math.min(count - 1, index + direction))
}

type Shortcut = Pick<KeyboardEvent, 'key' | 'defaultPrevented' | 'isComposing' | 'repeat' | 'altKey' | 'ctrlKey' | 'metaKey' | 'shiftKey'>
export function handlesShortcut(event: Shortcut, interactive: boolean): boolean {
  return !interactive && !event.defaultPrevented && !event.isComposing && !event.repeat &&
    !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey &&
    ['ArrowRight', 'PageDown', 'ArrowLeft', 'PageUp'].includes(event.key)
}

export const interactiveSelector = 'a,button,input,textarea,select,summary,[contenteditable]:not([contenteditable="false"]),audio,video,iframe,embed,object,[tabindex]:not([tabindex="-1"]),[role="button"],[role="link"],[role="textbox"],[role="searchbox"],[role="combobox"],[role="slider"],[role="spinbutton"],[role="checkbox"],[role="radio"],[role="radiogroup"],[role="switch"],[role="menu"],[role="menubar"],[role="menuitem"],[role="menuitemcheckbox"],[role="menuitemradio"],[role="tab"],[role="tablist"],[role="tree"],[role="treeitem"],[role="option"],[role="grid"],[role="gridcell"],[role="listbox"],[role="scrollbar"],[role="separator"][aria-valuenow]'
