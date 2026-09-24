const EVENTS = [
  { id: 1,  name: "Cloud Summit Madrid",          date: "2026-10-15", cat: "Cloud",          city: "Madrid",    mode: "Presencial", price: 120, desc: "Arquitecturas multicloud y casos reales de migración." },
  { id: 2,  name: "IA en Producción",             date: "2026-10-22", cat: "IA",             city: "Online",    mode: "Online",     price: 0,   desc: "Cómo llevar modelos de lenguaje a producción sin sorpresas." },
  { id: 3,  name: "Ciberseguridad Day",           date: "2026-11-05", cat: "Ciberseguridad", city: "Barcelona", mode: "Presencial", price: 90,  desc: "Respuesta ante incidentes, ransomware y buenas prácticas." },
  { id: 4,  name: "Rendimiento Web Conf",         date: "2026-11-12", cat: "Web",            city: "Valencia",  mode: "Presencial", price: 60,  desc: "Core Web Vitals, carga de imágenes y frameworks ligeros." },
  { id: 5,  name: "Datos y Pipelines",            date: "2026-11-19", cat: "Datos",          city: "Bilbao",    mode: "Presencial", price: 75,  desc: "Ingeniería de datos: de la ingesta al panel de control." },
  { id: 6,  name: "Open Source Weekend",          date: "2026-12-03", cat: "Open Source",    city: "Sevilla",   mode: "Presencial", price: 0,   desc: "Aprende a contribuir a proyectos abiertos en dos días." },
  { id: 7,  name: "Kubernetes desde cero",        date: "2026-12-10", cat: "Cloud",          city: "Online",    mode: "Online",     price: 30,  desc: "Taller práctico de contenedores y despliegues." },
  { id: 8,  name: "Hackatón de IA aplicada",      date: "2027-01-21", cat: "IA",             city: "Madrid",    mode: "Presencial", price: 0,   desc: "48 horas para construir un prototipo con equipos mixtos." },
  { id: 9,  name: "Seguridad en APIs",            date: "2027-02-04", cat: "Ciberseguridad", city: "Online",    mode: "Online",     price: 25,  desc: "Autenticación, límites de uso y errores frecuentes." },
  { id: 10, name: "Frontend Sur",                 date: "2027-02-18", cat: "Web",            city: "Málaga",    mode: "Presencial", price: 80,  desc: "Componentes, accesibilidad y diseño de interfaces." },
  { id: 11, name: "Data Lake Meetup",             date: "2027-03-04", cat: "Datos",          city: "Barcelona", mode: "Presencial", price: 0,   desc: "Charlas cortas sobre almacenamiento y gobierno del dato." },
  { id: 12, name: "Infraestructura como código",  date: "2027-03-18", cat: "Cloud",          city: "Valencia",  mode: "Presencial", price: 50,  desc: "Terraform y automatización de entornos en la nube." }
];

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const state = { cat: "Todos", q: "", reserved: new Set() };

const $grid = document.getElementById("grid");
const $chips = document.getElementById("chips");
const $count = document.getElementById("count");
const $empty = document.getElementById("empty");
const $q = document.getElementById("q");

const parseDate = (s) => new Date(s + "T09:00:00");
const slug = (s) => s.replace(/\s+/g, "");
const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function renderChips() {
  const cats = ["Todos", ...new Set(EVENTS.map((e) => e.cat))];
  $chips.innerHTML = cats
    .map((c) => `<button class="chip" data-cat="${c}" aria-pressed="${c === state.cat}">${c}</button>`)
    .join("");
}

function renderGrid() {
  const q = state.q.trim().toLowerCase();
  const list = EVENTS.filter((e) =>
    (state.cat === "Todos" || e.cat === state.cat) &&
    (!q || e.name.toLowerCase().includes(q) || e.city.toLowerCase().includes(q))
  );

  $grid.innerHTML = list.map((e) => {
    const d = parseDate(e.date);
    const reserved = state.reserved.has(e.id);
    return `
      <article class="card">
        <div class="card-head">
          <div class="date"><b>${d.getDate()}</b><span>${MESES[d.getMonth()]} ${d.getFullYear()}</span></div>
          <h3>${escapeHtml(e.name)}</h3>
        </div>
        <span class="tag t-${slug(e.cat)}">${e.cat}</span>
        <p>${escapeHtml(e.desc)}</p>
        <p>${e.city} · ${e.mode}</p>
        <div class="card-foot">
          <span class="price">${e.price === 0 ? "Gratis" : e.price + " €"}</span>
          <button class="reserve" data-id="${e.id}" aria-pressed="${reserved}">${reserved ? "Plaza reservada" : "Reservar plaza"}</button>
        </div>
      </article>`;
  }).join("");

  $count.textContent = `${list.length} ${list.length === 1 ? "evento" : "eventos"}`;
  $empty.hidden = list.length > 0;
}

$chips.addEventListener("click", (ev) => {
  const btn = ev.target.closest(".chip");
  if (!btn) return;
  state.cat = btn.dataset.cat;
  renderChips();
  renderGrid();
});

$q.addEventListener("input", () => {
  state.q = $q.value;
  renderGrid();
});

$grid.addEventListener("click", (ev) => {
  const btn = ev.target.closest(".reserve");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  state.reserved.has(id) ? state.reserved.delete(id) : state.reserved.add(id);
  renderGrid();
});

/* Cuenta atrás al próximo evento */
const upcoming = EVENTS.map((e) => ({ ...e, when: parseDate(e.date) }))
  .filter((e) => e.when > new Date())
  .sort((a, b) => a.when - b.when)[0];

function tick() {
  if (!upcoming) {
    document.getElementById("next-title").textContent = "No hay eventos próximos";
    return;
  }
  const diff = Math.max(0, upcoming.when - new Date());
  const pad = (n) => String(n).padStart(2, "0");
  document.getElementById("c-d").textContent = Math.floor(diff / 86400000);
  document.getElementById("c-h").textContent = pad(Math.floor(diff / 3600000) % 24);
  document.getElementById("c-m").textContent = pad(Math.floor(diff / 60000) % 60);
  document.getElementById("c-s").textContent = pad(Math.floor(diff / 1000) % 60);
}

if (upcoming) {
  document.getElementById("next-title").textContent = upcoming.name;
  document.getElementById("next-meta").textContent =
    `${upcoming.when.getDate()} de ${MESES[upcoming.when.getMonth()]} de ${upcoming.when.getFullYear()} · ${upcoming.city}`;
}
tick();
setInterval(tick, 1000);

renderChips();
renderGrid();
