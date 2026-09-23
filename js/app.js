// Intro video + flip board orchestration
document.addEventListener("DOMContentLoaded", function () {
	setupIntro();
	new FlipBoard();
});

function prefersReducedMotion() {
	return (
		window.matchMedia &&
		window.matchMedia("(prefers-reduced-motion: reduce)").matches
	);
}

function setupIntro() {
	const introVideo = document.getElementById("intro_video");
	const mainContent = document.getElementById("main_content");
	if (!introVideo || !mainContent) return;

	// Don't yank the page down if the visitor already scrolled on their own.
	// The flag is sticky and threshold-based: mobile browsers pause an
	// offscreen autoplay video and resume it when scrolled back into view, so
	// 'ended' can fire long after the user has scrolled down and returned to
	// the top — an instantaneous position check would wrongly re-scroll them.
	// The >50px threshold also ignores iOS rubber-band overscroll jitter.
	let userScrolledAway = false;
	const onScroll = function () {
		if (window.scrollY > 50) {
			userScrolledAway = true;
			window.removeEventListener("scroll", onScroll);
		}
	};
	window.addEventListener("scroll", onScroll, { passive: true });

	// If the intro can't load or autoplay is blocked (e.g. iOS Low Power Mode),
	// skip straight to the main content instead of showing a frozen frame —
	// unless the visitor is already past the intro
	const skipIntro = function () {
		if (window.scrollY > 50) return;
		introVideo.style.display = "none";
		window.scrollTo(0, 0);
	};
	introVideo.addEventListener("error", skipIntro);
	const videoSource = introVideo.querySelector("source");
	if (videoSource) videoSource.addEventListener("error", skipIntro);

	// Flaky networks can stall the video without ever firing 'error': if it
	// hasn't started playing after 8s while the page is visible, skip it
	const loadWatchdog = setTimeout(function () {
		if (!document.hidden && introVideo.paused) skipIntro();
	}, 8000);
	introVideo.addEventListener(
		"playing",
		function () {
			clearTimeout(loadWatchdog);
		},
		{ once: true }
	);

	const autoScroll = function () {
		if (userScrolledAway || window.scrollY > 50) return;
		// Never scroll a hidden tab (the user would return to a page that
		// silently jumped past the intro); wait until they come back instead
		if (document.hidden) {
			document.addEventListener("visibilitychange", function onVisible() {
				if (document.hidden) return;
				document.removeEventListener("visibilitychange", onVisible);
				setTimeout(autoScroll, 400);
			});
			return;
		}
		scrollIntoViewCustom(mainContent);
	};
	introVideo.addEventListener("ended", function () {
		setTimeout(autoScroll, 400);
	});

	// Autoplay can be rejected in background tabs (retry once the tab is
	// visible) or blocked outright (e.g. iOS Low Power Mode — skip the intro)
	const tryPlay = function () {
		const playAttempt = introVideo.play();
		if (!playAttempt || !playAttempt.catch) return;
		playAttempt.catch(function () {
			if (!introVideo.paused) return;
			if (document.hidden) {
				document.addEventListener("visibilitychange", function onVisible() {
					if (document.hidden) return;
					document.removeEventListener("visibilitychange", onVisible);
					tryPlay();
				});
			} else {
				skipIntro();
			}
		});
	};
	tryPlay();

	// Browsers suspend media in hidden tabs, so switching apps or tabs during
	// the intro can leave it frozen mid-play on return; resume it (tryPlay
	// skips the intro if the browser refuses)
	document.addEventListener("visibilitychange", function () {
		if (document.hidden || !introVideo.paused || introVideo.ended) return;
		if (userScrolledAway || introVideo.style.display === "none") return;
		tryPlay();
	});
}

