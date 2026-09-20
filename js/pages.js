function cardAmbiente(a) {
  const ph = a.heroSource !== "generated-direction" && a.heroSource !== "biblioteca" ? "placeholder" : a.heroSource === "generated-direction" ? "" : "";
  const needsShot = a.heroSource !== "generated-direction";
  return `
    <a class="card-amb" href="ambiente.html?id=${esc(a.id)}">
      ${img(a.hero, a.name)}
      ${needsShot && !a.hero ? `<span class="badge-ph">A definir</span>` : ""}
      <div class="cap">
        <small>${esc(a.subtitle)}</small>
        <strong>${esc(a.name)}</strong>
      </div>
    </a>`;
}

function cardPeca(p) {
  return `
    <a class="card-peca" href="peca.html?id=${esc(p.id)}">
      <div class="thumb">${img(p.image, p.name)}</div>
      <div>
        <div class="meta">
          <span>${esc(p.categoryName)}</span>
          <span class="status ${esc(p.status)}">${esc(statusLabel(p.status))}</span>
        </div>
        <h3>${esc(p.name)}</h3>
        <div class="meta"><span>${esc(p.priceLabel)}</span></div>
      </div>
    </a>`;
}

function renderHome() {
  const featured = [
    ...M.pecas.filter((p) => p.price),
    ...M.pecas.filter((p) => p.source === "atelier" && !p.price),
  ].slice(0, 6);
  const ambStrip = [
    "luxo-haute-decor",
    "biofilico-floresta",
    "dark-luxury-noir",
    "minimalista-silencio",
    "urbano-loft",
    "praia",
  ]
    .map((id) => ambienteById(id))
    .filter(Boolean);
  const paloma =
    M.index.find((i) => /painel-e-modelo|painel_e_modelo/i.test(i.local || ""))?.local ||
    M.pecas.find((p) => p.source === "atelier")?.image;
  const hero = ambienteById("luxo-haute-decor")?.hero;

  return `
    <section class="hero">
      <div class="hero-copy">
        <p class="kicker">${esc(brand.kicker)}</p>
        <h1>${esc(brand.headline)}</h1>
        <p class="lede">Peças exclusivas feitas à mão para trazer alma, textura e elegância atemporal ao seu espaço. Do boho-chic ao minimalismo sofisticado.</p>
        <div class="hero-actions">
          <a class="btn btn-solid" href="pecas.html">Ver coleção</a>
          <a class="btn btn-ghost" href="${wa("Olá! Quero encomendar uma peça MACR_AMO_.")}">Encomendar</a>
        </div>
      </div>
      <div class="hero-photo">
        ${img(hero, "Ambiente Haute Décor com painel de macramê")}
        <span class="hero-caption">Direção visual · Luxo Haute Décor</span>
      </div>
    </section>
    <div class="quote-band">
      <blockquote>“${esc(brand.tagline)}”</blockquote>
      <span>Design autoral ${esc(brand.instagramHandle)}</span>
    </div>
    <section class="section">
      <div class="wrap essencia">
        <div>
          <p class="kicker">Nossa essência</p>
          <h2>Feito à mão, com alma.</h2>
          <p style="margin-top:1rem;max-width:46ch">${esc(brand.about)}</p>
          <div class="stats">
            <div><b>100%</b><span class="muted">Handmade</span></div>
            <div><b>Premium</b><span class="muted">Materiais</span></div>
            <div><b>${M.ambientes.length}</b><span class="muted">Ambientes</span></div>
          </div>
        </div>
        ${img(paloma, "Paloma Batistta no ateliê MACR_AMO_")}
      </div>
    </section>
    <hr class="rule">
    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <div>
            <p class="kicker">Ambientes</p>
            <h2>O macramê como linguagem de interior.</h2>
          </div>
          <a href="ambientes.html">Ver os ${M.ambientes.length} →</a>
        </div>
        <div class="grid-amb">${ambStrip.map(cardAmbiente).join("")}</div>
      </div>
    </section>
    <section class="section" style="padding-top:0">
      <div class="wrap">
        <div class="section-head">
          <div>
            <p class="kicker">Peças</p>
            <h2>Coleção visível.</h2>
          </div>
          <a href="pecas.html">Abrir catálogo →</a>
        </div>
        <div class="grid-pecas">${featured.map(cardPeca).join("")}</div>
      </div>
    </section>`;
}

function renderAmbientes() {
  return `
    <section class="page-hero wrap">
      <p class="kicker">Ambientes</p>
      <h1>Vinte e seis linguagens. Um só fio.</h1>
      <p>Todas as categorias de interior já mapeadas na biblioteca. Quatro delas já têm direção visual gerada; as outras usam fotos reais e editoriais até você substituir.</p>
    </section>
    <section class="section" style="padding-top:0">
      <div class="wrap grid-amb">${M.ambientes.map(cardAmbiente).join("")}</div>
    </section>`;
}

