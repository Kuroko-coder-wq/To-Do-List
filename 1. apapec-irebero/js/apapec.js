// Theme Toggle Logic
const themeToggleBtn = document.getElementById('theme-toggle');
const bodyElement = document.body;

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const isDark = bodyElement.classList.contains('dark');
        const newTheme = isDark ? 'light' : 'dark';
        
        bodyElement.classList.remove(isDark ? 'dark' : 'light');
        bodyElement.classList.add(newTheme);
        localStorage.setItem('theme', newTheme);
    });
}
const savedTheme = localStorage.getItem('theme') || 'dark';
bodyElement.classList.add(savedTheme);

// 1. Fixed target date (always stays correct even if the site is closed and reopened)
const targetDate = new Date("July 7, 2027 08:30:00").getTime();

function onCountdownComplete() {
    const messageEl = document.getElementById("countdown-message");
    if (messageEl) {
        messageEl.innerText = "The event has started!";
    }
}

function updateCountdown() {
    // High-performance timestamp fetch
    const now = Date.now();
    const distance = targetDate - now;

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (distance > 0) {
        // Corrected math formulas for exact time parsing
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)); // Fixed bug here
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (daysEl) daysEl.innerText = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.innerText = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.innerText = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.innerText = seconds.toString().padStart(2, '0');
    } else {
        // Clear interval safely if it exists
        if (typeof timerInterval !== 'undefined') {
            clearInterval(timerInterval);
        }
        
        if (daysEl) daysEl.innerText = "00";
        if (hoursEl) hoursEl.innerText = "00";
        if (minutesEl) minutesEl.innerText = "00";
        if (secondsEl) secondsEl.innerText = "00";

        onCountdownComplete();
    }
}

// Check instantly on page load before setting the interval
updateCountdown();

// Only set the interval if the target date hasn't already passed
let timerInterval;
if (targetDate - Date.now() > 0) {
    timerInterval = setInterval(updateCountdown, 1000);
}

// 2. Admissions Modal Logic
const modal = document.getElementById("admission-modal");
const openModalBtn = document.getElementById("open-admission-modal");
const closeModalBtn = document.getElementById("close-admission-modal");
const admissionForm = document.getElementById("admission-form");

if (openModalBtn && modal) {
    openModalBtn.addEventListener("click", () => modal.classList.add("active"));
    closeModalBtn.addEventListener("click", () => modal.classList.remove("active"));
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("active");
    });
}

if (admissionForm) {
    admissionForm.addEventListener("submit", (e) => {
        e.preventDefault();
        showCustomAlert("Application submitted successfully! We will contact you shortly.", "success");
        modal.classList.remove("active");
        admissionForm.reset();
    });
}

// 3. Dynamic Search Filter for Teachers
const teacherSearchInput = document.getElementById("teacher-search");
if (teacherSearchInput) {
    teacherSearchInput.addEventListener("keyup", (e) => {
        const query = e.target.value.toLowerCase();
        const cards = document.querySelectorAll("#teachers-grid .teacher-card");

        cards.forEach(card => {
            const name = card.getAttribute("data-name").toLowerCase();
            const subject = card.getAttribute("data-subject").toLowerCase();
            if (name.includes(query) || subject.includes(query)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
}

// 4. Back-To-Top Button Logic
const backToTopBtn = document.getElementById("back-to-top");
window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        backToTopBtn.classList.add("show");
    } else {
        backToTopBtn.classList.remove("show");
    }
});
backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// Contact Form & Toast Helper Logic
document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.querySelector("#contact form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (!contactForm.checkValidity()) {
                contactForm.classList.add('submitted');
                return;
            }
            showCustomAlert("Message sent successfully! We will get back to you soon.", "success");
            contactForm.reset();
            contactForm.classList.remove('submitted');
        });
    }
});

function showCustomAlert(message, type = "success") {
    let container = document.getElementById("alert-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "alert-container";
        document.body.appendChild(container);
    }
    const alertBox = document.createElement("div");
    alertBox.className = `custom-alert ${type}`;
    alertBox.innerHTML = `
        <div class="alert-message">
            <span>✅</span>
            <span>${message}</span>
        </div>
        <button class="alert-close" aria-label="Close Alert">&times;</button>
    `;
    container.appendChild(alertBox);

    const closeBtn = alertBox.querySelector(".alert-close");
    closeBtn.addEventListener("click", () => removeAlert(alertBox));
    setTimeout(() => {
        if (alertBox.parentElement) removeAlert(alertBox);
    }, 4000);
}

function removeAlert(alertBox) {
    alertBox.style.opacity = "0";
    alertBox.style.transform = "translateY(20px)";
    setTimeout(() => alertBox.remove(), 300);
}