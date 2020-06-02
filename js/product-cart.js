let product = {};
let addButton;
let removeButton;
let viewButton;

function addToCart() {
  product.price = parseFloat(addButton.getAttribute('data-price')) || 1000.00;
  cartLS.add(product);
  productInCart();
}

function removeFromCart() {
  cartLS.remove(product.id);
  productOutOfCart();
}

function productInCart() {
  addButton.classList.add('product-cart-button-disable');
  removeButton.classList.remove('product-cart-button-hide');
  viewButton.classList.remove('product-cart-link-disable');
}

function productOutOfCart() {
  addButton.classList.remove('product-cart-button-disable');
  removeButton.classList.add('product-cart-button-hide');
  viewButton.classList.add('product-cart-link-disable');
}

window.addEventListener('load', function() {
  addButton = document.getElementById('product-add-button');
  removeButton = document.getElementById('product-remove-button');
  viewButton = document.getElementById('product-view-cart');

  product.id = addButton.getAttribute('data-id');
  product.title = addButton.getAttribute('data-title');
  product.cover = addButton.getAttribute('data-cover');
  product.url = addButton.getAttribute('data-url');

  if (cartLS.exists(product.id)) productInCart();
  else addButton.onclick = addToCart;

  removeButton.onclick = removeFromCart;
});
