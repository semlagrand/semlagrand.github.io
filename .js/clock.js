(function () {
	const formatter = new Intl.DateTimeFormat("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
		timeZone: "Europe/Amsterdam",
	});

	function getTimeString() {
		return formatter.format(new Date());
	}

	function ensureClockElement() {
		let el = document.getElementById("clock");
		if (!el) {
			el = document.createElement("div");
			el.id = "clock";
			document.body.appendChild(el);
		}
		return el;
	}

	function updateClock() {
		const el = ensureClockElement();
		el.textContent = getTimeString();
	}

	document.addEventListener("DOMContentLoaded", function () {
		updateClock();
		setInterval(updateClock, 1000);
	});
})();

