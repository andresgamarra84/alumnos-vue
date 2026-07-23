function toggleText() {
	var moreText = document.getElementById('more-text');
	var linkText = document.getElementById('toggle-link');
	console.log(moreText.style.display);
	if (moreText.style.display === 'none') {
		moreText.style.display = 'block';
		linkText.innerHTML = 'menos';
	} else {
		moreText.style.display = 'none';
		linkText.innerHTML = 'más';
	}
}
var carouselElement = document.querySelector('#carouselExampleIndicators');

var carousel = new bootstrap.Carousel(carouselElement, {
  interval: 5000,
  ride: 'carousel'
});