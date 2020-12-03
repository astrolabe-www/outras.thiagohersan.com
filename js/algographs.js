const productHttp = new XMLHttpRequest();

productHttp.onreadystatechange = (e) => {
  const mET = e.currentTarget;
  if (mET.readyState == 4 && mET.status == 200) {
    const res = JSON.parse(mET.responseText);
    if(res.success) {
      drawGraph(res.data.products);
    }
  }
};

function getProducts() {
  productHttp.open('GET', PRODS_URL);
  productHttp.send();
  setTimeout(getProducts, 60e3);
}

function nowIndex() {
  const mDate = new Date();
  return Math.floor((60 * mDate.getUTCHours()) + mDate.getUTCMinutes());
}

function windowResized() {
  const mGraphs = document.getElementById('mgraphs');
  resizeCanvas(mGraphs.offsetWidth, 0.333 * mGraphs.offsetWidth);
  getProducts();
}

function setup() {
  const mGraphs = document.getElementById('mgraphs');
  const mCanvas = createCanvas(mGraphs.offsetWidth, 0.333 * mGraphs.offsetWidth);
  mCanvas.parent('mgraphs');
  smooth();
  noLoop();
  background(255);
  stroke(0);
  getProducts();
}

function drawGraph(response) {
  const nI = nowIndex();

  const prods = response.filter(a => a.article > 400e3 && a.article < 476063).sort((a, b) => {
    const aNorm = (a.price.history[nI] - a.price.low) / (a.price.high - a.price.low);
    const bNorm = (b.price.history[nI] - b.price.low) / (b.price.high - b.price.low);
    if (aNorm > bNorm) return 1;
    else if (aNorm < bNorm) return -1;
    else return 0
  }).slice(0, 8);

  const allMins = prods.map(p => Math.min(...p.price.history));
  const allMaxs = prods.map(p => Math.max(...p.price.history));
  const mMin = Math.min(...allMins);
  const mMax = Math.max(...allMaxs);

  background(255);
  stroke(`#aaa`);

  prods.forEach(p => {
    drawProduct(p, mMin, mMax);
  });

  document.getElementById('my-top-3').innerHTML = '';
  prods.slice(0, 3).forEach(p => {
    document.getElementById('my-top-3').innerHTML += ` ${p.name} `;
  });
}

function drawProduct(prod, mMin, mMax) {
  const NUM_POINTS = 1440;

  const pVals = prod.price.history;

  const firstIndex = nowIndex() - NUM_POINTS + 1;
  const lastIndex = nowIndex() + 1;
  const mVals = [...pVals.slice(firstIndex), ...pVals.slice(0, lastIndex)].slice(0, NUM_POINTS);

  const lastVal = {};

  mVals.forEach((v, i) => {
    const x = map(i, 0, mVals.length - 1, 0, width);
    const y = map(v, mMin, mMax, 0.9 * height, 0.1 * height);
    line((lastVal.x || 0), (lastVal.y || y), x, y);
    lastVal.x = x;
    lastVal.y = y;
  });
}
