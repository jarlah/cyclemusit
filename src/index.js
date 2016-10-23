import Cycle from '@cycle/xstream-run';
import {makeDOMDriver} from '@cycle/dom';
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

function main(sources) {
  const match$ = sources.router.define({
    '/':
      Home,
    '/magasin':
      BrowseRoot,
    '/magasin/:nodeId': nodeId => sources =>
      BrowseNode(Object.assign(sources, { Props: { nodeId } })),
    '/magasin/:nodeId/edit': nodeId => sources =>
      EditNode(Object.assign(sources, { Props: { nodeId } })),
    '/magasin/:nodeId/add': nodeId => sources =>
      AddNode(Object.assign(sources, { Props: { nodeId } })),
    '/magasin/:nodeId/events': nodeId => sources =>
      BrowseEvents(Object.assign(sources, { Props: { nodeId } })),
    '/magasin/:nodeId/events/control/:controlId': (nodeId, controlId) => sources =>
      ViewControl(Object.assign(sources, { Props: { nodeId, controlId } })),
    '/magasin/:nodeId/events/control/add': nodeId => sources =>
      AddControl(Object.assign(sources, { Props: { nodeId } })),
    '/magasin/:nodeId/events/observation/:observationId': (nodeId, observationId) => sources =>
      ViewObservation(Object.assign(sources, { Props: { nodeId, observationId } })),
    '/magasin/:nodeId/events/observation/add': nodeId => sources =>
      AddObservation(Object.assign(sources, { Props: { nodeId } }))
  });

  const page$ = match$.map(({path, value}) => {
    return value(Object.assign({}, sources, {
      router: sources.router.path(path)
    }));
  });

  return {
    DOM: page$.map(c => c.DOM).flatten(),
    router: page$.map(c => c.router).flatten(),
  };
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app'),
  router: makeRouterDriver(createHashHistory(), switchPath)
});