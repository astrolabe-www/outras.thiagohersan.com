let allSignals;
const serverSignals = 'https://outras-api.herokuapp.com/signals/';
const localSignals = '../assets/json/outras.json';

const mGraphs = document.getElementById('mgraphs');
const mSignalSelector = document.getElementById('my-signal-selector');

mSignalSelector.addEventListener('change', drawGraph);

function windowResized() {
  const mGraphs = document.getElementById('mgraphs');
  resizeCanvas(mGraphs.offsetWidth, 0.333 * mGraphs.offsetWidth);
}

function setup() {
  const mCanvas = createCanvas(mGraphs.offsetWidth, 0.333 * mGraphs.offsetWidth);
  mCanvas.parent('mgraphs');
  smooth();
  noLoop();
  background(255);
  stroke(0);
  const signalsURL = (window.location.href.includes('//outras.ml')) ? serverSignals : localSignals;
  loadJSON(signalsURL, initGraph);
}

function initGraph(response) {
  allSignals = response.data.signals;
  allSignals.sort((a, b) => b.name.localeCompare(a.name));

  allSignals.forEach(s => {
    const mS = document.createElement('option');
    mS.setAttribute('value', s.name);
    mS.innerHTML = s.name.replace('_', ' ');
    mSignalSelector.appendChild(mS);
  });
  drawGraph();
}

function averageSignal(signal) {
  const averages = new Array(signal.length);
  const avgVals = new Array(32);
  let avgSum = 0;
  let currAvgIndex = 0;

  for(let i = 0; i < avgVals.length; i++) {
    avgVals[i] = signal[signal.length - avgVals.length + i];
    avgSum += avgVals[i];
  }
  
  for(let i = 0; i < averages.length; i++) {
    avgSum -= avgVals[currAvgIndex];
    avgVals[currAvgIndex] = signal[i];
    avgSum += avgVals[currAvgIndex];
    currAvgIndex = (currAvgIndex + 1) % avgVals.length;
    averages[i] = avgSum / avgVals.length;
  }
  return averages;
}

function drawGraph() {
  const NUM_POINTS = 120;
  const mSignal = allSignals.filter(s => s.name === mSignalSelector.value)[0] || {};
  const avgVals = averageSignal(mSignal.values);

  const nowIndex = (60 * (new Date()).getHours()) + (new Date()).getMinutes();
  const firstIndex = nowIndex - NUM_POINTS + 1;
  const lastIndex = nowIndex + 1;
  const mVals = [...avgVals.slice(firstIndex), ...avgVals.slice(0, lastIndex)].slice(0, NUM_POINTS);

  const mMin = Math.min(...mVals);
  const mMax = Math.max(...mVals);

  const lastVal = {};

  background(255);
  mVals.forEach((v, i) => {
    const x = map(i, 0, mVals.length - 1, 0, width);
    const y = map(v, mMin, mMax, 0.9 * height, 0.1 * height, true);

    lastVal.x = lastVal.x || 0;
    lastVal.y = lastVal.y || y;

    line(lastVal.x, lastVal.y, x, y);

    lastVal.x = x;
    lastVal.y = y;
  });
  setTimeout(drawGraph, 60e3);
}
