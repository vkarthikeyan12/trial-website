(function () {
  const el = document.getElementById("hero-terminal");
  if (!el) return;

  const name = el.dataset.name || "";
  const title = el.dataset.title || "";
  const bio = el.dataset.bio || "";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Static fallback (also used as the accessible end-state) -------------
  function renderStatic() {
    el.innerHTML = `
      <p class="line"><span class="prompt">whoami</span></p>
      <p class="name-out">${name}</p>
      <p class="title-out">${title}</p>
      <p class="line"><span class="prompt">cat profile.txt</span></p>
      <p class="out">${bio}</p>
      <p class="line"><span class="prompt"></span><span class="cursor-block"></span></p>
    `;
  }

  if (prefersReducedMotion) {
    renderStatic();
    return;
  }

  // Typewriter sequence ---------------------------------------------------
  el.innerHTML = "";

  const lineEl = document.createElement("p");
  lineEl.className = "line";
  const promptSpan = document.createElement("span");
  promptSpan.className = "prompt";
  lineEl.appendChild(promptSpan);
  el.appendChild(lineEl);

  function typeInto(target, text, speed, done) {
    let i = 0;
    (function step() {
      if (i <= text.length) {
        target.textContent = text.slice(0, i);
        i++;
        setTimeout(step, speed);
      } else if (done) {
        done();
      }
    })();
  }

  function pause(ms, cb) {
    setTimeout(cb, ms);
  }

  function addStatic(html) {
    const p = document.createElement("p");
    p.innerHTML = html;
    el.appendChild(p);
    return p;
  }

  typeInto(promptSpan, "whoami", 55, function () {
    pause(300, function () {
      const nameP = addStatic("");
      nameP.className = "name-out";
      typeInto(nameP, name, 30, function () {
        const titleP = addStatic("");
        titleP.className = "title-out";
        typeInto(titleP, title, 22, function () {
          pause(400, function () {
            const line2 = document.createElement("p");
            line2.className = "line";
            const prompt2 = document.createElement("span");
            prompt2.className = "prompt";
            line2.appendChild(prompt2);
            el.appendChild(line2);

            typeInto(prompt2, "cat profile.txt", 45, function () {
              pause(250, function () {
                const bioP = addStatic("");
                bioP.className = "out";
                typeInto(bioP, bio, 8, function () {
                  const cursorLine = document.createElement("p");
                  cursorLine.className = "line";
                  const finalPrompt = document.createElement("span");
                  finalPrompt.className = "prompt";
                  const cursor = document.createElement("span");
                  cursor.className = "cursor-block";
                  cursorLine.appendChild(finalPrompt);
                  cursorLine.appendChild(cursor);
                  el.appendChild(cursorLine);
                });
              });
            });
          });
        });
      });
    });
  });
})();

/* ---------------------------------------------------------------------
   3D tilt-on-hover for cards and the terminal window
--------------------------------------------------------------------- */
(function () {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) return;
  if (window.matchMedia("(hover: none)").matches) return; // skip on touch

  const targets = document.querySelectorAll(".tilt-card, .terminal");

  targets.forEach(function (el) {
    let raf = null;

    function onMove(e) {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width; // 0..1
      const py = (e.clientY - rect.top) / rect.height; // 0..1

      const maxTilt = el.classList.contains("terminal") ? 4 : 6;
      const rotateY = (px - 0.5) * maxTilt * 2;
      const rotateX = (0.5 - py) * maxTilt * 2;

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        el.style.transform =
          "perspective(900px) rotateX(" +
          rotateX.toFixed(2) +
          "deg) rotateY(" +
          rotateY.toFixed(2) +
          "deg) translateZ(0)";
        el.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
        el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      });
    }

    function onLeave() {
      if (raf) cancelAnimationFrame(raf);
      el.style.transform =
        "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)";
    }

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
  });
})();

/* ---------------------------------------------------------------------
   Occasional glitch flicker on the nav brand — subtle, not seizure-triggering
--------------------------------------------------------------------- */
(function () {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) return;

  const el = document.querySelector("[data-glitch]");
  if (!el) return;

  function glitchOnce() {
    el.classList.add("glitching");
    setTimeout(function () {
      el.classList.remove("glitching");
    }, 220);
  }

  function schedule() {
    const delay = 4000 + Math.random() * 6000;
    setTimeout(function () {
      glitchOnce();
      schedule();
    }, delay);
  }
  schedule();
})();

/* ---------------------------------------------------------------------
   Reveal-on-scroll for sections
--------------------------------------------------------------------- */
(function () {
  const sections = document.querySelectorAll(".section");
  if (!sections.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  sections.forEach(function (s) {
    observer.observe(s);
  });
})();
