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

const reserveForm = document.querySelector("[data-reserve-form]");
if (reserveForm) {
  const result = reserveForm.querySelector("[data-result]");

  function calculate() {
    const data = Object.fromEntries(new FormData(reserveForm).entries());
    const guests = Number(data.guests || 0);
    const deposit = Number(data.deposit || 0);
    const total = guests * deposit;
    result.querySelector("strong").textContent = zar.format(total);
    result.querySelector("span").textContent = `${guests} guests secured with a deposit before the table is blocked.`;
  }

  reserveForm.addEventListener("input", calculate);
  calculate();

  reserveForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = reserveForm.querySelector("[data-status]");
    if (!status) return;
    status.textContent = "Request received — Ember will confirm your table by email within the hour.";
    status.classList.add("in");
  });
}
