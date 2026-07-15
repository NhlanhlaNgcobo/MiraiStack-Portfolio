const zar = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});

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

const estimator = document.querySelector("[data-estimator]");
if (estimator) {
  const readout = estimator.querySelector("[data-readout]");
  const note = estimator.querySelector("[data-note]");

  function calculate() {
    const data = Object.fromEntries(new FormData(estimator).entries());
    const total =
      1200 +
      Number(data.callout || 0) +
      Number(data.hours || 0) * 680 +
      Number(data.parts || 0) * 1.22 +
      Number(data.urgency || 0);
    readout.textContent = zar.format(total);
    note.textContent = "Includes callout, labour, marked-up parts, and dispatch priority.";
  }

  estimator.addEventListener("input", calculate);
  calculate();
}

const bookingForm = document.querySelector("[data-booking-form]");
if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = bookingForm.querySelector("[data-status]");
    if (!status) return;
    status.textContent = "Job logged — dispatch will confirm your crew and window by SMS shortly.";
    status.classList.add("in");
  });
}
