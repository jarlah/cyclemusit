import {input} from '@cycle/dom';
import isolate from '@cycle/isolate'

function Input(sources) {
  const domSource = sources.DOM;
  const props$ = sources.props;

  // Intent:
  const newValue$ = domSource
    .select('input')
    .events('input')
    .map(ev => ev.target.value)

  // Model:
  const state$ = props$
    .map(props => newValue$
      .map(val => ({
        type: props.type,
        placeHolder: props.placeHolder,
        size: props.size,
        value: val
      }))
      .startWith(props)
    )
    .flatten()
    .remember();

  // View:
  const vdom$ = state$
    .map(state =>
      input({
        attrs: {
          type: state.type,
          size: state.size,
          placeHolder: state.placeHolder,
          value: state.value
        }
      })
    )

  return {
    DOM: vdom$,
    value: state$.map(state => state.value)
  }
}

export default sources =>
  isolate(Input)(sources)