document.querySelectorAll(".reveal").forEach((el, index) => {
  el.style.transitionDelay = `${Math.min((index % 6) * 40, 240)}ms`;
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("in");
    });
  },
  { threshold: 0.14 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const bookingForm = document.querySelector("[data-booking-form]");
if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = bookingForm.querySelector("[data-status]");
    if (!status) return;
    status.textContent = "Request received — Luma will confirm your treatment and hold the slot with a deposit link.";
    status.classList.add("in");
  });
}
