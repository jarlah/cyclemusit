import {div, h1} from '@cycle/dom'

export default function Layout (Component) {
  return sources => {
    const component = Component(sources)
    const vtree$ = component.DOM.map(childDom =>
      div([
        h1('Header'),
        childDom,
        div('Footer')
      ])
    )
    const sinks = {
      DOM: vtree$,
      router: component.router
    }
    return sinks;
  }
}