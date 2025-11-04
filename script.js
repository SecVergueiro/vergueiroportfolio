// script.js - Dinamiza a seção de projetos, modal, filtro e envio de WhatsApp
const TELEFONE_CONTATO = "5592999828545";
const JSON_PATH = "./projetos.json"; // ajuste se necessário
const MAX_FEATURED = 3; // quantos aparecem no "hall da fama" por padrão

// envio WhatsApp
function enviarWhats(event) {
  event.preventDefault();
  const nome = document.getElementById("nome");
  const mensagem = document.getElementById("mensagem");

  const nomeVal = nome?.value?.trim();
  const msgVal = mensagem?.value?.trim();

  if (!nomeVal || !msgVal) {
    alert("Por favor preencha nome e mensagem antes de enviar.");
    return;
  }

  const texto = `Olá, me chamo ${nomeVal}. ${msgVal}`;
  const msgFormatada = encodeURIComponent(texto);
  const url = `https://wa.me/${TELEFONE_CONTATO}?text=${msgFormatada}`;

  window.open(url, "_blank");
}

// cache e estado
let projetosCache = [];
let mostrandoTodos = false;

// fetch projetos.json
async function fetchProjetos() {
  try {
    const res = await fetch(JSON_PATH);
    if (!res.ok)
      throw new Error(`Falha ao carregar ${JSON_PATH} — status ${res.status}`);
    const data = await res.json();
    projetosCache = Array.isArray(data) ? data : [];
    renderProjetos();
  } catch (err) {
    console.error(err);
    const container = document.querySelector(".projetos-caixa");
    if (container) {
      container.innerHTML = `<p class="erro">Erro ao carregar projetos. Verifique o arquivo <code>${JSON_PATH}</code> ou o console.</p>`;
    }
  }
}

// helpers
function limparContainer() {
  const container = document.querySelector(".projetos-caixa");
  if (container) container.innerHTML = "";
}

function criarTagTecnologias(tecnologias = []) {
  return tecnologias
    .map(
      (t) => `<span class="tag-tec" aria-hidden="true">${escapeHtml(t)}</span>`
    )
    .join(" ");
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// gerar resumo curto (prioriza projeto.resumo)
function gerarResumoCurto(projeto) {
  if (!projeto) return "";
  if (projeto.resumo && projeto.resumo.trim()) return projeto.resumo.trim();

  const desc = (projeto.descricao || "").trim();
  if (!desc) return "";

  // tenta a primeira frase
  const partes = desc.split(/(?<=[.!?])\s+/);
  let primeira = partes[0] || desc;

  if (primeira.length < 30 && desc.length > 140) {
    let curta = desc.slice(0, 140);
    curta = curta.replace(/\s+\S*$/, "");
    return curta + "...";
  }

  if (primeira.length > 140) {
    let curta = primeira.slice(0, 140).replace(/\s+\S*$/, "");
    return curta + "...";
  }

  return primeira;
}

// criar card
function criarCard(projeto) {
  const card = document.createElement("article");
  card.className = "projetos-card";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute(
    "aria-label",
    `Abrir detalhes do projeto ${projeto.titulo}`
  );

  const thumb =
    projeto.thumbnail || projeto.imagem || "./img/placeholder-thumb.jpg";

  const resumoCurto = gerarResumoCurto(projeto);

  card.innerHTML = `
    <img src="${escapeHtml(thumb)}" alt="${escapeHtml(
    projeto.titulo
  )} - preview" class="projetos-imagem" />
    <div class="caixa-textos-projeto">
      <h3 class="info-projetos">${escapeHtml(projeto.titulo)}</h3>
      <p class="paragrafo-projetos">${escapeHtml(resumoCurto)}</p>
      <div class="tags-tecnologias" aria-hidden="true">${criarTagTecnologias(
        projeto.tecnologias
      )}</div>
      <div class="acoes-projeto">
        <a class="botao-projeto" href="${escapeHtml(
          projeto.linkHospedagem || "#"
        )}" target="_blank" rel="noopener noreferrer">Abrir</a>
        <a class="botao-projeto secundario" href="${escapeHtml(
          projeto.linkRepositorio || "#"
        )}" target="_blank" rel="noopener noreferrer">Repositório</a>
        <button class="botao-detalhes" type="button" aria-label="Ver detalhes de ${escapeHtml(
          projeto.titulo
        )}">Detalhes</button>
      </div>
    </div>
  `;

  // abrir modal ao clicar (exceto em links)
  card.addEventListener("click", (e) => {
    if (e.target.tagName.toLowerCase() === "a" || e.target.closest("a")) return;
    abrirModalProjeto(projeto);
  });

  // abrir modal com Enter
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter") abrirModalProjeto(projeto);
  });

  // botão detalhes
  const btnDetalhes = card.querySelector(".botao-detalhes");
  btnDetalhes?.addEventListener("click", (ev) => {
    ev.stopPropagation();
    abrirModalProjeto(projeto);
  });

  return card;
}

