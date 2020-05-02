function generateCart() {
  const cartList = document.getElementById('cart-list');
  cartList.innerHTML = '';

  const header = document.createElement('div');
  header.classList.add('cart-item');

  ['cover', 'title', 'price'].forEach(function(d) {
    const nDiv = document.createElement('div');

    if (d === 'cover') {
      nDiv.classList.add('cart-item-' + d + '-spacer');
    } else {
      nDiv.classList.add('cart-item-' + d);
      nDiv.innerHTML = d.replace('title', 'item');
    }
    header.appendChild(nDiv);
  });
  cartList.appendChild(header);

  cartLS.list().forEach(function(p) {
    const product = document.createElement('div');
    product.classList.add('cart-item');

    ['cover', 'title', 'price'].forEach(function(d) {
      let nDiv;
      if (d === 'cover') {
        nDiv = document.createElement('a');
        nDiv.href = p['url'];
        nDiv.style["background-image"] = "url('" + p[d] + "')";
      } else if (d === 'title') {
        nDiv = document.createElement('div');
        const tDiv = document.createElement('a');
        const rDiv = document.createElement('div');
        tDiv.innerHTML = p[d];
        tDiv.href = p['url'];
        rDiv.innerHTML = 'remove';
        rDiv.onclick = function() {
          cartLS.remove(p['id']);
          generateCart();
        };
        rDiv.classList.add('cart-item-remove');
        nDiv.appendChild(tDiv);
        nDiv.appendChild(rDiv);
      } else if (d === 'price') {
        nDiv = document.createElement('div');

        for (let i = 0; i < 3; i++) {
          let v = (i + 3);
          priceDiv = document.createElement('div');
          priceDiv.innerHTML = `$${v % 10}${v % 10}${(v + 1) % 10}${(v + 2) % 10}.${(v + 3) % 10}${(v + 4) % 10}`;
          priceDiv.classList.add('price');
          priceDiv.classList.add('price-' + ((i == 0) ? 'relative' : 'absolute'));
          nDiv.appendChild(priceDiv);
        }
      }

      nDiv.classList.add('cart-item-' + d);

      product.appendChild(nDiv);
    });
    cartList.appendChild(product);
  });

  const total = document.createElement('div');
  total.classList.add('cart-item');

  ['cover', 'title', 'price'].forEach(function(d) {
    const nDiv = document.createElement('div');
    nDiv.classList.add('cart-item-' + d);
    if (d === 'price') {
      for (let i = 0; i < 3; i++) {
        let v = (i + 7);
        priceDiv = document.createElement('div');
        priceDiv.innerHTML = `$${v % 10}${v % 10}${(v + 1) % 10}${(v + 2) % 10}.${(v + 3) % 10}${(v + 4) % 10}`;
        priceDiv.classList.add('price');
        priceDiv.classList.add('price-' + ((i == 0) ? 'relative' : 'absolute'));
        nDiv.appendChild(priceDiv);
      }
    } else if (d === 'title') {
      nDiv.innerHTML = 'TOTAL';
    }
    total.appendChild(nDiv);
  });

  if (cartLS.list().length > 0) cartList.appendChild(total);
}

window.addEventListener('load', function() {
  generateCart();
});
