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

	// Initialize flip board when DOM is loaded
	new FlipBoard();
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

// Flip Board Component
class FlipBoard {
	constructor() {
		this.apiUrl =
			"https://nomads.com/@isaacb.json?key=8971e0d4cc4a752af04587430a660fa9";
		this.displayElement = document.getElementById("flipDisplay");
		this.characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
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

		// State management
		this.dataReady = false;
		this.travelData = null;

		this.init();
	}

	async init() {
		// Always display the board immediately with empty states
		this.displayFlipBoard(null);

		// Start wide card animations after 2.5 seconds
		setTimeout(() => {
			this.animateWideCards();
		}, 2500);

		// Fetch data in parallel
		try {
			const data = await this.fetchData();
			this.travelData = data;
			this.dataReady = true;

			// Update the board with real data
			this.displayFlipBoard(data);

			// Start standard card animations at the same time as wide cards (2.5 seconds total)
			setTimeout(() => {
				this.animateStandardCards();
			}, 2500);
		} catch (error) {
			console.error("Error fetching data:", error);
			// Keep the empty board displayed, no error state needed
		}
	}

	async fetchData() {
		const response = await fetch(this.apiUrl);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	}

	displayFlipBoard(data) {
		// Use empty/default values when data is null or missing
		const locations = data?.location || {};
		const stats = data?.stats || {};

		const totalCountries = stats?.countries || 0;
		const current = locations.now || null;
		const previous = locations.previous || null;
		const next = locations.next || null;

		// Store location data for section identification
		this.currentLocationData = current;
		this.previousLocationData = previous;
		this.nextLocationData = next;

		// Calculate actual days using live data
		const today = new Date();
		const previousDays = previous?.date_end
			? this.calculateDaysFromDate(previous.date_end, today)
			: 0;
		const nextDays = next?.date_start
			? this.calculateDaysFromDate(today, next.date_start)
			: 0;

		let html = '<div class="space-y-4">';

		// Always show all sections, even with empty data
		html += this.createSection(
			[
				// Row 1: Wide card + 4 blanks + 3 number cards + wide card = 15 cards total
				this.createRow([
					this.createCard("PREVIOUS:", "wide", false, "", "previous"),
					...this.createBlankCards(4),
					...this.createNumberCards(previousDays.toString()),
					this.createCard("DAYS AGO", "wide", false, "", "daysAgo"),
				]),
				// Row 2: Exactly 15 standard cards for location
				this.createRow(this.createLocationRow(previous, "previous")),
			],
			true
		);

		html += this.createSection([
			// Row 3: Wide card + 4 blanks + 3 number cards + wide card = 15 cards total
			this.createRow([
				this.createCard("📍 NOW:", "wide", false, "", "now"),
				...this.createBlankCards(4),
				...this.createNumberCards(totalCountries.toString()),
				this.createCard("COUNTRIES", "wide", false, "", "countries"),
			]),
			// Row 4: Exactly 15 standard cards for location
			this.createRow(this.createLocationRow(current, "now")),
		]);

		html += this.createSection([
			// Row 5: Wide card + 4 blanks + 3 number cards + wide card = 15 cards total
			this.createRow([
				this.createCard("NEXT:", "wide", false, "", "next"),
				...this.createBlankCards(4),
				...this.createNumberCards(nextDays.toString()),
				this.createCard("DAYS AWAY", "wide", false, "", "daysAway"),
			]),
			// Row 6: Exactly 15 standard cards for location
			this.createRow(this.createLocationRow(next, "next")),
		]);

		html += "</div>";
		this.displayElement.innerHTML = html;
	}

	createSection(rows, isFirst = false) {
		const divider = isFirst
			? ""
			: '<div class="h-px bg-white/30 my-4 md:my-3 sm:my-2 max-[430px]:my-1.5 max-[385px]:my-1"></div>';
		return `${divider}<div class="flip-section">${rows.join("")}</div>`;
	}

	createRow(cards) {
		return `<div class="flex items-center justify-center my-3 md:my-2 sm:my-1.5 max-[430px]:my-1 max-[385px]:my-0.5 flex-wrap gap-2 md:gap-1 sm:gap-0.5 max-[430px]:gap-0.5 max-[385px]:gap-px">${cards.join(
			""
		)}</div>`;
	}

