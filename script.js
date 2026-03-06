// Custom cursor movement
const cursorDot = document.getElementById("cursor-dot");
const cursorRing = document.getElementById("cursor-ring");

window.addEventListener("pointermove", (e) => {
  const { clientX, clientY } = e;
  cursorDot.style.transform = `translate(${clientX}px, ${clientY}px)`;
  cursorRing.style.transform = `translate(${clientX}px, ${clientY}px)`;
});

// Theme toggle
const toggle = document.getElementById("theme-toggle");
const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
if (prefersLight) document.body.classList.add("light");

toggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
});

// Mobile nav
const navMenu = document.getElementById("nav-menu");
const navMobile = document.getElementById("nav-mobile");

navMenu.addEventListener("click", () => {
  const show = navMobile.style.display === "flex";
  navMobile.style.display = show ? "none" : "flex";
});

// Smooth scrolling for nav and hero buttons
function smoothScrollTo(targetId) {
  const el = document.querySelector(targetId);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 90;
  window.scrollTo({ top: y, behavior: "smooth" });
}

document.querySelectorAll(".nav-link, .scroll-link").forEach((link) => {
  const href = link.getAttribute("href");
  if (!href || !href.startsWith("#")) return;
  link.addEventListener("click", (e) => {
    e.preventDefault();
    smoothScrollTo(href);
    navMobile.style.display = "none";
  });
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
setActiveLink();

// Scroll reveal
const revealEls = document.querySelectorAll(
  ".section, .hero-card, .game-card, .game-viewer, .helper-card, .about-card, .contact-layout"
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

// 3D tilt
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

attachTilt(".hero-card");
attachTilt(".game-card");
attachTilt(".game-viewer");
attachTilt(".helper-card");
attachTilt(".about-card");
attachTilt(".contact-form");

// Game previews & embeds
const gameOutput = document.getElementById("game-output"); // not used now, but kept if you want text logs
const gameFrame = document.getElementById("game-frame");
const viewerTitle = document.getElementById("viewer-title");
const openNewTabBtn = document.getElementById("open-new-tab");
const gameCards = document.querySelectorAll(".run-game");

let currentGameUrl = null;

// Small description scripts for fun (not required)
const gameScripts = {
  runner: [
    "loading Neon Runner...",
    "tip: watch ahead, not at your feet.",
    "goal: reach the end before the bell rings."
  ],
  stack: [
    "loading Pixel Stack...",
    "tip: wait until blocks line up.",
    "goal: stack as high as you can."
  ],
  chill: [
    "loading Space Idle...",
    "tip: check upgrades between questions.",
    "goal: grow your galaxy slowly."
  ],
  memory: [
    "loading Memory Match...",
    "tip: remember positions in pairs.",
    "goal: clear the board in fewer moves."
  ]
};

gameCards.forEach((card) => {
  card.addEventListener("click", () => {
    const game = card.dataset.game;
    const url = card.dataset.url;
    currentGameUrl = url || null;

    document.body.classList.add("lab-launch");
    setTimeout(() => document.body.classList.remove("lab-launch"), 250);

    // Update viewer title
    const titleEl = card.querySelector("h3");
    viewerTitle.textContent = titleEl ? titleEl.textContent : "Game preview";

    // Embed game if URL exists
    if (url) {
      gameFrame.innerHTML = "";
      const iframe = document.createElement("iframe");
      iframe.src = url;
      gameFrame.appendChild(iframe);
      openNewTabBtn.disabled = false;
    } else {
      gameFrame.innerHTML =
        "<p class='viewer-placeholder'>No URL set for this game yet. Edit the HTML to add one.</p>";
      openNewTabBtn.disabled = true;
    }
  });
});

openNewTabBtn.addEventListener("click", () => {
  if (!currentGameUrl) return;
  window.open(currentGameUrl, "_blank");
});

// Game filters
const filterButtons = document.querySelectorAll(".filter-btn");
const gamesGrid = document.getElementById("games-grid");
const allGames = gamesGrid.querySelectorAll(".game-card");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.filter;
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    allGames.forEach((card) => {
      const cardType = card.dataset.type;
      card.style.display = type === "all" || cardType === type ? "" : "none";
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
  deleteBtn.textContent = "X";

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

// Homework helper: tips
const tipsList = document.getElementById("tips-list");
const tips = [
  "Do one small homework task before opening another game.",
  "If something is confusing, write down the exact question to ask a teacher later.",
  "Set a 10‑minute timer, focus hard, then take a short break.",
  "Keep all assignments in one list so nothing gets lost.",
  "If you are stuck, explain the problem out loud in your own words first."
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

// Homework helper: hint generator (no full answers)
const hwInput = document.getElementById("hw-input");
const hwHelpBtn = document.getElementById("hw-help");
const hwOutput = document.getElementById("hw-output");

function buildHints(question) {
  const q = question.trim();
  if (!q) return "Type a question or assignment first.";

  const lower = q.toLowerCase();
  let subject = "general";

  if (lower.includes("photosynthesis") || lower.includes("cell") || lower.includes("energy")) {
    subject = "science";
  } else if (lower.includes("fraction") || lower.includes("equation") || lower.includes("solve") || lower.includes("x =")) {
    subject = "math";
  } else if (lower.includes("essay") || lower.includes("paragraph") || lower.includes("write")) {
    subject = "writing";
  } else if (lower.includes("history") || lower.includes("revolution") || lower.includes("war")) {
    subject = "history";
  }

  const baseIntro =
    "Here are hints instead of the full answer. Use them to think it through yourself.\n";

  if (subject === "science") {
    return (
      baseIntro +
      "\n1. Identify what system or process is in the question (for example, a cycle or energy change)." +
      "\n2. List the inputs and outputs in your own words." +
      "\n3. Sketch a simple diagram with arrows showing what happens first, next, and last." +
      "\n4. Use your notes or textbook to check key terms, but do not copy sentences." +
      "\n5. Turn your diagram into 3–4 sentences that explain the process."
    );
  }

  if (subject === "math") {
    return (
      baseIntro +
      "\n1. Rewrite the problem clearly, with each step on its own line." +
      "\n2. Underline what the question is actually asking for (variable, length, total, etc.)." +
      "\n3. Decide which operations you need and in what order." +
      "\n4. Try one step and check if it makes the expression simpler; if not, try a different step." +
      "\n5. Plug your final answer back into the original problem to see if it works."
    );
  }

  if (subject === "writing") {
    return (
      baseIntro +
      "\n1. Rephrase the prompt in a simple sentence in your own words." +
      "\n2. List 3 short ideas that could be body paragraphs or main points." +
      "\n3. For each idea, write one example or detail from your notes." +
      "\n4. Turn your list into a paragraph: topic sentence, details, closing sentence." +
      "\n5. Read it once and fix any parts that sound confusing or off‑topic."
    );
  }

  if (subject === "history") {
    return (
      baseIntro +
      "\n1. Write down the time period and location the question focuses on." +
      "\n2. List the main people or groups involved." +
      "\n3. Put key events in order using numbers (1, 2, 3…)." +
      "\n4. For each event, note why it happened or what caused it." +
      "\n5. Answer in 3 parts: what happened, why it happened, and what changed because of it."
    );
  }

  return (
    baseIntro +
    "\n1. Rephrase the question in one simple sentence." +
    "\n2. Highlight 3–5 important words from the question." +
    "\n3. For each word, write a short definition using your notes." +
    "\n4. Use those definitions to build a 3–4 sentence answer in your own voice." +
    "\n5. Check that your answer responds to every part of the original question."
  );
}

hwHelpBtn.addEventListener("click", () => {
  hwOutput.textContent = buildHints(hwInput.value);
});

// Fake contact form handler
const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  statusEl.textContent = "Sending...";
  setTimeout(() => {
    statusEl.textContent =
      "Thanks! This demo does not actually send email, but your message was captured locally.";
    form.reset();
  }, 700);
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();
