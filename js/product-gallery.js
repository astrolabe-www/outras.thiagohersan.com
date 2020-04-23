function startSwipbox() {
  const bigImgUrl = document.getElementById('product-image').style['background-image'];
  for(const el of document.getElementsByClassName('swipebox')) {
    if(bigImgUrl.includes(el.getAttribute('href'))) el.click();
  }
}

function updateBigImage() {
  document.getElementById('product-image').style['background-image'] = this.style['background-image']
}

window.addEventListener('load', function() {
  document.getElementById('product-image').onclick = startSwipbox;

  for(const el of document.getElementsByClassName('gallery-thumbnail')) {
    el.onclick = updateBigImage;  
  }
});