	createCard(
		content,
		className = "",
		isFlag = false,
		section = "",
		cardType = ""
	) {
		const contentId = Math.random().toString(36).substr(2, 9);
		return `
			<div class="flip-card ${className}" data-target="${content}" data-id="${contentId}" ${
			isFlag ? 'data-is-flag="true"' : ""
		} ${section ? `data-section="${section}"` : ""} ${
			cardType ? `data-card-type="${cardType}"` : ""
		}>
				<div class="flip-card-inner">
					<!-- Static top half showing current content -->
					<div class="flip-card-half flip-card-top">
						<div class="flip-card-text top" id="top-${contentId}">${content}</div>
					</div>
					<!-- Static bottom half showing current content -->
					<div class="flip-card-half flip-card-bottom">
						<div class="flip-card-text bottom" id="bottom-${contentId}">${content}</div>
					</div>
					<!-- Animated top half that flips down -->
					<div class="flip-card-top-flip">
						<div class="flip-card-text top" id="top-flip-${contentId}">${content}</div>
					</div>
					<!-- Animated bottom half that flips up -->
					<div class="flip-card-bottom-flip">
						<div class="flip-card-text bottom" id="bottom-flip-${contentId}">${content}</div>
					</div>
				</div>
			</div>
		`;
	}

	createLetterCards(text) {
		return text.split("").map((char) => {
			if (char === " ") {
				return this.createCard(" ", "standard");
			}
			return this.createCard(char, "standard");
		});
	}

	createNumberCards(number) {
		// Pad number to 3 digits for consistency
		const paddedNumber = number.padStart(3, "0");
		const digits = paddedNumber.split("");

		// Find the first non-zero digit position
		let firstNonZeroIndex = digits.findIndex((digit) => digit !== "0");
		if (firstNonZeroIndex === -1) {
			// All zeros case - show last zero only
			firstNonZeroIndex = digits.length - 1;
		}

		return digits.map((digit, index) => {
			// Replace leading zeros with empty cards
			if (digit === "0" && index < firstNonZeroIndex) {
				return this.createCard(" ", "standard");
			}
			return this.createCard(digit, "standard");
		});
	}

	createBlankCards(count) {
		const cards = [];
		for (let i = 0; i < count; i++) {
			cards.push(this.createCard(" ", "standard"));
		}
		return cards;
	}

	createLocationRow(location, section) {
		const cards = [];

		// Add flag card (empty if no location)
		const flagEmoji = location
			? this.getCountryFlag(location.country_code)
			: "🌍";
		cards.push(
			this.createCard(flagEmoji, "standard flag", !!location, section)
		);

		// Add city name cards (empty if no location)
		const cityName = location
			? (location.city || "").toUpperCase().replace(/\s+/g, "")
			: "";
		cards.push(...this.createLetterCards(cityName));

		// Add comma (only if we have a country code)
		cards.push(this.createCard(location?.country_code ? "," : "", "standard"));

		// Add country code cards (empty if no location)
		const countryCode = location
			? (location.country_code || "").toUpperCase()
			: "";
		cards.push(...this.createLetterCards(countryCode));

		// Pad or truncate to exactly 15 cards
		if (cards.length > 15) {
			// Truncate if too long
			return cards.slice(0, 15);
		} else if (cards.length < 15) {
			// Pad with blank cards if too short
			const blanksNeeded = 15 - cards.length;
			cards.push(...this.createBlankCards(blanksNeeded));
		}

		return cards;
	}

	async animateAllCards() {
		// This method is kept for compatibility but now split into wide and standard
		// Wide cards are animated after 2.5 seconds, standard cards when data is ready
	}

	async animateCard(card) {
		const target = card.dataset.target;
		const isFlag = card.dataset.isFlag === "true";
		const section = card.dataset.section;
		const cardType = card.dataset.cardType;

		// Always animate if card has a target, even if it's a space
		if (target === undefined || target === null) return;

		// For flag cards, cycle through flags with section-based timing
		if (isFlag) {
			await this.cycleToTargetFlag(card, target, section);
		}
		// For wide cards, cycle through their options
		else if (card.classList.contains("wide") && cardType) {
			await this.cycleWideCard(card, target, cardType);
		}
		// For standard letter/number cards, cycle through characters
		else if (card.classList.contains("standard")) {
			// Even spaces and punctuation should animate
			if (target === " " || target === "," || target === "") {
				// Just do a simple flip for spaces and punctuation
				this.flipCard(card, target);
			} else {
				await this.cycleToTargetChar(card, target);
			}
		}
		// For other cards, just do a simple flip
		else {
			this.flipCard(card, target);
		}
	}

