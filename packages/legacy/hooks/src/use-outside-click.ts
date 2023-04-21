import { getOwnerDocument } from "@chakra-ui/utils"
import { useEffect, useRef } from "react"
import { useCallbackRef } from "./use-callback-ref"

export interface UseOutsideClickProps {
  /**
   * Whether context Menu Listener is enabled
   */
  listenContextMenu?: boolean
  /**
   * Whether the hook is enabled
   */
  enabled?: boolean
  /**
   * The reference to a DOM element.
   */
  ref: React.RefObject<HTMLElement>
  /**
   * Function invoked when a click is triggered outside the referenced element.
   */
  handler?: (e: Event) => void
}

/**
 * Example, used in components like Dialogs and Popovers, so they can close
 * when a user clicks outside them.
 *
 * @see Docs https://chakra-ui.com/docs/hooks/use-outside-click
 */
export function useOutsideClick(props: UseOutsideClickProps) {
  const { ref, handler, enabled = true, listenContextMenu = false } = props
  const savedHandler = useCallbackRef(handler)

  const stateRef = useRef({
    isPointerDown: false,
    ignoreEmulatedMouseEvents: false,
  })

  const state = stateRef.current

  useEffect(() => {
    if (!enabled) return
    const onPointerDown: any = (e: PointerEvent) => {
      if (isValidEvent(e, ref, listenContextMenu)) {
        state.isPointerDown = true
      }
    }

    const onMouseUp: any = (event: MouseEvent) => {
      if (state.ignoreEmulatedMouseEvents) {
        state.ignoreEmulatedMouseEvents = false
        return
      }

      if (
        state.isPointerDown &&
        handler &&
        isValidEvent(event, ref, listenContextMenu)
      ) {
        state.isPointerDown = false
        savedHandler(event)
      }
    }

    const onTouchEnd = (event: TouchEvent) => {
      state.ignoreEmulatedMouseEvents = true
      if (handler && state.isPointerDown && isValidEvent(event, ref)) {
        state.isPointerDown = false
        savedHandler(event)
      }
    }

    const doc = getOwnerDocument(ref.current)
    doc.addEventListener("mousedown", onPointerDown, true)
    doc.addEventListener("mouseup", onMouseUp, true)
    doc.addEventListener("touchstart", onPointerDown, true)
    doc.addEventListener("touchend", onTouchEnd, true)

    return () => {
      doc.removeEventListener("mousedown", onPointerDown, true)
      doc.removeEventListener("mouseup", onMouseUp, true)
      doc.removeEventListener("touchstart", onPointerDown, true)
      doc.removeEventListener("touchend", onTouchEnd, true)
    }
  }, [handler, ref, savedHandler, state, enabled])
}

function isValidEvent(
  event: any,
  ref: React.RefObject<HTMLElement>,
  listenContextMenu?: boolean,
) {
  const target = event.target as HTMLElement
  const availableButtons = [0]

  if (listenContextMenu) {
    availableButtons.push(2)
  }

  if (!availableButtons.includes(event.button)) return false
  // if the event target is no longer in the document
  if (target) {
    const doc = getOwnerDocument(target)
    if (!doc.contains(target)) return false
  }

  return !ref.current?.contains(target)
}
