// Custom cursor movement
const cursorDot = document.getElementById("cursor-dot");
const cursorRing = document.getElementById("cursor-ring");

window.addEventListener("pointermove", (e) => {
  const { clientX, clientY } = e;
  if (cursorDot) cursorDot.style.transform = `translate(${clientX}px, ${clientY}px)`;
  if (cursorRing) cursorRing.style.transform = `translate(${clientX}px, ${clientY}px)`;
});

// Theme toggle with persistent setting
const themeToggleBtn = document.getElementById("theme-toggle");

function getPreferredTheme() {
  const stored = localStorage.getItem("king-theme");
  if (stored === "light" || stored === "dark") return stored;

  const prefersDark = window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

function applyTheme(theme) {
  document.body.classList.remove("theme-dark", "theme-light");
  document.body.classList.add(theme === "dark" ? "theme-dark" : "theme-light");
}

// initialize theme
const initialTheme = getPreferredTheme();
applyTheme(initialTheme);

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const current = document.body.classList.contains("theme-dark") ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("king-theme", next);
  });
}

// Accent color customization
const accentButtons = document.querySelectorAll(".accent-swatch");

function setAccent(color) {
  // base accent
  document.documentElement.style.setProperty("--accent", color);
  // soft accent with alpha; if browser does not support this hex+alpha,
  // you can replace it with a fixed rgba in the CSS
  document.documentElement.style.setProperty("--accent-soft", color + "40");
  localStorage.setItem("king-accent", color);
}

// load stored accent
const savedAccent = localStorage.getItem("king-accent");
if (savedAccent) {
  setAccent(savedAccent);
}

accentButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const color = btn.dataset.accent;
    if (color) setAccent(color);
  });
});

// Mobile nav
const navMenu = document.getElementById("nav-menu");
const navMobile = document.getElementById("nav-mobile");

if (navMenu && navMobile) {
  navMenu.addEventListener("click", () => {
    const show = navMobile.style.display === "flex";
    navMobile.style.display = show ? "none" : "flex";
  });
}

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
    if (navMobile) navMobile.style.display = "none";
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
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    if (href === current) link.classList.add("active");
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
const gameFrame = document.getElementById("game-frame");
const viewerTitle = document.getElementById("viewer-title");
const openNewTabBtn = document.getElementById("open-new-tab");
const gameCards = document.querySelectorAll(".run-game");

let currentGameUrl = null;

