# Cafe 22

Cafe 22 e uma aplicacao web afetiva feita em React para guardar a historia da Mesa 22 em formato de cafeteria digital. O site combina contador de relacionamento, radio, cardapio simbolico, reserva da mesa, mural de fotos e arquivo de conversas em visual inspirado em chat.

## Visao Geral

O sistema foi construido como uma single-page application com navegacao interna por abas. A experiencia principal e mobile-first, mas tambem funciona em telas maiores.

Principais areas:

- **Balcao**: tela inicial com foto de capa, contador desde 22/11/2025, radio e atalhos.
- **Cardapio**: lista de pedidos simbolicos que abrem um recibo modal.
- **Mesa 22**: dados da reserva, status do relacionamento, acao com confetti e cartao fidelidade.
- **Mural**: galeria de fotos em estilo polaroid.
- **Arquivo**: linha do tempo de conversas reais, renderizadas em bolhas de chat.

## Stack

- React 19
- Vite 7
- Tailwind CSS 4
- PostCSS com `@tailwindcss/postcss`
- Framer Motion para animacoes
- Lucide React para icones
- Canvas Confetti para celebracao
- Vite PWA para manifest/service worker

## Requisitos

- Node.js 20 ou superior
- npm

O Tailwind 4 usa pacotes nativos e declara `node >= 20` em partes da cadeia. Se o projeto falhar em maquinas antigas, confirme a versao com:

```bash
node -v
```

## Como Rodar

Instale as dependencias:

```bash
npm install
```

Rode em desenvolvimento:

```bash
npm run dev
```

Abra a URL exibida pelo Vite, normalmente:

```text
http://localhost:5173
```

Gerar build de producao:

```bash
npm run build
```

Visualizar o build localmente:

```bash
npm run preview
```

Rodar lint:

```bash
npm run lint
```

## Estrutura do Projeto

```text
cafe22/
  index.html
  package.json
  package-lock.json
  postcss.config.js
  vite.config.js
  eslint.config.js
  public/
    musica.mp3
    vite.svg
    img/
      favicon.jpg
      capa1.jpg
      sade.jpg
      tudo.jpg
      foto1.jpg
      foto2.jpg
      foto3.jpg
      ...
  src/
    main.jsx
    App.jsx
    index.css
    data/
      cafeArchive.js
    lib/
      utils.js
```

## Arquivos Importantes

### `src/App.jsx`

Contem a aplicacao principal e todos os componentes visuais:

- `App`: controla a aba ativa, o recibo aberto e o evento selecionado no arquivo.
- `Header` e `BottomNav`: navegacao desktop e mobile.
- `Balcao`: home com hero, contador, radio e atalhos.
- `TimerCard`: contador desde a data de inicio.
- `RadioCard`: player de audio para `/musica.mp3`.
- `Cardapio`: lista de itens simbolicos.
- `Mesa22`: reserva, informacoes e cartao fidelidade.
- `Arquivo`: lista de eventos e conversa ativa.
- `CoffeeTalk` e `ChatBubble`: renderizacao das mensagens.
- `Mural`: galeria de fotos.
- `ReceiptModal`: recibo gerado ao pedir um item.

### `src/data/cafeArchive.js`

Guarda os eventos do arquivo de conversas. Cada evento pode conter:

```js
{
  id: "identificador-unico",
  date: "2025-05-06",
  displayDate: "06 de maio de 2025",
  title: "Titulo do evento",
  label: "Etiqueta curta",
  summary: "Resumo afetivo do evento",
  chapters: ["Opcional", "Para eventos longos"],
  messages: [
    {
      stamp: "06/05/2025 13:29",
      author: "Melzudin",
      text: "Texto da mensagem"
    }
  ]
}
```

### `src/index.css`

Define Tailwind 4 via `@import "tailwindcss";`, tokens de tema com `@theme` e classes utilitarias customizadas:

- `cafe-texture`
- `eyebrow`
- `action-card`
- `menu-card`
- `icon-action`
- `receipt-paper`
- `whatsapp-pattern`

### `postcss.config.js`

Carrega os plugins de CSS:

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

Se aparecer erro dizendo que `@tailwindcss/postcss` nao foi encontrado, rode:

```bash
npm install
```

As dependencias corretas ja estao registradas no `package.json` e no `package-lock.json`.

### `vite.config.js`

Configura React e PWA. A PWA gera manifest e service worker no build.

## Como Editar Conteudo

### Alterar fotos do mural

1. Coloque a imagem em `public/img/`.
2. Edite o array `muralItems` em `src/App.jsx`.
3. Use caminho iniciado por `/img/`.

Exemplo:

```js
{ src: "/img/nova-foto.jpg", title: "Novo momento", tag: "Mesa 22" }
```

### Alterar itens do cardapio

Edite o array `menuItems` em `src/App.jsx`.

Campos usados:

- `name`
- `category`
- `price`
- `icon`
- `description`
- `forbidden` opcional para item vetado

### Alterar datas do contador

As datas principais estao no topo de `src/App.jsx`:

```js
const startDate = new Date(2025, 10, 22, 0, 0, 0);
const sixMonthsDate = new Date(2026, 4, 22, 0, 0, 0);
```

Observacao: em JavaScript, o mes comeca em zero. Portanto `10` e novembro, e `4` e maio.

### Alterar conversas do arquivo

Edite `src/data/cafeArchive.js`.

Boas praticas:

- Mantenha `id` unico.
- Use `date` em formato `YYYY-MM-DD`.
- Use `displayDate` ja formatado em portugues.
- Preserve `author` exatamente como esperado pelo layout quando quiser alinhar a mensagem:
  - `Melzudin` fica a direita.
  - Qualquer outro autor fica a esquerda.

## Assets

Todos os arquivos publicos ficam em `public/`.

- Audio da radio: `public/musica.mp3`
- Imagens: `public/img/`
- Favicon: `public/img/favicon.jpg`

Em Vite, arquivos dentro de `public` sao acessados pela raiz da URL. Exemplo:

```jsx
<img src="/img/foto1.jpg" alt="Descricao" />
```

## PWA

O projeto usa `vite-plugin-pwa` com `registerType: 'autoUpdate'`. No build, sao gerados:

- `dist/manifest.webmanifest`
- `dist/sw.js`
- arquivos auxiliares do Workbox

O manifest fica configurado em `vite.config.js`.

## Build e Deploy

Para deploy estatico, rode:

```bash
npm run build
```

O resultado sai em:

```text
dist/
```

Esse diretorio pode ser publicado em plataformas de hospedagem estatica, como Vercel, Netlify, Cloudflare Pages ou GitHub Pages com configuracao apropriada.

Com Vercel, a configuracao padrao geralmente e:

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

## Manutencao

Antes de entregar mudancas:

```bash
npm run lint
npm run build
```

Se o site estiver aberto em desenvolvimento e uma mudanca de configuracao nao aparecer:

1. Pare o servidor.
2. Rode `npm install`, se dependencias mudaram.
3. Inicie novamente com `npm run dev`.
4. Recarregue a pagina no navegador.

## Privacidade

Este projeto contem fotos, audio e mensagens pessoais. Evite publicar o repositorio ou o deploy em ambientes publicos sem revisar o conteudo em:

- `public/img/`
- `public/musica.mp3`
- `src/data/cafeArchive.js`

