const rand = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});

document.querySelectorAll(".reveal").forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index * 35, 240)}ms`;
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

document.querySelectorAll("[data-add-cart]").forEach((button) => {
  button.addEventListener("click", () => {
    const value = Number(button.dataset.addCart);
    const cart = document.querySelector("[data-cart-total]");
    const count = document.querySelector("[data-cart-count]");
    if (!cart || !count) return;

    const nextTotal = Number(cart.dataset.value || 0) + value;
    const nextCount = Number(count.dataset.value || 0) + 1;
    cart.dataset.value = String(nextTotal);
    count.dataset.value = String(nextCount);
    cart.textContent = rand.format(nextTotal);
    count.textContent = `${nextCount} item${nextCount === 1 ? "" : "s"}`;
    button.textContent = "Added";
    setTimeout(() => (button.textContent = "Add to room"), 1100);
  });
});

const quoteForms = document.querySelectorAll("[data-calculator]");
quoteForms.forEach((form) => {
  const output = form.querySelector("[data-result]");
  const type = form.dataset.calculator;

  function calculate() {
    if (!output) return;
    const data = Object.fromEntries(new FormData(form).entries());
    let total = 0;
    let note = "";

    if (type === "trades") {
      total =
        1200 +
        Number(data.callout || 0) +
        Number(data.hours || 0) * 680 +
        Number(data.parts || 0) * 1.22 +
        Number(data.urgency || 0);
      note = "Includes callout, labour, marked-up parts, and dispatch priority.";
    }

    if (type === "restaurant") {
      const guests = Number(data.guests || 0);
      total = guests * Number(data.deposit || 0);
      note = `${guests} guests secured with a deposit before the table is blocked.`;
    }

    if (type === "wellness") {
      const avg = Number(data.average || 0);
      const noShows = Number(data.noshows || 0);
      total = avg * noShows * 4;
      note = "Estimated monthly no-show leakage before deposits and reminders.";
    }

    if (type === "leads") {
      const jobs = Number(data.jobs || 0);
      const value = Number(data.value || 0);
      const recovery = Number(data.recovery || 0) / 100;
      total = jobs * value * recovery;
      note = "Monthly revenue recovered if slow responses win back even this share.";
    }

    output.querySelector("strong").textContent = rand.format(total);
    output.querySelector("span").textContent = note;
  }

  form.addEventListener("input", calculate);
  calculate();
});

document.querySelectorAll("[data-booking-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = form.querySelector("[data-booking-status]");
    if (!status) return;
    status.textContent = "Request captured. In a live build this would reserve the slot, trigger a deposit flow, and notify the operator.";
    status.classList.add("in");
  });
});

document.addEventListener("pointermove", (event) => {
  const cards = document.querySelectorAll("[data-tilt]");
  const { innerWidth, innerHeight } = window;
  const x = (event.clientX / innerWidth - 0.5) * 8;
  const y = (event.clientY / innerHeight - 0.5) * -8;
  cards.forEach((card) => {
    card.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg)`;
  });
});