function renderAmbiente() {
  const a = ambienteById(qs("id"));
  if (!a) {
    return `<section class="wrap page-hero"><h1>Ambiente não encontrado</h1><p><a href="ambientes.html">Voltar</a></p></section>`;
  }
  const related = pecasDoAmbiente(a).slice(0, 9);
  const gallery = (a.gallery && a.gallery.length ? a.gallery : [a.hero]).filter(Boolean);
  const msg = `Olá Paloma, vim pelo site MACR_AMO_ e quero um projeto no estilo ${a.name} — ${a.subtitle}.`;
  return `
    <section class="page-hero wrap">
      <p class="kicker">${esc(a.subtitle)}</p>
      <h1>${esc(a.name)}</h1>
      <p>${esc(a.conceito)}</p>
    </section>
    <section class="wrap detail">
      <div class="detail-gallery">
        <div class="main">${img(gallery[0], a.name)}</div>
        ${gallery.slice(1, 5).map((g) => `<div class="thumb">${img(g, a.name)}</div>`).join("")}
      </div>
      <div class="detail-body">
        <p class="kicker">Conceito</p>
        <p class="conceito">${esc(a.conceito)}</p>
        <p class="muted" style="margin-top:1rem">Peças deste ambiente: ${a.pecasRelacionadas.map((id) => catById(id)?.name || id).join(", ")}</p>
        ${a.heroSource === "generated-direction" ? `<p class="muted" style="margin-top:.6rem">Hero de direção visual (gerado). Substitua depois por foto de projeto real.</p>` : ""}
        <div class="actions">
          <a class="btn btn-ink" href="${wa(msg)}">${esc(a.cta)}</a>
          <a class="btn btn-line" href="${wa(msg)}">WhatsApp</a>
        </div>
      </div>
    </section>
    <section class="section related">
      <div class="wrap">
        <div class="section-head"><h2>Peças relacionadas</h2><a href="pecas.html">Catálogo</a></div>
        <div class="grid-pecas">${related.length ? related.map(cardPeca).join("") : `<p class="empty">Ainda sem peça definitiva neste estilo.</p>`}</div>
      </div>
    </section>`;
}

function renderPecas() {
  const cat = qs("cat");
  const cats = M.categorias.filter((c) => c.count > 0 || c.placeholder);
  const list = cat ? M.pecas.filter((p) => p.category === cat) : M.pecas.filter((p) => p.category !== "registros");
  const shown = cat === "registros" ? M.pecas.filter((p) => p.category === "registros") : list;
  return `
    <section class="page-hero wrap">
      <p class="kicker">Peças</p>
      <h1>Catálogo por categoria.</h1>
      <p>Alimentado por JSON. ${M.stats.pecas} imagens catalogadas · ${M.stats.categoriasComImagem} categorias com foto · 3 ainda no placeholder.</p>
    </section>
    <section class="wrap" style="padding-bottom:4rem">
      <div class="chips" id="chips">
        <a class="chip ${!cat ? "is-on" : ""}" href="pecas.html">Todas</a>
        ${cats
          .map(
            (c) =>
              `<a class="chip ${cat === c.id ? "is-on" : ""}" href="pecas.html?cat=${esc(c.id)}">${esc(c.name)} ${c.count ? c.count : "·"}</a>`
          )
          .join("")}
      </div>
      <p class="count-bar">${shown.length} peça(s)</p>
      <div class="grid-pecas" id="grid">
        ${shown.length ? shown.map(cardPeca).join("") : `<p class="empty">Categoria mapeada, ainda sem imagem definitiva.</p>`}
      </div>
    </section>`;
}

function renderPeca() {
  const p = pecaById(qs("id"));
  if (!p) {
    return `<section class="wrap page-hero"><h1>Peça não encontrada</h1><p><a href="pecas.html">Voltar</a></p></section>`;
  }
  const ambs = p.ambientes.map(ambienteById).filter(Boolean);
  const gallery = p.gallery && p.gallery.length ? p.gallery : [p.image];
  const more = M.pecas.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 6);
  const msg = `Olá Paloma, vim pelo site e quero orçamento da peça "${p.name}" (${p.categoryName}).`;
  return `
    <section class="wrap detail" style="padding-top:2.4rem">
      <div class="detail-gallery">
        <div class="main">${img(gallery[0], p.name)}</div>
        ${gallery.slice(1, 5).map((g) => `<div class="thumb">${img(g, p.name)}</div>`).join("")}
      </div>
      <div class="detail-body">
        <p class="kicker">${esc(p.categoryName)}</p>
        <h1>${esc(p.name)}</h1>
        <p class="meta"><span class="status ${esc(p.status)}">${esc(statusLabel(p.status))}</span> <span>${esc(p.priceLabel)}</span></p>
        <p class="conceito" style="margin-top:1rem">Peça de macramê autoral MACR_AMO_. Cores, medida e fio sob consulta.</p>
        ${
          ambs.length
            ? `<p class="muted" style="margin-top:1rem">Ambientes: ${ambs
                .map((a) => `<a href="ambiente.html?id=${esc(a.id)}">${esc(a.name)}</a>`)
                .join(" · ")}</p>`
            : ""
        }
        <div class="actions">
          <a class="btn btn-ink" href="${wa(msg)}">Pedir orçamento</a>
          <a class="btn btn-line" href="pecas.html?cat=${esc(p.category)}">Ver categoria</a>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <div class="section-head"><h2>Na mesma família</h2></div>
        <div class="grid-pecas">${more.map(cardPeca).join("")}</div>
      </div>
    </section>`;
}

