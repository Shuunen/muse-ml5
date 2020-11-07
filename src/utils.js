export function throttle (callback, wait, options) {
  let context, arguments_, result
  let timeout
  let previous = 0
  if (!options) options = {}
  const later = function laterCallback () {
    previous = options.leading === false ? 0 : Date.now()
    timeout = undefined
    result = callback.apply(context, arguments_)
    if (!timeout) context = arguments_ = undefined
  }
  return function throttleCallback () {
    const now = Date.now()
    if (!previous && options.leading === false) previous = now
    const remaining = wait - (now - previous)
    context = this
    arguments_ = arguments
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = undefined
      }
      previous = now
      result = callback.apply(context, arguments_)
      if (!timeout) context = arguments_ = undefined
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining)
    }
    return result
  }
}
