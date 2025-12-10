// Mobile Menu Toggle
const menuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Countdown Timer Logic
function updateCountdown() {
    const now = new Date();
    const currentDay = now.getDay(); // 0 is Sunday

    // Target: Next Sunday at 6:00 PM (18:00)
    let target = new Date(now);
    target.setHours(18, 0, 0, 0);

    if (currentDay === 0 && now.getHours() >= 18) {
        // It's past 6PM on Sunday, target next Sunday
        target.setDate(now.getDate() + 7);
    } else {
        // Calc days until Sunday (0)
        let daysUntilSunday = 0 - currentDay;
        if (daysUntilSunday < 0) daysUntilSunday += 7;
        target.setDate(now.getDate() + daysUntilSunday);
    }

    const diff = target - now;

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = d < 10 ? "0" + d : d;
    document.getElementById("hours").innerText = h < 10 ? "0" + h : h;
    document.getElementById("minutes").innerText = m < 10 ? "0" + m : m;
    document.getElementById("seconds").innerText = s < 10 ? "0" + s : s;
}

setInterval(updateCountdown, 1000);
updateCountdown();
