/* =============================================
   EmpreendeSC — app.js
   Controlador principal: estado, filtros, CRUD
   ============================================= */

/* ── Estado da aplicação ─────────────────────── */

let empreendimentos = loadData();
let filteredData    = [];
let currentPage     = 1;
let sortKey         = 'nome';
let sortDir         = 1;       // 1 = asc | -1 = desc
let editingId       = null;
let deleteId        = null;

/* ── Inicialização ───────────────────────────── */

function init() {
  seedData(empreendimentos);
  render();
  bindKeyboard();
}

/* ── Render principal ────────────────────────── */

function render() {
  applyFilters();
  updateStats(empreendimentos);
}

/* ── Filtros e ordenação ─────────────────────── */

function applyFilters() {
  const q      = document.getElementById('searchInput').value.toLowerCase().trim();
  const seg    = document.getElementById('filterSegmento').value;
  const status = document.getElementById('filterStatus').value;

  filteredData = empreendimentos.filter(e => {
    const matchQ = !q ||
      e.nome.toLowerCase().includes(q)         ||
      e.municipio.toLowerCase().includes(q)    ||
      e.empreendedor.toLowerCase().includes(q) ||
      (e.contato && e.contato.toLowerCase().includes(q));
    const matchSeg    = !seg    || e.segmento === seg;
    const matchStatus = !status || e.status   === status;
    return matchQ && matchSeg && matchStatus;
  });

  filteredData.sort((a, b) => {
    const va = (a[sortKey] || '').toString().toLowerCase();
    const vb = (b[sortKey] || '').toString().toLowerCase();
    return va < vb ? -sortDir : va > vb ? sortDir : 0;
  });

  currentPage = 1;
  renderTable(filteredData, currentPage);
  renderPagination(filteredData.length, currentPage);
  updateStats(empreendimentos);
}

function sortBy(key) {
  sortDir = sortKey === key ? sortDir * -1 : 1;
  sortKey = key;

  document.querySelectorAll('thead th').forEach(th => {
    th.classList.toggle('sorted', th.dataset.sort === key);
  });

  applyFilters();
}

function goPage(p) {
  const pages = Math.ceil(filteredData.length / PAGE_SIZE);
  if (p < 1 || p > pages) return;
  currentPage = p;
  renderTable(filteredData, currentPage);
  renderPagination(filteredData.length, currentPage);
}

/* ── Busca com debounce ──────────────────────── */

let searchTimer;
function onSearch() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(applyFilters, 220);
}

/* ── CRUD: Create / Update ───────────────────── */

function openModal(id = null) {
  editingId = id;

  if (id) {
    const emp = empreendimentos.find(e => e.id === id);
    if (!emp) return;
    openModalForm(emp);
  } else {
    openModalForm(null);
  }
}

function openEdit(id) {
  openModal(id);
}

function submitForm() {
  if (!validateForm()) {
    showToast('Preencha os campos obrigatórios.', 'error');
    return;
  }

  const payload = getFormValues();

  if (editingId) {
    const idx = empreendimentos.findIndex(e => e.id === editingId);
    empreendimentos[idx] = { ...empreendimentos[idx], ...payload };
    showToast('Empreendimento atualizado!', 'success');
  } else {
    empreendimentos.unshift({
      id: genId(),
      ...payload,
      criadoEm: new Date().toISOString(),
    });
    showToast('Empreendimento cadastrado!', 'success');
  }

  saveData(empreendimentos);
  closeModal();
  editingId = null;
  render();
}

/* ── CRUD: Delete ────────────────────────────── */

function openConfirm(id) {
  deleteId = id;
  const emp = empreendimentos.find(e => e.id === id);
  if (emp) openConfirmDialog(emp.nome);
}

function confirmDelete() {
  if (!deleteId) return;

  const name = empreendimentos.find(e => e.id === deleteId)?.nome || '';
  empreendimentos = empreendimentos.filter(e => e.id !== deleteId);
  saveData(empreendimentos);
  closeConfirm();
  deleteId = null;
  render();
  showToast(`"${name}" removido.`, 'info');
}

/* ── Atalhos de teclado ──────────────────────── */

function bindKeyboard() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal();
      closeConfirm();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      document.getElementById('searchInput').focus();
    }
  });
}

/* ── Bootstrap ───────────────────────────────── */

document.addEventListener('DOMContentLoaded', init);