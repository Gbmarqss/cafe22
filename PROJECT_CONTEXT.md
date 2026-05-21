# Contexto do Projeto: Cafe 22

Este arquivo e o contexto vivo para continuar o desenvolvimento do Cafe 22. Ele serve como handoff para lembrar o que o sistema e, como esta organizado, quais decisoes ja foram tomadas e o que merece cuidado nas proximas mudancas.

## Resumo

Cafe 22 e uma SPA afetiva, personalizada para Melzudin e Advogata, com linguagem visual de cafeteria romantica. A ideia central e transformar datas, fotos, pedidos simbolicos e conversas em uma experiencia unica de memoria.

O site nao e uma landing page generica. Ele ja abre como uma experiencia utilizavel, com navegacao por secoes internas.

## Estado Atual

O projeto esta rodando no navegador apos correcao das dependencias do PostCSS/Tailwind.

Correcao recente:

- `@tailwindcss/postcss` foi adicionado em `devDependencies`.
- `autoprefixer` foi adicionado em `devDependencies`.
- `package-lock.json` foi atualizado junto com `package.json`.
- `npm run build` foi executado e passou.

Motivo da correcao:

O `postcss.config.js` ja apontava para `@tailwindcss/postcss`, mas o pacote nao estava instalado. Como o projeto usa Tailwind 4, esse plugin e necessario para o pipeline de CSS.

## Personalidade do Produto

Tom desejado:

- romantico
- interno
- brincalhao
- de memoria compartilhada
- com estetica de cafeteria
- com cara de presente pessoal, nao produto SaaS

Evitar:

- linguagem corporativa
- secoes de marketing
- excesso de explicacao dentro da interface
- visual generico de dashboard
- refatoracoes grandes sem necessidade

## Publico

O publico principal e uma pessoa especifica, nao usuarios anonimos. Isso muda as decisoes:

- O conteudo pode ser altamente contextual.
- Textos podem conter piadas internas.
- A prioridade e emocao, fluidez e cuidado visual.
- A privacidade dos assets e conversas e importante.

## Arquitetura

Tipo:

- SPA React em Vite
- Estado local com hooks do React
- Sem backend
- Sem roteamento por URL
- Sem banco de dados

Entrada:

- `src/main.jsx` monta `App` no elemento `#root`.

Aplicacao:

- `src/App.jsx` concentra os componentes e dados de UI locais.

Dados longos:

- `src/data/cafeArchive.js` guarda a linha do tempo de conversas.

Estilos:

- `src/index.css` usa Tailwind 4 e tokens customizados com `@theme`.

Assets:

- `public/img/` contem fotos e imagens.
- `public/musica.mp3` e a faixa usada pela radio.

## Navegacao

A navegacao e controlada pelo estado `activeTab` em `App`.

Abas existentes:

- `counter`: Balcao
- `menu`: Cardapio
- `table`: Mesa 22
- `mural`: Mural
- `archive`: Arquivo

Desktop:

- Usa `Header` com nav horizontal.

Mobile:

- Usa `BottomNav` fixa no rodape.

## Componentes Principais

### `App`

Responsabilidades:

- guarda `activeTab`
- guarda `receipt`
- guarda `selectedEventId`
- seleciona `activeEvent`
- renderiza header, conteudo ativo, bottom nav e modal de recibo

### `Balcao`

Home do site.

Contem:

- imagem hero `/img/tudo.jpg`
- texto principal da Mesa 22
- contador
- radio
- atalhos para cardapio e arquivo

### `TimerCard`

Mostra tempo desde `startDate`.

Datas importantes:

- inicio: 22/11/2025
- marco de 6 meses: 22/05/2026

Detalhe tecnico:

Em JavaScript, meses sao baseados em zero:

- `new Date(2025, 10, 22)` significa 22 de novembro de 2025.
- `new Date(2026, 4, 22)` significa 22 de maio de 2026.

### `RadioCard`

Player simples de audio com `useRef` e `useState`.

Asset:

- `/musica.mp3`

Imagem:

- `/img/sade.jpg`

### `Cardapio`

Renderiza `menuItems`.

Ao clicar em um item, chama `onOrder(item)` e abre `ReceiptModal`.

Itens podem ser marcados com:

```js
forbidden: true
```

### `ReceiptModal`

Modal visual de recibo.

Fecha:

- clicando no overlay
- clicando no botao interno

O clique dentro do recibo usa `stopPropagation()`.

### `Mesa22`

Mostra dados da reserva e cards de recursos.

Acao especial:

- botao chama `confetti()`

Tambem inclui:

- `LoyaltyCard`
- link para o Arquivo
- cards informativos

### `Arquivo`

Renderiza a lista lateral/horizontal dos eventos em `archiveEvents`.

Estado selecionado:

