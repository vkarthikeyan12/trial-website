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
