// Mobile Menu Toggle
const menuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Countdown Timer Logic - Timezone-Safe (Eastern Time)
// =====================================================
// This countdown always targets Sunday 6:00 PM Eastern Time (ET/EDT).
// It uses Intl.DateTimeFormat to get the current time in America/New_York,
// then calculates the target date accordingly. This approach handles DST
// automatically because the timezone database manages the offsets.

/**
 * Get the current date/time components in Eastern Time
 * @returns {Object} { year, month, day, hour, minute, second, dayOfWeek }
 */
function getEasternTimeComponents() {
    const now = new Date();

    // Format current time in Eastern timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        weekday: 'short',
        hour12: false
    });

    const parts = formatter.formatToParts(now);
    const getValue = (type) => parts.find(p => p.type === type)?.value;

    const dayMap = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };

    return {
        year: parseInt(getValue('year')),
        month: parseInt(getValue('month')),
        day: parseInt(getValue('day')),
        hour: parseInt(getValue('hour')),
        minute: parseInt(getValue('minute')),
        second: parseInt(getValue('second')),
        dayOfWeek: dayMap[getValue('weekday')]
    };
}

/**
 * Calculate the next Sunday 6:00 PM ET as a UTC timestamp
 * @returns {number} Unix timestamp in milliseconds
 */
function getNextAuctionClose() {
    const et = getEasternTimeComponents();

    // Calculate days until next Sunday
    let daysUntilSunday = (7 - et.dayOfWeek) % 7;

    // If it's Sunday, check if we're past 6PM
    if (et.dayOfWeek === 0) {
        if (et.hour >= 18) {
            // Past 6PM Sunday, target next week
            daysUntilSunday = 7;
        } else {
            // Before 6PM Sunday, target today
            daysUntilSunday = 0;
        }
    }

    // Build the target date string in ET
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysUntilSunday);

    // Get the target Sunday's date in ET
    const targetFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const targetParts = targetFormatter.formatToParts(targetDate);
    const getTargetValue = (type) => targetParts.find(p => p.type === type)?.value;

    const targetYear = getTargetValue('year');
    const targetMonth = getTargetValue('month');
    const targetDay = getTargetValue('day');

    // Create a date string for Sunday 6PM ET and convert to UTC
    // We use a trick: create the date as if it's in ET, then convert
    const targetString = `${targetYear}-${targetMonth}-${targetDay}T18:00:00`;

    // Get UTC offset for the target date in America/New_York
    const tempDate = new Date(targetString + 'Z');
    const etOffset = getETOffset(tempDate);

    // The target time in UTC = ET time + offset (offset is negative for behind UTC)
    return new Date(targetString + 'Z').getTime() - (etOffset * 60 * 1000);
}

/**
 * Get the UTC offset in minutes for Eastern Time at a given date
 * (Handles DST automatically)
 */
function getETOffset(date) {
    const utcString = date.toLocaleString('en-US', { timeZone: 'UTC' });
    const etString = date.toLocaleString('en-US', { timeZone: 'America/New_York' });
    const utcDate = new Date(utcString);
    const etDate = new Date(etString);
    return (etDate - utcDate) / (60 * 1000);
}

function updateCountdown() {
    const now = Date.now();
    const target = getNextAuctionClose();
    const diff = target - now;

    // Ensure we never show negative values
    if (diff <= 0) {
        // Auction just closed, recalculate for next week
        setTimeout(updateCountdown, 1000);
        return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = d < 10 ? "0" + d : d;
    document.getElementById("hours").innerText = h < 10 ? "0" + h : h;
    document.getElementById("minutes").innerText = m < 10 ? "0" + m : m;
    document.getElementById("seconds").innerText = s < 10 ? "0" + s : s;

    // Show the countdown (hide fallback)
    const countdownEl = document.getElementById('countdown');
    if (countdownEl) {
        countdownEl.style.display = 'flex';
    }
    const fallbackEl = document.getElementById('countdown-fallback');
    if (fallbackEl) {
        fallbackEl.style.display = 'none';
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Signup Modal Functions
function openSignupModal() {
    document.getElementById('signupModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSignupModal() {
    document.getElementById('signupModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;

    // Show success message
    alert(`Thank you, ${name}! You've been signed up for exclusive deal alerts.`);

    // Reset form and close modal
    document.getElementById('signupForm').reset();
    closeSignupModal();
}

// Close modal when clicking outside
document.getElementById('signupModal').addEventListener('click', function (e) {
    if (e.target === this) {
        closeSignupModal();
    }
});
