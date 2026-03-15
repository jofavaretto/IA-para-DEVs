/* =============================================
   EmpreendeSC — storage.js
   Camada de persistência via localStorage
   ============================================= */

const STORAGE_KEY = 'empreendesc_v1';

/**
 * Carrega todos os empreendimentos do localStorage.
 * Retorna array vazio em caso de erro ou dado ausente.
 * @returns {Array}
 */
function loadData() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    console.warn('[EmpreendeSC] Falha ao carregar dados do localStorage.');
    return [];
  }
}

/**
 * Persiste o array de empreendimentos no localStorage.
 * @param {Array} data
 */
function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Gera um ID único para novos registros.
 * @returns {string}
 */
function genId() {
  return 'emp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
}

/**
 * Popula o banco com dados de exemplo na primeira execução.
 * Não faz nada se já houver registros.
 * @param {Array} empreendimentos - array reativo do estado global
 */
function seedData(empreendimentos) {
  if (empreendimentos.length > 0) return;

  const seeds = [
    {
      id: genId(),
      nome: 'Tech Valley SC',
      empreendedor: 'Ana Beatriz Lima',
      municipio: 'Florianópolis',
      segmento: 'Tecnologia',
      contato: 'contato@techvalley.sc',
      status: 'ativo',
      cnpj: '12.345.678/0001-90',
      descricao: 'Startup de soluções em nuvem',
      criadoEm: new Date().toISOString(),
    },
    {
      id: genId(),
      nome: 'Agro Oeste Ltda',
      empreendedor: 'Carlos Eduardo Ramos',
      municipio: 'Chapecó',
      segmento: 'Agronegócio',
      contato: 'agrooeste@hotmail.com',
      status: 'ativo',
      cnpj: '98.765.432/0001-10',
      descricao: 'Produção de grãos e derivados',
      criadoEm: new Date().toISOString(),
    },
    {
      id: genId(),
      nome: 'Blumenau Têxtil',
      empreendedor: 'Gretchen Hoffmann',
      municipio: 'Blumenau',
      segmento: 'Indústria',
      contato: '@blunautextil',
      status: 'ativo',
      cnpj: '',
      descricao: 'Confecção de malhas e uniformes',
      criadoEm: new Date().toISOString(),
    },
    {
      id: genId(),
      nome: 'Sul Serviços Gerais',
      empreendedor: 'Marcos Aurélio',
      municipio: 'Criciúma',
      segmento: 'Serviços',
      contato: 'sulservicos@gmail.com',
      status: 'inativo',
      cnpj: '',
      descricao: '',
      criadoEm: new Date().toISOString(),
    },
    {
      id: genId(),
      nome: 'Empório Gourmet Norte',
      empreendedor: 'Juliana Steffens',
      municipio: 'Joinville',
      segmento: 'Comércio',
      contato: 'emporiogourmet@sc.com.br',
      status: 'ativo',
      cnpj: '55.221.334/0001-88',
      descricao: 'Importados e especialidades',
      criadoEm: new Date().toISOString(),
    },
  ];

  empreendimentos.push(...seeds);
  saveData(empreendimentos);
}