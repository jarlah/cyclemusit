import Cycle from '@cycle/xstream-run';
import {makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http'
import {makeRouterDriver} from 'cyclic-router';
import {createHashHistory} from 'history';
import switchPath from 'switch-path';
import ViewObservation from './pages/ViewObservation'
import ViewControl from './pages/ViewControl'
import EditNode from './pages/EditNode'
import AddNode from './pages/AddNode'
import AddControl from './pages/AddControl'
import AddObservation from './pages/AddObservation'
import BrowseNode from './pages/BrowseNode'
import BrowseRoot from './pages/BrowseRoot'
import BrowseEvents from './pages/BrowseEvents'
import Home from './pages/Home'
import Layout from './layout'

function main(sources) {
  const match$ = sources.router.define({
    '/':
      Layout(Home),
    '/magasin':
      Layout(BrowseRoot),
    '/magasin/:nodeId': nodeId => sources =>
      Layout(BrowseNode)(Object.assign(sources, { Props: { nodeId } })),
    '/magasin/:nodeId/edit': nodeId => sources =>
      Layout(EditNode)(Object.assign(sources, { Props: { nodeId } })),
    '/magasin/:nodeId/add': nodeId => sources =>
      Layout(AddNode)(Object.assign(sources, { Props: { nodeId } })),
    '/magasin/:nodeId/events': nodeId => sources =>
      Layout(BrowseEvents)(Object.assign(sources, { Props: { nodeId } })),
    '/magasin/:nodeId/events/control/:controlId': (nodeId, controlId) => sources =>
      Layout(ViewControl)(Object.assign(sources, { Props: { nodeId, controlId } })),
    '/magasin/:nodeId/events/control/add': nodeId => sources =>
      Layout(AddControl)(Object.assign(sources, { Props: { nodeId } })),
    '/magasin/:nodeId/events/observation/:observationId': (nodeId, observationId) => sources =>
      Layout(ViewObservation)(Object.assign(sources, { Props: { nodeId, observationId } })),
    '/magasin/:nodeId/events/observation/add': nodeId => sources =>
      Layout(AddObservation)(Object.assign(sources, { Props: { nodeId } }))
  });

  const page$ = match$.map(({path, value}) => {
    return value(Object.assign({}, sources, {
      router: sources.router.path(path)
    }));
  });

  return {
    DOM: page$.map(c => c.DOM).flatten(),
    router: page$.map(c => c.router).flatten(),
    HTTP: page$.map(c => c.HTTP).flatten(),
  };
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app'),
  router: makeRouterDriver(createHashHistory(), switchPath),
  HTTP: makeHTTPDriver()
});