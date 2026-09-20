const M = window.MACRAMO;
const brand = M.brand;

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wa(msg) {
  const text = msg || "Olá! Vim pelo site MACR_AMO_ e gostaria de conversar sobre um projeto.";
  return "https://wa.me/" + brand.whatsapp + "?text=" + encodeURIComponent(text);
}

function img(src, alt, cls) {
  if (!src) return `<div class="ph ${cls || ""}" role="img" aria-label="${esc(alt)}"></div>`;
  return `<img src="${esc(src)}" alt="${esc(alt || "")}" class="${cls || ""}" loading="lazy" onerror="this.outerHTML='<div class=ph></div>'">`;
}

function qs(name) {
  return new URLSearchParams(location.search).get(name);
}

function catById(id) {
  return M.categorias.find((c) => c.id === id);
}

function pecaById(id) {
  return M.pecas.find((p) => p.id === id);
}

function ambienteById(id) {
  return M.ambientes.find((a) => a.id === id);
}

function pecasDoAmbiente(amb) {
  return M.pecas.filter(
    (p) => p.ambientes.includes(amb.id) || amb.pecasRelacionadas.includes(p.category)
  );
}

function statusLabel(s) {
  if (s === "disponivel") return "Disponível";
  if (s === "sob encomenda" || s === "sob-encomenda") return "Sob encomenda";
  return "Consultar";
}

function navHTML(active) {
  const links = [
    ["index.html", "Início", "home"],
    ["ambientes.html", "Ambientes", "ambientes"],
    ["pecas.html", "Peças", "pecas"],
    ["projetos.html", "Projetos", "projetos"],
    ["sobre.html", "Sobre", "sobre"],
    ["contato.html", "Contato", "contato"],
  ];
  return `
    <a class="skip" href="#app">Ir ao conteúdo</a>
    <header class="nav" id="nav">
      <a class="brand" href="index.html">
        <img src="assets/brand/mark.svg" alt="">
        <span>MACR_AMO_</span>
      </a>
      <button class="nav-toggle" type="button" aria-label="Abrir menu">Menu</button>
      <ul class="nav-links">
        ${links
          .map(
            ([href, label, id]) =>
              `<li><a href="${href}" class="${id === active ? "is-on" : ""}">${label}</a></li>`
          )
          .join("")}
      </ul>
      <a class="nav-cta" href="${wa("Olá Paloma, vim pelo site MACR_AMO_.")}">WhatsApp</a>
    </header>`;
}

function footerHTML() {
  return `
    <section class="cta-band">
      <div class="wrap">
        <p class="kicker">Atendimento exclusivo</p>
        <h2>Transforme seu projeto em realidade.</h2>
        <p>Peças sob medida para arquitetos, designers de interiores e quem quer um espaço com alma.</p>
        <a class="btn btn-solid" href="${wa()}">Solicitar orçamento</a>
      </div>
    </section>
    <footer class="footer">
      <div class="footer-top">
        <div>
          <p>${esc(brand.artist)} · ${esc(brand.city)}</p>
          <p><a href="${esc(brand.instagram)}">${esc(brand.instagramHandle)}</a></p>
          <p><a href="${wa()}">${esc(brand.whatsappLabel)}</a></p>
        </div>
        <small>Preview local · não é o site oficial publicado</small>
      </div>
      <div class="footer-word">MACR_AMO_</div>
      <small>© <span id="year"></span> ${esc(brand.name)} — ${esc(brand.tagline)}</small>
    </footer>`;
}

function mountChrome() {
  const page = document.body.dataset.page;
  document.body.insertAdjacentHTML("afterbegin", navHTML(page));
  document.body.insertAdjacentHTML("beforeend", footerHTML());
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
  const nav = document.getElementById("nav");
  nav.querySelector(".nav-toggle").addEventListener("click", () => nav.classList.toggle("is-open"));
}

document.addEventListener("DOMContentLoaded", () => {
  if (!window.MACRAMO) {
    document.getElementById("app").innerHTML =
      "<p class='wrap empty'>Catálogo não carregou. Abra pelo preview.bat (servidor local) ou recarregue.</p>";
    return;
  }
  mountChrome();
  if (typeof renderPage === "function") renderPage();
});
