let allSignals;
const serverSignals = 'https://outras-api.herokuapp.com/signals/';
const localSignals = '../assets/json/outras.json';

const mGraphs = document.getElementById('mgraphs');
const mSignalSelector = document.getElementById('my-signal-selector');

mSignalSelector.addEventListener('change', drawGraph);

function windowResized() {
  const mGraphs = document.getElementById('mgraphs');
  resizeCanvas(mGraphs.offsetWidth, 0.5625 * mGraphs.offsetWidth);
}

function setup() {
  const mCanvas = createCanvas(mGraphs.offsetWidth, 0.5625 * mGraphs.offsetWidth);
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
  const avgVals = new Array(64);
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
  const mSignal = allSignals.filter(s => s.name === mSignalSelector.value)[0] || {};
  const mVals = averageSignal(mSignal.values);

  const nowIndex = (60 * (new Date()).getHours()) + (new Date()).getMinutes();
  const lastVal = {};

  lastVal.x = width - 1;
  lastVal.y = height - mVals[nowIndex] * height;

  background(255);
  for(let p = 1; p < width; p++) {
    const i = ((nowIndex + mVals.length) - p) % mVals.length;
    const x = width - p - 1;
    const y = height - mVals[i] * height;

    line(lastVal.x, lastVal.y, x, y);

    lastVal.x = x;
    lastVal.y = y;
  }
  setTimeout(drawGraph, 60e3);
}