- `selectedEventId` fica em `App`
- `Arquivo` recebe `activeEvent` e `setSelectedEventId`

### `CoffeeTalk`

Renderiza a conversa ativa em um painel com visual de chat.

Suporta `chapters` opcional em eventos longos.

### `ChatBubble`

Regra de alinhamento:

- `author === "Melzudin"` alinha a direita.
- outros autores alinham a esquerda.

### `Mural`

Renderiza `muralItems` com fotos em estilo polaroid.

## Dados Editaveis

### Cardapio

Arquivo:

```text
src/App.jsx
```

Array:

```js
const menuItems = [...]
```

### Mural

Arquivo:

```text
src/App.jsx
```

Array:

```js
const muralItems = [...]
```

### Cartao fidelidade

Arquivo:

```text
src/App.jsx
```

Array:

```js
const loyaltyStamps = [...]
```

### Arquivo de conversas

Arquivo:

```text
src/data/cafeArchive.js
```

Export:

```js
export const archiveEvents = [...]
```

## Design System Atual

Tokens de cor e fonte ficam em `src/index.css`.

Tema:

- `--color-cafe-cream`
- `--color-cafe-paper`
- `--color-cafe-ink`
- `--color-cafe-espresso`
- `--color-cafe-muted`
- `--color-cafe-line`
- `--color-cafe-honey`
- `--color-cafe-cherry`

Fontes:

- serif: Playfair Display
- sans: Inter

Classes customizadas importantes:

- `cafe-texture`
- `eyebrow`
- `action-card`
- `menu-card`
- `icon-action`
- `receipt-paper`
- `whatsapp-pattern`

## Dependencias Importantes

Runtime:

- `react`
- `react-dom`
- `framer-motion`
- `lucide-react`
- `canvas-confetti`
- `clsx`
- `tailwind-merge`
- `tailwindcss`
- `vite-plugin-pwa`
- `@fontsource/inter`
- `@fontsource/playfair-display`

Dev/build:

- `@tailwindcss/postcss`
- `autoprefixer`
- `eslint`
- plugins do ESLint

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

Build validado:

```bash
npm run build
```

Resultado esperado:

- Vite transforma os modulos.
- Gera `dist/`.
- PWA gera manifest e service worker.

## Cuidados Tecnicos

### Tailwind 4

O projeto usa:

```css
@import "tailwindcss";
```

e:

```js
'@tailwindcss/postcss': {}
```

Nao trocar para sintaxe antiga de Tailwind 3 sem migrar tudo com cuidado.

### PWA

O plugin PWA esta em `vite.config.js`.

Se alterar icones reais do app, revisar:

- `manifest.icons`
- `public/img/favicon.jpg`

Hoje os icones do manifest ainda apontam para `/vite.svg`.

### Encoding

Alguns textos aparecem com caracteres quebrados no terminal. Antes de fazer correcao massiva de acentos, verificar como o navegador esta renderizando e qual encoding real dos arquivos.

Evitar mudanca global automatica de texto sem revisar visualmente.

### Conteudo pessoal

O projeto contem conversas e imagens pessoais. Tratar como conteudo sensivel.

Antes de publicar:

- revisar `src/data/cafeArchive.js`
- revisar `public/img/`
- revisar `public/musica.mp3`

## Possiveis Proximos Passos

Melhorias de produto:

- adicionar carta dos 6 meses na secao Mesa 22
- transformar "Termos de Amor" em modal ou pagina propria
- adicionar modo de abrir foto do mural em tela cheia
- adicionar novas datas ao cartao fidelidade
- criar tela especial para 22/05/2026
- trocar icones PWA por imagens finais do Cafe 22

Melhorias tecnicas:

- separar componentes de `App.jsx` quando o arquivo crescer mais
- mover `menuItems`, `muralItems` e `loyaltyStamps` para `src/data/`
- adicionar testes simples para renderizacao das abas
- revisar acessibilidade dos botoes e textos alternativos
- validar responsividade em mobile real

## Checklist Para Novas Mudancas

Antes de editar:

- entender se a mudanca e conteudo, layout, comportamento ou build
- preservar o tom afetivo do projeto
- evitar mexer em dados pessoais sem necessidade

Depois de editar:

```bash
npm run lint
npm run build
```

Se mexer em UI:

- abrir no navegador
- testar mobile e desktop
- testar navegacao entre abas
- testar modal de recibo
- testar audio se a mudanca tocar na radio

## Handoff Rapido

Se alguem for continuar daqui, comece por:

1. Ler `README.md`.
2. Ler este `PROJECT_CONTEXT.md`.
3. Rodar `npm install`.
4. Rodar `npm run dev`.
5. Abrir o site no navegador.
6. Para conteudo, editar primeiro `src/App.jsx` ou `src/data/cafeArchive.js`.

