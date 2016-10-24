import {div} from '@cycle/dom'
import xs from 'xstream'

export default function App (sources) {
  const vtree$ = xs.of(
    div('Add observation under: ' + sources.Props.nodeId)
  )
  const sinks = {
    DOM: vtree$,
    router: xs.empty(),
    HTTP: xs.empty()
  }
  return sinks
}
