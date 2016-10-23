import {div, h1} from '@cycle/dom'
import xs from 'xstream'

export default function App (sources) {
  const vtree$ = xs.of(
    div(
      'Welcome'
    )
  )
  const sinks = {
    DOM: vtree$,
    router: xs.empty()
  }
  return sinks
}
