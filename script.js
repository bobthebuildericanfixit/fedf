// ===== Custom cursor =====
const cursorDot = document.getElementById("cursor-dot");
const cursorRing = document.getElementById("cursor-ring");

window.addEventListener("pointermove", (e) => {
  const { clientX, clientY } = e;
  if (cursorDot) cursorDot.style.transform = `translate(${clientX}px, ${clientY}px)`;
  if (cursorRing) cursorRing.style.transform = `translate(${clientX}px, ${clientY}px)`;
});

// ===== Mobile nav =====
const navMenu = document.getElementById("nav-menu");
const navMobile = document.getElementById("nav-mobile");

if (navMenu && navMobile) {
  navMenu.addEventListener("click", () => {
    const show = navMobile.style.display === "flex";
    navMobile.style.display = show ? "none" : "flex";
  });
}

// ===== Smooth scroll =====
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

// ===== Active nav on scroll =====
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

// ===== Scroll reveal =====
const revealEls = document.querySelectorAll(
  ".section, .hero-card, .game-card, .game-viewer, .helper-card, .about-card, .contact-layout, .featured-game, .idea-card"
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

// ===== Game data (rating, plays, categories, videos) =====
const gamesData = [
  {
    id: "runner",
    title: "Neon Runner",
    description: "Fast endless runner—dodge obstacles and beat the clock.",
    url: "https://example.com/games/neon-runner",
    categories: ["arcade"],
    tags: ["Arcade", "Reflex"],
    rating: 4.7,
    plays: 12540,
    thumbnailClass: "game-thumb-1",
    previewVideo: "https://example.com/previews/neon-runner.mp4"
  },
  {
    id: "stack",
    title: "Pixel Stack",
    description: "Time your drops to build a perfectly stacked tower.",
    url: "https://example.com/games/pixel-stack",
    categories: ["puzzle"],
    tags: ["Puzzle", "Timing"],
    rating: 4.3,
    plays: 8420,
    thumbnailClass: "game-thumb-2",
    previewVideo: "https://example.com/previews/pixel-stack.mp4"
  },
  {
    id: "chill",
    title: "Space Idle",
    description: "Idle galaxy builder you can check between homework tasks.",
    url: "https://example.com/games/space-idle",
    categories: ["chill"],
    tags: ["Chill", "Idle"],
    rating: 4.5,
    plays: 9650,
    thumbnailClass: "game-thumb-3",
    previewVideo: "https://example.com/previews/space-idle.mp4"
  },
  {
    id: "memory",
    title: "Memory Match",
    description: "Flip cards, track positions, and beat your last score.",
    url: "https://example.com/games/memory-match",
    categories: ["puzzle"],
    tags: ["Puzzle", "Memory"],
    rating: 4.1,
    plays: 6780,
    thumbnailClass: "game-thumb-4",
    previewVideo: "https://example.com/previews/memory-match.mp4"
  }
  // Add more games here as you build them out
];

const gamesGrid = document.getElementById("games-grid");
const gameSearchInput = document.getElementById("game-search");
const filterButtons = document.querySelectorAll(".filter-btn");

let currentFilter = "all";
let currentSearch = "";
let currentGameUrl = null;

// ===== Render games =====
function formatPlays(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M plays";
  if (n >= 1_000) return Math.round(n / 100) / 10 + "k plays";
  return n + " plays";
}

function renderStars(rating) {
  const fullStars = Math.round(rating);
  const maxStars = 5;
  let stars = "";
  for (let i = 0; i < maxStars; i++) {
    stars += i < fullStars ? "★" : "☆";
  }
  return stars;
}

function matchesFilter(game) {
  if (currentFilter === "all") return true;
  return game.categories.includes(currentFilter);
}

function matchesSearch(game) {
  if (!currentSearch) return true;
  return game.title.toLowerCase().includes(currentSearch);
}

function renderGames() {
  if (!gamesGrid) return;
  gamesGrid.innerHTML = "";

  const toShow = gamesData.filter((g) => matchesFilter(g) && matchesSearch(g));

  toShow.forEach((game) => {
    const card = document.createElement("article");
    card.className = "game-card";
    card.dataset.gameId = game.id;

    card.innerHTML = `
      <div class="game-thumb-wrapper">
        <div class="game-thumb ${game.thumbnailClass}"></div>
        <video class="game-preview-video" muted loop preload="none">
          <source src="${game.previewVideo}" type="video/mp4" />
        </video>
      </div>
      <div class="game-info">
        <h3>${game.title}</h3>
        <p>${game.description}</p>
        <div class="game-meta">
          <div class="game-rating">
            <span class="game-stars">${renderStars(game.rating)}</span>
            <span>${game.rating.toFixed(1)}</span>
          </div>
          <div class="game-plays">${formatPlays(game.plays)}</div>
        </div>
        <div class="game-tags">
          ${game.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
        </div>
      </div>
    `;

    attachGameCardEvents(card, game);
    gamesGrid.appendChild(card);
  });
}

renderGames();

// ===== Filters =====
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.filter;
    currentFilter = type || "all";
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderGames();
  });
});

