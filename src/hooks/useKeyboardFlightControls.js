import { useEffect, useRef } from 'react'

export const FLIGHT_MOVE_KEYS = new Set([
  'KeyW',
  'KeyA',
  'KeyS',
  'KeyD',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'KeyQ',
  'KeyE',
  'ShiftLeft',
  'ShiftRight',
  'Space',
])

function isEditableElement(element) {
  if (!element) {
    return false
  }

  const tagName = element.tagName?.toLowerCase()

  return (
    element.isContentEditable ||
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'button' ||
    tagName === 'select'
  )
}

function stopFlightKeyEvent(event) {
  event.preventDefault()
  event.stopPropagation()
  event.stopImmediatePropagation?.()
}

export function useKeyboardFlightControls(isActive) {
  const keysRef = useRef(new Set())

  useEffect(() => {
    if (!isActive) {
      keysRef.current.clear()
      return undefined
    }

    const pressedKeys = keysRef.current

    const handleKeyDown = (event) => {
      if (!FLIGHT_MOVE_KEYS.has(event.code)) {
        return
      }

      if (isEditableElement(document.activeElement) || isEditableElement(event.target)) {
        return
      }

      stopFlightKeyEvent(event)
      pressedKeys.add(event.code)
    }

    const handleKeyUp = (event) => {
      if (!FLIGHT_MOVE_KEYS.has(event.code)) {
        return
      }

      if (isEditableElement(document.activeElement) || isEditableElement(event.target)) {
        return
      }

      stopFlightKeyEvent(event)
      pressedKeys.delete(event.code)
    }

    window.addEventListener('keydown', handleKeyDown, { capture: true })
    window.addEventListener('keyup', handleKeyUp, { capture: true })

    return () => {
      pressedKeys.clear()
      window.removeEventListener('keydown', handleKeyDown, { capture: true })
      window.removeEventListener('keyup', handleKeyUp, { capture: true })
    }
  }, [isActive])

  return keysRef
}
