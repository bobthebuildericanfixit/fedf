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
  ".section, .hero-stats, .about-card, .feature-card, .project-card, .lab-terminal, .docs-layout, .contact-layout"
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
attachTilt(".feature-card");
attachTilt(".about-card");
attachTilt(".term-window");
attachTilt(".lab-terminal");
attachTilt(".orbit-card");
attachTilt(".contact-form");

// Lab demos
const labOutput = document.getElementById("lab-output");
const labCards = document.querySelectorAll(".run-lab");

const labScripts = {
  echo: [
    "C:\\User> run echo --text \"Hello, Googuardiaan\"",
    "[parser] command: echo",
    "[parser] flag: --text",
    "[exec] output: Hello, Googuardiaan"
  ],
  branch: [
    "C:\\User> run branch --mode safe",
    "[input] mode = safe",
    "[branch] taking safe path...",
    "[exec] sandbox enabled, no real files touched"
  ],
  logs: [
    "C:\\User> run logs --source sample.txt",
    "[io] reading 32 lines...",
    "[analysis] 3 unique commands detected",
    "[task] guess the missing flags"
  ],
  disasm: [
    "C:\\User> run disasm --file demo.bin",
    "[loader] reading pseudo ops...",
    "[view] jmp -> while loop",
    "[tip] map low-level steps back to if/else"
  ]
};

labCards.forEach((card) => {
  card.addEventListener("click", () => {
    const lab = card.dataset.lab;
    const lines = labScripts[lab] || [];

    // Background flash to feel like launching a game
    document.body.classList.add("lab-launch");
    setTimeout(() => document.body.classList.remove("lab-launch"), 250);

    labOutput.innerHTML = "";
    lines.forEach((line, i) => {
      setTimeout(() => {
        const div = document.createElement("div");
        div.className = "term-line";
        div.textContent = line;
        labOutput.appendChild(div);
        labOutput.scrollTop = labOutput.scrollHeight;
      }, i * 320);
    });
  });
});

// Docs tabs
const docButtons = document.querySelectorAll(".docs-link");
const docPanels = document.querySelectorAll(".doc-panel");

docButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.doc;
    docButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    docPanels.forEach((panel) => {
      panel.classList.toggle("active", panel.id === `doc-${id}`);
    });
  });
});

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
