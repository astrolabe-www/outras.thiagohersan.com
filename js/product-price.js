const productApi = 'https://outras-api.herokuapp.com/products';
const productUrl = `${productApi}/__ARTICLE__`;

const productHttp = new XMLHttpRequest();

const EL = {};

productHttp.onreadystatechange = (err) => {
  if (productHttp.readyState == 4 && productHttp.status == 200) {
    const res = JSON.parse(productHttp.responseText);
    if(res.success) {
      window.lastProductData = res.data.product;

      const myPrice = window.lastProductData.price.history[nowIndex()].toFixed(2);

      EL.productPrice.innerHTML = `${myPrice} USD`;
      EL.addButton.setAttribute('data-price', myPrice);
      EL.graphLoader.style.display = 'none';

      drawGraph();
    }
  }
};

function nowIndex() {
  const mDate = new Date();
  return Math.floor((60 * mDate.getUTCHours()) + mDate.getUTCMinutes());
}

function windowResized() {
  resizeCanvas(EL.mGraph.offsetWidth, 0.333 * EL.mGraph.offsetWidth);
  drawGraph();
}

function setup() {
  EL.mGraph = document.getElementById('mgraph');
  const mCanvas = createCanvas(EL.mGraph.offsetWidth, 0.333 * EL.mGraph.offsetWidth);
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

function drawGraph() {
  const mProduct = window.lastProductData;
  const selectedMinutes = parseInt(EL.buttonContainer.getAttribute('data-selected'));
  const nPoints = selectedMinutes || 120;

  const avgVals = averageSignal(mProduct.price.history);

  const firstIndex = nowIndex() - nPoints + 1;
  const lastIndex = nowIndex() + 1;

  const mVals = [...avgVals.slice(firstIndex), ...avgVals.slice(0, lastIndex)].slice(0, nPoints);
  const mMin = Math.min(...mVals);
  const mMax = Math.max(...mVals);

  const graphColor = getComputedStyle(EL.productCartHeader).backgroundColor;
  background(255);
  stroke(graphColor);
  fill(graphColor);
  strokeWeight(1);

  beginShape();
  vertex(0, height);

  mVals.forEach((v, i) => {
    vertex(
      map(i, 0, mVals.length - 1, 0, width),
      map(v, mMin, mMax, 0.9 * height, 0.1 * height, true)
    );
  });
  vertex(width, height);
  endShape(CLOSE);

  setTimeout(getProduct, 60e3);
}

function getProduct() {
  productHttp.open('GET', productUrl.replace('__ARTICLE__', EL.myArticle));
  productHttp.send();
}

window.addEventListener('load', () => {
  EL.myArticle = document.getElementById('my-product').getAttribute('data-article');
  EL.dateButtons = Array.from(document.getElementsByClassName('product-graph-date-button'));
  EL.buttonContainer = document.querySelectorAll('[data-selected]')[0];
  EL.productCartHeader = document.getElementById('my-product-price').parentElement;
  EL.productPrice = document.getElementById('my-product-price');
  EL.addButton = document.getElementById('product-add-button');
  EL.mGraph = document.getElementById('mgraph');
  EL.graphLoader = document.getElementById('my-graph-loader');

  EL.dateButtons.forEach(button => {
    button.addEventListener('click', () => {
      EL.dateButtons.forEach(unselect => unselect.classList.remove('selected'));
      button.classList.add('selected');
      EL.buttonContainer.setAttribute('data-selected', parseInt(button.getAttribute('data-minutes')));
      drawGraph();
    });
  });

  getProduct();
});
