# MACR_AMO_ — ecossistema V1 (preview local)

Pasta: `C:\Users\yanfi\Desktop\Macramoecossistemapalomabatistta`

Não usa GitHub. Não publica o site oficial. Abra o preview na sua máquina.

## Abrir

Duplo clique em `preview.bat`  
ou no terminal:

```
node tools\preview-server.js
```

URL: http://127.0.0.1:4173

## O que esta V1 faz

Site HTML + CSS + JS, catálogo em JSON, páginas:

- HOME
- AMBIENTES (26) + página de cada ambiente
- PEÇAS (categorias da biblioteca) + página de cada peça
- PROJETOS
- SOBRE
- CONTATO (WhatsApp)

Cada ambiente: hero, conceito, galeria, peças relacionadas, CTA “Quero um projeto neste estilo”, WhatsApp.  
Cada peça: imagem, galeria, categoria, ambientes, status, CTA de orçamento.

## Números (catalogação única da pasta Macramo)

| Item | Qtd |
|---|---|
| Imagens indexadas | 288 |
| Vídeos | 5 |
| Peças no catálogo (exibíveis) | 265 |
| Categorias de peças | 29 |
| Categorias com foto | 26 |
| Categorias ainda vazias | 3 (Carnaval, Suportes de higiene, Suportes para toalha) |
| Ambientes | 26 |
| Projetos-amostra | 6 |
| Imagens **novas** geradas | 4 |

## Imagens novas (direção visual, sem pessoas, sem texto)

1. `assets/generated/luxo-haute-decor.jpg` → `assets/ambientes/luxo-haute-decor/hero.jpg`
2. `assets/generated/biofilico-floresta.jpg` → `assets/ambientes/biofilico-floresta/hero.jpg`
3. `assets/generated/dark-luxury-noir.jpg` → `assets/ambientes/dark-luxury-noir/hero.jpg`
4. `assets/generated/minimalista-silencio.jpg` → `assets/ambientes/minimalista-silencio/hero.jpg`

O restante reaproveita a biblioteca original (ateliê, peças, Instagram, editorial).

## JSON

`data/brand.json`  
`data/ambientes.json`  
`data/pecas.json`  
`data/categorias.json`  
`data/projetos.json`  
`data/catalog-index.json`  
`data/site.json`  
`js/data.js` (mesmo conteúdo, para o site abrir sem backend)

Edite o JSON e rode de novo `node tools/catalog.js` só se a pasta `Desktop\Macramo` mudar. O site lê `js/data.js` — se você editar JSON à mão, copie para `js/data.js` ou recatalogue.

## O que ainda é provisório

- 22 ambientes usam foto da biblioteca (não hero dedicado). Troque depois em `assets/ambientes/{id}/hero.jpg`.
- Categoria **Registros do ateliê**: prints e arquivos soltos ainda não classificados.
- Muitas fotos da pasta `Macramê` são referência (Pinterest/tutorial). Ficaram em `assets/referencias/` e não entram no shop.
- Textos de peça genéricos (“Peça Painéis”) nos arquivos sem nome bonito.
- Preços só nas peças do site oficial (bolsa 280, espelho 300, almofadas 180). O resto: Consultar.
- Não publicar no Firebase ainda. `firebase.json` está pronto para quando você quiser.

## Próximo passo (quando for gastar crédito de novo)

1. Gerar **um hero por ambiente** que ainda está com foto emprestada (os 22). Faça aos poucos, 3–5 por vez.
2. Recortar prints do Instagram (tirar chrome da interface).
3. Nomear/ocultar peças em `data/pecas.json`.
4. Só então hospedar um preview (Firebase), nunca no lugar do oficial sem revisar.

## Contato da marca (do site atual)

WhatsApp (71) 9 8722-0342  
Instagram @macr_amo_  
Paloma Batistta
