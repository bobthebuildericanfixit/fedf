// Loading screen
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => {
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";
    setTimeout(() => loader.remove(), 400);
  }, 1100);
});

// Custom cursor movement
const cursorDot = document.getElementById("cursor-dot");
const cursorRing = document.getElementById("cursor-ring");

window.addEventListener("pointermove", (e) => {
  const { clientX, clientY } = e;
  cursorDot.style.transform = `translate(${clientX}px, ${clientY}px)`;
  cursorRing.style.transform = `translate(${clientX}px, ${clientY}px)`;
});

// Theme toggle (light/dark)
const toggle = document.getElementById("theme-toggle");
const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
if (prefersLight) document.body.classList.add("light");

toggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
});

// Mobile nav toggle
const navMenu = document.getElementById("nav-menu");
const navMobile = document.getElementById("nav-mobile");
navMenu.addEventListener("click", () => {
  navMobile.style.display =
    navMobile.style.display === "flex" ? "none" : "flex";
});

// Active nav links on scroll
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

function setActiveLink() {
  let current = "";
  sections.forEach((section) => {
    const top = window.scrollY;
    const offset = section.offsetTop - 120;
    const height = section.offsetHeight;
    if (top >= offset && top < offset + height) {
      current = "#" + section.id;
    }
  });

  navLinks.forEach((link) => {
    if (link.getAttribute("href") === current) link.classList.add("active");
    else link.classList.remove("active");
  });
}

window.addEventListener("scroll", setActiveLink);

// Scroll reveal
const revealEls = document.querySelectorAll(
  ".section, .hero-stats, .about-card, .project-card, .lab-terminal, .helper-layout, .contact-layout"
);
revealEls.forEach((el) => el.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

revealEls.forEach((el) => observer.observe(el));

// 3D tilt on cards
function attachTilt(selector) {
  const cards = document.querySelectorAll(selector);
  cards.forEach((card) => {
    card.classList.add("tilt");
    const strength = 14;

    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * strength;
      const rotateX = ((y / rect.height) - 0.5) * -strength;
      card.style.transform =
        `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.classList.add("tilt-hover");
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
      card.classList.remove("tilt-hover");
    });
  });
}

attachTilt(".project-card");
attachTilt(".term-window");
attachTilt(".lab-terminal");
attachTilt(".about-card");
attachTilt(".helper-card");
attachTilt(".contact-form");
attachTilt(".orbit-card");

// Game previews
const gameOutput = document.getElementById("game-output");
const gameCards = document.querySelectorAll(".run-game");

const gameScripts = {
  runner: [
    "arcade> open neon_runner",
    "[loading] drawing endless hallway...",
    "[tip] use arrows/WASD to dodge obstacles.",
    "[goal] survive until the timer hits zero."
  ],
  stack: [
    "arcade> open pixel_stack",
    "[loading] loading colorful blocks...",
    "[tip] tap when blocks line up for a perfect stack.",
    "[goal] build as high as you can before it collapses."
  ],
  chill: [
    "arcade> open space_idle",
    "[loading] spinning up tiny galaxy...",
    "[tip] click planets to earn stars over time.",
    "[goal] check in between homework questions."
  ],
  memory: [
    "arcade> open memory_match",
    "[loading] shuffling cards...",
    "[tip] remember where each icon is hiding.",
    "[goal] clear the board in the fewest flips."
  ]
};

gameCards.forEach((card) => {
  card.addEventListener("click", () => {
    const game = card.dataset.game;
    const lines = gameScripts[game] || [];

    document.body.classList.add("lab-launch");
    setTimeout(() => document.body.classList.remove("lab-launch"), 250);

    gameOutput.innerHTML = "";
    lines.forEach((line, i) => {
      setTimeout(() => {
        const div = document.createElement("div");
        div.className = "term-line";
        div.textContent = line;
        gameOutput.appendChild(div);
        gameOutput.scrollTop = gameOutput.scrollHeight;
      }, i * 320);
    });
  });
});

// Game filters
const filterButtons = document.querySelectorAll(".filter-btn");
const gamesGrid = document.getElementById("games-grid");
const allGames = gamesGrid.querySelectorAll(".project-card");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.filter;
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    allGames.forEach((card) => {
      const cardType = card.dataset.type;
      if (type === "all" || cardType === type) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// Homework helper: tasks
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");

function addTask(text) {
  if (!text.trim()) return;
  const li = document.createElement("li");
  li.className = "task-item";

  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = text;

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const doneBtn = document.createElement("button");
  doneBtn.className = "task-btn";
  doneBtn.textContent = "Done";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "task-btn";
  deleteBtn.textContent = "✕";

  doneBtn.addEventListener("click", () => {
    span.classList.toggle("completed");
  });

  deleteBtn.addEventListener("click", () => {
    li.remove();
  });

  actions.appendChild(doneBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(span);
  li.appendChild(actions);
  taskList.appendChild(li);
}

addTaskBtn.addEventListener("click", () => {
  addTask(taskInput.value);
  taskInput.value = "";
});

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask(taskInput.value);
    taskInput.value = "";
  }
});

// Homework helper: timer
const timerMinutes = document.getElementById("timer-minutes");
const timerDisplay = document.getElementById("timer-display");
const startTimerBtn = document.getElementById("start-timer");
const resetTimerBtn = document.getElementById("reset-timer");

let timerInterval = null;
let remainingSeconds = 0;

function updateTimerDisplay() {
  const mins = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const secs = String(remainingSeconds % 60).padStart(2, "0");
  timerDisplay.textContent = `${mins}:${secs}`;
}

startTimerBtn.addEventListener("click", () => {
  if (timerInterval) return;
  remainingSeconds = parseInt(timerMinutes.value, 10) * 60;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    remainingSeconds--;
    updateTimerDisplay();
    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      timerDisplay.textContent = "Done!";
    }
  }, 1000);
});

resetTimerBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
  remainingSeconds = 0;
  timerDisplay.textContent = "00:00";
});

// Homework helper: random tips
const tipsList = document.getElementById("tips-list");
const tips = [
  "Do one small homework task before opening another game.",
  "If something is confusing, write down the exact question to ask a teacher later.",
  "Set a 10‑minute timer, focus hard, then take a quick break.",
  "Keep all your assignments in one list so nothing gets lost.",
  "If you’re stuck, try explaining the problem out loud in your own words."
];

function showRandomTips() {
  tipsList.innerHTML = "";
  const shuffled = [...tips].sort(() => Math.random() - 0.5);
  shuffled.slice(0, 3).forEach((tip) => {
    const li = document.createElement("li");
    li.textContent = tip;
    tipsList.appendChild(li);
  });
}

showRandomTips();

// Fake contact form handler
const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  statusEl.textContent = "Sending...";
  setTimeout(() => {
    statusEl.textContent =
      "Thanks! This demo doesn’t actually send email, but your message was captured locally.";
    form.reset();
  }, 700);
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();
