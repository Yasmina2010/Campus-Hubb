function el(tag, options = {}, children = []) {
  const node = document.createElement(tag);
  if (options.class) node.className = options.class;
  if (options.text) node.textContent = options.text;
  if (options.attrs) {
    for (const [key, value] of Object.entries(options.attrs)) {
      node.setAttribute(key, value);
    }
  }
  [].concat(children).forEach(child => {
    if (child) node.appendChild(child);
  });
  return node;
}

function formatDate(date) {
  return date.toLocaleDateString(undefined, {
    month: "short", day: "numeric", year: "numeric"
  });
}

function todayStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function makeFilters(container, options, onChange, includeAll = true) {
  const labels = includeAll ? ["All", ...options] : options;
  container.innerHTML = "";
  labels.forEach((label, index) => {
    const button = el("button", {
      class: "chip" + (index === 0 ? " active" : ""),
      text: label,
      attrs: { type: "button" }
    });
    button.addEventListener("click", () => {
      container.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
      button.classList.add("active");
      onChange(label);
    });
    container.appendChild(button);
  });
}

const DEMO_BADGE = () =>
  el("span", { class: "badge demo", text: "Demo data" });

const NAV_LINKS = [
  { page: "home", label: "Home", href: "index.html" },
  { page: "announcements", label: "Announcements", href: "announcements.html" },
  { page: "guidance", label: "College Guidance", href: "college-guidance.html" },
  { page: "opportunities", label: "Opportunities", href: "opportunities.html" },
  { page: "calendar", label: "Calendar", href: "calendar.html" }
];

