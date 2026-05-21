/* ======================================================
   TYPING ANIMATION
   ====================================================== */
var typed = new Typed(".typing", {
    strings: ["Web Designer", "Web Developer", "Graphic Designer", "PHP Developer"],
    typeSpeed: 100,
    backSpeed: 60,
    loop: true
});

/* ======================================================
   SIDEBAR TOGGLE + OVERLAY
   ====================================================== */
const navToggler = document.querySelector(".nav-toggler");
const aside      = document.querySelector(".aside");

// Create overlay
const overlay = document.createElement("div");
overlay.classList.add("aside-overlay");
document.body.appendChild(overlay);

function openSidebar() {
    aside.classList.add("open");
    navToggler.classList.add("open");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeSidebar() {
    aside.classList.remove("open");
    navToggler.classList.remove("open");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
}

navToggler.addEventListener("click", () => {
    aside.classList.contains("open") ? closeSidebar() : openSidebar();
});

overlay.addEventListener("click", closeSidebar);

// Close on resize back to desktop
window.addEventListener("resize", () => {
    if (window.innerWidth > 1199) closeSidebar();
});

/* ======================================================
   NAV ACTIVE LINK ON SCROLL
   ====================================================== */
const sections = document.querySelectorAll(".section");
const navLinks  = document.querySelectorAll(".nav a");

// Close sidebar when nav link clicked (mobile)
navLinks.forEach((link) => {
    link.addEventListener("click", () => closeSidebar());
});

window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 80) {
            current = section.getAttribute("id");
        }
    });
    navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }
    });
});

/* ======================================================
   CONTACT FORM — FORMSPREE AJAX SUBMISSION
   ====================================================== */
const contactForm  = document.getElementById("contact-form");
const cfSubmit     = document.getElementById("cf-submit");
const cfName       = document.getElementById("cf-name");
const cfEmail      = document.getElementById("cf-email");
const cfSubject    = document.getElementById("cf-subject");
const cfMessage    = document.getElementById("cf-message");
const cfSuccess    = document.getElementById("cf-success");
const cfFail       = document.getElementById("cf-fail");
const cfBtnText    = document.getElementById("cf-btn-text");
const cfBtnLoading = document.getElementById("cf-btn-loading");

function showError(input, errorId, msg) {
    input.classList.add("input-error");
    document.getElementById(errorId).textContent = msg;
}

function clearError(input, errorId) {
    input.classList.remove("input-error");
    document.getElementById(errorId).textContent = "";
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Clear errors on input
[cfName, cfEmail, cfSubject, cfMessage].forEach((field) => {
    field.addEventListener("input", () => {
        clearError(field, field.id + "-error");
        cfSuccess.style.display = "none";
        cfFail.style.display    = "none";
    });
});

// Validate before submit
function validateForm() {
    let valid = true;

    if (cfName.value.trim().length < 2) {
        showError(cfName, "cf-name-error", "Name must be at least 2 characters.");
        valid = false;
    } else { clearError(cfName, "cf-name-error"); }

    if (!isValidEmail(cfEmail.value.trim())) {
        showError(cfEmail, "cf-email-error", "Please enter a valid email address.");
        valid = false;
    } else { clearError(cfEmail, "cf-email-error"); }

    if (cfSubject.value.trim().length < 3) {
        showError(cfSubject, "cf-subject-error", "Subject must be at least 3 characters.");
        valid = false;
    } else { clearError(cfSubject, "cf-subject-error"); }

    if (cfMessage.value.trim().length < 10) {
        showError(cfMessage, "cf-message-error", "Message must be at least 10 characters.");
        valid = false;
    } else { clearError(cfMessage, "cf-message-error"); }

    return valid;
}

// Submit via fetch (AJAX) — no page redirect
contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Sync hidden fields
    document.getElementById("cf-replyto").value        = cfEmail.value.trim();
    document.getElementById("cf-subject-hidden").value = cfSubject.value.trim();

    // Show loading state
    cfBtnText.style.display    = "none";
    cfBtnLoading.style.display = "inline";
    cfSubmit.disabled          = true;
    cfSuccess.style.display    = "none";
    cfFail.style.display       = "none";

    try {
        const response = await fetch(contactForm.action, {
            method:  "POST",
            headers: { "Accept": "application/json" },
            body:    new FormData(contactForm)
        });

        if (response.ok) {
            // Success
            cfSuccess.style.display = "inline-block";
            contactForm.reset();
            // Clear any leftover error states
            [cfName, cfEmail, cfSubject, cfMessage].forEach((f) => {
                f.classList.remove("input-error");
            });
        } else {
            // Formspree returned an error
            const data = await response.json();
            if (data.errors) {
                cfFail.textContent = data.errors.map(err => err.message).join(", ");
            }
            cfFail.style.display = "inline-block";
        }
    } catch (err) {
        // Network error
        cfFail.style.display = "inline-block";
    } finally {
        // Restore button
        cfBtnText.style.display    = "inline";
        cfBtnLoading.style.display = "none";
        cfSubmit.disabled          = false;
    }
});

/* ======================================================
   SCROLL REVEAL (IntersectionObserver)
   ====================================================== */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ======================================================
   PROGRESS BAR ANIMATION
   ====================================================== */
const progressBars  = document.querySelectorAll(".progress-in");
const aboutSection  = document.querySelector(".about.section");
let progressDone    = false;

progressBars.forEach((bar) => { bar.style.width = "0"; });

if (aboutSection) {
    new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !progressDone) {
                progressDone = true;
                progressBars.forEach((bar) => {
                    const w = bar.getAttribute("data-width");
                    if (w) setTimeout(() => { bar.style.width = w + "%"; }, 200);
                });
            }
        });
    }, { threshold: 0.2 }).observe(aboutSection);
}

/* ======================================================
   BACK TO TOP BUTTON
   ====================================================== */
const backToTopBtn = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
    backToTopBtn.classList.toggle("show", window.scrollY > 300);
});

backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ======================================================
   FOOTER YEAR
   ====================================================== */
const footerYear = document.getElementById("footer-year");
if (footerYear) footerYear.textContent = new Date().getFullYear();
