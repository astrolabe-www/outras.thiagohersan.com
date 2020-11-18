const xmlHttp = new XMLHttpRequest();
const url = 'https://outras-api.herokuapp.com/products/__ARTICLE__/price';

xmlHttp.onreadystatechange = function(err) {
  if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
    const res = JSON.parse(xmlHttp.responseText);
    if(res.success) {
      const myPrice = res.data.price.current.toFixed(2);
      const myPriceElement = document.getElementById('my-product-price');
      const addButtonElement = document.getElementById('product-add-button');
      myPriceElement.innerHTML = `${myPrice} USD`;
      addButtonElement.setAttribute('data-price', myPrice);
    }
  }
};

window.addEventListener('load', function() {
  const myArticle = document.getElementById('my-product').getAttribute('data-article');
  xmlHttp.open("GET", url.replace('__ARTICLE__', myArticle));
  xmlHttp.send();
});
