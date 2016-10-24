import {div, h2, button, br, input} from '@cycle/dom'
import xs from 'xstream'
import Input from '../components/input'
var Immutable = require('immutable');

function createInput(id, domSource) {
  const sources = Object.assign({},
    {props: xs.of(
      {
        id: id,
        type: 'text',
        size: 20,
        value: '',
        placeHolder: 'enter ' + id
      }
    )},
    {DOM: domSource}
  );
  return Input(sources);
}

function reducer(id, value$) {
  return value$.map(val => function (state) {
    return state.set(id, val)
  })
}

function AddNode (sources) {

  const getRandomUser$ = sources.DOM
    .select('.get-random')
    .events('click')
    .map(() => {
      const randomNum = Math.round(Math.random() * 9) + 1;
      return {
        url: 'http://jsonplaceholder.typicode.com/users/' + String(randomNum),
        category: 'users',
        method: 'GET'
      };
    });

  const users$ = sources.HTTP.select('users')
    .flatten()
    .map(res => {
      return {
        ok: res.ok,
        data: res.body
      }
    })
    .startWith({
      data: {}
    });

  const nameInput = createInput('name', sources.DOM);
  const nameReducer = reducer('name', nameInput.value);

  const typeInput = createInput('type', sources.DOM);
  const typeReducer = reducer('type', typeInput.value);

  const usersReducer = reducer('users', users$)

  const reducer$ = xs.merge(nameReducer, typeReducer, usersReducer)

  const state$ = reducer$.fold((acc, reducer) => reducer(acc), Immutable.Map())

  const vtree$ = xs.combine(nameInput.DOM, typeInput.DOM, state$)
    .map(([nameInput, typeInput, state]) => {
      return div([
        h2('Add new node under ' + sources.Props.nodeId),
        div([nameInput]),
        div([typeInput]),
        br(),
        input('.get-random', {attrs: {type: 'button', value: 'Save'}}),
        br(),
        br(),
        div([state.get('users') ? state.get('users').data.username : ''])
      ])
    })

  return {
    DOM: vtree$,
    router: xs.empty(),
    HTTP: getRandomUser$
  }
}

export default AddNode
