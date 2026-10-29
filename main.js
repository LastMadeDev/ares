// Project ARES site. No build step, no dependencies.
(() => {
  "use strict";

  // ---------- launch mode + links ----------
  // The mode lives on <html data-mode>. Links for each mode are set here, in one place.
  const SITE_REPO = "https://github.com/LastMadeDev/ares";
  const KIT_REPO = "https://github.com/LastMadeDev/Project-ARES";
  const LINKS = {
    "early-access": {
      primary: `${SITE_REPO}/issues/new?template=early-access.yml`,
      commercial: `${SITE_REPO}/issues/new?template=commercial.yml`,
      repo: KIT_REPO,
    },
    "open-source": {
      primary: "#start",
      commercial: `${SITE_REPO}/issues/new?template=commercial.yml`,
      repo: KIT_REPO,
    },
  };
  const mode = document.documentElement.dataset.mode in LINKS ? document.documentElement.dataset.mode : "early-access";
  document.querySelectorAll("[data-link]").forEach((a) => {
    const href = LINKS[mode][a.dataset.link];
    if (!href) return;
    a.href = href;
    if (href.startsWith("http")) { a.target = "_blank"; a.rel = "noopener"; }
  });

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // ---------- nav ----------
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("scrolled", scrollY > 10);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- reveal + count-up ----------
  const countUp = (el) => {
    const end = +el.dataset.count;
    if (reduced) { el.textContent = end.toLocaleString(); return; }
    const t0 = performance.now(), dur = 1400;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4))).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      $$("[data-count]", e.target).forEach(countUp);
      if (e.target.matches("[data-count]")) countUp(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  // ?shot shows everything at once, for full-page screenshots.
  const shot = new URLSearchParams(location.search).has("shot");
  $$(".reveal").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 60}ms`;
    if (shot) { el.style.transition = "none"; el.classList.add("in"); $$("[data-count]", el).forEach((c) => (c.textContent = (+c.dataset.count).toLocaleString())); }
    else io.observe(el);
  });

  // ---------- spotlight cards ----------
  document.addEventListener("pointermove", (e) => {
    const card = e.target.closest?.(".spot");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, { passive: true });

  // ---------- background field ----------
  const cv = $("#field");
  const ctx = cv.getContext("2d");
  let W = 0, H = 0, dpr = 1, mx = -9999, my = -9999, raf = 0;
  const GAP = 30;
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  };
  const draw = () => {
    raf = 0;
    ctx.clearRect(0, 0, W, H);
    const off = -(scrollY * 0.15) % GAP;
    for (let y = off; y < H + GAP; y += GAP) {
      for (let x = (W % GAP) / 2; x < W; x += GAP) {
        const d = Math.hypot(x - mx, y - my);
        const k = Math.max(0, 1 - d / 220);
        if (k > 0) {
          ctx.fillStyle = `rgba(241,106,99,${0.12 + k * 0.7})`;
          ctx.beginPath(); ctx.arc(x, y, 1 + k * 1.4, 0, 6.283); ctx.fill();
        } else {
          ctx.fillStyle = "rgba(146,156,170,.09)";
          ctx.fillRect(x - 0.6, y - 0.6, 1.2, 1.2);
        }
      }
    }
  };
  const queue = () => { if (!raf) raf = requestAnimationFrame(draw); };
  addEventListener("resize", resize);
  addEventListener("scroll", queue, { passive: true });
  if (!reduced) addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; queue(); }, { passive: true });
  document.addEventListener("pointerleave", () => { mx = my = -9999; queue(); });
  resize();

  // ---------- hero terminal ----------
  // [delay ms before the line, html]. A line starting with "$" is typed out character by character.
  const RUN = [
    [300, "$<span class='c-p'>❯</span> /work LM-142 <span class='c-m'>refinery upgrade tiers</span>"],
    [500, "<span class='c-m'>●</span> Ticket LM-142 · <span class='c-b'>4</span> acceptance checks · truth order: digest → Book → island"],
    [420, "<span class='c-m'>●</span> Digest lookup <span class='c-s'>Fortnite.digest.verse</span> · 3 symbols confirmed"],
    [520, "<span class='c-m'>●</span> Edit <span class='c-b'>refinery_service.verse</span> <span class='c-g'>+84</span> <span class='c-r'>−12</span>"],
    [300, "  <span class='c-g'>✓</span> verse-lint      0 issues"],
    [600, "<span class='c-m'>●</span> verse_check.py  <span class='c-g'>0 errors</span> <span class='c-m'>· 2.9 s · warm server, no editor</span>"],
    [700, "<span class='c-m'>●</span> MCP batch: place 6 devices · set 14 @editables · <span class='c-y'>guard split 214 writes → 2 chunks</span> · saved"],
    [800, "<span class='c-m'>●</span> /build-check   BuildAll <span class='c-g'>green</span> · digest proof <span class='c-g'>✓</span> · log proof <span class='c-g'>✓</span>"],
    [900, "<span class='c-m'>●</span> Playtest  <span class='c-g'>[TEST] refinery.tier3 PASS</span>  <span class='c-g'>[TEST] save.roundtrip PASS</span>"],
    [500, "<span class='c-y'>◆</span> Stop gate: green build since last edit · <span class='c-b'>verified</span>"],
    [500, "<span class='c-g'>✓ Done.</span> commit <span class='c-s'>4e1c9a2</span> · LM-142 → In Review · 1 lesson → kit"],
  ];
  const body = $("#termBody");
  let runId = 0;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const play = async () => {
    const id = ++runId;
    body.innerHTML = "";
    const cursor = document.createElement("span");
    cursor.className = "cursor";
    for (const [delay, line] of RUN) {
      if (!reduced) await sleep(delay);
      if (id !== runId) return;
      const row = document.createElement("div");
      body.appendChild(row);
      if (line.startsWith("$") && !reduced) {
        const tmp = document.createElement("div");
        tmp.innerHTML = line.slice(1);
        const prompt = tmp.firstChild.outerHTML;
        const text = tmp.textContent.slice(1);
        row.innerHTML = prompt;
        row.appendChild(cursor);
        for (let i = 1; i <= text.length; i++) {
          if (id !== runId) return;
          row.innerHTML = prompt + text.slice(0, i).replace(/&/g, "&amp;").replace(/</g, "&lt;");
          row.appendChild(cursor);
          await sleep(28 + Math.random() * 40);
        }
        row.innerHTML = line.slice(1);
      } else {
        row.innerHTML = line.replace(/^\$/, "");
      }
      row.appendChild(cursor);
    }
  };
  let played = shot;
  if (shot) play();
  new IntersectionObserver((es, o) => {
    if (es[0].isIntersecting && !played) { played = true; play(); o.disconnect(); }
  }, { threshold: 0.3 }).observe($("#term"));
  $("#replay").addEventListener("click", play);

  // ---------- mode tabs ----------
  const tabs = $$(".tab");
  tabs.forEach((t) => t.addEventListener("click", () => {
    tabs.forEach((x) => { x.classList.toggle("active", x === t); x.setAttribute("aria-selected", x === t); });
    $$(".pane").forEach((p) => p.classList.toggle("active", p.dataset.pane === t.dataset.tab));
  }));

  // ---------- skills explorer ----------
  const SKILLS = {
    Verse: [
      ["verse-book", "The Book of Verse offline: semantics ground truth for every construct and effect."],
      ["verse-shapes", "Copy-then-modify shapes that compile, one per construct, plus the effects table."],
      ["verse-patterns", "The backbone and recipes that compile: services, join/leave, currency, shop, waves."],
      ["verse-persistence", "Per-player saves with a versioned envelope, debounced writes and migration."],
      ["verse-compile-errors", "Compiler error catalogue: code or message to cause to fix."],
      ["verse-digest-lookup", "The real signature of any Verse, Fortnite or Unreal API, from your digests."],
      ["verse-devices", "Device events, placement and Fortnite APIs: buttons, volumes, HUD, props."],
      ["verse-testability", "Debug cheats, test clock, [TEST] and [EVENT] tags, log watching, wiring audit."],
      ["verse-audit-orchestrator", "Audit until clean: specialist agents in parallel, one blocker fixed at a time."],
    ],
    "Editor and world": [
      ["uefn-connectivity", "Reach UEFN over MCP: recovery, crash safety, batching, undo, health."],
      ["uefn-editables", "Set @editable values on placed devices: refs, arrays, slot-class arrays."],
      ["uefn-scene-graph", "Entities, components, prefabs, keyframed movement, items and abilities."],
      ["uefn-level-design", "Spatial checks, blockout, player flow, cover, spawns, landmarks, scatter."],
      ["uefn-island-settings", "Player count, spawn pads, teams, matchmaking, publish prep."],
      ["uefn-materials", "Masters, instances, Verse parameters, UI materials, water, shader cost."],
      ["uefn-niagara", "Systems, emitters, spawning from Verse, VFX devices, rebuild vs edit."],
      ["uefn-cinematics", "Level Sequences from editor Python, cinematic devices, per-player rigs."],
      ["optimized-lighting", "Lumen cost, exposure, post process, day sequence, world-UI brightness."],
      ["uefn-batch-dry-run", "Read, review, journal, apply, read back: the gate for destructive batches."],
      ["uefn-lore-hygiene", "Ignore files, audits, junk eviction, restoring from an older revision."],
    ],
    UI: [
      ["ui-authoring", "WBPs over MCP: compile cost, build order, UI materials, buttons, bindings."],
      ["ui-binding", "Verse fields, MVVM bindings and click events on a widget."],
      ["ui-wiring", "Verse wrappers from the Assets digest, screens and the HUD service."],
      ["ui-from-mockup", "Build a widget from a mockup with the island UI kit, then run layout checks."],
      ["ui-mockup", "Generate a UI mockup in the island style: menu, popup, HUD, sign."],
      ["ui-icons", "Make, key and import UI icons and rebuild the icon master."],
      ["ui-animate", "Hover, press, open and close, states and triggers on a bound widget."],
      ["ui-tutorial-guide", "Tutorial spotlights, pointers and pad breadcrumbs."],
    ],
    "3D pipeline": [
      ["blender-pipeline", "The hub for every Blender job: builder scripts, review loop, characters."],
      ["blender-kit", "Station kit for props: geometry, details, palette, review renders, bake, FBX."],
      ["blender-procedural", "Node-math shaders and 80+ variant families for texture-free looks."],
      ["blender-animation", "Loops, static and animated swaps, material-math states, baking."],
      ["blender-uefn-bridge", "Measure UEFN into Blender and ship back: probes, pivots, import settings."],
    ],
    "Paid and retention": [
      ["uefn-marketplace", "In-island purchases in Verse: entitlements, offers, fulfillment, replay."],
      ["igp-safeguards", "Epic's in-island transaction rules as a compliance flow."],
      ["uefn-accolades-analytics", "Accolades and analytics: one owning device, reason enums, once-per-join."],
    ],
    Performance: [
      ["uefn-perf", "Server-tick profiling: waves, playbook, proof on the same tour."],
      ["workflow-speed", "Find the bottleneck in a slow step: model, editor or build."],
    ],
    Media: [
      ["image-gen", "Concept art, references, thumbnails, textures and promo art."],
      ["game-sfx", "Game sound effects in code, auditioned and wired per player."],
      ["clip-trailer", "Cut recordings into clips and the trailer master."],
    ],
    "Workflow and kit": [
      ["linear", "Agent-ready tickets, status flow, question banks, files between machines."],
      ["uefn-session", "The session model: runs, file homes, git, parallel runs, handoff."],
      ["island-bootstrap", "Start a new island from your latest game's Verse, pruned, with git."],
      ["kit-learn", "Write a lesson into the kit: search first, sharpen before adding."],
      ["kit-sync", "Ship or pull the kit with kit.ps1: sync, conflicts, auth."],
    ],
  };
  const chipBox = $("#skillChips"), grid = $("#skillGrid"), moreBtn = $("#skillMore");
  const total = Object.values(SKILLS).reduce((n, a) => n + a.length, 0);
  const domains = [["All", total], ...Object.entries(SKILLS).map(([k, v]) => [k, v.length])];
  const PREVIEW = 12;
  const showSkills = (dom, full = false) => {
    $$("button", chipBox).forEach((b) => b.classList.toggle("on", b.dataset.d === dom));
    const all = dom === "All" ? Object.values(SKILLS).flat() : SKILLS[dom];
    const list = full ? all : all.slice(0, PREVIEW);
    moreBtn.hidden = list.length === all.length;
    moreBtn.textContent = `Show all ${all.length} skills`;
    moreBtn.onclick = () => showSkills(dom, true);
    grid.innerHTML = list.map(([n, d], i) => {
      const [pre, ...rest] = n.split("-");
      return `<div class="skill enter" style="animation-delay:${Math.min(i, 20) * 18}ms"><b><i>${pre}</i>${rest.length ? "-" + rest.join("-") : ""}</b><span>${d}</span></div>`;
    }).join("");
  };
  chipBox.innerHTML = domains.map(([d, n]) => `<button type="button" data-d="${d}">${d}<span class="n">${n}</span></button>`).join("");
  chipBox.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) showSkills(b.dataset.d); });
  showSkills("All");

  // ---------- command palette ----------
  const CMDS = [
    ["/plan-ticket", "Interview until the idea is agent-ready Linear tickets."],
    ["/work", "Execute a ticket to the end, no questions, to proof."],
    ["/work-long", "Work mode while you are away, with full UEFN recovery."],
    ["/test-pass", "Every In Review ticket in one playthrough checklist."],
    ["/project-sync", "Map the island's Verse into lazy per-folder notes."],
    ["/build-check", "Compile once for every session, prove it, then lint."],
    ["/audit", "Fan the specialist auditors out; loop until CLEAN."],
    ["/perf", "Measure the tick, attribute the cost, fix, prove."],
    ["/igp-audit", "Walk every paid product through Epic's rules."],
    ["/read-logs", "Read the Output Log, mark [TEST] checks, diagnose."],
    ["/handoff", "End the session: commit, handoff page, human steps."],
    ["/carry", "Compress a chat into a tiny carry note."],
    ["/eod", "End-of-day wrap-up."],
    ["/eow", "End-of-week wrap-up; retire lessons that stopped firing."],
    ["/start-project", "Start an island with no past codebase."],
    ["/new-island", "Fork your latest island's Verse into a new one."],
    ["/learn-source", "Fold a vetted outside source into the kit."],
    ["/kit-stocktake", "Audit the kit itself."],
    ["/kit-ship", "Ship pending kit changes to main as a release."],
    ["/uefn-snapshot", "Re-capture every MCP toolset after a UEFN update."],
    ["/blender-prop", "Model a prop through the render and art-direction loop."],
    ["/blender-animate", "Static and animated versions that swap cleanly."],
    ["/blender-fit", "Measure placed actors and build a prop that fits."],
    ["/blender-export", "Ship props to UEFN with the exact import settings."],
  ];
  const palInput = $("#palInput"), palList = $("#palList");
  let sel = 0, shown = CMDS;
  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  const hi = (s, q) => {
    if (!q) return esc(s);
    const i = s.toLowerCase().indexOf(q);
    return i < 0 ? esc(s) : esc(s.slice(0, i)) + "<mark>" + esc(s.slice(i, i + q.length)) + "</mark>" + esc(s.slice(i + q.length));
  };
  const renderPal = () => {
    const q = palInput.value.trim().toLowerCase().replace(/^\//, "");
    shown = CMDS.filter(([c, d]) => !q || c.includes(q) || d.toLowerCase().includes(q));
    sel = Math.min(sel, Math.max(0, shown.length - 1));
    palList.innerHTML = shown.length
      ? shown.map(([c, d], i) => `<li role="option" class="${i === sel ? "sel" : ""}" aria-selected="${i === sel}"><code>${hi(c, q)}</code><span>${hi(d, q)}</span></li>`).join("")
      : `<li class="empty">No command matches “${esc(palInput.value)}”.</li>`;
  };
  palInput.addEventListener("input", () => { sel = 0; renderPal(); });
  palInput.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { sel = Math.min(sel + 1, shown.length - 1); e.preventDefault(); }
    else if (e.key === "ArrowUp") { sel = Math.max(sel - 1, 0); e.preventDefault(); }
    else if (e.key === "Escape") { palInput.value = ""; palInput.blur(); }
    else return;
    renderPal();
    palList.children[sel]?.scrollIntoView({ block: "nearest" });
  });
  document.addEventListener("keydown", (e) => {
    const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName);
    if (e.key === "/" && !typing) {
      e.preventDefault();
      $("#commands").scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
      palInput.focus({ preventScroll: true });
    }
  });
  renderPal();

  // ---------- copy buttons ----------
  $$("[data-copy]").forEach((b) => b.addEventListener("click", async () => {
    const text = $("#" + b.dataset.copy).innerText;
    try { await navigator.clipboard.writeText(text); b.textContent = "Copied"; b.classList.add("done"); }
    catch { b.textContent = "Select and copy"; }
    setTimeout(() => { b.textContent = "Copy"; b.classList.remove("done"); }, 1800);
  }));
})();