// renderização com filtro e featured logic (VERSÃO AJUSTADA)
function renderProjetos() {
  const container = document.querySelector(".projetos-caixa");
  if (!container) return;

  limparContainer();

  const filtroInput = document.getElementById("filtro-tec");
  const filtro = filtroInput?.value?.trim().toLowerCase() || "";

  // se houver filtro, garantir que mostrandoTodos volte para false (UX consistente)
  if (filtro) {
    mostrandoTodos = false;
  }

  // controle visibilidade do botão ver-mais quando houver filtro
  const btnVerMais = document.getElementById("ver-mais");
  if (btnVerMais) {
    btnVerMais.style.display = filtro ? "none" : "";
    btnVerMais.textContent = mostrandoTodos ? "Ver menos" : "Ver mais";
    btnVerMais.setAttribute("aria-pressed", String(mostrandoTodos));
  }

  let lista = projetosCache.slice();

  if (filtro) {
    lista = lista.filter(
      (p) =>
        Array.isArray(p.tecnologias) &&
        p.tecnologias.some((t) => t.toLowerCase().includes(filtro))
    );
  }

  // Apenas aplicar o limite quando NÃO estivermos mostrando todos e NÃO houver filtro.
  const aplicarLimite = !mostrandoTodos && !filtro;

  if (aplicarLimite) {
    const featured = lista.filter((p) => p.featured);
    if (featured.length >= MAX_FEATURED) {
      lista = featured.slice(0, MAX_FEATURED);
    } else {
      lista = lista.slice(0, MAX_FEATURED);
    }
  }

  if (lista.length === 0) {
    container.innerHTML = `<p class="nenhum">Nenhum projeto encontrado.</p>`;
    return;
  }

  const fragment = document.createDocumentFragment();
  lista.forEach((p) => fragment.appendChild(criarCard(p)));
  container.appendChild(fragment);
}

// ver mais / ver menos
function toggleVerMais() {
  mostrandoTodos = !mostrandoTodos;
  const btn = document.getElementById("ver-mais");
  if (btn) {
    btn.textContent = mostrandoTodos ? "Ver menos" : "Ver mais";
    btn.setAttribute("aria-pressed", String(mostrandoTodos));
  }
  renderProjetos();
}

// modal simples e acessível (mantive elementos existentes)
const modal = {
  element: null,
  imagem: null,
  titulo: null,
  descricao: null,
  tecnologias: null,
  linkHospedagem: null,
  linkRepo: null,
  // carousel
  carouselWrapper: null,
  prevBtn: null,
  nextBtn: null,
  contador: null,
  carouselImages: [],
  carouselIndex: 0,
  closeBtn: null,
};

