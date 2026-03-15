/* =============================================
   EmpreendeSC — render.js
   Funções de renderização da tabela, stats e paginação
   ============================================= */

const PAGE_SIZE = 10;

/**
 * Escapa caracteres HTML para prevenir XSS.
 * @param {*} str
 * @returns {string}
 */
function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Normaliza o segmento para uso como classe CSS (remove acentos e espaços).
 * @param {string} segmento
 * @returns {string}
 */
function segClass(segmento) {
  return (segmento || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '');
}

/**
 * Renderiza as linhas da tabela com base nos dados filtrados e página atual.
 * @param {Array}  filteredData
 * @param {number} currentPage
 */
function renderTable(filteredData, currentPage) {
  const tbody = document.getElementById('tableBody');
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageData = filteredData.slice(start, start + PAGE_SIZE);

  if (filteredData.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="5">
        <div class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p>Nenhum empreendimento encontrado.</p>
        </div>
      </td></tr>`;
    return;
  }

  tbody.innerHTML = pageData.map((e, i) => `
    <tr style="animation-delay:${i * 30}ms">
      <td>
        <div class="td-name">${escHtml(e.nome)}</div>
        <div class="td-empreendedor">${escHtml(e.empreendedor)}</div>
        ${e.descricao ? `<div class="td-empreendedor" style="font-style:italic">${escHtml(e.descricao)}</div>` : ''}
      </td>
      <td class="hide-mobile">
        <div class="td-municipio">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            style="color:var(--sc-green);flex-shrink:0">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          ${escHtml(e.municipio)}
        </div>
        ${e.cnpj ? `<div class="td-contato">${escHtml(e.cnpj)}</div>` : ''}
      </td>
      <td>
        <span class="seg-badge seg-${segClass(e.segmento)}">${escHtml(e.segmento)}</span>
      </td>
      <td class="hide-mobile">
        <span class="badge badge-${e.status}">
          ${e.status === 'ativo' ? '● Ativo' : '○ Inativo'}
        </span>
      </td>
      <td>
        <div style="display:flex;gap:0.35rem;align-items:center">
          <button class="btn btn-ghost btn-sm btn-icon" title="Editar" onclick="openEdit('${e.id}')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="btn btn-danger btn-sm btn-icon" title="Remover" onclick="openConfirm('${e.id}')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14H6L5 6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

/**
 * Renderiza os controles de paginação.
 * @param {number} total       - total de registros filtrados
 * @param {number} currentPage
 */
function renderPagination(total, currentPage) {
  const pages = Math.ceil(total / PAGE_SIZE);
  const start = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const end   = Math.min(currentPage * PAGE_SIZE, total);

  document.getElementById('paginationInfo').textContent =
    `Mostrando ${start}–${end} de ${total}`;

  const btns = document.getElementById('paginationBtns');
  let html = `
    <button class="page-btn" onclick="goPage(${currentPage - 1})"
      ${currentPage === 1 ? 'disabled' : ''}>‹</button>`;

  for (let p = 1; p <= pages; p++) {
    const isNearCurrent = Math.abs(p - currentPage) <= 1;
    const isEdge        = p === 1 || p === pages;

    if (!isNearCurrent && !isEdge) {
      if (p === 2 || p === pages - 1) {
        html += `<span style="color:var(--text-muted);padding:0 4px">…</span>`;
      }
      continue;
    }
    html += `<button class="page-btn ${p === currentPage ? 'active' : ''}"
      onclick="goPage(${p})">${p}</button>`;
  }

  html += `
    <button class="page-btn" onclick="goPage(${currentPage + 1})"
      ${currentPage >= pages ? 'disabled' : ''}>›</button>`;

  btns.innerHTML = html;
}

/**
 * Atualiza os cards de estatísticas.
 * @param {Array} empreendimentos - todos os registros (sem filtro)
 */
function updateStats(empreendimentos) {
  const ativos    = empreendimentos.filter(e => e.status === 'ativo').length;
  const inativos  = empreendimentos.filter(e => e.status === 'inativo').length;
  const segmentos = new Set(empreendimentos.map(e => e.segmento)).size;

  document.getElementById('statTotal').textContent     = empreendimentos.length;
  document.getElementById('statAtivos').textContent    = ativos;
  document.getElementById('statInativos').textContent  = inativos;
  document.getElementById('statSegmentos').textContent = segmentos;
}