# Isaque Vergueiro — Portfólio

Portfólio pessoal desenvolvido em **React + Vite**.  
Tema visual: **Bleach × Shadow the Hedgehog** — dark, gótico, numetal.

---

## Como rodar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`

---

## Como fazer o build para produção

```bash
npm run build
```

Os arquivos ficam na pasta `dist/` prontos para deploy.

---

## Deploy na Vercel

1. Suba o projeto para um repositório GitHub
2. Acesse [vercel.com](https://vercel.com) e importe o repositório
3. A Vercel detecta Vite automaticamente — só clique em **Deploy**

---

## Estrutura de pastas

```
portfolio/
├── index.html                  # Entry point HTML (SEO, fonts, meta tags)
├── vite.config.js
├── package.json
├── public/                     # Arquivos estáticos (colocar aqui)
│   ├── isaquevergueiropic.png  # Sua foto
│   ├── curriculo-isaque-vergueiro.pdf
│   ├── img/                    # Thumbnails dos projetos
│   └── imgsisvac/              # Imagens do SISVAC
└── src/
    ├── main.jsx
    ├── App.jsx                 # Composição de todas as seções
    ├── styles/
    │   └── global.css          # CSS global, tokens, reset, utilitários
    ├── data/
    │   └── index.js            # Todos os dados: projetos, stack, experiências
    ├── hooks/
    │   └── useReveal.js        # Hook para animação de entrada no scroll
    └── components/
        ├── Cursor              # Cursor customizado (ponto vermelho + anel)
        ├── Particles           # Partículas flutuantes via Canvas
        ├── Nav                 # Navegação fixa com underline animado
        ├── Hero                # Seção inicial com foto, nome e glitch
        ├── Sobre               # Bio + stats
        ├── Experiencia         # Timeline vertical de experiências
        ├── Stack               # Grid de ícones por categoria + idiomas
        ├── Projetos            # Vitrine SISVAC + grid com filtro
        ├── Modal               # Modal de detalhe do projeto com carrossel
        ├── Contato             # Formulário + links (dispara WhatsApp)
        └── Footer
```

---

## Adicionando suas imagens

Coloque os arquivos na pasta `public/`:

```
public/
  isaquevergueiropic.png
  curriculo-isaque-vergueiro.pdf
  img/
    meteoraimg.jpeg
    memotecaangular.jpeg
    memotecaangular2.jpeg
    memotecaangular3.jpeg
    memotecaangularexcluir.jpeg
    alurabooksangular.jpg
    listadecomprarangular.jpeg
    spaceappimg.jpeg
    organoimage.png
    organoimage2.jpeg
    cinetagimg.jpg
    vidflow.jpeg
    fokusimg.jpeg
    alurabooks.jpeg
    codeconnect.jpeg
    listadecompras.jpeg
    loginlol.jpeg
  imgsisvac/
    sisvac.jpeg
    sisvac2.jpeg
    sisvac3.jpeg
    sisvac4.jpeg
    sisvac5.jpeg
    sisvac6.jpeg
```

---

## Atualizando o link do SISVAC

Quando o deploy do SISVAC estiver pronto, edite `src/data/index.js`:

```js
export const SISVAC = {
  // ...
  linkHospedagem: 'https://SEU-LINK-AQUI.vercel.app',
  // ...
}
```
