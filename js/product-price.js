const xmlHttp = new XMLHttpRequest();
const url = 'https://outras-api.herokuapp.com/products/__ARTICLE__/price';

xmlHttp.onreadystatechange = function(err) {
  if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
    const res = JSON.parse(xmlHttp.responseText);
    if(res.success) {
      const myPrice = res.data.price.toFixed(2);
      document.getElementById('my-product-price').innerHTML = `${myPrice} USD`;
    }
  }
};

window.addEventListener('load', function() {
  const myArticle = document.getElementById('my-product').getAttribute('data-article');
  xmlHttp.open("GET", url.replace('__ARTICLE__', myArticle));
  xmlHttp.send();
});
