/* =============================================
   EmpreendeSC — ui.js
   Toasts, modais e helpers de interface
   ============================================= */

/* ── Toast ───────────────────────────────────── */

const TOAST_DURATION = 3000;

const TOAST_ICONS = {
  success: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
    <polyline points="20 6 9 17 4 12"/></svg>`,
  error: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  info: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
};

/**
 * Exibe uma notificação temporária (toast) na tela.
 * @param {string} msg
 * @param {'success'|'error'|'info'} type
 */
function showToast(msg, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = (TOAST_ICONS[type] || '') + escHtml(msg);
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('out');
    setTimeout(() => toast.remove(), 350);
  }, TOAST_DURATION);
}

/* ── Modal de formulário ─────────────────────── */

/**
 * Abre o modal de criação/edição.
 * Se `empreendimento` for passado, preenche o formulário para edição.
 * @param {Object|null} empreendimento
 */
function openModalForm(empreendimento = null) {
  clearFormErrors();
  const isEdit = Boolean(empreendimento);

  document.getElementById('modalTitle').textContent =
    isEdit ? 'EDITAR EMPREENDIMENTO' : 'NOVO EMPREENDIMENTO';
  document.getElementById('submitLabel').textContent =
    isEdit ? 'Atualizar' : 'Salvar';

  if (isEdit) {
    document.getElementById('f-nome').value         = empreendimento.nome;
    document.getElementById('f-empreendedor').value = empreendimento.empreendedor;
    document.getElementById('f-municipio').value    = empreendimento.municipio;
    document.getElementById('f-segmento').value     = empreendimento.segmento;
    document.getElementById('f-contato').value      = empreendimento.contato;
    document.getElementById('f-status').value       = empreendimento.status;
    document.getElementById('f-cnpj').value         = empreendimento.cnpj || '';
    document.getElementById('f-descricao').value    = empreendimento.descricao || '';
  } else {
    document.getElementById('empForm').reset();
  }

  document.getElementById('modalOverlay').classList.add('open');
}

/**
 * Fecha o modal de formulário.
 */
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

/* ── Modal de confirmação de exclusão ────────── */

/**
 * Abre o diálogo de confirmação de exclusão.
 * @param {string} nome - nome do empreendimento a ser exibido
 */
function openConfirmDialog(nome) {
  document.getElementById('confirmName').textContent = `"${nome}"`;
  document.getElementById('confirmOverlay').classList.add('open');
}

/**
 * Fecha o diálogo de confirmação.
 */
function closeConfirm() {
  document.getElementById('confirmOverlay').classList.remove('open');
}

/* ── Validação do formulário ─────────────────── */

const REQUIRED_FIELDS = ['nome', 'empreendedor', 'municipio', 'segmento', 'contato'];

/**
 * Valida os campos obrigatórios do formulário.
 * Marca visualmente os campos com erro.
 * @returns {boolean} true se válido
 */
function validateForm() {
  clearFormErrors();
  let valid = true;

  REQUIRED_FIELDS.forEach(field => {
    const val = document.getElementById('f-' + field).value.trim();
    if (!val) {
      document.getElementById('grp-' + field).classList.add('has-error');
      valid = false;
    }
  });

  return valid;
}

/**
 * Remove todos os marcadores de erro do formulário.
 */
function clearFormErrors() {
  document.querySelectorAll('.form-group.has-error')
    .forEach(g => g.classList.remove('has-error'));
}

/**
 * Lê e retorna os valores atuais do formulário.
 * @returns {Object}
 */
function getFormValues() {
  return {
    nome:         document.getElementById('f-nome').value.trim(),
    empreendedor: document.getElementById('f-empreendedor').value.trim(),
    municipio:    document.getElementById('f-municipio').value.trim(),
    segmento:     document.getElementById('f-segmento').value,
    contato:      document.getElementById('f-contato').value.trim(),
    status:       document.getElementById('f-status').value,
    cnpj:         document.getElementById('f-cnpj').value.trim(),
    descricao:    document.getElementById('f-descricao').value.trim(),
  };
}

/* ── Backdrop click ──────────────────────────── */

/**
 * Fecha o modal ao clicar fora dele (no overlay).
 * @param {MouseEvent} event
 * @param {string} overlayId
 * @param {Function} closeFn
 */
function closeOnBackdrop(event, overlayId, closeFn) {
  if (event.target.id === overlayId) closeFn();
}