// ===== Search =====
if (gameSearchInput) {
  gameSearchInput.addEventListener("input", () => {
    currentSearch = gameSearchInput.value.trim().toLowerCase();
    renderGames();
  });
}

// ===== Viewer & fullscreen =====
const gameFrame = document.getElementById("game-frame");
const viewerTitle = document.getElementById("viewer-title");
const openNewTabBtn = document.getElementById("open-new-tab");
const fullscreenBtn = document.getElementById("fullscreen-game");

function loadGameInViewer(game) {
  if (!gameFrame || !viewerTitle || !openNewTabBtn || !fullscreenBtn) return;

  document.body.classList.add("lab-launch");
  setTimeout(() => document.body.classList.remove("lab-launch"), 250);

  viewerTitle.textContent = game.title;
  currentGameUrl = game.url;

  gameFrame.innerHTML = "";
  const iframe = document.createElement("iframe");
  iframe.src = game.url;
  iframe.setAttribute("allowfullscreen", "true");
  gameFrame.appendChild(iframe);

  openNewTabBtn.disabled = false;
  fullscreenBtn.disabled = false;

  // Fake: bump play count locally
  game.plays += 1;
  renderGames();
}

// Attach click + hover video to each card
function attachGameCardEvents(card, game) {
  // click to load viewer
  card.addEventListener("click", () => {
    loadGameInViewer(game);
  });

  // preview video on hover (desktop)
  const thumb = card.querySelector(".game-thumb");
  const video = card.querySelector(".game-preview-video");
  if (!thumb || !video) return;

  card.addEventListener("mouseenter", () => {
    video.style.display = "block";
    thumb.style.display = "none";
    if (video.readyState >= 2) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  });

  card.addEventListener("mouseleave", () => {
    video.pause();
    video.style.display = "none";
    thumb.style.display = "block";
  });
}

if (openNewTabBtn) {
  openNewTabBtn.addEventListener("click", () => {
    if (!currentGameUrl) return;
    window.open(currentGameUrl, "_blank");
  });
}

if (fullscreenBtn) {
  fullscreenBtn.addEventListener("click", () => {
    if (!gameFrame) return;
    const iframe = gameFrame.querySelector("iframe");
    if (!iframe || !iframe.requestFullscreen) return;

    iframe.requestFullscreen().then(() => {
      const hint = document.createElement("div");
      hint.className = "fullscreen-hint";
      hint.textContent = "Press Esc to exit full screen";
      document.body.appendChild(hint);
      setTimeout(() => hint.remove(), 2500);
    }).catch(() => {});
  });
}

// ===== Featured "Play now" button =====
const playFeaturedBtn = document.getElementById("play-featured");
if (playFeaturedBtn) {
  playFeaturedBtn.addEventListener("click", () => {
    const featured = gamesData[0];
    if (!featured) return;
    smoothScrollTo("#games");
    loadGameInViewer(featured);
  });
}

// ===== Popular chips (optional: if you add them in HTML) =====
document.querySelectorAll(".games-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    const name = chip.textContent.trim().toLowerCase();
    const game = gamesData.find((g) => g.title.toLowerCase() === name);
    if (!game) return;
    smoothScrollTo("#games");
    loadGameInViewer(game);
  });
});

// ===== Homework helper: tasks =====
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

// ===== Homework helper: timer + streak =====
const timerMinutes = document.getElementById("timer-minutes");
const timerDisplay = document.getElementById("timer-display");
const startTimerBtn = document.getElementById("start-timer");
const resetTimerBtn = document.getElementById("reset-timer");
const streakCounter = document.getElementById("streak-counter");

let timerInterval = null;
let remainingSeconds = 0;
let streak = 0;

if (timerMinutes && timerDisplay && startTimerBtn && resetTimerBtn && streakCounter) {
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
        streak++;
        streakCounter.textContent = `Streak: ${streak}`;
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

// ===== Homework helper: tips =====
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

// ===== Hint helper (pseudo‑AI) =====
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

// ===== Ideas voting =====
const ideaButtons = document.querySelectorAll(".idea-vote");
const ideasTotalEl = document.getElementById("ideas-total");
const topIdeaEl = document.getElementById("top-idea");
const ideaVotes = {};
let totalVotes = 0;

ideaButtons.forEach((btn) => {
  const key = btn.dataset.idea;
  ideaVotes[key] = 0;

  btn.addEventListener("click", () => {
    ideaVotes[key]++;
    totalVotes++;

    btn.textContent = `+1 Vote (${ideaVotes[key]})`;

    let best = "None yet";
    let bestVotes = 0;
    Object.entries(ideaVotes).forEach(([k, v]) => {
      if (v > bestVotes) {
        bestVotes = v;
        best = btn.closest(".ideas-grid")
          ? document.querySelector(`.idea-vote[data-idea="${k}"]`)
              ?.parentElement.querySelector("h3")?.textContent || k
          : k;
      }
    });

    if (ideasTotalEl && topIdeaEl) {
      topIdeaEl.textContent = best;
      ideasTotalEl.firstChild.textContent = `Total votes: ${totalVotes} | Most popular: `;
    }
  });
});

// ===== Fake contact form =====
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

// ===== Footer year =====
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
