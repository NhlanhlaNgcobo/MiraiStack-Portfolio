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

const feed = [
  { t: "00:00:02", channel: "WhatsApp", msg: "New enquiry — kitchen renovation quote", status: "REPLIED" },
  { t: "00:00:41", channel: "Website", msg: "Contact form — after-hours plumbing leak", status: "QUALIFIED" },
  { t: "00:01:15", channel: "Instagram", msg: "DM — availability this weekend?", status: "BOOKED" },
  { t: "00:01:52", channel: "Missed call", msg: "Callback requested — 082 xxx xxxx", status: "REPLIED" },
  { t: "00:02:30", channel: "Facebook", msg: "Message — pricing for solar install", status: "QUALIFIED" },
];

const consoleBody = document.querySelector("[data-console]");
if (consoleBody) {
  feed.forEach((row, index) => {
    const line = document.createElement("div");
    line.className = "console-line";
    line.style.animationDelay = `${index * 220}ms`;
    line.innerHTML = `<span class="t">${row.t}</span><span class="channel">${row.channel}</span><span>${row.msg}</span><span class="status">${row.status}</span>`;
    consoleBody.appendChild(line);
  });
}

const calcForm = document.querySelector("[data-calculator]");
if (calcForm) {
  const output = calcForm.querySelector("[data-output]");

  function calculate() {
    const data = Object.fromEntries(new FormData(calcForm).entries());
    const jobs = Number(data.jobs || 0);
    const value = Number(data.value || 0);
    const recovery = Number(data.recovery || 0) / 100;
    const total = jobs * value * recovery;
    output.querySelector("strong").textContent = zar.format(total);
    output.querySelector("span").textContent = "Monthly revenue recovered if slow responses win back even this share.";
  }

  calcForm.addEventListener("input", calculate);
  calculate();
}

const trialForm = document.querySelector("[data-booking-form]");
if (trialForm) {
  trialForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = trialForm.querySelector("[data-status]");
    if (!status) return;
    status.textContent = "Signal received — the switch-on team will set up tracking within one business day.";
    status.classList.add("in");
  });
}