	flipCard(card, newContent) {
		const contentId = card.dataset.id;

		// Get all text elements
		const topElement = document.getElementById(`top-${contentId}`);
		const bottomElement = document.getElementById(`bottom-${contentId}`);
		const topFlipElement = document.getElementById(`top-flip-${contentId}`);
		const bottomFlipElement = document.getElementById(
			`bottom-flip-${contentId}`
		);

		if (
			!topElement ||
			!bottomElement ||
			!topFlipElement ||
			!bottomFlipElement
		) {
			console.warn("Missing flip elements for card:", contentId);
			return;
		}

		// Set up the flip animation
		topFlipElement.textContent = topElement.textContent; // Current content on top flip
		bottomFlipElement.textContent = newContent; // New content on bottom flip

		// Start the flip animation
		card.classList.add("flipping");

		// Universal animation duration based on card type
		const isStandardCard = card.classList.contains("standard");
		const animationDuration = isStandardCard ? 300 : 600;
		const topUpdateDelay = isStandardCard ? 20 : 50;

		// Update the static top half early so it's visible when the card flaps down
		setTimeout(() => {
			topElement.textContent = newContent;
		}, topUpdateDelay);

		// After animation completes, update remaining elements and reset
		setTimeout(() => {
			bottomElement.textContent = newContent;
			topFlipElement.textContent = newContent;
			bottomFlipElement.textContent = newContent;
			card.classList.remove("flipping");
		}, animationDuration);
	}

	async cycleWideCard(card, target, cardType) {
		// Use the shared randomized sequence for all wide cards
		const shuffledTexts = [...this.shuffledWideCardTexts];

		// If target not in shuffled list, add it at a random position
		if (!shuffledTexts.includes(target)) {
			const randomIndex = Math.floor(Math.random() * shuffledTexts.length);
			shuffledTexts.splice(randomIndex, 0, target);
		}

		const flipInterval = 800; // Slower for wide cards
		let currentIndex = 0;

		const flipTimer = setInterval(() => {
			const text = shuffledTexts[currentIndex];

			// Flip to the new text
			this.flipCard(card, text);

			// Stop when we reach the target
			if (text === target) {
				clearInterval(flipTimer);
				return;
			}

			currentIndex = (currentIndex + 1) % shuffledTexts.length;
		}, flipInterval);
	}

	async cycleToTargetChar(card, target) {
		const targetIndex = this.characters.indexOf(target);
		if (targetIndex === -1) return; // Target not found in characters

		const flipInterval = 200; // Faster than animation duration (150ms)
		let currentIndex = 0;

		const flipTimer = setInterval(() => {
			const char = this.characters[currentIndex];

			// Flip to the new character
			this.flipCard(card, char);

			if (currentIndex === targetIndex) {
				clearInterval(flipTimer);
			}

			currentIndex = (currentIndex + 1) % this.characters.length;

			// If we've gone through all characters and haven't found target, stop
			if (currentIndex === 0 && targetIndex === -1) {
				clearInterval(flipTimer);
			}
		}, flipInterval);
	}

	async cycleToTargetFlag(card, target, section) {
		const targetIndex = this.flags.indexOf(target);
		if (targetIndex === -1) return; // Target not found in flags

		// Set max flips based on section
		let maxFlips;
		switch (section) {
			case "now":
				maxFlips = 15;
				break;
			case "previous":
				maxFlips = 20;
				break;
			case "next":
				maxFlips = 25;
				break;
			default:
				maxFlips = 15;
				break;
		}

		const flipInterval = 200; // Time between flips
		let currentIndex = 0;
		let flipCount = 0;

		const flipTimer = setInterval(() => {
			const flag = this.flags[currentIndex];

			// Flip to the new flag
			this.flipCard(card, flag);

			flipCount++;

			// Stop if we've reached the target naturally
			if (currentIndex === targetIndex) {
				clearInterval(flipTimer);
				return;
			}

			// If we hit max flips, jump directly to target on next flip
			if (flipCount >= maxFlips) {
				clearInterval(flipTimer);

				// Do one final flip to the correct target
				setTimeout(() => {
					this.flipCard(card, target);
				}, flipInterval);
				return;
			}

			currentIndex = (currentIndex + 1) % this.flags.length;
		}, flipInterval);
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

		const diffTime = Math.abs(to - from);
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	}

	animateStandardCards() {
		const standardCards = this.displayElement.querySelectorAll(
			".flip-card.standard"
		);
		standardCards.forEach((card, index) => {
			// Slight stagger: 15ms between cards for smoother performance
			setTimeout(() => {
				this.animateCard(card);
			}, index * 15);
		});
	}

	animateWideCards() {
		const wideCards = this.displayElement.querySelectorAll(".flip-card.wide");
		wideCards.forEach((card, index) => {
			// Slight stagger: 25ms between wide cards
			setTimeout(() => {
				this.animateCard(card);
			}, index * 25);
		});
	}
}
