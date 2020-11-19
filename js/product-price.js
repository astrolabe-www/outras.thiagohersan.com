const productApi = 'https://outras-api.herokuapp.com/products';
const productUrl = `${productApi}/__ARTICLE__`;

const productHttp = new XMLHttpRequest();

productHttp.onreadystatechange = (err) => {
  if (productHttp.readyState == 4 && productHttp.status == 200) {
    const res = JSON.parse(productHttp.responseText);
    if(res.success) {
      const nowIndex = (60 * (new Date()).getHours()) + (new Date()).getMinutes();
      const myPrice = res.data.product.price.history[nowIndex].toFixed(2);

      const myPriceElement = document.getElementById('my-product-price');
      const addButtonElement = document.getElementById('product-add-button');

      myPriceElement.innerHTML = `${myPrice} USD`;
      addButtonElement.setAttribute('data-price', myPrice);
      drawGraph(res.data.product);
    }
  }
};

function windowResized() {
  const mGraph = document.getElementById('mgraph');
  resizeCanvas(mGraph.offsetWidth, 0.444 * mGraph.offsetWidth);
}

function setup() {
  const mGraph = document.getElementById('mgraph');
  const mCanvas = createCanvas(mGraph.offsetWidth, 0.444 * mGraph.offsetWidth);
  mCanvas.parent('mgraph');
  smooth();
  noLoop();
  background(255);
  stroke(0);
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

function drawGraph(mProduct) {
  const NUM_POINTS = 120;
  const avgVals = averageSignal(mProduct.price.history);

  const nowIndex = (60 * (new Date()).getHours()) + (new Date()).getMinutes();
  const firstIndex = nowIndex - NUM_POINTS + 1;
  const lastIndex = nowIndex + 1;
  const mVals = [...avgVals.slice(firstIndex), ...avgVals.slice(0, lastIndex)].slice(0, NUM_POINTS);

  const mMin = Math.min(...mVals);
  const mMax = Math.max(...mVals);

  const lastVal = {};

  background(255);
  stroke(200);
  strokeWeight(2);
  line(0.005 * width, 0.08 * height, 0.005 * width, 0.92 * height);
  line(0.005 * width, 0.92 * height, 0.995 * width, 0.92 * height);

  stroke(0);
  strokeWeight(1);
  mVals.forEach((v, i) => {
    const x = map(i, 0, mVals.length - 1, 0, width);
    const y = map(v, mMin, mMax, 0.9 * height, 0.1 * height, true);

    lastVal.x = lastVal.x || 0;
    lastVal.y = lastVal.y || y;

    line(lastVal.x, lastVal.y, x, y);

    lastVal.x = x;
    lastVal.y = y;
  });
  setTimeout(getProduct, 60e3);
}

function getProduct() {
  const myArticle = document.getElementById('my-product').getAttribute('data-article');
  productHttp.open('GET', productUrl.replace('__ARTICLE__', myArticle));
  productHttp.send();
}

window.addEventListener('load', getProduct);
