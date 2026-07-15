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

const cartCount = document.querySelector("[data-cart-count]");
const cartTotal = document.querySelector("[data-cart-total]");

document.querySelectorAll("[data-add]").forEach((button) => {
  button.addEventListener("click", () => {
    const value = Number(button.dataset.add);
    if (!cartCount || !cartTotal) return;
    const nextCount = Number(cartCount.dataset.value || 0) + 1;
    const nextTotal = Number(cartTotal.dataset.value || 0) + value;
    cartCount.dataset.value = String(nextCount);
    cartTotal.dataset.value = String(nextTotal);
    cartCount.textContent = `${nextCount} item${nextCount === 1 ? "" : "s"} · ${zar.format(nextTotal)}`;
    const label = button.textContent;
    button.textContent = "Added";
    setTimeout(() => (button.textContent = label), 1100);
  });
});

const bookingForm = document.querySelector("[data-booking-form]");
if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = bookingForm.querySelector("[data-status]");
    if (!status) return;
    status.textContent = "Request received — a Kanso stylist will confirm your appointment by email within one business day.";
    status.classList.add("in");
  });
}

const newsletter = document.querySelector("[data-newsletter]");
if (newsletter) {
  newsletter.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = newsletter.querySelector("button");
    if (button) button.textContent = "Subscribed";
  });
}