function renderProjetos() {
  return `
    <section class="page-hero wrap">
      <p class="kicker">Projetos</p>
      <h1>O fio no espaço real.</h1>
      <p>Recortes da biblioteca — ateliê, instagram e editoriais — agrupados como projetos até os cases oficiais entrarem.</p>
    </section>
    <section class="wrap" style="padding-bottom:4rem">
      <div class="grid-amb">
        ${M.projetos
          .map(
            (p) => `
          <a class="card-amb" href="${p.ambiente ? "ambiente.html?id=" + esc(p.ambiente) : "pecas.html"}">
            ${img(p.image, p.name)}
            <div class="cap">
              <small>${esc(p.status)}</small>
              <strong>${esc(p.name)}</strong>
            </div>
          </a>`
          )
          .join("")}
      </div>
    </section>`;
}

function renderSobre() {
  const shots = M.index.filter((i) => i.local && i.local.startsWith("assets/atelier/")).slice(0, 6);
  const portrait =
    shots.find((s) => /painel-e-modelo|rmsstn|a16bd6bd/i.test(s.local))?.local || shots[0]?.local;
  return `
    <section class="page-hero wrap">
      <p class="kicker">Sobre</p>
      <h1>${esc(brand.artist)}.</h1>
      <p>${esc(brand.about)}</p>
    </section>
    <section class="wrap sobre-grid" style="padding-bottom:4rem">
      ${img(portrait, "Paloma Batistta")}
      <div>
        <p class="kicker">${esc(brand.name)}</p>
        <h2>Design autoral em macramê.</h2>
        <p style="margin-top:1rem;max-width:46ch">A marca une técnica ancestral e interior contemporâneo. Esta V1 reúne a biblioteca de peças, os 26 ambientes de projeto e o ateliê — para você editar textos, trocar fotos e gerar o que faltar.</p>
        <p style="margin-top:1rem;max-width:46ch">WhatsApp ${esc(brand.whatsappLabel)} · ${esc(brand.instagramHandle)}</p>
        <div class="mosaic">
          ${shots.slice(0, 4).map((s) => img(s.local, "Ateliê")).join("")}
        </div>
      </div>
    </section>`;
}

function renderContato() {
  const interesses = ["Painel decorativo", "Suporte de plantas", "Espelho", "Bolsas", "Almofadas", "Projeto personalizado", "Lustre", "Berço"];
  return `
    <section class="page-hero wrap">
      <p class="kicker">Contato</p>
      <h1>Vamos amarrar o projeto.</h1>
      <p>O formulário abre o WhatsApp com a sua mensagem pronta. Nada é enviado para servidor nesta V1.</p>
    </section>
    <section class="wrap contact-grid" style="padding-bottom:4rem">
      <div>
        <p class="kicker">Direct</p>
        <h2>${esc(brand.whatsappLabel)}</h2>
        <p style="margin:1rem 0"><a href="${esc(brand.instagram)}">${esc(brand.instagramHandle)}</a></p>
        <p class="muted">Bahia · atendimento por conversa</p>
      </div>
      <form id="orcamento">
        <label>Nome<input name="nome" required placeholder="Seu nome"></label>
        <label>Interesse
          <select name="interesse">
            ${interesses.map((i) => `<option>${esc(i)}</option>`).join("")}
          </select>
        </label>
        <label>Mensagem<textarea name="msg" placeholder="Medida, cor, ambiente..."></textarea></label>
        <button class="btn btn-ink" type="submit">Iniciar conversa</button>
      </form>
    </section>`;
}

function bindContato() {
  const form = document.getElementById("orcamento");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const text = `Olá Paloma, sou ${fd.get("nome")}. Interesse: ${fd.get("interesse")}. ${fd.get("msg") || ""}`.trim();
    location.href = wa(text);
  });
}

function renderPage() {
  const page = document.body.dataset.page;
  const app = document.getElementById("app");
  const map = {
    home: renderHome,
    ambientes: renderAmbientes,
    ambiente: renderAmbiente,
    pecas: renderPecas,
    peca: renderPeca,
    projetos: renderProjetos,
    sobre: renderSobre,
    contato: renderContato,
  };
  app.innerHTML = (map[page] || renderHome)();
  if (page === "contato") bindContato();
}
