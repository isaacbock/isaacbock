// Intro video functionality
document.addEventListener("DOMContentLoaded", function () {
	const introVideo = document.getElementById("intro_video");
	const mainContent = document.getElementById("main_content");

	if (introVideo && mainContent) {
		// Handle video end - scroll to main content
		introVideo.addEventListener("ended", function () {
			setTimeout(function () {
				scrollIntoViewCustom(mainContent);
			}, 400);
		});
	}
});

// Smooth scroll functionality
function scrollIntoViewCustom(element, duration = 1000) {
	const targetPosition = element.offsetTop;
	const startPosition = window.pageYOffset;
	const distance = targetPosition - startPosition;
	let startTime = null;

	function animation(currentTime) {
		if (startTime === null) startTime = currentTime;
		const timeElapsed = currentTime - startTime;
		const run = ease(timeElapsed, startPosition, distance, duration);
		window.scrollTo(0, run);
		if (timeElapsed < duration) requestAnimationFrame(animation);
	}

	function ease(t, b, c, d) {
		t /= d / 2;
		if (t < 1) return (c / 2) * t * t + b;
		t--;
		return (-c / 2) * (t * (t - 2) - 1) + b;
	}

	requestAnimationFrame(animation);
}
