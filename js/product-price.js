const productHttp = new XMLHttpRequest();

const EL = {};
const STYLE = {};

let mouseGraphics, graphGraphics;

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
  mouseGraphics.remove();
  graphGraphics.remove();
  mouseGraphics = createGraphics(width, height);
  graphGraphics = createGraphics(width, height);
  drawGraph();
}

function drawPriceInfo() {
  if(!window.priceCoordinates) return;

  if ((mouseX <= width) && (mouseX >= 0) && (mouseY <= height) && (mouseY >= 0)) {
    const mVal = window.priceCoordinates[Math.round(mouseX)];
    mouseGraphics.clear();

    mouseGraphics.stroke(0);
    mouseGraphics.drawingContext.setLineDash([1, 3]);
    mouseGraphics.line(mouseX, 0, mouseX, height);

    mouseGraphics.stroke(STYLE.graphColor);
    mouseGraphics.fill(255);
    mouseGraphics.drawingContext.setLineDash([]);
    mouseGraphics.ellipse(mouseX, mVal.y, 8, 8);

    EL.priceInfo.innerHTML = `${mVal.date}, $${mVal.price.toFixed(2)}`;
    EL.priceInfo.style.opacity = '1';
    EL.priceInfo.style.left = `calc(${mouseX / width * 100}% - ${EL.priceInfo.offsetWidth / 2}px)`;

    const calcLeft = getComputedStyle(EL.priceInfo).left;
    const mLeft = Math.max(0, Math.min(width - EL.priceInfo.offsetWidth, parseFloat(calcLeft)));
    EL.priceInfo.style.left = `${mLeft}px`;

    if(mVal.y < (height / 2.2)) {
      EL.priceInfo.style.top = 'initial';
      EL.priceInfo.style.bottom = '32px';
    } else if(mVal.y > (height / 1.8)) {
      EL.priceInfo.style.top = '32px';
      EL.priceInfo.style.bottom = 'initial';
    }
  }
}

function mouseMoved() {
  drawPriceInfo();
}

function touchStarted() {
  drawPriceInfo();
}

function touchMoved() {
  drawPriceInfo();
}

function draw() {
  background(255);
  image(graphGraphics, 0, 0);
  image(mouseGraphics, 0, 0);
}

function setup() {
  EL.mGraph = document.getElementById('mgraph');
  const mCanvas = createCanvas(EL.mGraph.offsetWidth, 0.333 * EL.mGraph.offsetWidth);
  mCanvas.parent('mgraph');
  mouseGraphics = createGraphics(width, height);
  graphGraphics = createGraphics(width, height);
  smooth();
  frameRate(24);
  background(255);
  stroke(0);
}

function drawGraph() {
  const mProduct = window.lastProductData;
  const selectedMinutes = parseInt(EL.buttonContainer.getAttribute('data-selected'));
  const nPoints = selectedMinutes || 120;

  const priceVals = mProduct.price.history;

  const firstIndex = nowIndex() - nPoints + 1;
  const lastIndex = nowIndex() + 1;

  const mVals = [...priceVals.slice(firstIndex), ...priceVals.slice(0, lastIndex)].slice(0, nPoints);
  const mMin = Math.min(...mVals);
  const mMax = Math.max(...mVals);

  mouseGraphics.clear();
  EL.priceInfo.style.opacity = '0';

  graphGraphics.background(255);

  graphGraphics.strokeWeight(1);
  graphGraphics.stroke(STYLE.axisColor);

  graphGraphics.line(0, 0.5 * height, width, 0.5 * height);
  graphGraphics.line(0, 0.1 * height, width, 0.1 * height);

  graphGraphics.stroke(STYLE.graphColor);
  graphGraphics.fill(STYLE.graphColor);

  graphGraphics.beginShape();
  graphGraphics.vertex(0, height);

  window.priceCoordinates = new Array(width);
  const last = { x: -1, y: 0 };

  mVals.forEach((v, i) => {
    const mX = Math.round(map(i, 0, mVals.length - 1, 0, width));
    const mY = map(v, mMin, mMax, 0.9 * height, 0.1 * height, true);

    const firstDateUnix = (new Date()).getTime() - ((selectedMinutes + 1) * 60 * 1000);
    const lastDateUnix = (new Date()).getTime() - (0 * 60 * 1000);
    const mDate = new Date(lerp(firstDateUnix, lastDateUnix, mX / width));

    const mPriceInfo = {
      x: mX,
      y: mY,
      date: `${mDate.getHours()}:${String(mDate.getMinutes()).padStart(2, '0')}`,
      price: v
    };

    for(let i = last.x + 1; i <= mX; i++) {
      const nY = lerp(last.y, mY, (i - last.x + 1)/(mX - last.x + 1));
      window.priceCoordinates[i] = { ...mPriceInfo, y: nY };
    }
    last.x = mX;
    last.y = mY;

    graphGraphics.vertex(mX, mY);
  });
  graphGraphics.vertex(width, height);
  graphGraphics.endShape(CLOSE);

  graphGraphics.strokeWeight(1);
  graphGraphics.stroke(0);
  graphGraphics.line(0, 0.99 * height, width, 0.99 * height);

  graphGraphics.line(1, 0.99 * height, 1, 0.95 * height);
  graphGraphics.line(0.5 * width, 0.99 * height, 0.5 * width, 0.95 * height);
  graphGraphics.line(width - 1, 0.99 * height, width - 1, 0.95 * height);

  Array.from(EL.timeAxis).forEach((e, i) => {
    const minutesAgo = selectedMinutes - 0.5 * i * selectedMinutes;
    const mDate = new Date((new Date()).getTime() - (minutesAgo * 60 * 1000));
    e.innerHTML = `${mDate.getHours()}:${String(mDate.getMinutes()).padStart(2, '0')}`;
  });

  const mTop = [0.1, 0.5, 0.99];
  const lastPrice = Array.from(EL.priceAxis).pop();

  Array.from(EL.priceAxis).forEach((e, i) => {
    e.innerHTML = `$${lerp(mMin, mMax, 1 - 0.5 * i).toFixed(0)}`;
    e.style.top = `${mTop[i] * height - e.offsetHeight / 2}px`;
    e.style.marginLeft = `-${e.offsetWidth + 2}px`;
  });
  lastPrice.style.top = `${height - lastPrice.offsetHeight}px`;

  setTimeout(getProduct, 60e3);
}

function getProduct() {
  productHttp.open('GET', `${PRODS_URL}/${EL.myArticle}`);
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
  EL.priceInfo = document.getElementById('my-product-price-info');
  EL.dateButtonSelected = document.querySelectorAll('.product-graph-date-button.selected')[0];
  EL.timeAxis = document.getElementsByClassName('product-graph-time-axis-value');
  EL.priceAxis = document.getElementsByClassName('product-graph-price-axis-value');

  STYLE.graphColor = getComputedStyle(EL.productCartHeader).backgroundColor;
  STYLE.axisColor = getComputedStyle(EL.dateButtonSelected).backgroundColor;

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
