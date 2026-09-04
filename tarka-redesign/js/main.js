/* ============================================================
   TARKA — interaction layer
   Vanilla JS + GSAP/ScrollTrigger only, per spec.
   ============================================================ */
(function(){
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     CUSTOM CURSOR
  --------------------------------------------------------- */
  const cursor = document.getElementById("cursor");
  const cursorLabel = document.getElementById("cursorLabel");
  if (cursor && !reduceMotion && matchMedia("(hover:hover)").matches) {
    let mx = 0, my = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });
    (function loop(){
      cx += (mx - cx) * 0.22;
      cy += (my - cy) * 0.22;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();

    document.querySelectorAll("[data-cursor]").forEach(el => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("is-active");
        cursorLabel.textContent = el.getAttribute("data-cursor");
      });
      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("is-active");
        cursorLabel.textContent = "";
      });
    });
  } else if (cursor) {
    cursor.style.display = "none";
  }

  /* ---------------------------------------------------------
     MOBILE NAV
  --------------------------------------------------------- */
  const burger = document.getElementById("navBurger");
  const mobileMenu = document.getElementById("mobileMenu");
  burger.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });
  mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    mobileMenu.classList.remove("is-open");
  }));

  /* ---------------------------------------------------------
     HERO — signature changing-word tagline
  --------------------------------------------------------- */
  (function heroWord(){
    const el = document.getElementById("heroWord");
    let i = 0;

    function setWidth(word){
      // measure width via hidden clone so the stage never jumps
      const probe = document.createElement("span");
      probe.style.visibility = "hidden";
      probe.style.position = "absolute";
      probe.style.whiteSpace = "nowrap";
      probe.style.font = getComputedStyle(el).font;
      probe.textContent = word;
      document.body.appendChild(probe);
      const w = probe.getBoundingClientRect().width;
      document.body.removeChild(probe);
      return w;
    }

    function cycle(){
      const next = HERO_WORDS[(i + 1) % HERO_WORDS.length];
      const targetWidth = setWidth(next);

      if (reduceMotion || !window.gsap) {
        el.textContent = next;
        i = (i + 1) % HERO_WORDS.length;
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => { i = (i + 1) % HERO_WORDS.length; }
      });
      tl.to(el, { width: targetWidth, duration: 0.35, ease: "power3.inOut" }, 0)
        .to(el, { yPercent: -110, opacity: 0, duration: 0.32, ease: "power3.in" }, 0)
        .add(() => { el.textContent = next; })
        .fromTo(el, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.42, ease: "power3.out" });
    }

    // set initial fixed-ish width so first paint is stable
    el.style.display = "inline-block";
    el.style.width = setWidth(el.textContent) + "px";

    setInterval(cycle, 2200);
  })();

  /* ---------------------------------------------------------
     PORTFOLIO LIST
  --------------------------------------------------------- */
  const portfolioList = document.getElementById("portfolioList");
  function renderProjects(list){
    portfolioList.innerHTML = "";
    list.forEach((p, idx) => {
      const row = document.createElement("article");
      row.className = "project reveal" + (idx % 2 === 1 ? " project--reverse" : "");
      row.dataset.id = p.id;

      // Single media container for both states so the layout can never diverge.
      // The gradient plate always renders as the base layer; a real <img> is
      // layered on top only when a valid path is supplied, and quietly falls
      // back to the plate underneath if that image fails to load.
      const hasImage = Boolean(p.image && p.image.trim() !== "");
      const imgMarkup = hasImage
        ? `<img class="project__media-img" src="${p.image}" alt="${p.title} — ${p.category} project" loading="lazy" onerror="this.style.display='none';">`
        : "";

      row.innerHTML = `
        <div class="project__media">
          <div class="project__media-plate" aria-hidden="true"></div>
          ${imgMarkup}
          <span class="project__media-tag">${p.category} — ${p.year}</span>
        </div>
        <div class="project__content">
          <span class="project__num">${p.num}</span>
          <div class="project__title-wrap"><h3 class="project__title">${p.title}</h3></div>
          <p class="project__meta">${p.category} · ${p.year}</p>
          <p class="project__summary">${p.summary}</p>
          <span class="project__link">View project <span class="project__link-arrow">→</span></span>
        </div>
      `;
      row.addEventListener("click", () => openCase(p.id));
      portfolioList.appendChild(row);
    });
    initReveal();
  }
  renderProjects(PROJECTS);

  /* ---------------------------------------------------------
     SERVICES
  --------------------------------------------------------- */
  const serviceGrid = document.getElementById("serviceGrid");
  const serviceDetail = document.getElementById("serviceDetail");
  const serviceDetailInner = document.getElementById("serviceDetailInner");
  const serviceDetailClose = document.getElementById("serviceDetailClose");

  SERVICES.forEach(s => {
    const card = document.createElement("button");
    card.className = "service-card";
    card.dataset.id = s.id;
    card.innerHTML = `
      <span class="service-card__tag">${s.tag}</span>
      <div>
        <h3 class="service-card__title">${s.title}</h3>
        <p class="service-card__blurb">${s.blurb}</p>
      </div>
    `;
    card.addEventListener("click", () => openService(s.id));
    serviceGrid.appendChild(card);
  });

  function openService(id){
    const s = SERVICES.find(x => x.id === id);
    const related = PROJECTS.filter(p => s.projectTags.some(t => p.tags.includes(t)));
    document.querySelectorAll(".service-card").forEach(c => c.classList.toggle("is-active", c.dataset.id === id));

    serviceDetailInner.innerHTML = `
      <p class="sd__title-tag" style="font-family:var(--font-mono);font-size:12px;color:var(--green-deep);margin:0 0 10px;">${s.tag} — Service</p>
      <h3 class="sd__title">${s.title}</h3>
      <p class="sd__blurb">${s.blurb}</p>
      <div class="sd__process">${s.process.map(step => `<span>${step}</span>`).join("")}</div>
      <div class="sd__projects">
        ${related.map(p => `
          <div class="sd__project" data-id="${p.id}">
            <em>${p.category} — ${p.year}</em>
            <strong>${p.title}</strong>
          </div>`).join("") || "<p style='opacity:.6'>New work in this discipline is coming soon.</p>"}
      </div>
    `;
    serviceDetail.hidden = false;
    serviceDetailInner.querySelectorAll(".sd__project").forEach(el => {
      el.addEventListener("click", () => openCase(el.dataset.id));
    });
    serviceDetail.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }
  serviceDetailClose.addEventListener("click", () => {
    serviceDetail.hidden = true;
    document.querySelectorAll(".service-card").forEach(c => c.classList.remove("is-active"));
  });

  /* ---------------------------------------------------------
     SYSTEM — interactive word field
  --------------------------------------------------------- */
  const SYSTEM_WORDS = ["IDEA", "PRODUCT", "APP", "BRAND", "SYSTEM", "EXPERIENCE", "DIGITAL", "VIDEO", "INTERFACE", "OBJECT"];
  const positions = [
    [8,18],[78,12],[14,72],[85,68],[46,10],
    [6,46],[92,42],[40,86],[64,30],[58,78]
  ];
  const wordField = document.getElementById("systemWordField");
  SYSTEM_WORDS.forEach((w, idx) => {
    const el = document.createElement("span");
    el.className = "system-word";
    el.textContent = w;
    const [x,y] = positions[idx % positions.length];
    el.style.left = x + "%";
    el.style.top = y + "%";
    el.addEventListener("mouseenter", () => {
      if (reduceMotion || !window.gsap) return;
      gsap.fromTo(el, { scale: 1 }, { scale: 1.08, duration: .25, ease: "power2.out", yoyo:true, repeat:1 });
    });
    wordField.appendChild(el);
  });

  /* ---------------------------------------------------------
     CLIENTS MARQUEE
  --------------------------------------------------------- */
  function fillMarquee(el, words){
    const set = [...words, ...words]; // duplicate for seamless loop
    el.innerHTML = set.map(w => `<span>${w}</span>`).join("");
  }
  fillMarquee(document.getElementById("marquee1"), CLIENTS_ROW_1);
  fillMarquee(document.getElementById("marquee2"), CLIENTS_ROW_2);

  /* ---------------------------------------------------------
     THINKING LIST
  --------------------------------------------------------- */
  const thinkingList = document.getElementById("thinkingList");
  THINKING.forEach(t => {
    const row = document.createElement("div");
    row.className = "thinking-item reveal";
    row.innerHTML = `<h3 class="thinking-item__title">${t.title}</h3><span class="thinking-item__tag">${t.tag}</span>`;
    thinkingList.appendChild(row);
  });

  /* ---------------------------------------------------------
     STUDIO COLLAGE
  --------------------------------------------------------- */
  const studioCollage = document.getElementById("studioCollage");
  for (let i = 0; i < 7; i++){
    const tile = document.createElement("div");
    tile.className = "studio-tile reveal";
    studioCollage.appendChild(tile);
  }

  /* ---------------------------------------------------------
     SCROLL REVEAL
  --------------------------------------------------------- */
  function initReveal(){
    document.querySelectorAll(".reveal").forEach(el => {
      if (el.dataset.revealBound) return;
      el.dataset.revealBound = "1";
      if (!window.ScrollTrigger || reduceMotion) { el.classList.add("is-visible"); return; }
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => el.classList.add("is-visible")
      });
    });
  }
  document.querySelectorAll(".block__fragment, .founder, .thinking-item, .studio-tile, .service-card").forEach(el => el.classList.add("reveal"));
  initReveal();

  /* ---------------------------------------------------------
     NEW PRODUCT NOTIFICATION
  --------------------------------------------------------- */
  const notify = document.getElementById("notifyChip");
  let notifyShown = false;
  window.addEventListener("scroll", () => {
    if (notifyShown) return;
    if (window.scrollY > window.innerHeight * 1.2) {
      notify.classList.add("is-visible");
      notifyShown = true;
    }
  }, { passive: true });
  notify.addEventListener("click", () => openService("ai-video"));

  /* ---------------------------------------------------------
     CASE STUDY OVERLAY
  --------------------------------------------------------- */
  const caseOverlay = document.getElementById("caseOverlay");
  const caseScroll = document.getElementById("caseScroll");
  const caseClose = document.getElementById("caseClose");

  function openCase(id){
    const p = PROJECTS.find(x => x.id === id);
    if (!p) return;
    caseScroll.innerHTML = `
      <div class="case__hero-plate"></div>
      <p class="case__eyebrow">${p.category}</p>
      <h1 class="case__title">${p.title}</h1>
      <p class="case__meta">${p.category} — ${p.year}</p>
      <div class="case__section"><h3>Overview</h3><p>${p.summary}</p></div>
      <div class="case__section"><h3>The challenge</h3><p>${p.challenge}</p></div>
      <div class="case__section"><h3>Our approach</h3><p>${p.approach}</p></div>
      <div class="case__section"><h3>Outcome</h3><p>${p.outcome}</p></div>
    `;
    caseOverlay.classList.add("is-open");
    caseOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    caseScroll.scrollTop = 0;
  }
  function closeCase(){
    caseOverlay.classList.remove("is-open");
    caseOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  caseClose.addEventListener("click", closeCase);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeCase(); });

  /* ---------------------------------------------------------
     NAV — hide-on-scroll-down / show-on-scroll-up
  --------------------------------------------------------- */
  const nav = document.getElementById("nav");
  let lastY = 0;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (y > lastY && y > 200) nav.style.transform = "translateY(-110%)";
    else nav.style.transform = "translateY(0)";
    lastY = y;
  }, { passive: true });
  nav.style.transition = "transform .4s var(--ease, ease)";

})();