// ===================================================================
// FUNÇÃO MODIFICADA (bindModalElements - REMOVEU LÓGICA DE ZOOM)
// ===================================================================
function bindModalElements() {
  modal.element = document.getElementById("projeto-modal");
  if (!modal.element) return;

  // permitir foco programático no container do modal
  modal.element.setAttribute("tabindex", "-1");

  modal.imagem = document.getElementById("modal-imagem");
  modal.titulo = document.getElementById("modal-titulo");
  modal.descricao = document.getElementById("modal-descricao");
  modal.tecnologias = document.getElementById("modal-tecnologias");
  modal.linkHospedagem = document.getElementById("modal-hospedagem");
  modal.linkRepo = document.getElementById("modal-repo");

  // referência ao botão fechar (X)
  modal.closeBtn = document.getElementById("modal-close");

  modal.carouselWrapper = document.getElementById("modal-carousel");
  modal.prevBtn = document.getElementById("modal-prev");
  modal.nextBtn = document.getElementById("modal-next");
  modal.contador = document.getElementById("modal-carousel-contador");

  // evento fechar
  modal.closeBtn?.addEventListener("click", fecharModal);

  // fechar clicando fora do conteúdo
  modal.element.addEventListener("click", (e) => {
    // Se clicar fora do conteúdo (no fundo), fecha o modal
    if (e.target === modal.element) fecharModal();
  });

  // NOVO: Removemos o listener de clique na imagem para o zoom

  // navegação de teclado (Esc e setas)
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      modal.element &&
      !modal.element.classList.contains("hidden")
    ) {
      fecharModal();
    }
    if (!modal.element || modal.element.classList.contains("hidden")) return;

    if (
      (e.key === "ArrowLeft" || e.key === "ArrowRight") &&
      modal.carouselImages &&
      modal.carouselImages.length > 1
    ) {
      if (e.key === "ArrowLeft") mostrarImagemAnterior();
      if (e.key === "ArrowRight") mostrarImagemProxima();
    }
  });

  // botões prev/next
  modal.prevBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    mostrarImagemAnterior();
  });
  modal.nextBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    mostrarImagemProxima();
  });
}

// retorna a descrição que aparecerá no modal (prioriza descricao_detalhada)
function obterDescricaoModal(projeto) {
  if (!projeto) return "Sem descrição.";
  if (projeto.descricao_detalhada && projeto.descricao_detalhada.trim()) {
    return projeto.descricao_detalhada.trim();
  }
  if (projeto.descricao && projeto.descricao.trim()) {
    return projeto.descricao.trim();
  }
  return "Sem descrição.";
}

// auxilia a coletar imagens do projeto (imagem, imagem2, imagem3... etc)
function coletarImagensProjeto(p) {
  const imgs = [];
  // primeira chave comum: imagem
  if (p.imagem) imgs.push(p.imagem);
  // procurar imagem2..imagem10
  for (let i = 2; i <= 10; i++) {
    const key = `imagem${i}`;
    if (p[key]) imgs.push(p[key]);
  }
  // fallback para thumbnail se nada encontrado
  if (imgs.length === 0 && p.thumbnail) imgs.push(p.thumbnail);
  // garantir caminhos válidos e únicos
  return imgs.filter(Boolean);
}

function mostrarImagemIndex(index) {
  if (!modal.imagem || !modal.carouselImages.length) return;
  modal.carouselIndex =
    ((index % modal.carouselImages.length) + modal.carouselImages.length) %
    modal.carouselImages.length;
  const src = modal.carouselImages[modal.carouselIndex];
  modal.imagem.src = src;
  modal.imagem.alt = `Imagem ${modal.carouselIndex + 1} de ${
    modal.carouselImages.length
  }`;
  if (modal.contador) {
    modal.contador.textContent = `${modal.carouselIndex + 1} / ${
      modal.carouselImages.length
    }`;
  }
}

function mostrarImagemProxima() {
  if (!modal.carouselImages || modal.carouselImages.length === 0) return;
  mostrarImagemIndex(modal.carouselIndex + 1);
}

function mostrarImagemAnterior() {
  if (!modal.carouselImages || modal.carouselImages.length === 0) return;
  mostrarImagemIndex(modal.carouselIndex - 1);
}

