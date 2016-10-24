import {div} from '@cycle/dom'
import xs from 'xstream'

export default function () {
  const vtree$ = xs.of(
    div(
      "Hei"
    )
  )
  const sinks = {
    DOM: vtree$,
    router: xs.empty()
  }
  return sinks
}
