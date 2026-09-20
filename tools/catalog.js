/**
 * Cataloga UMA vez a biblioteca em Desktop\Macramo e copia
 * as imagens para o ecossistema local, gerando JSON reutilizável.
 * Reexecutar só se a biblioteca original mudar.
 */
const fs = require("fs");
const path = require("path");

const SRC = path.resolve("C:/Users/yanfi/Desktop/Macramo");
const ROOT = path.resolve(__dirname, "..");
const ASSETS = path.join(ROOT, "assets");
const DATA = path.join(ROOT, "data");

const IMG_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const VID_EXT = new Set([".mp4", ".mov", ".webm"]);

function slugify(s) {
  return String(s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function ensureDir(d) {
  fs.mkdirSync(d, { recursive: true });
}

function walk(dir, acc = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function isCopiaInteriores(rel) {
  return /Design de Interiores de Macram[eê] - Copia/i.test(rel);
}

function isInteriores(rel) {
  return /Design de Interiores de Macram[eê]/i.test(rel) && !isCopiaInteriores(rel);
}

function qualityOf(rel, name) {
  const n = name.toLowerCase();
  const r = rel.toLowerCase();
  if (/screenshot|instagram/i.test(n)) return "instagram";
  if (/^2025|^img-202/i.test(n) && !r.includes("macram")) return "atelier";
  if (/painel_e_modelo|a16bd6bd|luminaria_macrame_premium/i.test(n)) return "atelier";
  if (/tutorial|passo a passo|aprenda|curso |aula |como fazer|elo7|etsy|download|homify/i.test(n))
    return "referencia";
  if (/generated_video/i.test(n)) return "video";
  if (/^0\d-|^1\d-|^2\d-|^3\d-/.test(n) || /file_000|chatgpt|image - 20/i.test(n))
    return "editorial";
  if (r.includes("macramé") || r.includes("macrame\\") || /macramé/i.test(rel)) return "editorial";
  return "biblioteca";
}

function shouldDisplay(quality, name) {
  if (quality === "referencia") return false;
  if (/generated_video/i.test(name)) return false;
  return true;
}

const CATEGORY_META = [
  { id: "acessorios", match: /acess[oó]rios/i, name: "Acessórios", group: "vestuario", ambientes: ["praia", "casamento", "urbano-loft"] },
  { id: "balancos", match: /balan[cç]o/i, name: "Balanços", group: "mobiliario", ambientes: ["bercario-ninho", "tropical", "praia", "rustico-cabana"] },
  { id: "bercos", match: /ber[cç]o/i, name: "Berços", group: "infantil", ambientes: ["bercario-ninho", "chale"] },
  { id: "bolsas", match: /bolsas/i, name: "Bolsas", group: "vestuario", ambientes: ["urbano-loft", "praia", "cafe"] },
  { id: "cabanas", match: /cabana/i, name: "Cabanas", group: "mobiliario", ambientes: ["rustico-cabana", "praia", "infantil"] },
  { id: "cadeiras-macas", match: /cadeiras|macas/i, name: "Cadeiras e Maças", group: "mobiliario", ambientes: ["praia", "piscina-oasis", "tropical", "hotel-boutique"] },
  { id: "carregadores", match: /carregador/i, name: "Carregadores", group: "objetos", ambientes: ["urbano-loft", "tecnologico"] },
  { id: "chaveiros", match: /chaveiros/i, name: "Chaveiros", group: "objetos", ambientes: ["urbano-loft", "cafe"] },
  { id: "cocares", match: /cocar/i, name: "Cocares", group: "ritual", ambientes: ["mistico-oraculo", "espiritual-templo", "civilizacoes", "artistico"] },
  { id: "cortinas", match: /cortinas/i, name: "Cortinas", group: "têxtil", ambientes: ["tropical", "praia", "casamento", "hotel-boutique"] },
  { id: "espelhos", match: /espelho/i, name: "Espelhos", group: "parede", ambientes: ["urbano-loft", "praia", "hotel-boutique", "luxo-haute-decor"] },
  { id: "lustres", match: /lustre/i, name: "Lustres", group: "iluminacao", ambientes: ["hotel-boutique", "rustico-cabana", "dark-luxury-noir", "classico-palacete"] },
  { id: "mantas", match: /mantas/i, name: "Mantas", group: "têxtil", ambientes: ["urbano-loft", "campo", "chale", "montanha"] },
  { id: "mesa", match: /\\mesa$|\/mesa$|\\mesa\\/i, name: "Mesa", group: "têxtil", ambientes: ["cafe", "restaurante", "praia"] },
  { id: "paineis", match: /paineis|pain[eé]is/i, name: "Painéis", group: "parede", ambientes: ["artistico", "casamento", "luxo-haute-decor", "espiritual-templo"] },
  { id: "quadros", match: /quadros/i, name: "Quadros", group: "parede", ambientes: ["artistico", "classico-palacete", "urbano-loft"] },
  { id: "saias", match: /saias/i, name: "Saias", group: "vestuario", ambientes: ["praia", "casamento", "tropical"] },
  { id: "sandalias", match: /sand[aâ]lias/i, name: "Sandálias", group: "vestuario", ambientes: ["praia", "piscina-oasis", "deserto"] },
  { id: "sousplats", match: /sousplat|souplat/i, name: "Sousplats", group: "mesa", ambientes: ["restaurante", "cafe", "praia", "casamento"] },
  { id: "suportes-plantas", match: /suporte para plantas/i, name: "Suportes para plantas", group: "biofilico", ambientes: ["biofilico-floresta", "tropical", "zen-wabi-sabi", "urbano-loft"] },
  { id: "suportes-prateleira", match: /suporte prateleira/i, name: "Prateleiras", group: "mobiliario", ambientes: ["urbano-loft", "minimalista-silencio"] },
  { id: "suportes-cameras", match: /suporte para c[aâ]meras/i, name: "Suportes para câmeras", group: "objetos", ambientes: ["tecnologico", "urbano-loft"] },
  { id: "suportes-higiene", match: /papel higi[eê]nico/i, name: "Suportes de higiene", group: "objetos", ambientes: ["hotel-boutique", "rustico-cabana"] },
  { id: "suportes-toalha", match: /suporte para toalha/i, name: "Suportes para toalha", group: "objetos", ambientes: ["praia", "hotel-boutique"] },
  { id: "tapetes", match: /tapete/i, name: "Tapetes", group: "têxtil", ambientes: ["campo", "rustico-cabana", "deserto"] },
  { id: "tops", match: /\\top$|\/top$|\\top\\/i, name: "Tops", group: "vestuario", ambientes: ["praia", "tropical", "casamento"] },
  { id: "travesseiros", match: /travesseiro|almofada/i, name: "Almofadas e travesseiros", group: "têxtil", ambientes: ["urbano-loft", "chale", "praia", "hotel-boutique"] },
  { id: "carnaval", match: /carnaval/i, name: "Carnaval", group: "vestuario", ambientes: ["tropical", "artistico"] },
  { id: "registros", match: /__never__/i, name: "Registros do ateliê", group: "arquivo", ambientes: ["urbano-loft"] },
];

function inferCategoryId(name, rel) {
  const n = (name + " " + rel).toLowerCase();
  if (/espelho|mirror/.test(n)) return "espelhos";
  if (/lustre|luminar|lamp|pendente|chandelier/.test(n)) return "lustres";
  if (/painel|wall hanging|cesto/.test(n)) return "paineis";
  if (/bolsa|bag|clutch|hobo/.test(n)) return "bolsas";
  if (/(^|[\s\-])top([\s\-]|$)|\bcrop\b/.test(n)) return "tops";
  if (/ber[cç]o|cradle|moises/.test(n)) return "bercos";
  if (/cortina/.test(n)) return "cortinas";
  if (/manta|throw|peseira/.test(n)) return "mantas";
  if (/almofada|pillow|travesseiro/.test(n)) return "travesseiros";
  if (/chaveiro/.test(n)) return "chaveiros";
  if (/sand[aá]lia|sandal/.test(n)) return "sandalias";
  if (/saia|saida de praia/.test(n)) return "saias";
  if (/sousplat|souplat|porta-copos/.test(n)) return "sousplats";
  if (/cocar/.test(n)) return "cocares";
  if (/balan[cç]o/.test(n)) return "balancos";
  if (/cabana/.test(n)) return "cabanas";
  if (/tapete|rug/.test(n)) return "tapetes";
  if (/brinco|colar|acess/.test(n)) return "acessorios";
  if (/suporte.*planta|plant hanger|vaso/.test(n)) return "suportes-plantas";
  if (/quadro/.test(n)) return "quadros";
  if (/mesa|caminho de mesa/.test(n)) return "mesa";
  if (/cadeira|ma[cç]a|hammock/.test(n)) return "cadeiras-macas";
  return null;
}

function categoryFromRel(rel, name) {
  const posix = rel.replace(/\\/g, "/");
  for (const c of CATEGORY_META) {
    if (c.match.test(posix) || c.match.test(rel)) return c;
  }
  if (/bolsas de macram/i.test(posix)) return CATEGORY_META.find((c) => c.id === "bolsas");
  if (/suportes de macram/i.test(posix)) return CATEGORY_META.find((c) => c.id === "suportes-plantas");
  const inferred = inferCategoryId(name || "", rel);
  if (inferred) return CATEGORY_META.find((c) => c.id === inferred) || null;
  return null;
}

function prettyName(file, cat) {
  const base = path.parse(file).name
    .replace(/[_-]+/g, " ")
    .replace(/\(\d+\)$/g, "")
    .trim();
  const numbered = base.match(/^(\d{2})\s+(.+)/);
  if (numbered) {
    return titleCase(numbered[2]);
  }
  if (/^[a-f0-9]{8,}$/i.test(base.replace(/\s/g, "")) || /file 000|chatgpt|image 20|download/i.test(base)) {
    return cat ? `Peça ${cat.name}` : "Peça autoral";
  }
  if (base.length > 42) return cat ? cat.name : "Peça autoral";
  return titleCase(base);
}

function titleCase(s) {
  return s
    .replace(/macrame/gi, "macramê")
    .split(/\s+/)
    .map((w) => (w.length <= 2 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join(" ")
    .replace(/\bMacramê\b/g, "macramê");
}

const AMBIENTES = [
  { id: "artistico", name: "Artístico", subtitle: "Galeria Têxtil", pecas: ["paineis", "quadros", "cocares"], mood: "Galeria íntima, peça como obra." },
  { id: "bercario-ninho", name: "Berçário", subtitle: "Ninho", pecas: ["bercos", "balancos", "travesseiros"], mood: "Acolhimento, fio macio, silêncio." },
  { id: "biofilico-floresta", name: "Biofílico", subtitle: "Floresta Interna", pecas: ["suportes-plantas", "lustres", "cortinas"], mood: "Verde vivo entre nós naturais." },
  { id: "cafe", name: "Café", subtitle: "Café Artesanal", pecas: ["mesa", "sousplats", "lustres"], mood: "Mesa lenta, corda e cerâmica." },
  { id: "campo", name: "Campo", subtitle: "Casa de Fazenda", pecas: ["mantas", "tapetes", "paineis"], mood: "Linho, pólen, sombra de varanda." },
  { id: "casamento", name: "Casamento", subtitle: "Wedding Macramê", pecas: ["paineis", "cortinas", "saias"], mood: "Cerimônia têxtil, fundo de altar." },
  { id: "chale", name: "Chalé", subtitle: "Chalet Macramê", pecas: ["lustres", "mantas", "travesseiros"], mood: "Madeira, fogo baixo, franja." },
  { id: "civilizacoes", name: "Civilizações", subtitle: "Arqueologia Têxtil", pecas: ["cocares", "paineis", "tapetes"], mood: "Nós como memória ancestral." },
  { id: "classico-palacete", name: "Clássico", subtitle: "Palacete", pecas: ["lustres", "quadros", "cortinas"], mood: "Altura, simetria, algodão cru." },
  { id: "dark-luxury-noir", name: "Dark Luxury", subtitle: "Noir", pecas: ["lustres", "paineis", "espelhos"], mood: "Sombra, âmbar, silêncio caro." },
  { id: "deserto", name: "Deserto", subtitle: "Sahara", pecas: ["tapetes", "sandalias", "paineis"], mood: "Areia, ocre, vento parado." },
  { id: "espiritual-templo", name: "Espiritual", subtitle: "Templo", pecas: ["paineis", "cocares", "lustres"], mood: "Ritual, eixo vertical, pausa." },
  { id: "hotel-boutique", name: "Hotel Boutique", subtitle: "Hospitality", pecas: ["lustres", "espelhos", "travesseiros"], mood: "Chegada, luz baixa, assinatura." },
  { id: "luxo-haute-decor", name: "Luxo", subtitle: "Haute Décor", pecas: ["paineis", "espelhos", "lustres"], mood: "Peça monumental, hotel de autor." },
  { id: "minimalista-silencio", name: "Minimalista", subtitle: "Silêncio", pecas: ["paineis", "suportes-prateleira", "quadros"], mood: "Um gesto. Muito ar." },
  { id: "montanha", name: "Montanha", subtitle: "Refúgio", pecas: ["mantas", "tapetes", "lustres"], mood: "Lã visual, abrigo, pedra." },
  { id: "mistico-oraculo", name: "Místico", subtitle: "Oráculo", pecas: ["cocares", "paineis", "chaveiros"], mood: "Símbolo, sombra, fio-guia." },
  { id: "nautico", name: "Náutico", subtitle: "Yacht Macramê", pecas: ["cortinas", "cadeiras-macas", "sousplats"], mood: "Corda de barco, horizonte." },
  { id: "piscina-oasis", name: "Piscina", subtitle: "Oásis", pecas: ["cadeiras-macas", "sandalias", "suportes-plantas"], mood: "Sombra molhada, descanso." },
  { id: "praia", name: "Praia", subtitle: "Casa Mediterrânea", pecas: ["bolsas", "sandalias", "saias", "espelhos"], mood: "Sal, cal, algodão cru." },
  { id: "restaurante", name: "Restaurante", subtitle: "Gastronomia", pecas: ["sousplats", "mesa", "lustres"], mood: "Mesa posta, tecido como serviço." },
  { id: "rustico-cabana", name: "Rústico", subtitle: "Cabana Artesanal", pecas: ["cabanas", "lustres", "tapetes"], mood: "Barro, tronco, lamparina." },
  { id: "tecnologico", name: "Tecnológico", subtitle: "Digital Macramê", pecas: ["carregadores", "suportes-cameras", "espelhos"], mood: "Fio + objeto contemporâneo." },
  { id: "tropical", name: "Tropical", subtitle: "Jardim Tropical", pecas: ["cortinas", "suportes-plantas", "tops"], mood: "Sombra verde, brisa, cor." },
  { id: "urbano-loft", name: "Urbano", subtitle: "Loft", pecas: ["mantas", "espelhos", "bolsas", "travesseiros"], mood: "Apartamento, textura, cidade." },
  { id: "zen-wabi-sabi", name: "Zen Japonês", subtitle: "Wabi-Sabi", pecas: ["suportes-plantas", "paineis", "quadros"], mood: "Imperfeição bela, vazio útil." },
];

const EDITORIAL_NAMES = {
  "01-manta-sofa-apartamento": { name: "Manta no sofá", category: "mantas", ambientes: ["urbano-loft"] },
  "02-painel-pequeno": { name: "Painel pequeno", category: "paineis", ambientes: ["urbano-loft", "minimalista-silencio"] },
  "03-quadro-macrame": { name: "Quadro de macramê", category: "quadros", ambientes: ["artistico"] },
  "05-berco-redondo-macrame": { name: "Berço redondo", category: "bercos", ambientes: ["bercario-ninho"] },
  "06-sala-manta-almofadas": { name: "Sala com manta e almofadas", category: "travesseiros", ambientes: ["urbano-loft"] },
  "08-ambiente-quarto-almofadas": { name: "Quarto com almofadas", category: "travesseiros", ambientes: ["bercario-ninho", "chale"] },
  "09-ambiente-lustres-plantas": { name: "Lustres e plantas", category: "lustres", ambientes: ["biofilico-floresta", "hotel-boutique"] },
  "10-natal-arvore-estrelas": { name: "Estrelas de Natal", category: "paineis", ambientes: ["chale"] },
  "11-natal-pendurando-estrela": { name: "Estrela suspensa", category: "paineis", ambientes: ["chale"] },
  "13-cortina-macrame-verde": { name: "Cortina verde", category: "cortinas", ambientes: ["tropical"] },
  "14-souplat-porta-copos": { name: "Sousplat e porta-copos", category: "sousplats", ambientes: ["restaurante", "cafe"] },
  "15-lustre-creme-aceso": { name: "Lustre creme aceso", category: "lustres", ambientes: ["hotel-boutique"] },
  "16-lustre-duplo-corredor": { name: "Lustres no corredor", category: "lustres", ambientes: ["hotel-boutique", "urbano-loft"] },
  "17-lustre-tambor-cordao": { name: "Lustre tambor", category: "lustres", ambientes: ["rustico-cabana"] },
  "18-top-amarelo-creme": { name: "Top amarelo e creme", category: "tops", ambientes: ["praia"] },
  "19-top-oliva": { name: "Top oliva", category: "tops", ambientes: ["tropical"] },
  "20-top-creme": { name: "Top creme", category: "tops", ambientes: ["praia"] },
  "21-top-selfie-espelho": { name: "Top no espelho", category: "tops", ambientes: ["urbano-loft"] },
  "22-top-mostarda-ombro": { name: "Top mostarda", category: "tops", ambientes: ["deserto"] },
  "23-top-terracota": { name: "Top terracota", category: "tops", ambientes: ["deserto", "praia"] },
  "24-bolsa-hobo-verde": { name: "Bolsa hobo verde", category: "bolsas", ambientes: ["urbano-loft"], price: 280, status: "disponivel" },
  "25-cestos-parede-navy": { name: "Cestos de parede", category: "paineis", ambientes: ["nautico", "urbano-loft"] },
  "26-passeio-golden-coleira": { name: "Coleira", category: "acessorios", ambientes: ["campo"] },
  "29-casa-praia-almofadas": { name: "Casa de praia", category: "travesseiros", ambientes: ["praia"] },
  "30-chaveiro-bege": { name: "Chaveiro bege", category: "chaveiros", ambientes: ["urbano-loft"] },
  "31-clutch-tassels": { name: "Clutch com tassels", category: "bolsas", ambientes: ["casamento", "praia"] },
};

const OFFICIAL_PRICE = {
  "a16bd6bd-7aae-43db-a863-c0d9cd7a97a3_rmsstn": { name: "Espelho Boho", category: "espelhos", price: 300, status: "disponivel", ambientes: ["urbano-loft", "praia"] },
  "8942bfa0-ee1a-4d7d-9bde-565dcb6335d6_uhcagt": { name: "Almofadas Finesse", category: "travesseiros", price: 180, status: "disponivel", ambientes: ["urbano-loft", "hotel-boutique"] },
  "luminaria_macrame_premium_w3cr1r_djequ1": { name: "Luminária premium", category: "lustres", status: "consultar", ambientes: ["rustico-cabana", "luxo-haute-decor"] },
};

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function run() {
  ensureDir(DATA);
  ensureDir(path.join(ASSETS, "atelier"));
  ensureDir(path.join(ASSETS, "editorial"));
  ensureDir(path.join(ASSETS, "instagram"));
  ensureDir(path.join(ASSETS, "pecas"));
  ensureDir(path.join(ASSETS, "ambientes"));
  ensureDir(path.join(ASSETS, "projetos"));
  ensureDir(path.join(ASSETS, "generated"));
  ensureDir(path.join(ASSETS, "video"));
  ensureDir(path.join(ASSETS, "referencias"));

  const files = walk(SRC);
  const counters = {};
  const pecas = [];
  const index = [];
  const videos = [];
  let copied = 0;
  let skippedCopia = 0;

  for (const full of files) {
    const rel = path.relative(SRC, full);
    const ext = path.extname(full).toLowerCase();
    const name = path.basename(full);
    const dir = path.dirname(rel);

    if (isCopiaInteriores(rel)) {
      skippedCopia++;
      continue;
    }

    const kind = IMG_EXT.has(ext) ? "image" : VID_EXT.has(ext) ? "video" : "other";
    const quality = qualityOf(rel, name);
    const cat = categoryFromRel(rel, name);
    const stem = path.parse(name).name;
    const editorial = EDITORIAL_NAMES[stem];
    const official = OFFICIAL_PRICE[stem];
    const display = kind === "image" && shouldDisplay(quality, name);

    const rec = {
      original: rel.replace(/\\/g, "/"),
      name,
      kind,
      quality,
      category: (official && official.category) || (editorial && editorial.category) || (cat && cat.id) || null,
      interioresFolder: isInteriores(rel),
      display,
    };

    if (kind === "video") {
      const dest = path.join(ASSETS, "video", slugify(stem) + ext);
      copyFile(full, dest);
      copied++;
      rec.local = "assets/video/" + path.basename(dest);
      videos.push(rec);
      index.push(rec);
      continue;
    }

    if (kind !== "image") {
      index.push(rec);
      continue;
    }

    let bucket = "referencias";
    if (!cat && (dir === "." || dir === "")) bucket = "atelier";
    else if (quality === "instagram") bucket = "instagram";
    else if (quality === "atelier") bucket = "atelier";
    else if (cat) bucket = path.join("pecas", cat.id);
    else if (quality === "editorial") bucket = "editorial";
    else bucket = "editorial";

    if (quality === "referencia") bucket = "referencias";

    const key = bucket;
    counters[key] = (counters[key] || 0) + 1;
    const destName = String(counters[key]).padStart(2, "0") + "-" + (slugify(stem) || "peca") + ext;
    const dest = path.join(ASSETS, bucket, destName);
    copyFile(full, dest);
    copied++;
    const local = ("assets/" + bucket + "/" + destName).replace(/\\/g, "/");
    rec.local = local;
    index.push(rec);

    if (!display) continue;

    const meta = official || editorial || {};
    const categoryId = rec.category || "registros";
    const catMeta = CATEGORY_META.find((c) => c.id === categoryId) || {
      id: "registros",
      name: "Registros do ateliê",
      group: "arquivo",
      ambientes: ["urbano-loft"],
    };
    const id = slugify((meta.name || prettyName(name, catMeta)) + "-" + counters[key] + "-" + categoryId);

    pecas.push({
      id,
      name: meta.name || prettyName(name, catMeta) || "Peça autoral",
      category: categoryId,
      categoryName: catMeta ? catMeta.name : "Coleção",
      status: meta.status || "consultar",
      price: meta.price || null,
      priceLabel: meta.price ? `R$ ${meta.price.toFixed(2).replace(".", ",")}` : "Consultar",
      image: local,
      gallery: [local],
      ambientes: meta.ambientes || (catMeta && catMeta.ambientes) || [],
      source: quality,
      placeholder: false,
    });
  }

  const catSeen = new Map();
  for (const p of pecas) {
    if (!catSeen.has(p.category)) {
      const m = CATEGORY_META.find((c) => c.id === p.category);
      catSeen.set(p.category, {
        id: p.category,
        name: p.categoryName,
        group: m ? m.group : "colecao",
        count: 0,
        cover: p.image,
        ambientes: m ? m.ambientes : [],
      });
    }
    catSeen.get(p.category).count++;
  }

  // categorias vazias conhecidas
  for (const c of CATEGORY_META) {
    if (!catSeen.has(c.id)) {
      catSeen.set(c.id, {
        id: c.id,
        name: c.name,
        group: c.group,
        count: 0,
        cover: null,
        ambientes: c.ambientes,
        placeholder: true,
      });
    }
  }

  const categorias = [...catSeen.values()].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  const ambientes = AMBIENTES.map((a) => {
    const related = pecas.filter((p) => p.ambientes.includes(a.id) || a.pecas.includes(p.category));
    const covers = related.map((p) => p.image);
    const generatedMap = {
      "luxo-haute-decor": "assets/generated/luxo-haute-decor.jpg",
      "biofilico-floresta": "assets/generated/biofilico-floresta.jpg",
      "dark-luxury-noir": "assets/generated/dark-luxury-noir.jpg",
      "minimalista-silencio": "assets/generated/minimalista-silencio.jpg",
    };
    const prefer = {
      "hotel-boutique": (p) => p.category === "lustres" && (p.source === "instagram" || p.source === "atelier"),
      "rustico-cabana": (p) => /lumin[aá]ria premium/i.test(p.name) || (p.category === "lustres" && p.source === "atelier"),
      "praia": (p) => /praia/i.test(p.name),
      "urbano-loft": (p) => /manta no sof[aá]/i.test(p.name),
      "bercario-ninho": (p) => p.category === "bercos",
      "artistico": (p) => p.category === "paineis" && p.source === "biblioteca",
    };
    let picked = related.find(prefer[a.id] || (() => false));
    if (!picked) {
      const rank = { atelier: 0, instagram: 1, biblioteca: 2, editorial: 3 };
      picked = [...related].sort((x, y) => (rank[x.source] ?? 9) - (rank[y.source] ?? 9))[0];
    }
    const generatedSrc = generatedMap[a.id];
    if (generatedSrc) {
      const destDir = path.join(ASSETS, "ambientes", a.id);
      ensureDir(destDir);
      const abs = path.join(ROOT, generatedSrc);
      if (fs.existsSync(abs)) {
        fs.copyFileSync(abs, path.join(destDir, "hero.jpg"));
      }
    }
    const hero = generatedSrc
      ? `assets/ambientes/${a.id}/hero.jpg`
      : (picked && picked.image) || covers[0] || null;
    const hasGenerated = Boolean(generatedSrc);
    return {
      id: a.id,
      name: a.name,
      subtitle: a.subtitle,
      conceito: a.mood,
      pecasRelacionadas: a.pecas,
      hero,
      gallery: [...new Set([hero, ...covers.filter(Boolean)])].filter(Boolean).slice(0, 8),
      placeholder: !hero,
      heroSource: hasGenerated ? "generated-direction" : hero ? "biblioteca" : "placeholder",
      cta: "Quero um projeto neste estilo",
    };
  });

  const projetos = [
    {
      id: "corredor-lustres",
      name: "Corredor com lustres",
      ambiente: "hotel-boutique",
      pecas: ["lustres"],
      image: pecas.find((p) => /lustre/i.test(p.name) && p.source === "instagram")?.image || pecas.find((p) => p.category === "lustres")?.image,
      status: "realizado",
    },
    {
      id: "espelho-atelier",
      name: "Espelho Boho no ateliê",
      ambiente: "urbano-loft",
      pecas: ["espelhos"],
      image: pecas.find((p) => /espelho boho/i.test(p.name))?.image || pecas.find((p) => p.category === "espelhos")?.image,
      status: "realizado",
    },
    {
      id: "ninho-berco",
      name: "Ninho — berço suspenso",
      ambiente: "bercario-ninho",
      pecas: ["bercos"],
      image: pecas.find((p) => p.category === "bercos")?.image,
      status: "referencia",
    },
    {
      id: "casa-praia",
      name: "Casa de praia",
      ambiente: "praia",
      pecas: ["travesseiros", "cortinas"],
      image: pecas.find((p) => /praia/i.test(p.name))?.image,
      status: "editorial",
    },
    {
      id: "luminaria-premium",
      name: "Luminária premium",
      ambiente: "rustico-cabana",
      pecas: ["lustres"],
      image: pecas.find((p) => /lumin[aá]ria premium/i.test(p.name))?.image,
      status: "realizado",
    },
    {
      id: "painel-sala",
      name: "Painel na sala",
      ambiente: "urbano-loft",
      pecas: ["paineis"],
      image: pecas.find((p) => p.source === "atelier" && /painel/i.test(p.name + p.image))?.image || pecas.find((p) => p.category === "paineis")?.image,
      status: "realizado",
    },
  ].filter((p) => p.image);

  const brand = {
    name: "MACR_AMO_",
    artist: "Paloma Batistta",
    tagline: "Conexões através dos nós",
    headline: "Arte em macramê que transforma ambientes.",
    kicker: "Design de Interiores Artesanal",
    about:
      "Na MACR_AMO_, não vendemos apenas decoração; entregamos uma experiência sensorial. Cada fio é trançado com intenção, unindo técnicas ancestrais a um design contemporâneo que valoriza o tempo e a matéria-prima natural.",
    instagram: "https://instagram.com/macr_amo_",
    instagramHandle: "@macr_amo_",
    whatsapp: "5571987220342",
    whatsappLabel: "(71) 9 8722-0342",
    city: "Bahia",
    officialPreview: "https://macr-amo.web.app/",
    handmade: "100% handmade",
    materials: "Materiais premium",
  };

  const stats = {
    sourceFiles: files.length,
    imagesIndexed: index.filter((i) => i.kind === "image").length,
    videos: videos.length,
    copied,
    skippedCopia,
    pecas: pecas.length,
    categorias: categorias.length,
    categoriasComImagem: categorias.filter((c) => c.count > 0).length,
    ambientes: ambientes.length,
    ambientesComHero: ambientes.filter((a) => !a.placeholder).length,
    ambientesPlaceholder: ambientes.filter((a) => a.placeholder).length,
    projetos: projetos.length,
  };

  const payload = { brand, stats, categorias, pecas, ambientes, projetos, videos, index };

  fs.writeFileSync(path.join(DATA, "brand.json"), JSON.stringify(brand, null, 2));
  fs.writeFileSync(path.join(DATA, "categorias.json"), JSON.stringify(categorias, null, 2));
  fs.writeFileSync(path.join(DATA, "pecas.json"), JSON.stringify(pecas, null, 2));
  fs.writeFileSync(path.join(DATA, "ambientes.json"), JSON.stringify(ambientes, null, 2));
  fs.writeFileSync(path.join(DATA, "projetos.json"), JSON.stringify(projetos, null, 2));
  fs.writeFileSync(path.join(DATA, "catalog-index.json"), JSON.stringify({ stats, index }, null, 2));
  fs.writeFileSync(path.join(DATA, "site.json"), JSON.stringify(payload, null, 2));
  fs.writeFileSync(
    path.join(ROOT, "js", "data.js"),
    "window.MACRAMO = " + JSON.stringify(payload) + ";\n"
  );

  console.log(JSON.stringify(stats, null, 2));
}

ensureDir(path.join(ROOT, "js"));
run();