if (gameFrame && viewerTitle && openNewTabBtn && gameCards.length) {
  gameCards.forEach((card) => {
    card.addEventListener("click", () => {
      const url = card.dataset.url;
      currentGameUrl = url || null;

      document.body.classList.add("lab-launch");
      setTimeout(() => document.body.classList.remove("lab-launch"), 250);

      const titleEl = card.querySelector("h3");
      viewerTitle.textContent = titleEl ? titleEl.textContent : "Game preview";

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
}

// Game filters
const filterButtons = document.querySelectorAll(".filter-btn");
const gamesGrid = document.getElementById("games-grid");
if (gamesGrid && filterButtons.length) {
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
}

// Homework helper: tasks
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");

if (taskInput && addTaskBtn && taskList) {
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
}

// Homework helper: timer
const timerMinutes = document.getElementById("timer-minutes");
const timerDisplay = document.getElementById("timer-display");
const startTimerBtn = document.getElementById("start-timer");
const resetTimerBtn = document.getElementById("reset-timer");

let timerInterval = null;
let remainingSeconds = 0;

if (timerMinutes && timerDisplay && startTimerBtn && resetTimerBtn) {
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
}

// Homework helper: tips
const tipsList = document.getElementById("tips-list");
if (tipsList) {
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
}

// Hint helper (pseudo‑AI)
const hwInput = document.getElementById("hw-input");
const hwHelpBtn = document.getElementById("hw-help");
const hwOutput = document.getElementById("hw-output");

if (hwInput && hwHelpBtn && hwOutput) {
  function buildHints(question) {
    const q = question.trim();
    if (!q) return "Type or paste a question first, then click \"Get hints\".";

    let response = "You asked:\n\"" + q + "\"\n\n";

    const lower = q.toLowerCase();

    const words = lower
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3);
    const unique = [...new Set(words)].slice(0, 6);

    if (unique.length) {
      response += "Key ideas I see: " + unique.join(", ") + ".\n\n";
    }

    let subject = "general";
    if (/(photosynthesis|cell|respiration|atom|energy|ecosystem)/.test(lower)) subject = "science";
    else if (/(fraction|equation|solve|graph|function|slope|algebra|integer)/.test(lower)) subject = "math";
    else if (/(essay|paragraph|thesis|analyze|compare|contrast|theme)/.test(lower)) subject = "writing";
    else if (/(history|revolution|war|empire|civil|treaty|independence)/.test(lower)) subject = "history";

    const baseIntro =
      "Here are structured hints, not a finished answer. Use them as a checklist while you work:\n";

    if (subject === "science") {
      response +=
        baseIntro +
        "\n1. Vocabulary pass: underline any science terms (process names, parts, units). Look each up in your notes and write a one‑line meaning." +
        "\n2. Inputs and outputs: list what goes in and what comes out of the process or system in the question." +
        "\n3. Sequence: write the steps in order using bullets (first, next, then, finally)." +
        "\n4. Why it matters: add one sentence on why this process matters in the body or environment." +
        "\n5. Answer build: combine your bullets into 3–5 sentences in your own words. If it sounds like the book, rewrite it.";
      return response;
    }

    if (subject === "math") {
      response +=
        baseIntro +
        "\n1. Rewrite the problem clearly, leaving space between lines. Circle what you are solving for." +
        "\n2. Decide the type: are you simplifying, solving for a variable, graphing, or comparing two things?" +
        "\n3. List what is given (numbers, equations, diagrams) and what is missing. This keeps you from guessing." +
        "\n4. Do one move that makes the expression simpler (combine like terms, isolate a fraction, move terms)." +
        "\n5. After you get a candidate answer, plug it back into the original problem to check if it works. If not, find the step that broke.";
      return response;
    }

    if (subject === "writing") {
      response +=
        baseIntro +
        "\n1. Rephrase the prompt in one sentence. Make sure the main verb (explain, argue, compare) is in your sentence." +
        "\n2. Brain dump 5 quick bullet ideas that could answer the prompt. Then keep the best 3." +
        "\n3. For each of the 3, add one piece of evidence (quote, fact, or example) from your text or notes." +
        "\n4. Turn each idea into a paragraph: topic sentence, evidence, and one sentence linking it back to the prompt." +
        "\n5. Do a focus check: cross out any sentence that is not actually helping answer the question.";
      return response;
    }

    if (subject === "history") {
      response +=
        baseIntro +
        "\n1. Time and place: write the decade/century and region the question is about." +
        "\n2. People and groups: list who is involved and what each side wanted." +
        "\n3. Build a mini‑timeline of 3–5 key events in order." +
        "\n4. For each event, jot one cause and one effect." +
        "\n5. Use your timeline to write a paragraph explaining what happened, why it happened, and what changed afterward.";
      return response;
    }

    response +=
      baseIntro +
      "\n1. Rewrite the question in a simpler sentence using your own words." +
      "\n2. Highlight 3–5 important words and write what each means in this context." +
      "\n3. Decide what the question wants you to do: explain, compare, list, argue, calculate, etc." +
      "\n4. Outline your answer with 3–4 bullets, each bullet handling one part of the question." +
      "\n5. Turn your outline into full sentences, then read once and check if you covered every part of the prompt.";
    return response;
  }

  hwHelpBtn.addEventListener("click", () => {
    hwOutput.textContent = buildHints(hwInput.value);
  });
}

// Fake contact form handler
const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");

if (form && statusEl) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    statusEl.textContent = "Sending...";
    setTimeout(() => {
      statusEl.textContent =
        "Thanks. This demo does not actually send email, but your message was captured locally.";
      form.reset();
    }, 700);
  });
}

// Footer year
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