function renderHeader() {
  const target = document.getElementById("site-header");
  if (!target) return;
  const current = document.body.dataset.page;
  const links = NAV_LINKS.map(link =>
    `<a href="${link.href}" class="${link.page === current ? "active" : ""}">${link.label}</a>`
  ).join("");

  target.innerHTML = `
    <div class="demo-banner">Demo version: all content is sample data</div>
    <header class="site-header">
      <div class="header-inner">
        <a class="logo" href="index.html">🏫 Campus Hub</a>
        <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false">☰</button>
        <nav class="nav" aria-label="Main navigation">${links}</nav>
      </div>
    </header>`;

  const toggle = target.querySelector(".menu-toggle");
  const nav = target.querySelector(".nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

function renderFooter() {
  const target = document.getElementById("site-footer");
  if (!target) return;
  target.innerHTML = `
    <footer class="site-footer">
      <p>© ${new Date().getFullYear()} Campus Hub · Demo version with sample data only.</p>
    </footer>`;
}

function announcementCard(item) {
  return el("article", { class: "card" }, [
    el("div", { class: "meta" }, [
      el("span", { class: "badge", text: item.category }),
      el("span", { class: "muted", text: formatDate(parseISO(item.date)) }),
      DEMO_BADGE()
    ]),
    el("h3", { text: item.title }),
    el("p", { text: item.body })
  ]);
}

function eventCard(item) {
  const date = parseISO(item.date);
  return el("article", { class: "card event-row" }, [
    el("div", { class: "event-date" }, [
      el("small", { text: date.toLocaleDateString(undefined, { month: "short" }) }),
      el("span", { text: String(date.getDate()) })
    ]),
    el("div", {}, [
      el("div", { class: "meta" }, [
        el("span", { class: "badge", text: item.type }),
        DEMO_BADGE()
      ]),
      el("h3", { text: item.title }),
      el("p", { class: "muted", text: item.time })
    ])
  ]);
}

function sortedAnnouncements() {
  return [...announcements].sort((a, b) => parseISO(b.date) - parseISO(a.date));
}

function initHome() {
  const annBox = document.getElementById("home-announcements");
  if (annBox) {
    sortedAnnouncements().slice(0, 3).forEach(a => annBox.appendChild(announcementCard(a)));
  }
  const evBox = document.getElementById("home-events");
  if (evBox) {
    const today = todayStart();
    calendarEvents
      .filter(e => parseISO(e.date) >= today)
      .sort((a, b) => parseISO(a.date) - parseISO(b.date))
      .slice(0, 3)
      .forEach(e => evBox.appendChild(eventCard(e)));
  }
}

function initAnnouncements() {
  const filters = document.getElementById("announcement-filters");
  const list = document.getElementById("announcement-list");
  const categories = [...new Set(announcements.map(a => a.category))];
  function show(category) {
    list.innerHTML = "";
    sortedAnnouncements()
      .filter(a => category === "All" || a.category === category)
      .forEach(a => list.appendChild(announcementCard(a)));
  }
  makeFilters(filters, categories, show);
  show("All");
}
function initGuidance() {
  const container = document.getElementById("guidance-content");
  if (!container) return;

  const grades = Object.keys(guidance);
  const tabs = document.getElementById("grade-tabs");
  const checklist = document.getElementById("guidance-checklist");
  const tips = document.getElementById("guidance-tips");

  let currentGrade = grades[0];

  function renderGrade(grade) {
    currentGrade = grade;
    container.innerHTML = "";
    const info = guidance[grade];

    container.appendChild(el("h2", { text: info.title || `Grade ${grade}` }));
    if (info.description) {
      container.appendChild(el("p", { text: info.description }));
    }

    const items = info.steps || info.items || [];
    items.forEach(item => {
      const card = el("article", { class: "card" });
      card.appendChild(el("h3", {
        text: typeof item === "string" ? item : item.title || item.name || "Step"
      }));
      if (typeof item === "object" && item.description) {
        card.appendChild(el("p", { text: item.description }));
      }
      container.appendChild(card);
    });

    if (checklist) {
      checklist.innerHTML = "";
      const saved = JSON.parse(localStorage.getItem("campus-checklist-" + grade) || "[]");
      guidanceTips.forEach((tip, index) => {
        const label = el("label", { class: "checklist-item" });
        const input = el("input", { attrs: { type: "checkbox" } });
        input.checked = saved.includes(index);
        input.addEventListener("change", () => {
          const checked = [...checklist.querySelectorAll('input[type="checkbox"]')]
            .map((box, i) => box.checked ? i : -1)
            .filter(i => i >= 0);
          localStorage.setItem("campus-checklist-" + grade, JSON.stringify(checked));
          updateProgress();
        });
        label.appendChild(input);
        label.appendChild(document.createTextNode(" " + tip));
        checklist.appendChild(label);
      });
      function updateProgress() {
        const boxes = [...checklist.querySelectorAll('input[type="checkbox"]')];
        const count = boxes.filter(box => box.checked).length;
        const progress = document.getElementById("checklist-progress");
        if (progress) progress.textContent = `${count} of ${boxes.length} completed`;
      }
      updateProgress();
    }

    if (tips) {
      tips.innerHTML = "";
      guidanceTips.forEach(tip => {
        tips.appendChild(el("p", { class: "tip-item", text: "✓ " + tip }));
      });
    }
  }

  if (tabs) {
    tabs.innerHTML = "";
    grades.forEach((grade, index) => {
      const button = el("button", {
        class: "chip" + (index === 0 ? " active" : ""),
        text: `Grade ${grade}`,
        attrs: { type: "button" }
      });
      button.addEventListener("click", () => {
        tabs.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        button.classList.add("active");
        renderGrade(grade);
      });
      tabs.appendChild(button);
    });
  }

  renderGrade(currentGrade);
}

function initOpportunities() {
  const list = document.getElementById("opportunity-list");
  if (!list) return;

  const search = document.getElementById("opportunity-search");
  const filters = document.getElementById("opportunity-filters");
  const categories = [...new Set(opportunities.map(o => o.category))];
  let activeCategory = "All";

  function show() {
    const query = search ? search.value.toLowerCase().trim() : "";
    list.innerHTML = "";
    opportunities
      .filter(o => activeCategory === "All" || o.category === activeCategory)
      .filter(o => `${o.title} ${o.description || ""} ${o.category}`.toLowerCase().includes(query))
      .forEach(o => {
        const card = el("article", { class: "card" }, [
          el("div", { class: "meta" }, [
            el("span", { class: "badge", text: o.category }),
            DEMO_BADGE()
          ]),
          el("h3", { text: o.title }),
          el("p", { text: o.description || "" })
        ]);
        if (o.deadline) {
          card.appendChild(el("p", { class: "muted", text: "Deadline: " + o.deadline }));
        }
        list.appendChild(card);
      });

    if (!list.children.length) {
      list.appendChild(el("p", { text: "No opportunities found." }));
    }
  }

  if (filters) makeFilters(filters, categories, category => {
    activeCategory = category;
    show();
  });
  if (search) search.addEventListener("input", show);
  show();
}

function initCalendar() {
  const grid = document.getElementById("calendar-grid");
  if (!grid) return;

  const title = document.getElementById("calendar-month");
  const list = document.getElementById("calendar-events");
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();

  function render() {
    if (title) {
      title.textContent = new Date(year, month, 1).toLocaleDateString(undefined, {
        month: "long", year: "numeric"
      });
    }

    grid.innerHTML = "";
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach(day => {
      grid.appendChild(el("div", { class: "calendar-day-name", text: day }));
    });

    const firstDay = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      grid.appendChild(el("div", { class: "calendar-cell empty" }));
    }

    for (let day = 1; day <= days; day++) {
      const date = new Date(year, month, day);
      const iso = [
        year,
        String(month + 1).padStart(2, "0"),
        String(day).padStart(2, "0")
      ].join("-");

      const cell = el("button", {
        class: "calendar-cell",
        text: String(day),
        attrs: { type: "button" }
      });

      if (date.toDateString() === now.toDateString()) {
        cell.classList.add("today");
      }
      if (calendarEvents.some(event => event.date === iso)) {
        cell.classList.add("has-event");
      }

      cell.addEventListener("click", () => showDay(iso));
      grid.appendChild(cell);
    }

    if (list) {
      list.innerHTML = "";
      calendarEvents
        .filter(event => {
          const d = parseISO(event.date);
          return d.getFullYear() === year && d.getMonth() === month;
        })
        .sort((a, b) => parseISO(a.date) - parseISO(b.date))
        .forEach(event => list.appendChild(eventCard(event)));

      if (!list.children.length) {
        list.appendChild(el("p", { text: "No events this month." }));
      }
    }
  }

  function showDay(iso) {
    if (!list) return;
    list.innerHTML = "";
    const events = calendarEvents.filter(event => event.date === iso);
    if (!events.length) {
      list.appendChild(el("p", { text: "No events on this day." }));
      return;
    }
    events.forEach(event => list.appendChild(eventCard(event)));
  }

  function changeMonth(step) {
    month += step;
    if (month < 0) { month = 11; year--; }
    if (month > 11) { month = 0; year++; }
    render();
  }

  const prev = document.getElementById("cal-prev");
  const next = document.getElementById("cal-next");
  const today = document.getElementById("cal-today");

  if (prev) prev.addEventListener("click", () => changeMonth(-1));
  if (next) next.addEventListener("click", () => changeMonth(1));
  if (today) today.addEventListener("click", () => {
    year = now.getFullYear();
    month = now.getMonth();
    render();
  });

  render();
}

renderHeader();
renderFooter();

const pageStarters = {
  home: initHome,
  announcements: initAnnouncements,
  guidance: initGuidance,
  opportunities: initOpportunities,
  calendar: initCalendar
};

const startPage = pageStarters[document.body.dataset.page];
if (startPage) startPage();
