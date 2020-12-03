const SIGNAL_NAMES = [
  "TEMPERATURE_ARMPIT",
  "TEMPERATURE_MOUTH",
  "HEART_BEAT"
];

const signals = {};

const httpStateChangeCb = (e) => {
  const mET = e.currentTarget;
  if (mET.readyState == 4 && mET.status == 200) {
    const res = JSON.parse(mET.responseText);
    if(res.success) {
      console.log(`posted ${res.data.signal.name}`);
    }
  }
}

function postSignal() {
  const nI = nowIndex();

  SIGNAL_NAMES.forEach(s => {
    const mUrl = `${SIGNALS_POST_URL}/${s}/${signals[s].values[nI].toFixed(2)}`;
    console.log(mUrl);
    signals[s].http.open('POST', mUrl);
    signals[s].http.send();
  });
  setTimeout(postSignal, 60e3);
}

function windowResized() {
  const mGraphs = document.getElementById('mgraphs');
  resizeCanvas(mGraphs.offsetWidth, 0.333 * mGraphs.offsetWidth);
  drawGraph();
}

function setup() {
  const mGraphs = document.getElementById('mgraphs');
  const mCanvas = createCanvas(mGraphs.offsetWidth, 0.333 * mGraphs.offsetWidth);
  mCanvas.parent('mgraphs');
  smooth();
  noLoop();
  background(255);
  stroke(0);
  createGraph();
  drawGraph();
  postSignal();
}

function nowIndex() {
  const mDate = new Date();
  return Math.floor((60 * mDate.getUTCHours()) + mDate.getUTCMinutes());
}

function createGraph() {
  noiseSeed(101081);
  SIGNAL_NAMES.forEach((s, j) => {

    const mHttp = new XMLHttpRequest();
    mHttp.onreadystatechange = httpStateChangeCb;
    signals[s] = {
      values: [],
      http: mHttp
    };

    const noiseFactor = s.startsWith('TEMP') ? 1/166 : 1/33;
    for(let i = 0; i < 24 * 60; i++) {
      signals[s].values.push(noise(i * noiseFactor, j));
    }
  });
}

function drawGraph() {
  background(255);
  stroke(`#aaa`);

  SIGNAL_NAMES.forEach(s => {
    const last = {x: null, y: null};
    for (let i = 0; i < signals[s].values.length; i++) {
      const mx = map(i, 0, signals[s].values.length, 0, width);
      const my = map(signals[s].values[i], 0, 1.0, height, 0);
      line(last.x || mx, last.y || my, mx, my);
      last.x = mx;
      last.y = my;
    }
  });
}
