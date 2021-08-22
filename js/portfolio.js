$(document).ready(function () {
	// hide portfolio popups by default
	$(".portfolio_popup").hide();

	// portfolio items open popup description on click
	$(".hover_overlay").click(portfolioPopup);

	// portfolio items open popup description on click
	$(".fa-close").click(closePortfolioPopup);
});

function portfolioPopup(e) {
	disableScroll();
	if (e.target instanceof HTMLDivElement) {
		let popup =
			e.target.parentElement.getElementsByClassName("portfolio_popup")[0];
		popup.style.display = "block";
	} else if (e.target.parentElement instanceof HTMLHeadingElement) {
		let popup =
			e.target.parentElement.parentElement.parentElement.getElementsByClassName(
				"portfolio_popup"
			)[0];
		popup.style.display = "block";
	} else {
		let popup =
			e.target.parentElement.parentElement.getElementsByClassName(
				"portfolio_popup"
			)[0];
		popup.style.display = "block";
	}
}
function closePortfolioPopup(e) {
	enableScroll();
	let popup = e.target.parentElement.parentElement;
	popup.style.display = "none";
}

// Disable scrolling via https://www.geeksforgeeks.org/how-to-disable-scrolling-temporarily-using-javascript/
function disableScroll() {
	// Get the current page scroll position
	scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	(scrollLeft = window.pageXOffset || document.documentElement.scrollLeft),
		// if any scroll is attempted, set this to the previous value
		(window.onscroll = function () {
			window.scrollTo(scrollLeft, scrollTop);
		});
}

function enableScroll() {
	window.onscroll = function () {};
}
