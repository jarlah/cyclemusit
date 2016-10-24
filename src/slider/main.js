import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {div, h2, makeDOMDriver} from '@cycle/dom';
import LabeledSlider from './labeledSlider'

function main(sources) {
  const weightProps$ = xs.of({
    label: 'Weight', unit: 'kg', min: 40, value: 70, max: 150
  });
  const heightProps$ = xs.of({
    label: 'Height', unit: 'cm', min: 140, value: 170, max: 210
  });

  const weightSources = {DOM: sources.DOM, props: weightProps$};
  const heightSources = {DOM: sources.DOM, props: heightProps$};

  const weightSlider = LabeledSlider(weightSources);
  const heightSlider = LabeledSlider(heightSources);

  const weightDom$ = weightSlider.DOM;
  const weightValue$ = weightSlider.value;

  const heightDom$ = heightSlider.DOM;
  const heightValue$ = heightSlider.value;

  const calculateBmi = ([weight, height]) => {
    const heightMeters = height * 0.01;
    return Math.round(weight / (heightMeters * heightMeters));
  };

  const bmi$ = xs.combine(weightValue$, heightValue$)
    .map(calculateBmi)
    .remember();

  const vdom$ = xs.combine(bmi$, weightDom$, heightDom$)
    .map(([bmi, weightDom, heightDom]) =>
      div([
        weightDom,
        heightDom,
        h2('BMI is ' + bmi)
      ])
    );

  return {
    DOM: vdom$
  };
}

run(main, {
  DOM: makeDOMDriver('#app')
});