// Smooth scroll functionality
function scrollIntoViewCustom(element, duration = 1000) {
	const targetPosition = element.offsetTop;

	if (prefersReducedMotion()) {
		window.scrollTo(0, targetPosition);
		return;
	}

	// Prefer native smooth scrolling: it runs in the browser compositor and
	// yields gracefully to user gestures, where a JS scroll loop fights the
	// user's finger on touch devices
	if ("scrollBehavior" in document.documentElement.style) {
		window.scrollTo({ top: targetPosition, behavior: "smooth" });
		return;
	}

	// Fallback easing loop for older browsers — cancelled by any user input
	const startPosition = window.pageYOffset;
	const distance = targetPosition - startPosition;
	let startTime = null;
	let cancelled = false;

	const cancel = function () {
		cancelled = true;
	};
	window.addEventListener("wheel", cancel, { passive: true, once: true });
	window.addEventListener("touchstart", cancel, { passive: true, once: true });

	function animation(currentTime) {
		if (cancelled) return;
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

// Flip Board Component
//
// The board renders once as an all-blank grid, then waits for BOTH the travel
// data and the board scrolling into view before flipping every card to its
// target. All flips are driven by a single requestAnimationFrame loop so the
// page never runs hundreds of overlapping timers.
class FlipBoard {
	constructor() {
		this.apiUrl =
			"https://nomads.com/@isaacb.json?key=8971e0d4cc4a752af04587430a660fa9";
		this.displayElement = document.getElementById("flipDisplay");
		this.boardElement = document.getElementById("flipBoard");
		this.characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		this.digits = "0123456789";
		this.flags = [
			"🇦🇩",
			"🇦🇪",
			"🇦🇫",
			"🇦🇬",
			"🇦🇮",
			"🇦🇱",
			"🇦🇲",
			"🇦🇴",
			"🇦🇶",
			"🇦🇷",
			"🇦🇸",
			"🇦🇹",
			"🇦🇺",
			"🇦🇼",
			"🇦🇽",
			"🇦🇿",
			"🇧🇦",
			"🇧🇧",
			"🇧🇩",
			"🇧🇪",
			"🇧🇫",
			"🇧🇬",
			"🇧🇭",
			"🇧🇮",
			"🇧🇯",
			"🇧🇱",
			"🇧🇲",
			"🇧🇳",
			"🇧🇴",
			"🇧🇶",
			"🇧🇷",
			"🇧🇸",
			"🇧🇹",
			"🇧🇻",
			"🇧🇼",
			"🇧🇾",
			"🇧🇿",
			"🇨🇦",
			"🇨🇨",
			"🇨🇩",
			"🇨🇫",
			"🇨🇬",
			"🇨🇭",
			"🇨🇮",
			"🇨🇰",
			"🇨🇱",
			"🇨🇲",
			"🇨🇳",
			"🇨🇴",
			"🇨🇷",
			"🇨🇺",
			"🇨🇻",
			"🇨🇼",
			"🇨🇽",
			"🇨🇾",
			"🇨🇿",
			"🇩🇪",
			"🇩🇬",
			"🇩🇯",
			"🇩🇰",
			"🇩🇲",
			"🇩🇴",
			"🇩🇿",
			"🇪🇨",
			"🇪🇪",
			"🇪🇬",
			"🇪🇭",
			"🇪🇷",
			"🇪🇸",
			"🇪🇹",
			"🇪🇺",
			"🇫🇮",
			"🇫🇯",
			"🇫🇰",
			"🇫🇲",
			"🇫🇴",
			"🇫🇷",
			"🇬🇦",
			"🇬🇧",
			"🇬🇩",
			"🇬🇪",
			"🇬🇫",
			"🇬🇬",
			"🇬🇭",
			"🇬🇮",
			"🇬🇱",
			"🇬🇲",
			"🇬🇳",
			"🇬🇵",
			"🇬🇶",
			"🇬🇷",
			"🇬🇸",
			"🇬🇹",
			"🇬🇺",
			"🇬🇼",
			"🇬🇾",
			"🇭🇰",
			"🇭🇲",
			"🇭🇳",
			"🇭🇷",
			"🇭🇹",
			"🇭🇺",
			"🇮🇨",
			"🇮🇩",
			"🇮🇪",
			"🇮🇱",
			"🇮🇲",
			"🇮🇳",
			"🇮🇴",
			"🇮🇶",
			"🇮🇷",
			"🇮🇸",
			"🇮🇹",
			"🇯🇪",
			"🇯🇲",
			"🇯🇴",
			"🇯🇵",
			"🇰🇪",
			"🇰🇬",
			"🇰🇭",
			"🇰🇮",
			"🇰🇲",
			"🇰🇳",
			"🇰🇵",
			"🇰🇷",
			"🇰🇼",
			"🇰🇾",
			"🇰🇿",
			"🇱🇦",
			"🇱🇧",
			"🇱🇨",
			"🇱🇮",
			"🇱🇰",
			"🇱🇷",
			"🇱🇸",
			"🇱🇹",
			"🇱🇺",
			"🇱🇻",
			"🇱🇾",
			"🇲🇦",
			"🇲🇨",
			"🇲🇩",
			"🇲🇪",
			"🇲🇫",
			"🇲🇬",
			"🇲🇭",
			"🇲🇰",
			"🇲🇱",
			"🇲🇲",
			"🇲🇳",
			"🇲🇴",
			"🇲🇵",
			"🇲🇶",
			"🇲🇷",
			"🇲🇸",
			"🇲🇹",
			"🇲🇺",
			"🇲🇻",
			"🇲🇼",
			"🇲🇽",
			"🇲🇾",
			"🇲🇿",
			"🇳🇦",
			"🇳🇨",
			"🇳🇪",
			"🇳🇫",
			"🇳🇬",
			"🇳🇮",
			"🇳🇱",
			"🇳🇴",
			"🇳🇵",
			"🇳🇷",
			"🇳🇺",
			"🇳🇿",
			"🇴🇲",
			"🇵🇦",
			"🇵🇪",
			"🇵🇫",
			"🇵🇬",
			"🇵🇭",
			"🇵🇰",
			"🇵🇱",
			"🇵🇲",
			"🇵🇳",
			"🇵🇷",
			"🇵🇸",
			"🇵🇹",
			"🇵🇼",
			"🇵🇾",
			"🇶🇦",
			"🇷🇪",
			"🇷🇴",
			"🇷🇸",
			"🇷🇺",
			"🇷🇼",
			"🇸🇦",
			"🇸🇧",
			"🇸🇨",
			"🇸🇩",
			"🇸🇪",
			"🇸🇬",
			"🇸🇭",
			"🇸🇮",
			"🇸🇯",
			"🇸🇰",
			"🇸🇱",
			"🇸🇲",
			"🇸🇳",
			"🇸🇴",
			"🇸🇷",
			"🇸🇸",
			"🇸🇹",
			"🇸🇻",
			"🇸🇽",
			"🇸🇾",
			"🇸🇿",
			"🇹🇦",
			"🇹🇨",
			"🇹🇩",
			"🇹🇫",
			"🇹🇬",
			"🇹🇭",
			"🇹🇯",
			"🇹🇰",
			"🇹🇱",
			"🇹🇲",
			"🇹🇳",
			"🇹🇴",
			"🇹🇷",
			"🇹🇹",
			"🇹🇻",
			"🇹🇼",
			"🇹🇿",
			"🇺🇦",
			"🇺🇬",
			"🇺🇲",
			"🇺🇳",
			"🇺🇸",
			"🇺🇾",
			"🇺🇿",
			"🇻🇦",
			"🇻🇨",
			"🇻🇪",
			"🇻🇬",
			"🇻🇮",
			"🇻🇳",
			"🇻🇺",
			"🇼🇫",
			"🇼🇸",
			"🇽🇰",
			"🇾🇪",
			"🇾🇹",
			"🇿🇦",
			"🇿🇲",
			"🇿🇼",
		];

		// All wide card texts that appear on the board
		this.allWideCardTexts = [
			"📍 NOW:",
			"COUNTRIES",
			"PREVIOUS:",
			"DAYS AGO",
			"NEXT:",
			"DAYS AWAY",
		];

		// Create a single randomized sequence that all wide cards will use
		this.shuffledWideCardTexts = [...this.allWideCardTexts].sort(
			() => Math.random() - 0.5
		);

		// Flip cadence/duration in ms. Durations must stay in sync with the
		// animation rules in css/flipboard.css, and each cadence must exceed its
		// duration so one flip fully finishes before the next starts.
		this.standardFlip = { cadence: 200, duration: 180 };
		this.wideFlip = { cadence: 800, duration: 600 };

		this.cards = [];

		// Render the all-blank board immediately so there is never a flash of
		// final content, then animate once the data is ready AND the board is
		// actually on screen (after the intro auto-scroll, or right away if the
		// page loads already scrolled down).
		this.renderBoard();

		// Race the fetch against a timeout so a hung request degrades to the
		// blank-data board instead of leaving the page permanently blank
		const dataPromise = Promise.race([
			this.fetchData(),
			new Promise((_, reject) =>
				setTimeout(() => reject(new Error("Travel data request timed out")), 10000)
			),
		]).catch((error) => {
			console.error("Error fetching data:", error);
			return null;
		});
		Promise.all([dataPromise, this.whenBoardVisible()]).then(([data]) => {
			this.start(data);
		});
	}

	async fetchData() {
		const response = await fetch(this.apiUrl);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	}

	whenBoardVisible() {
		return new Promise((resolve) => {
			if (!("IntersectionObserver" in window)) {
				resolve();
				return;
			}
			const observer = new IntersectionObserver(
				(entries) => {
					if (entries.some((entry) => entry.isIntersecting)) {
						observer.disconnect();
						resolve();
					}
				},
				{ threshold: 0.3 }
			);
			observer.observe(this.boardElement);
		});
	}

	// Describes every card on the board (6 rows of 15 slots) for the given
	// data. Row shapes are fixed, so the layout for null data and real data
	// always line up card-for-card.
	buildLayout(data) {
		const locations = (data && data.location) || {};
		const stats = (data && data.stats) || {};

		const totalCountries = stats.countries || 0;
		const current = locations.now || null;
		const previous = locations.previous || null;
		const next = locations.next || null;

		const today = new Date();
		const previousDays =
			previous && previous.date_end
				? this.calculateDaysFromDate(previous.date_end, today)
				: 0;
		const nextDays =
			next && next.date_start
				? this.calculateDaysFromDate(today, next.date_start)
				: 0;

		return [
			[
				[
					this.wideCell("PREVIOUS:"),
					...this.blankCells(4),
					...this.numberCells(previousDays),
					this.wideCell("DAYS AGO"),
				],
				this.locationCells(previous, "previous"),
			],
			[
				[
					this.wideCell("📍 NOW:"),
					...this.blankCells(4),
					...this.numberCells(totalCountries),
					this.wideCell("COUNTRIES"),
				],
				this.locationCells(current, "now"),
			],
			[
				[
					this.wideCell("NEXT:"),
					...this.blankCells(4),
					...this.numberCells(nextDays),
					this.wideCell("DAYS AWAY"),
				],
				this.locationCells(next, "next"),
			],
		];
	}

	wideCell(content) {
		return { type: "wide", content };
	}

	blankCells(count) {
		return Array.from({ length: count }, () => ({
			type: "letter",
			content: "",
		}));
	}

	numberCells(number) {
		// Clamp to 0-999: the board is a fixed 72-card grid paired to layout
		// cells by index, so a 4th digit would shift every downstream card onto
		// the wrong target. Pad to 3 digits, replacing leading zeros with blanks.
		const clamped = Math.max(0, Math.min(999, Number(number) || 0));
		const digits = clamped.toString().padStart(3, "0").split("");
		let firstNonZeroIndex = digits.findIndex((digit) => digit !== "0");
		if (firstNonZeroIndex === -1) firstNonZeroIndex = digits.length - 1;

		return digits.map((digit, index) => ({
			type: "digit",
			content: index < firstNonZeroIndex ? "" : digit,
		}));
	}

	locationCells(location, section) {
		const cells = [];

		cells.push({
			type: "flag",
			content: location ? this.getCountryFlag(location.country_code) : "🌍",
			section,
		});

		const countryCode = location
			? (location.country_code || "").toUpperCase()
			: "";

		// Drop parentheticals ("Haftkul (Seven Lakes)") and truncate long names
		// so the ", CC" suffix always fits in the 15-card row
		const maxCityLength = countryCode ? 14 - 1 - countryCode.length : 14;
		const cityName = location
			? Array.from(
					(location.city || "")
						.replace(/\s*\(.*?\)/g, "")
						.toUpperCase()
						.replace(/\s+/g, "")
			  )
					.slice(0, maxCityLength)
					.join("")
			: "";
		for (const char of cityName) {
			cells.push({ type: "letter", content: char });
		}

		cells.push({
			type: "letter",
			content: location && location.country_code ? "," : "",
		});

		for (const char of countryCode) {
			cells.push({ type: "letter", content: char });
		}

		// Pad or truncate to exactly 15 cards
		while (cells.length < 15) {
			cells.push({ type: "letter", content: "" });
		}
		return cells.slice(0, 15);
	}

	flattenLayout(sections) {
		return sections.flat(2);
	}

	renderBoard() {
		const sections = this.buildLayout(null);
		let html = '<div class="flip-rows">';
		sections.forEach((rows, index) => {
			if (index > 0) html += '<div class="flip-divider"></div>';
			html += '<div class="flip-section">';
			for (const row of rows) {
				html += '<div class="flip-row">';
				for (const cell of row) {
					const classes =
						cell.type === "wide"
							? "flip-card wide"
							: cell.type === "flag"
							? "flip-card standard flag"
							: "flip-card standard";
					html += `
						<div class="${classes}">
							<div class="flip-card-inner">
								<div class="flip-card-half flip-card-top"><div class="flip-card-text top"></div></div>
								<div class="flip-card-half flip-card-bottom"><div class="flip-card-text bottom"></div></div>
								<div class="flip-card-top-flip"><div class="flip-card-text top"></div></div>
								<div class="flip-card-bottom-flip"><div class="flip-card-text bottom"></div></div>
							</div>
						</div>`;
				}
				html += "</div>";
			}
			html += "</div>";
		});
		html += "</div>";
		this.displayElement.innerHTML = html;

		this.cards = Array.from(
			this.displayElement.querySelectorAll(".flip-card")
		).map((el) => ({
			el,
			topText: el.querySelector(".flip-card-top .flip-card-text"),
			bottomText: el.querySelector(".flip-card-bottom .flip-card-text"),
			topFlipText: el.querySelector(".flip-card-top-flip .flip-card-text"),
			bottomFlipText: el.querySelector(
				".flip-card-bottom-flip .flip-card-text"
			),
			current: "",
			sequence: [],
			cadence: 0,
			duration: 0,
			nextFlipAt: 0,
			finishAt: null,
			flipVariant: false,
		}));
	}

	start(data) {
		const cells = this.flattenLayout(this.buildLayout(data));
		this.updateAriaLabel(data);

		if (prefersReducedMotion()) {
			this.cards.forEach((card, index) => {
				this.setCardInstantly(card, cells[index].content);
			});
			return;
		}

		const startTime = performance.now();
		let standardIndex = 0;
		let wideIndex = 0;
		this.cards.forEach((card, index) => {
			const cell = cells[index];
			card.sequence = this.buildSequence(cell);
			const timing = cell.type === "wide" ? this.wideFlip : this.standardFlip;
			card.cadence = timing.cadence;
			card.duration = timing.duration;
			// Stagger card starts so the board ripples in instead of every card
			// flipping on the exact same frame
			const offset =
				cell.type === "wide" ? wideIndex++ * 25 : standardIndex++ * 15;
			card.nextFlipAt = startTime + offset;
		});

		requestAnimationFrame((now) => this.tick(now));
	}

	// The sequence of contents a card flips through, ending at its target
	buildSequence(cell) {
		const target = cell.content;

		// Blank cards do a single empty flap for texture (indexOf("") would
		// otherwise match position 0 of the alphabets below)
		if (target === "" || target === " ") return [target];

		if (cell.type === "wide") {
			const index = this.shuffledWideCardTexts.indexOf(target);
			if (index === -1) return [target];
			return this.shuffledWideCardTexts.slice(0, index + 1);
		}

		if (cell.type === "flag") {
			const index = this.flags.indexOf(target);
			if (index === -1) return [target];
			// Cap the number of flips per section, then jump to the target
			const maxFlips =
				{ now: 15, previous: 20, next: 25 }[cell.section] || 15;
			if (index < maxFlips) return this.flags.slice(0, index + 1);
			return [...this.flags.slice(0, maxFlips), target];
		}

		const alphabet = cell.type === "digit" ? this.digits : this.characters;
		const index = alphabet.indexOf(target);
		if (index === -1) return [target]; // blanks, punctuation, accented letters
		return alphabet.slice(0, index + 1).split("");
	}

	tick(now) {
		let active = false;
		for (const card of this.cards) {
			if (card.finishAt !== null) {
				if (now >= card.finishAt) {
					// Sync all four layers: at rest the top-flip overlay covers the
					// static top half, so it must show the settled content too
					card.bottomText.textContent = card.current;
					card.topFlipText.textContent = card.current;
					card.bottomFlipText.textContent = card.current;
					card.el.classList.remove("flip-a", "flip-b");
					card.finishAt = null;
				} else {
					active = true;
				}
			}
			if (card.sequence.length > 0) {
				active = true;
				if (card.finishAt === null && now >= card.nextFlipAt) {
					this.startFlip(card, now);
				}
			}
		}
		if (active) requestAnimationFrame((time) => this.tick(time));
	}

	startFlip(card, now) {
		const next = card.sequence.shift();
		card.topFlipText.textContent = card.current; // outgoing content on the falling flap
		card.bottomFlipText.textContent = next; // incoming content on the rising flap
		card.topText.textContent = next; // static top, revealed as the flap falls
		// Alternate between two identical animations so consecutive flips always
		// restart cleanly, even when frames are dropped
		card.flipVariant = !card.flipVariant;
		card.el.classList.remove(card.flipVariant ? "flip-b" : "flip-a");
		card.el.classList.add(card.flipVariant ? "flip-a" : "flip-b");
		card.current = next;
		card.finishAt = now + card.duration;
		card.nextFlipAt = now + card.cadence;
	}

	setCardInstantly(card, content) {
		card.topText.textContent = content;
		card.bottomText.textContent = content;
		card.topFlipText.textContent = content;
		card.bottomFlipText.textContent = content;
		card.current = content;
	}

	updateAriaLabel(data) {
		const locations = (data && data.location) || {};
		const describe = (location) =>
			location && location.city
				? `${location.city}, ${(location.country_code || "").toUpperCase()}`
				: "unknown";
		this.boardElement.setAttribute(
			"aria-label",
			`Split-flap travel board. Now: ${describe(
				locations.now
			)}. Previously: ${describe(locations.previous)}. Next: ${describe(
				locations.next
			)}.`
		);
	}

	getCountryFlag(countryCode) {
		if (!countryCode || countryCode.length !== 2) return "🌍";

		const codePoints = countryCode
			.toUpperCase()
			.split("")
			.map((char) => 127397 + char.charCodeAt(0));

		return String.fromCodePoint(...codePoints);
	}

	calculateDaysFromDate(fromDate, toDate) {
		const normalize = (date) => {
			const d =
				typeof date === "string"
					? new Date(`${date}T00:00:00`)
					: new Date(date);
			d.setHours(0, 0, 0, 0); // force to midnight local time
			return d;
		};

		const from = normalize(fromDate);
		const to = normalize(toDate);

		// Round, not floor: across a DST change local midnights are 23 or 25
		// hours apart, which floor would count one day short
		return Math.round(Math.abs(to - from) / (1000 * 60 * 60 * 24));
	}
}
