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

document.querySelectorAll(".menu-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".menu-tab").forEach((t) => t.classList.remove("is-active"));
    tab.classList.add("is-active");
    const target = tab.dataset.tab;
    document.querySelectorAll(".menu-panel").forEach((panel) => {
      panel.hidden = panel.dataset.panel !== target;
    });
  });
});

const order = new Map();
const orderList = document.querySelector("[data-order-list]");
const orderEmpty = document.querySelector("[data-order-empty]");
const orderTotal = document.querySelector("[data-order-total]");

function renderOrder() {
  orderList.querySelectorAll(".order-row").forEach((row) => row.remove());
  if (order.size === 0) {
    orderEmpty.style.display = "block";
  } else {
    orderEmpty.style.display = "none";
  }

  let total = 0;
  order.forEach((item, name) => {
    total += item.price * item.qty;
    const row = document.createElement("div");
    row.className = "order-row";
    row.innerHTML = `<span class="qty">${item.qty}×</span><span class="name">${name}</span><span class="line-total">${zar.format(item.price * item.qty)}</span><button type="button" class="remove" aria-label="Remove ${name}">×</button>`;
    row.querySelector(".remove").addEventListener("click", () => {
      order.delete(name);
      renderOrder();
    });
    orderList.appendChild(row);
  });

  orderTotal.textContent = zar.format(total);
}

document.querySelectorAll("[data-item]").forEach((item) => {
  const button = item.querySelector("[data-add]");
  const name = item.dataset.name;
  const price = Number(item.dataset.price);

  button.addEventListener("click", () => {
    const existing = order.get(name);
    order.set(name, { price, qty: existing ? existing.qty + 1 : 1 });
    renderOrder();
    button.classList.add("is-added");
    button.textContent = "Added";
    setTimeout(() => {
      button.classList.remove("is-added");
      button.textContent = "Add";
    }, 900);
  });
});

const sendOrderBtn = document.querySelector("[data-send-order]");
if (sendOrderBtn) {
  sendOrderBtn.addEventListener("click", () => {
    const orderStatus = document.querySelector("[data-order-status]");
    if (order.size === 0) {
      orderStatus.textContent = "Add at least one plate or pour first.";
      orderStatus.classList.add("in");
      return;
    }
    const summary = Array.from(order.entries())
      .map(([name, item]) => `${item.qty}× ${name}`)
      .join(", ");
    const occasionField = document.querySelector('[data-reserve-form] textarea');
    if (occasionField) {
      occasionField.value = occasionField.value
        ? `${occasionField.value}\nPre-order: ${summary}.`
        : `Pre-order: ${summary}.`;
    }
    orderStatus.textContent = "Order added to your reservation notes below.";
    orderStatus.classList.add("in");
    document.getElementById("reserve").scrollIntoView({ behavior: "smooth" });
  });
}

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