// ===================================================================
// FUNÇÃO MODIFICADA (abrirModalProjeto)
// ===================================================================
function abrirModalProjeto(p) {
  if (!modal.element) return;

  // --- 1. Determinar condições ---
  const imagens = coletarImagensProjeto(p);
  const hasCarousel = imagens.length > 1;
  const isSisvac = String(p.id).toLowerCase() === "sisvac"; // Regra especial mantida

  // --- 2. Lógica do Carrossel (Generalizada) ---
  if (hasCarousel) {
    modal.carouselImages = imagens;
    modal.carouselIndex = 0;
    mostrarImagemIndex(0);

    // Mostrar controles
    if (modal.carouselWrapper) modal.carouselWrapper.style.display = "";
    if (modal.prevBtn) modal.prevBtn.style.display = "";
    if (modal.nextBtn) modal.nextBtn.style.display = "";
    if (modal.contador)
      modal.contador.style.display =
        modal.carouselImages.length > 1 ? "" : "none";

    // Ativa classe para mover setas
    modal.element.classList.add("carousel-active");
  } else {
    // Lógica de Imagem Única
    const imgSrc =
      (imagens.length > 0 ? imagens[0] : null) ||
      p.thumbnail ||
      "./img/placeholder-thumb.jpg";
    modal.imagem.src = imgSrc;
    modal.imagem.alt = `${p.titulo} - preview`;

    // Ocultar controles
    if (modal.carouselWrapper) modal.carouselWrapper.style.display = "";
    if (modal.prevBtn) modal.prevBtn.style.display = "none";
    if (modal.nextBtn) modal.nextBtn.style.display = "none";
    if (modal.contador) modal.contador.style.display = "none";

    // Limpar estado
    modal.carouselImages = [];
    modal.carouselIndex = 0;
    
    // Remove classe do carrossel
    modal.element.classList.remove("carousel-active");
  }

  // --- 3. Lógica Específica (Sisvac ou outras) ---

  // O 'X' de fechar fica SEMPRE visível
  if (modal.closeBtn) modal.closeBtn.style.display = "";

  if (isSisvac) {
    // Esconder link de hospedagem (regra específica mantida)
    if (modal.linkHospedagem) modal.linkHospedagem.style.display = "none";
  } else {
    // Mostrar link de hospedagem normalmente
    if (modal.linkHospedagem) {
      modal.linkHospedagem.style.display = "";
      modal.linkHospedagem.href = p.linkHospedagem || "#";
    }
  }
  
  // Se você quiser que a imagem do Sisvac *ainda* seja maior que as outras (manter object-fit: contain):
  if (isSisvac) {
      // Já está coberto pela classe .carousel-active, que agora é genérica para todos com carrossel.
      // Se não houver carrossel mas você quiser imagem maior, criaria uma classe aqui.
      // Exemplo: modal.element.classList.add("modal-sisvac-imagem-contain");
  } else {
      // modal.element.classList.remove("modal-sisvac-imagem-contain");
  }


  // --- 4. Preencher Conteúdo Comum ---
  modal.titulo.textContent = p.titulo || "Projeto";

  const descricaoParaMostrar = obterDescricaoModal(p);
  modal.descricao.innerHTML = `<p>${escapeHtml(descricaoParaMostrar)}</p>`;

  modal.tecnologias.textContent =
    Array.isArray(p.tecnologias) && p.tecnologias.length
      ? p.tecnologias.join(", ")
      : "—";

  modal.linkRepo.href = p.linkRepositorio || "#";

  // --- 5. Abrir e Focar ---
  modal.element.classList.remove("hidden");
  modal.element.setAttribute("aria-hidden", "false");

  // Foco sempre no botão de fechar
  if (modal.closeBtn) {
    modal.closeBtn.focus();
  } else {
    modal.element.focus();
  }
}

// ===================================================================
// FUNÇÃO MODIFICADA (fecharModal - REMOVEU LÓGICA DE ZOOM)
// ===================================================================
function fecharModal() {
  if (!modal.element) return;
  modal.element.classList.add("hidden");
  modal.element.setAttribute("aria-hidden", "true");
  // limpar estado do carrossel
  modal.carouselImages = [];
  modal.carouselIndex = 0;
  
  // Remove a classe genérica do carrossel
  modal.element.classList.remove("carousel-active");
}

// inicialização
function initProjetos() {
  bindModalElements();

  document.getElementById("ver-mais")?.addEventListener("click", toggleVerMais);
  document.getElementById("filtro-tec")?.addEventListener("input", () => {
    renderProjetos();
  });

  fetchProjetos();
}

document.addEventListener("DOMContentLoaded", () => {
  initProjetos();
});