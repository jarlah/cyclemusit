import {div, span, input} from '@cycle/dom';
import isolate from '@cycle/isolate'

function LabeledSlider(sources) {
  const domSource = sources.DOM;
  const props$ = sources.props;

  // Intent:
  const newValue$ = domSource
    .select('.slider')
    .events('input')
    .map(ev => ev.target.value)

  // Model:
  const state$ = props$
    .map(props => newValue$
      .map(val => ({
        label: props.label,
        unit: props.unit,
        min: props.min,
        value: val,
        max: props.max
      }))
      .startWith(props)
    )
    .flatten()
    .remember();

  // View:
  const vdom$ = state$
    .map(state =>
      div('.labeled-slider', [
        span('.label',
          state.label + ' ' + state.value + state.unit
        ),
        input('.slider', {
          attrs: {type:'range', min: state.min, max: state.max, value:state.value}
        })
      ])
    );

  return {
    DOM: vdom$,
    value: state$.map(state => state.value)
  }
}

export default sources =>
  isolate(LabeledSlider)(sources)