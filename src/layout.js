import {div, h1} from '@cycle/dom'

export default function Layout (Component) {
  return sources => {
    const component = Component(sources)
    const vtree$ = component.DOM.map(childDom =>
      div([
        div('Header'),
        childDom,
        div('Footer')
      ])
    )
    const sinks = {
      DOM: vtree$,
      router: component.router,
      HTTP: component.HTTP
    }
    return sinks;
  }
}