/* ============================================================
   AquaBit — dashboard logic
   ============================================================ */

const SAVE_KEY = 'aquabitzee_dashboard_v1';
const DASHBOARD_LAYOUT_KEY = 'aquabitzee_dashboard_layout_v1';
const DASHBOARD_SIZES_KEY = 'aquabitzee_dashboard_sizes_v1';
const DASHBOARD_WINDOWS_KEY = 'aquabitzee_dashboard_windows_v1';
const DASHBOARD_WIDGET_ORDER = ['overview', 'fish', 'water', 'tank', 'tasks', 'background', 'light', 'decor'];
const DASHBOARD_GRID_SIZE = 12;
const DASHBOARD_MINIMUM_SIZES = {
  overview: { width: 300, height: 216 },
  fish: { width: 360, height: 204 },
  water: { width: 288, height: 252 },
  tank: { width: 336, height: 360 },
  tasks: { width: 288, height: 216 },
  decor: { width: 288, height: 216 },
  background: { width: 336, height: 240 },
  light: { width: 312, height: 120, maxWidth: 420, maxHeight: 144 }
};

const SPECIES = {
  salt: [
    { key: 'anchovy',        img: 'assets/peixes/Grey 1 A.png',       name: 'Anchova',           rarity: 'common' },
    { key: 'clownfish',      img: 'assets/peixes/Orange 1 A.png',     name: 'Peixe-Palhaço',     rarity: 'common' },
    { key: 'clownfishRed',   img: 'assets/peixes/Orange 1 B.png',     name: 'Peixe-Palhaço Vermelho', rarity: 'common' },
    { key: 'clownfishGold',  img: 'assets/peixes/Orange 1 C.png',     name: 'Peixe-Palhaço Dourado',  rarity: 'common' },
    { key: 'clownfishWhite', img: 'assets/peixes/Orange 1 D.png',     name: 'Peixe-Palhaço Branco',   rarity: 'common' },
    { key: 'clownfishYellow',img: 'assets/peixes/Orange 1 E.png',     name: 'Peixe-Palhaço Amarelo',  rarity: 'common' },
    { key: 'surgeonfish',    img: 'assets/peixes/Blue 1 A.png',       name: 'Cirurgião',         rarity: 'common' },
    { key: 'silverFish',     img: 'assets/peixes/Grey 1 B.png',       name: 'Peixe-Prateado',    rarity: 'common' },
    { key: 'reefFish',       img: 'assets/peixes/Grey 1 C.png',       name: 'Peixe-de-Recife',   rarity: 'common' },
    { key: 'moonFish',       img: 'assets/peixes/Grey 1 D.png',       name: 'Peixe-Lua',         rarity: 'common' },
    { key: 'pinkFish',       img: 'assets/peixes/Pink 1 A.png',       name: 'Peixe-Rosa',        rarity: 'common' },
    { key: 'clam',           img: 'assets/peixes/clam.png',           name: 'Marisco',           rarity: 'common', bottom: true, scale: 0.62 },
    { key: 'shrimp',         img: 'assets/peixes/Shrimp 1.png',       name: 'Camarão',           rarity: 'common', scale: 0.68 },
    { key: 'pufferfish',     img: 'assets/peixes/Green 1 A.png',      name: 'Baiacu',            rarity: 'rare' },
    { key: 'jellyfish',      img: 'assets/peixes/JellyFish 1 A.png',  name: 'Água-viva Azul',    rarity: 'rare', float: true },
    { key: 'pinkJellyfish',  img: 'assets/peixes/JellyFish 1 B.png',  name: 'Água-viva Rosa',    rarity: 'rare', float: true },
    { key: 'crab',           img: 'assets/peixes/crab.png',          name: 'Caranguejo',        rarity: 'rare', bottom: true, scale: 0.72 },
    { key: 'shark',          img: 'assets/peixes/Shark 1.png',        name: 'Tubarão',           rarity: 'rare', scale: 1.12 },
    { key: 'squid',          img: 'assets/peixes/Squid 1.png',        name: 'Lula',              rarity: 'legendary', scale: 0.9 },
    { key: 'seaAngler',      img: 'assets/peixes/SeaAngler 1.png',    name: 'Peixe-Pescador',    rarity: 'legendary', scale: 1.12 },
    { key: 'swordfish',      img: 'assets/peixes/SwordFish 1.png',   name: 'Peixe-Espada',      rarity: 'legendary', scale: 1.18 }
  ],
  fresh: [
    { key: 'goldfish',  img: 'assets/peixes/Yellow 1 A.png',  name: 'Kinguiô',            rarity: 'common' },
    { key: 'yellowFish',img: 'assets/peixes/Yellow 1 B.png',  name: 'Peixe-Amarelo',      rarity: 'common' },
    { key: 'angelfish', img: 'assets/peixes/Purple 1 A.png',  name: 'Peixe-Anjo',         rarity: 'common' },
    { key: 'purpleFish',img: 'assets/peixes/Purple 1 B.png',  name: 'Peixe-Roxo',         rarity: 'common' },
    { key: 'bass',      img: 'assets/peixes/Blue 1 B.png',    name: 'Robalo',             rarity: 'common' },
    { key: 'blueFish',  img: 'assets/peixes/Blue 1 C.png',    name: 'Peixe-Azul',         rarity: 'common' },
    { key: 'catfish',   img: 'assets/peixes/Green 1 B.png',   name: 'Bagre',              rarity: 'rare' },
    { key: 'trout',     img: 'assets/peixes/Red 1 A.png',     name: 'Truta Arco-Íris',    rarity: 'legendary' },
    { key: 'redFish',   img: 'assets/peixes/Red 1 B.png',     name: 'Peixe-Vermelho',     rarity: 'common' },
    { key: 'rubyFish',  img: 'assets/peixes/Red 1 C.png',     name: 'Peixe-Rubi',         rarity: 'common' }
  ]
};

const FISH_PERSONALITY = {
  schooling: new Set([
    'anchovy', 'clownfish', 'clownfishRed', 'clownfishGold', 'clownfishWhite', 'clownfishYellow',
    'surgeonfish', 'silverFish', 'reefFish', 'pinkFish', 'goldfish', 'yellowFish',
    'purpleFish', 'bass', 'blueFish', 'trout', 'redFish', 'rubyFish'
  ]),
  greedy: new Set(['clownfish', 'clownfishRed', 'clownfishGold', 'clownfishWhite',
    'clownfishYellow', 'goldfish', 'pufferfish', 'shark']),
  lightEaters: new Set(['clam', 'jellyfish', 'pinkJellyfish', 'seaAngler']),
  playful: new Set(['clownfish', 'clownfishRed', 'clownfishGold', 'clownfishWhite',
    'clownfishYellow', 'goldfish', 'pinkFish', 'jellyfish', 'pinkJellyfish', 'shrimp']),
  tidy: new Set(['surgeonfish', 'pufferfish', 'shrimp', 'catfish']),
  shy: new Set(['angelfish', 'moonFish', 'jellyfish', 'pinkJellyfish', 'squid', 'crab'])
};

function personalityOf(speciesKey) {
  return {
    schooling: FISH_PERSONALITY.schooling.has(speciesKey),
    appetite: FISH_PERSONALITY.greedy.has(speciesKey) ? 1.22
      : FISH_PERSONALITY.lightEaters.has(speciesKey) ? 0.78 : 1,
    playful: FISH_PERSONALITY.playful.has(speciesKey),
    tidy: FISH_PERSONALITY.tidy.has(speciesKey),
    shy: FISH_PERSONALITY.shy.has(speciesKey)
  };
}

const BACKGROUNDS = [
  { key: 'reef',  name: 'SIMPLES',   price: 0,  img: 'assets/bg/bg_simples.png' },
  { key: 'cave',  name: 'ELABORADO', price: 50, img: 'assets/bg/bg_elaborado.png' },
  { key: 'river', name: 'RIO',       price: 50, img: 'assets/bg/bg_rio.png' }
];

const DECOR_CATALOG = [
  { key: 'plant', name: 'Alga Verde',       price: 5,  kind: 'plant', thumb: 'assets/outros/Alga 1 A.png',
    sprites: ['assets/outros/Alga 1 A.png', 'assets/outros/Alga 1 B.png', 'assets/outros/Alga 1 C.png', 'assets/outros/Alga 1 D.png'], widths: [96, 140, 76, 110], front: true },
  { key: 'rock',  name: 'Alga Ondulada',    price: 8,  kind: 'rock',  thumb: 'assets/outros/Alga 1 B.png',
    sprites: ['assets/outros/Alga 1 B.png', 'assets/outros/Alga 1 D.png'], widths: [96, 140], front: false },
  { key: 'wood',  name: 'Alga Azul',        price: 12, kind: 'wood',  thumb: 'assets/outros/Alga 1 C.png',
    sprites: ['assets/outros/Alga 1 C.png'], widths: [132], front: false },
  { key: 'coral', name: 'Alga Coral',       price: 15, kind: 'coral', thumb: 'assets/outros/Alga 1 D.png',
    sprites: ['assets/outros/Alga 1 D.png'], widths: [64, 78], front: true },
  { key: 'chest', name: 'Baú do Tesouro',   price: 20, kind: 'chest', thumb: 'assets/outros/chest.png',
    sprites: ['assets/outros/chest.png'], widths: [48], front: false }
];

const STARTER_DECOR = [
  { key: 'plant', kind: 'plant', sprite: 'assets/outros/Alga 1 C.png', x: 0.5, bottom: 13, w: 86,  front: true },
  { key: 'plant', kind: 'plant', sprite: 'assets/outros/Alga 1 A.png', x: 9,   bottom: 12, w: 112, front: true },
  { key: 'rock',  kind: 'rock',  sprite: 'assets/outros/Alga 1 B.png', x: 16,  bottom: 12, w: 150, front: false },
  { key: 'wood',  kind: 'wood',  sprite: 'assets/outros/Alga 1 D.png', x: 50,  bottom: 12, w: 148, front: false },
  { key: 'plant', kind: 'plant', sprite: 'assets/outros/Alga 1 B.png', x: 67,  bottom: 12, w: 150, front: true },
  { key: 'coral', kind: 'coral', sprite: 'assets/outros/Alga 1 A.png', x: 39,  bottom: 12, w: 72,  front: true },
  { key: 'rock',  kind: 'rock',  sprite: 'assets/outros/Alga 1 C.png', x: 83,  bottom: 12, w: 104, front: true }
];

const LEGACY_DECOR_SPRITES = {
  'plant1.png': 'assets/outros/Alga 1 A.png',
  'plant2.png': 'assets/outros/Alga 1 B.png',
  'plant3.png': 'assets/outros/Alga 1 C.png',
  'rock1.png': 'assets/outros/Alga 1 C.png',
  'rock2.png': 'assets/outros/Alga 1 B.png',
  'wood.png': 'assets/outros/Alga 1 D.png',
  'coral.png': 'assets/outros/Alga 1 A.png',
  'chest.png': 'assets/outros/chest.png'
};

/* ------------------------------------------------------------
   SISTEMA DE DECORAÇÃO — DESATIVADO
   Coloque true para reativar. Com false, as decorações continuam
   salvas no save (nada é apagado), mas não são renderizadas no
   tanque nem o painel de decorações aparece na tela.
   ------------------------------------------------------------ */
const DECOR_ENABLED = false;

const RARITY_LABEL = { common: 'COMUM', rare: 'RARO', legendary: 'LENDÁRIO' };

const FISH_EMOTES = {
  hungry: { sprite: 'assets/emotes/pipo-popupemotes060.png', label: 'Estou com fome!' },
  clean: { sprite: 'assets/emotes/pipo-popupemotes023.png', label: 'Preciso de uma limpeza!' },
  affection: { sprite: 'assets/emotes/pipo-popupemotes009.png', label: 'Quero carinho!' },
  sad: { sprite: 'assets/emotes/pipo-popupemotes021.png', label: 'Não estou me sentindo bem...' },
  happy: { sprite: 'assets/emotes/pipo-popupemotes011.png', label: 'Estou feliz!' },
  grateful: { sprite: 'assets/emotes/pipo-popupemotes039.png', label: 'Obrigado!' },
  surprised: { sprite: 'assets/emotes/pipo-popupemotes032.png', label: 'Que susto!' }
};
const FISH_EMOTE_COOLDOWN = 9000;

/* ---------------- melhorias do aquário ---------------- */
const EQUIPMENT_CATALOG = [
  { key: 'heater', name: 'Aquecedor', icon: '🌡️', max: 3, prices: [35, 80, 140],
    effect: l => l === 0
      ? 'Sem aquecimento: a água esfria até 4 °C abaixo do ideal.'
      : 'Aquece e mantém a água a até ' + (4 * (1 - l / 3)).toFixed(1) + ' °C do ideal.' },
  { key: 'filter', name: 'Filtro', icon: '🧽', max: 3, prices: [40, 85, 150],
    effect: l => l === 0
      ? 'A sujeira se acumula na velocidade normal.'
      : 'A sujeira se acumula ' + [0, 22, 42, 62][l] + '% mais devagar.' },
  { key: 'oxygen', name: 'Oxigenador', icon: '💨', max: 3, prices: [35, 80, 140],
    effect: l => l === 0
      ? 'O oxigênio depende só da água limpa.'
      : '+' + (l * 8) + '% de oxigênio e mais bolhas no tanque.' },
  { key: 'buffer', name: 'Condicionador de pH', icon: '🧪', max: 3, prices: [30, 70, 120],
    effect: l => l === 0
      ? 'O pH cai devagar até 0.45 fora do ideal.'
      : 'Segura o pH a até ' + (0.45 * (1 - l / 3)).toFixed(2) + ' do ideal.' },
  { key: 'uv', name: 'Luz UV', icon: '💡', max: 3, prices: [60, 120, 200],
    effect: l => l === 0
      ? 'Sem iluminação: nenhuma cor liberada.'
      : 'Ilumina o tanque, reduz a queda de felicidade em ' + (l * 5) + '% e libera as cores.' }
];

const LIGHT_COLORS = [
  { key: 'blue',   name: 'Azul',    price: 0,   rgb: '90 170 255',
    bonusText: l => 'Oxigênio +' + (4 * l) + '%' },
  { key: 'cyan',   name: 'Ciano',   price: 60,  rgb: '70 240 230',
    bonusText: l => 'Sujeira -' + (5 * l) + '%' },
  { key: 'green',  name: 'Verde',   price: 80,  rgb: '90 240 140',
    bonusText: l => 'Felicidade -' + (6 * l) + '%' },
  { key: 'pink',   name: 'Rosa',    price: 100, rgb: '255 110 200',
    bonusText: l => 'Amor -' + (8 * l) + '%' },
  { key: 'violet', name: 'Violeta', price: 130, rgb: '170 110 255',
    bonusText: l => 'EXP +' + (8 * l) + '%' },
  { key: 'amber',  name: 'Âmbar',   price: 160, rgb: '255 190 90',
    bonusText: l => 'Moedas +' + (20 * l) + '%' }
];

const WATER_BASE = {
  salt:  { temp: 26, ph: 8.1 },
  fresh: { temp: 24, ph: 7.2 }
};

const MAX_CAPACITY = 10;
const DEFAULT_TANK_TYPE = 'salt';

const DEFAULT_STATE = {
  tankType: null,
  coins: 25,
  gems: 0,
  exp: 120,
  capacity: 4,
  background: 'reef',
  backgroundsOwned: ['reef'],
  food: 2,
  water: { clean: 100, temp: 26, ph: 7.2 },
  equipment: { heater: 0, filter: 0, oxygen: 0, buffer: 0, uv: 0 },
  lightColor: 'blue',
  lightColors: ['blue'],
  pets: [],
  decor: JSON.parse(JSON.stringify(STARTER_DECOR)),
  ownedDecor: {},
  tasks: { feed: false, pet: false, clean: false },
  tasksDate: null,
  stats: { cleans: 0, hatched: 0, earned: 25, games: 0, upgrades: 0, fed: 0 }
};

let state = JSON.parse(JSON.stringify(DEFAULT_STATE));
let uidSeq = 1;
let currentFish = null;
let currentView = null;
let gameTimer = null, gameSpawner = null, gameScore = 0, gameTimeLeft = 30;
const fishEmoteTimes = new WeakMap();
const fishPlayTimes = new WeakMap();
let playerCursor = null;
let lastAquariumMoment = 0;

/* ---------------- utils ---------------- */
const $ = (id) => document.getElementById(id);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const rand = (a, b) => a + Math.random() * (b - a);
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]);

/* data local no formato YYYY-MM-DD, usada para resetar as tarefas do dia */
function todayKey() {
  const d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

/* reseta as tarefas uma vez por dia; retorna true se resetou agora */
function ensureDailyTasks() {
  const today = todayKey();
  if (state.tasksDate === today) return false;
  state.tasks = { feed: false, pet: false, clean: false };
  state.tasksDate = today;
  return true;
}

function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 2100);
}

function speciesOf(key) {
  for (const type of Object.keys(SPECIES)) {
    const found = SPECIES[type].find(s => s.key === key);
    if (found) return found;
  }
  return SPECIES.salt[0];
}

function shownPets() {
  return state.pets.filter(p => p.shown);
}

function levelInfo() {
  const per = 250;
  const level = 1 + Math.floor(state.exp / per);
  const now = state.exp % per;
  return { level, now, max: per };
}

function avgStats(p) {
  return (p.hunger + p.love + p.clean + p.happy) / 4;
}

function growthState(p) {
  const avg = avgStats(p);
  const stage = p.stage === 'adult' ? 'adult' : 'baby';
  if (stage === 'adult') return { tag: 'ADULTO', tone: 'good' };
  if (avg >= 70 && p.hunger >= 52 && p.love >= 50 && p.clean >= 55) return { tag: 'PRONTO', tone: 'warn' };
  return { tag: 'BEBÊ', tone: 'alert' };
}

function moodOf(p) {
  const a = avgStats(p);
  if (a >= 70) return { emoji: '😄', label: 'Feliz', cls: '' };
  if (a >= 40) return { emoji: '😐', label: 'Ok', cls: 'ok' };
  return { emoji: '😟', label: 'Triste', cls: 'sad' };
}

function bondLevel(pet) {
  const affinity = pet.affinity || 0;
  return affinity >= 100 ? 3 : affinity >= 70 ? 2 : affinity >= 40 ? 1 : 0;
}

function bondLabel(pet) {
  return ['Conhecido', 'Amigo', 'Melhor amigo', 'Inseparável'][bondLevel(pet)];
}

function areFishCompatible(first, second) {
  if (!first || !second || first.uid === second.uid) return false;
  if (first.species === second.species) return true;
  return personalityOf(first.species).schooling && personalityOf(second.species).schooling;
}

function friendshipOf(first, second) {
  return clamp(Number(first.friendships && first.friendships[second.uid]) || 0, 0, 100);
}

function bestFishFriend(pet) {
  return shownPets()
    .filter(other => areFishCompatible(pet, other))
    .sort((a, b) => friendshipOf(pet, b) - friendshipOf(pet, a))[0] || null;
}

/* ---------------- água & equipamentos ---------------- */
function waterBase() {
  return WATER_BASE[state.tankType] || WATER_BASE.salt;
}

function equipLvl(key) {
  const eq = state.equipment || {};
  return clamp(Math.round(eq[key] || 0), 0, 3);
}

function uvLevel() {
  return equipLvl('uv');
}

function lightColorOf(key) {
  return LIGHT_COLORS.find(c => c.key === key) || LIGHT_COLORS[0];
}

/* bônus da cor só vale com a Luz UV instalada */
function lightBonus(key) {
  return uvLevel() > 0 && state.lightColor === key;
}

function waterOxygen() {
  const blue = lightBonus('blue') ? uvLevel() * 4 : 0;
  return Math.round(clamp(50 + state.water.clean * 0.44 + equipLvl('oxygen') * 8 + blue, 0, 100));
}

function filterMultiplier() {
  return [1, 0.78, 0.58, 0.38][equipLvl('filter')];
}

/* 0 = água perfeita, 1 = tudo fora do ideal */
function waterStress() {
  const base = waterBase();
  const w = state.water;
  const tBad = clamp((Math.abs(w.temp - base.temp) - 1) / 3, 0, 1);
  const pBad = clamp((Math.abs(w.ph - base.ph) - 0.2) / 0.4, 0, 1);
  const oBad = clamp((70 - waterOxygen()) / 40, 0, 1);
  const cBad = clamp((60 - w.clean) / 60, 0, 1);
  return clamp(tBad * 0.30 + pBad * 0.25 + oBad * 0.15 + cBad * 0.30, 0, 1);
}

function waterWarning() {
  const base = waterBase();
  const w = state.water;
  if (w.temp < base.temp - 1.4) return { text: 'Temperatura baixa', crit: w.temp < base.temp - 2.6 };
  if (w.temp > base.temp + 1.4) return { text: 'Temperatura alta', crit: w.temp > base.temp + 2.6 };
  if (w.ph < base.ph - 0.22) return { text: 'pH baixo', crit: w.ph < base.ph - 0.4 };
  if (w.ph > base.ph + 0.22) return { text: 'pH alto', crit: w.ph > base.ph + 0.4 };
  if (waterOxygen() < 60) return { text: 'Oxigênio baixo', crit: waterOxygen() < 45 };
  if (w.clean < 45) return { text: 'Água suja', crit: w.clean < 25 };
  return null;
}

function totalUpgradeLevels() {
  return EQUIPMENT_CATALOG.reduce((sum, item) => sum + equipLvl(item.key), 0);
}

function expansionCost() {
  return 150 + 100 * Math.max(0, Math.floor((state.capacity - 4) / 2));
}

/* ---------------- persistence ---------------- */
function save() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) {}
}

function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    state = Object.assign(JSON.parse(JSON.stringify(DEFAULT_STATE)), data);
    state.water = Object.assign({ clean: 100, temp: 26, ph: 7.2 }, data.water || {});
    state.equipment = Object.assign({ heater: 0, filter: 0, oxygen: 0, buffer: 0, uv: 0 }, data.equipment || {});
    Object.keys(state.equipment).forEach(k => { state.equipment[k] = clamp(Math.round(state.equipment[k] || 0), 0, 3); });
    state.lightColors = Array.isArray(data.lightColors) ? data.lightColors.filter(k => LIGHT_COLORS.some(c => c.key === k)) : [];
    if (!state.lightColors.length) state.lightColors = ['blue'];
    state.lightColor = LIGHT_COLORS.some(c => c.key === data.lightColor) ? data.lightColor : 'blue';
    if (!state.lightColors.includes(state.lightColor)) state.lightColors.push(state.lightColor);
    state.tasks = Object.assign({ feed: false, pet: false, clean: false }, data.tasks || {});
    delete state.tasks.check;
    state.tasksDate = typeof data.tasksDate === 'string' ? data.tasksDate : null;
    state.stats = Object.assign({ cleans: 0, hatched: 0, earned: 25, games: 0, upgrades: 0, fed: 0 }, data.stats || {});
    state.ownedDecor = data.ownedDecor || {};
    // saves antigos podem ter espécies que não existem mais
    const known = k => Object.keys(SPECIES).some(t => SPECIES[t].some(s => s.key === k));
    state.pets = (data.pets || []).filter(p => known(p.species)).map(p => {
      const pet = { depth: 1, x: rand(8, 78), y: rand(28, 60), ...p };
      const sp = speciesOf(pet.species);
      pet.affinity = Number.isFinite(pet.affinity) ? clamp(pet.affinity, 0, 100) : 25;
      pet.friendships = pet.friendships && typeof pet.friendships === 'object'
        ? Object.fromEntries(Object.entries(pet.friendships)
          .filter(([uid, value]) => Number(uid) !== pet.uid && Number.isFinite(value))
          .map(([uid, value]) => [uid, clamp(value, 0, 100)]))
        : {};
      if (sp.bottom) {
        pet.depth = 2;
        pet.y = clamp(pet.y, 9, 14);
      }
      return pet;
    });
    state.decor = (data.decor && data.decor.length ? data.decor : JSON.parse(JSON.stringify(STARTER_DECOR)))
      .map(d => {
        if (d.sprite) return { ...d, sprite: LEGACY_DECOR_SPRITES[d.sprite] || d.sprite };
        const cat = DECOR_CATALOG.find(c => c.key === d.key) || DECOR_CATALOG[0];
        return {
          key: cat.key,
          kind: cat.kind,
          sprite: cat.thumb,
          x: d.x !== undefined ? d.x : rand(4, 84),
          bottom: 6,
          w: cat.widths[0],
          front: !!cat.front
        };
      });
    uidSeq = state.pets.reduce((m, p) => Math.max(m, p.uid || 0), 0) + 1;
    return true;
  } catch (e) {
    return false;
  }
}

/* ---------------- atalho de teste ----------------
   Abra aquario.html?coins=999999 uma vez para aplicar as moedas
   ao save atual. A URL é limpa sozinha depois de aplicar. */
function applyTestParams() {
  const params = new URLSearchParams(location.search);
  if (!params.has('coins')) return false;
  const coins = Math.round(Number(params.get('coins')));
  if (!Number.isFinite(coins)) return false;

  state.coins = clamp(coins, 0, 9999999);
  save();

  try {
    params.delete('coins');
    const qs = params.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
  } catch (e) {}

  return true;
}

function dashboardWidgets() {
  return [...$('dashboard').querySelectorAll('.dashboard-widget')];
}

function dashboardWidgetOrder() {
  return dashboardWidgets().map(widget => widget.dataset.widget);
}

function setWidgetGeometry(widget, geometry) {
  const snap = value => Math.round(value / DASHBOARD_GRID_SIZE) * DASHBOARD_GRID_SIZE;
  const minimum = DASHBOARD_MINIMUM_SIZES[widget.dataset.widget];
  const width = Math.min(minimum.maxWidth || Infinity, Math.max(minimum.width, snap(geometry.width)));
  const height = Math.min(minimum.maxHeight || Infinity, Math.max(minimum.height, snap(geometry.height)));
  const dashboard = widget.closest('#dashboard');
  let x = Math.max(0, snap(geometry.x));
  if (dashboard && width <= dashboard.clientWidth) {
    const maxX = Math.floor((dashboard.clientWidth - width) / DASHBOARD_GRID_SIZE) * DASHBOARD_GRID_SIZE;
    x = Math.min(x, maxX);
  } else {
    x = 0;
  }
  widget.style.setProperty('--window-x', `${x}px`);
  widget.style.setProperty('--window-y', `${Math.max(0, snap(geometry.y))}px`);
  widget.style.setProperty('--window-width', `${width}px`);
  widget.style.setProperty('--window-height', `${height}px`);
}

function getWidgetGeometry(widget) {
  return {
    x: parseFloat(widget.style.getPropertyValue('--window-x')) || 0,
    y: parseFloat(widget.style.getPropertyValue('--window-y')) || 0,
    width: parseFloat(widget.style.getPropertyValue('--window-width')) || widget.offsetWidth,
    height: parseFloat(widget.style.getPropertyValue('--window-height')) || widget.offsetHeight
  };
}

function dashboardWidgetsOverlap(first, second, gap = 10) {
  return first.x < second.x + second.width + gap
    && first.x + first.width + gap > second.x
    && first.y < second.y + second.height + gap
    && first.y + first.height + gap > second.y;
}

function findFreeWidgetPosition(desired, width, height, occupied, dashboardWidth) {
  const maxX = Math.max(0, dashboardWidth - width);
  const clampX = x => Math.max(0, Math.min(maxX, x));
  const xCandidates = new Set([clampX(desired.x), 0, maxX]);
  const yCandidates = new Set([Math.max(0, desired.y), 0]);
  let lowestBottom = 0;
  occupied.forEach(other => {
    xCandidates.add(clampX(other.x - width - 10));
    xCandidates.add(clampX(other.x + other.width + 10));
    yCandidates.add(Math.max(0, other.y - height - 10));
    yCandidates.add(Math.max(0, other.y + other.height + 10));
    lowestBottom = Math.max(lowestBottom, other.y + other.height);
  });
  yCandidates.add(lowestBottom + 10);

  let best = null;
  let bestDistance = Infinity;
  xCandidates.forEach(x => yCandidates.forEach(y => {
    const candidate = { x, y, width, height };
    if (occupied.some(other => dashboardWidgetsOverlap(candidate, other))) return;
    const distance = (x - desired.x) ** 2 + 8 * (y - desired.y) ** 2;
    if (distance < bestDistance) {
      best = { x, y };
      bestDistance = distance;
    }
  }));
  return best || { x: clampX(desired.x), y: lowestBottom + 10 };
}

function preventDashboardWidgetOverlap(widgets, dashboard) {
  const geometries = new Map([...widgets.entries()].map(([key, widget]) => [key, getWidgetGeometry(widget)]));
  const occupied = [];
  const orderedKeys = [...widgets.keys()].sort((first, second) => {
    if (first === 'tank') return -1;
    if (second === 'tank') return 1;
    const firstGeometry = geometries.get(first);
    const secondGeometry = geometries.get(second);
    return firstGeometry.y - secondGeometry.y || firstGeometry.x - secondGeometry.x;
  });
  let adjusted = false;
  orderedKeys.forEach(key => {
    const widget = widgets.get(key);
    const geometry = getWidgetGeometry(widget);
    if (getComputedStyle(widget).display === 'none') return;
    const position = findFreeWidgetPosition(
      geometry, geometry.width, geometry.height, occupied, dashboard.clientWidth
    );
    if (position.x !== geometry.x || position.y !== geometry.y) {
      setWidgetGeometry(widget, { ...geometry, ...position });
      adjusted = true;
    }
    occupied.push(getWidgetGeometry(widget));
  });
  return adjusted;
}

function reflowDashboardWidgets(widgets, dashboard, anchorWidget) {
  const visibleWidgets = [...widgets.values()]
    .filter(widget => getComputedStyle(widget).display !== 'none');
  const anchoredGeometry = anchorWidget ? getWidgetGeometry(anchorWidget) : null;
  const occupied = [];

  if (anchorWidget && anchoredGeometry) occupied.push(anchoredGeometry);
  const remaining = visibleWidgets
    .filter(widget => widget !== anchorWidget)
    .sort((first, second) => {
      const firstGeometry = getWidgetGeometry(first);
      const secondGeometry = getWidgetGeometry(second);
      return firstGeometry.y - secondGeometry.y || firstGeometry.x - secondGeometry.x;
    });

  remaining.forEach(widget => {
    const geometry = getWidgetGeometry(widget);
    const position = findFreeWidgetPosition(
      geometry, geometry.width, geometry.height, occupied, dashboard.clientWidth
    );
    setWidgetGeometry(widget, { ...geometry, ...position });
    occupied.push(getWidgetGeometry(widget));
  });
  return visibleWidgets;
}

function saveDashboardOrder() {
  try {
    localStorage.setItem(DASHBOARD_LAYOUT_KEY, JSON.stringify(dashboardWidgetOrder()));
  } catch (error) {
    console.error('Não foi possível salvar a organização dos painéis.', error);
    toast('Não foi possível salvar a organização dos painéis');
  }
}

function saveDashboardSizes(widgets) {
  const sizes = {};
  widgets.forEach((widget, key) => {
    sizes[key] = {
      x: parseFloat(widget.style.getPropertyValue('--window-x')),
      y: parseFloat(widget.style.getPropertyValue('--window-y')),
      width: parseFloat(widget.style.getPropertyValue('--window-width')),
      height: parseFloat(widget.style.getPropertyValue('--window-height'))
    };
  });
  try {
    localStorage.setItem(DASHBOARD_SIZES_KEY, JSON.stringify(sizes));
  } catch (error) {
    console.error('Não foi possível salvar o tamanho dos painéis.', error);
    toast('Não foi possível salvar o tamanho dos painéis');
  }
}

function saveDashboardWindows(widgets) {
  const state = { closed: [], minimized: [] };
  widgets.forEach((widget, key) => {
    if (widget.classList.contains('is-window-closed')) state.closed.push(key);
    if (widget.classList.contains('is-window-minimized')) state.minimized.push(key);
  });
  try {
    localStorage.setItem(DASHBOARD_WINDOWS_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Não foi possível salvar o estado dos painéis.', error);
    toast('Não foi possível salvar o estado dos painéis');
  }
}

function announceDashboardOrder(widget) {
  const position = dashboardWidgetOrder().indexOf(widget.dataset.widget) + 1;
  const heading = widget.querySelector('.panel-head h2');
  const label = heading ? heading.textContent.trim() : 'Aquário';
  $('layoutMessage').textContent = `${label} movido para a posição ${position}`;
}

function setupDashboardGrid() {
  const dashboard = $('dashboard');
  const columnCount = matchMedia('(max-width: 1080px) and (min-width: 861px)').matches ? 6 : 12;
  const defaultWidgetColumns = columnCount === 6 ? 2 : 3;
  const specs = [
    ['overview', '.col-left > .panel:first-child'],
    ['fish', '#fishHead'],
    ['water', '#panelParams'],
    ['tank', '.col-center'],
    ['tasks', '#taskList'],
    ['decor', '#decorPanel'],
    ['background', '#bgList'],
    ['light', '#lightDots']
  ];
  const widgets = new Map();
  const labels = new Map();

  specs.forEach(([key, selector]) => {
    const target = dashboard.querySelector(selector);
    if (!target) throw new Error(`Painel do dashboard ausente: ${key}`);
    const widget = key === 'overview' || key === 'water' || key === 'decor'
      ? target
      : target.closest('.panel') || target;
    widget.classList.add('dashboard-widget');
    widget.dataset.widget = key;
    if (key === 'tank') widget.classList.add('dashboard-tank');
    widget.style.setProperty('--widget-span',
      key === 'tank' ? String(columnCount === 6 ? 4 : 6)
        : key === 'fish' && columnCount === 12 ? '6' : String(defaultWidgetColumns));
    widget.style.setProperty('--widget-rows', key === 'tank' ? '4' : '1');

    const grip = document.createElement('button');
    grip.className = 'widget-grip';
    grip.type = 'button';
    grip.textContent = '⠿';
    grip.title = 'Arraste para reorganizar';
    const heading = widget.querySelector('.panel-head h2');
    const label = heading ? heading.textContent.trim() : 'Aquário';
    labels.set(key, label);
    grip.setAttribute('aria-label', `Reorganizar painel ${label}`);
    grip.tabIndex = -1;
    widget.appendChild(grip);

    ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'].forEach(edge => {
      const handle = document.createElement('button');
      handle.type = 'button';
      handle.className = 'widget-resize';
      handle.dataset.resizeEdge = edge;
      handle.title = 'Arraste a borda para redimensionar';
      handle.setAttribute('aria-label', `Redimensionar ${label} pela borda ${edge}`);
      handle.tabIndex = -1;
      widget.appendChild(handle);
    });

    const windowControls = document.createElement('div');
    windowControls.className = 'widget-window-controls';
    [
      ['minimize', '−', `Minimizar painel ${label}`],
      ['close', '×', `Fechar painel ${label}`]
    ].forEach(([action, text, accessibleLabel]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `widget-window-action is-${action}`;
      button.dataset.windowAction = action;
      button.textContent = text;
      button.title = accessibleLabel;
      button.setAttribute('aria-label', accessibleLabel);
      button.tabIndex = -1;
      windowControls.appendChild(button);
    });
    widget.appendChild(windowControls);
    widgets.set(key, widget);
  });

  DASHBOARD_WIDGET_ORDER.forEach(key => dashboard.appendChild(widgets.get(key)));
  dashboard.querySelector('.col-left').remove();
  dashboard.querySelector('.col-center').classList.add('dashboard-widget');
  dashboard.querySelector('.col-right').remove();

  try {
    const savedOrder = JSON.parse(localStorage.getItem(DASHBOARD_LAYOUT_KEY) || 'null');
    if (Array.isArray(savedOrder)
      && savedOrder.length === DASHBOARD_WIDGET_ORDER.length
      && new Set(savedOrder).size === DASHBOARD_WIDGET_ORDER.length
      && savedOrder.every(key => DASHBOARD_WIDGET_ORDER.includes(key))) {
      savedOrder.forEach(key => dashboard.appendChild(widgets.get(key)));
      if (savedOrder.some((key, index) => key !== DASHBOARD_WIDGET_ORDER[index])) {
        dashboard.classList.add('is-customized');
      }
    }
    const savedSizes = JSON.parse(localStorage.getItem(DASHBOARD_SIZES_KEY) || 'null');
    if (savedSizes && typeof savedSizes === 'object' && !Array.isArray(savedSizes)) {
      widgets.forEach((widget, key) => {
        const size = savedSizes[key];
        if (!size || !Number.isInteger(size.columns) || !Number.isInteger(size.rows)) return;
        const minColumns = key === 'tank' ? 3 : 2;
        widget.style.setProperty('--widget-span', String(Math.max(minColumns, Math.min(columnCount, size.columns))));
        widget.style.setProperty('--widget-rows', String(Math.max(1, Math.min(5, size.rows))));
      });
      if (Object.keys(savedSizes).length) dashboard.classList.add('is-customized');
    }
  } catch (error) {
    console.warn('Não foi possível carregar a organização salva dos painéis.', error);
  }

  let savedSizes = null;
  try {
    savedSizes = JSON.parse(localStorage.getItem(DASHBOARD_SIZES_KEY) || 'null');
  } catch (error) {
    console.warn('Não foi possível carregar os tamanhos salvos dos painéis.', error);
  }
  const dashboardRect = dashboard.getBoundingClientRect();
  let sizesAdjusted = false;
  widgets.forEach((widget, key) => {
    const savedSize = savedSizes && savedSizes[key];
    const rect = widget.getBoundingClientRect();
    const geometry = savedSize
      && [savedSize.x, savedSize.y, savedSize.width, savedSize.height].every(Number.isFinite)
      ? savedSize
      : {
          x: rect.left - dashboardRect.left,
          y: rect.top - dashboardRect.top,
          width: rect.width,
          height: rect.height
        };
    const minWidth = Math.min(DASHBOARD_MINIMUM_SIZES[key].width, dashboard.clientWidth);
    const minHeight = DASHBOARD_MINIMUM_SIZES[key].height;
    const x = Math.max(0, Math.min(dashboard.clientWidth - minWidth, geometry.x));
    const normalizedGeometry = {
      x,
      y: Math.max(0, geometry.y),
      width: Math.min(DASHBOARD_MINIMUM_SIZES[key].maxWidth || Infinity,
        Math.max(minWidth, Math.min(dashboard.clientWidth - x, geometry.width))),
      height: Math.min(DASHBOARD_MINIMUM_SIZES[key].maxHeight || Infinity,
        Math.max(minHeight, geometry.height))
    };
    if (normalizedGeometry.width !== geometry.width || normalizedGeometry.height !== geometry.height) {
      sizesAdjusted = true;
    }
    setWidgetGeometry(widget, normalizedGeometry);
  });
  dashboard.classList.add('is-freeform');
  const layoutAdjusted = preventDashboardWidgetOverlap(widgets, dashboard) || sizesAdjusted;
  if (layoutAdjusted) {
    dashboard.classList.add('is-customized');
    saveDashboardSizes(widgets);
  }
  try {
    const savedWindows = JSON.parse(localStorage.getItem(DASHBOARD_WINDOWS_KEY) || 'null');
    if (savedWindows && typeof savedWindows === 'object' && !Array.isArray(savedWindows)) {
      (Array.isArray(savedWindows.closed) ? savedWindows.closed : []).forEach(key => {
        if (widgets.has(key)) widgets.get(key).classList.add('is-window-closed');
      });
      (Array.isArray(savedWindows.minimized) ? savedWindows.minimized : []).forEach(key => {
        if (widgets.has(key) && !widgets.get(key).classList.contains('is-window-closed')) {
          widgets.get(key).classList.add('is-window-minimized');
        }
      });
    }
  } catch (error) {
    console.warn('Não foi possível carregar o estado salvo dos painéis.', error);
  }

  const refreshWindowManager = () => {
    const dock = $('dashboardMinimized');
    const menu = $('windowManagerMenu');
    dock.replaceChildren();
    menu.replaceChildren();

    widgets.forEach((widget, key) => {
      const label = labels.get(key);
      if (widget.classList.contains('is-window-minimized')) {
        const restoreButton = document.createElement('button');
        restoreButton.type = 'button';
        restoreButton.className = 'minimized-window';
        restoreButton.textContent = `▣ ${label}`;
        restoreButton.title = `Restaurar ${label}`;
        restoreButton.onclick = () => {
          widget.classList.remove('is-window-minimized');
          saveDashboardWindows(widgets);
          refreshWindowManager();
          $('layoutMessage').textContent = `${label} restaurado`;
        };
        dock.appendChild(restoreButton);
      }
      if (widget.classList.contains('is-window-closed')) {
        const reopenButton = document.createElement('button');
        reopenButton.type = 'button';
        reopenButton.className = 'reopen-window';
        reopenButton.textContent = `Abrir ${label}`;
        reopenButton.onclick = () => {
          widget.classList.remove('is-window-closed', 'is-window-minimized');
          saveDashboardWindows(widgets);
          refreshWindowManager();
          $('layoutMessage').textContent = `${label} aberto`;
        };
        menu.appendChild(reopenButton);
      }
    });
    dock.hidden = dock.childElementCount === 0;
    $('windowManagerToggle').hidden = menu.childElementCount === 0;
    if (menu.childElementCount === 0) {
      menu.hidden = true;
      $('windowManagerToggle').setAttribute('aria-expanded', 'false');
    }
    dashboard.querySelector('.dashboard-toolbar').hidden = dock.hidden
      && (!dashboard.classList.contains('editing') || menu.childElementCount === 0);
  };
  refreshWindowManager();

  const setEditing = (editing) => {
    dashboard.classList.toggle('editing', editing);
    $('layoutToggle').textContent = editing ? 'CONCLUIR' : 'ORGANIZAR GRADE';
    $('layoutToggle').setAttribute('aria-pressed', String(editing));
    $('layoutReset').hidden = !editing;
    $('windowManagerToggle').hidden = !editing || $('windowManagerMenu').childElementCount === 0;
    if (!editing) {
      $('windowManagerMenu').hidden = true;
      $('windowManagerToggle').setAttribute('aria-expanded', 'false');
    }
    $('layoutMessage').textContent = editing
      ? 'Arraste ⠿ para mover e as bordas ou cantos para redimensionar; use − para minimizar e × para fechar'
      : 'Organize os painéis do seu aquário';
    widgets.forEach(widget => {
      widget.querySelector('.widget-grip').tabIndex = editing ? 0 : -1;
      widget.querySelectorAll('.widget-resize').forEach(button => {
        button.tabIndex = editing ? 0 : -1;
      });
      widget.querySelectorAll('.widget-window-action').forEach(button => {
        button.tabIndex = editing ? 0 : -1;
      });
    });
    refreshWindowManager();
  };

  $('windowManagerToggle').onclick = () => {
    const menu = $('windowManagerMenu');
    menu.hidden = !menu.hidden;
    $('windowManagerToggle').setAttribute('aria-expanded', String(!menu.hidden));
  };
  $('layoutToggle').onclick = () => setEditing(!dashboard.classList.contains('editing'));
  $('layoutReset').onclick = () => {
    DASHBOARD_WIDGET_ORDER.forEach(key => dashboard.appendChild(widgets.get(key)));
    dashboard.classList.remove('is-customized');
    dashboard.classList.remove('is-freeform');
    dashboard.querySelector('.dashboard-toolbar').hidden = false;
    widgets.forEach((widget, key) => {
      widget.classList.remove('is-window-closed', 'is-window-minimized');
      widget.style.setProperty('--widget-span',
        key === 'tank' ? String(columnCount === 6 ? 4 : 6)
          : key === 'fish' && columnCount === 12 ? '6' : String(defaultWidgetColumns));
      widget.style.setProperty('--widget-rows', key === 'tank' ? '4' : '1');
    });
    const dashboardRect = dashboard.getBoundingClientRect();
    widgets.forEach(widget => {
      const rect = widget.getBoundingClientRect();
      setWidgetGeometry(widget, {
        x: rect.left - dashboardRect.left,
        y: rect.top - dashboardRect.top,
        width: rect.width,
        height: rect.height
      });
    });
    dashboard.classList.add('is-freeform');
    preventDashboardWidgetOverlap(widgets, dashboard);
    try {
      localStorage.removeItem(DASHBOARD_LAYOUT_KEY);
      localStorage.removeItem(DASHBOARD_SIZES_KEY);
      localStorage.removeItem(DASHBOARD_WINDOWS_KEY);
    } catch (error) {
      console.error('Não foi possível remover a organização salva dos painéis.', error);
      toast('Não foi possível restaurar a grade');
    }
    refreshWindowManager();
    $('layoutMessage').textContent = 'Grade original restaurada';
  };

  let dragState = null;
  const moveWidget = (widget, beforeWidget) => {
    if (!widget || widget === beforeWidget) return;
    dashboard.insertBefore(widget, beforeWidget || null);
  };

  const updateDragTarget = event => {
    if (!dragState || dragState.mode !== 'move' || dragState.pointerId !== event.pointerId) return;
    const { widget, startX, startY, initialX, initialY } = dragState;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    const geometry = getWidgetGeometry(widget);
    const x = Math.max(0, Math.min(dashboard.clientWidth - geometry.width, initialX + deltaX));
    const y = Math.max(0, initialY + deltaY);
    setWidgetGeometry(widget, { ...geometry, x, y });
    const candidates = dashboardWidgets().filter(item => item !== dragState.widget
      && !item.classList.contains('is-window-closed')
      && !item.classList.contains('is-window-minimized'));
    let nearest = null;
    let nearestDistance = Infinity;
    candidates.forEach(candidate => {
      const rect = candidate.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = dx * dx + dy * dy;
      if (distance < nearestDistance) {
        nearest = candidate;
        nearestDistance = distance;
      }
    });
    if (!nearest) return;
    const rect = nearest.getBoundingClientRect();
    const verticalOffset = event.clientY - (rect.top + rect.height / 2);
    const before = Math.abs(verticalOffset) < rect.height * 0.2
      ? dashboardWidgets().indexOf(dragState.widget) > dashboardWidgets().indexOf(nearest)
      : verticalOffset < 0;
    dashboard.querySelectorAll('.drop-target').forEach(item => item.classList.remove('drop-target'));
    nearest.classList.add('drop-target');
    dragState.target = nearest;
    dragState.before = before;
  };

  const finishDrag = event => {
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    if (dragState.mode === 'resize') {
      const { widget, initialX, initialY, initialWidth, initialHeight } = dragState;
      dragState = null;
      widget.classList.remove('is-resizing');
      const x = parseFloat(widget.style.getPropertyValue('--window-x'));
      const y = parseFloat(widget.style.getPropertyValue('--window-y'));
      const width = parseFloat(widget.style.getPropertyValue('--window-width'));
      const height = parseFloat(widget.style.getPropertyValue('--window-height'));
      if (x !== initialX || y !== initialY || width !== initialWidth || height !== initialHeight) {
        dashboard.classList.add('is-customized');
        saveDashboardSizes(widgets);
        const heading = widget.querySelector('.panel-head h2');
        $('layoutMessage').textContent = `${heading ? heading.textContent.trim() : 'Aquário'} redimensionado`;
      }
      return;
    }
    const { widget: movedWidget, initialOrder, target, before } = dragState;
    dragState = null;
    movedWidget.classList.remove('is-dragging');
    dashboard.querySelectorAll('.drop-target').forEach(item => item.classList.remove('drop-target'));
    if (event.type === 'pointerup' && target) {
      moveWidget(movedWidget, before ? target : target.nextElementSibling);
    }
    reflowDashboardWidgets(widgets, dashboard, movedWidget);
    if (initialOrder.some((key, index) => key !== dashboardWidgetOrder()[index])) {
      dashboard.classList.add('is-customized');
      saveDashboardOrder();
      announceDashboardOrder(movedWidget);
    }
    saveDashboardSizes(widgets);
  };

  document.addEventListener('pointermove', updateDragTarget);
  document.addEventListener('pointermove', event => {
    if (!dragState || dragState.mode !== 'resize' || dragState.pointerId !== event.pointerId) return;
    const { widget, edge, startX, startY, initialX, initialY, initialWidth, initialHeight } = dragState;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    const { width: configuredMinWidth, height: minHeight } = DASHBOARD_MINIMUM_SIZES[widget.dataset.widget];
    let x = initialX;
    let y = initialY;
    let width = initialWidth;
    let height = initialHeight;
    const minWidth = Math.min(configuredMinWidth, dashboard.clientWidth - x);

    if (edge.includes('e')) width = Math.max(minWidth, Math.min(dashboard.clientWidth - x, initialWidth + deltaX));
    if (edge.includes('s')) height = Math.max(minHeight, initialHeight + deltaY);
    if (edge.includes('w')) {
      x = Math.max(0, Math.min(initialX + initialWidth - minWidth, initialX + deltaX));
      width = initialX + initialWidth - x;
    }
    if (edge.includes('n')) {
      y = Math.max(0, Math.min(initialY + initialHeight - minHeight, initialY + deltaY));
      height = initialY + initialHeight - y;
    }
    const proposed = { x, y, width, height };
    const occupied = dashboardWidgets()
      .filter(item => item !== widget && getComputedStyle(item).display !== 'none')
      .map(getWidgetGeometry);
    let geometry = { ...proposed };
    if (edge.includes('e') || edge.includes('w')) {
      occupied.forEach(other => {
        const verticalOverlap = geometry.y < other.y + other.height + 10
          && geometry.y + geometry.height + 10 > other.y;
        if (!verticalOverlap) return;
        if (edge.includes('e') && other.x >= initialX + initialWidth - 1) {
          geometry.width = Math.min(geometry.width, other.x - 10 - geometry.x);
        }
        if (edge.includes('w') && other.x + other.width <= initialX + 1) {
          const right = initialX + initialWidth;
          geometry.x = Math.max(geometry.x, other.x + other.width + 10);
          geometry.width = right - geometry.x;
        }
      });
    }
    if (edge.includes('n') || edge.includes('s')) {
      occupied.forEach(other => {
        const horizontalOverlap = geometry.x < other.x + other.width + 10
          && geometry.x + geometry.width + 10 > other.x;
        if (!horizontalOverlap) return;
        if (edge.includes('s') && other.y >= initialY + initialHeight - 1) {
          geometry.height = Math.min(geometry.height, other.y - 10 - geometry.y);
        }
        if (edge.includes('n') && other.y + other.height <= initialY + 1) {
          const bottom = initialY + initialHeight;
          geometry.y = Math.max(geometry.y, other.y + other.height + 10);
          geometry.height = bottom - geometry.y;
        }
      });
    }
    geometry.width = Math.max(minWidth, geometry.width);
    geometry.height = Math.max(minHeight, geometry.height);
    if (occupied.some(other => dashboardWidgetsOverlap(geometry, other))) {
      const initial = {
        x: initialX,
        y: initialY,
        width: initialWidth,
        height: initialHeight
      };
      let low = 0;
      let high = 1;
      for (let iteration = 0; iteration < 16; iteration += 1) {
        const progress = (low + high) / 2;
        const candidate = {
          x: initial.x + (geometry.x - initial.x) * progress,
          y: initial.y + (geometry.y - initial.y) * progress,
          width: initial.width + (geometry.width - initial.width) * progress,
          height: initial.height + (geometry.height - initial.height) * progress
        };
        if (occupied.some(other => dashboardWidgetsOverlap(candidate, other))) high = progress;
        else low = progress;
      }
      geometry = {
        x: initial.x + (geometry.x - initial.x) * low,
        y: initial.y + (geometry.y - initial.y) * low,
        width: initial.width + (geometry.width - initial.width) * low,
        height: initial.height + (geometry.height - initial.height) * low
      };
    }
    setWidgetGeometry(widget, geometry);
    const snappedGeometry = getWidgetGeometry(widget);
    if (occupied.some(other => dashboardWidgetsOverlap(snappedGeometry, other))) {
      setWidgetGeometry(widget, dragState.lastValidGeometry);
    } else {
      dragState.lastValidGeometry = snappedGeometry;
    }
  });
  document.addEventListener('pointerup', finishDrag);
  document.addEventListener('pointercancel', finishDrag);

  widgets.forEach(widget => {
    const grip = widget.querySelector('.widget-grip');
    grip.addEventListener('pointerdown', event => {
      if (!dashboard.classList.contains('editing') || event.button !== 0) return;
      event.preventDefault();
      const rect = widget.getBoundingClientRect();
      const dashboardRect = dashboard.getBoundingClientRect();
      dragState = {
        mode: 'move',
        widget,
        pointerId: event.pointerId,
        initialOrder: dashboardWidgetOrder(),
        startX: event.clientX,
        startY: event.clientY,
        initialX: rect.left - dashboardRect.left + dashboard.scrollLeft,
        initialY: rect.top - dashboardRect.top + dashboard.scrollTop
      };
      widget.classList.add('is-dragging');
    });

    widget.querySelectorAll('.widget-resize').forEach(resizeHandle => {
      resizeHandle.addEventListener('pointerdown', event => {
        if (!dashboard.classList.contains('editing') || event.button !== 0) return;
        event.preventDefault();
        const rect = widget.getBoundingClientRect();
        const dashboardRect = dashboard.getBoundingClientRect();
        dragState = {
          mode: 'resize',
          widget,
          pointerId: event.pointerId,
          edge: resizeHandle.dataset.resizeEdge,
          startX: event.clientX,
          startY: event.clientY,
          initialX: rect.left - dashboardRect.left + dashboard.scrollLeft,
          initialY: rect.top - dashboardRect.top + dashboard.scrollTop,
          initialWidth: rect.width,
          initialHeight: rect.height,
          lastValidGeometry: {
            x: rect.left - dashboardRect.left + dashboard.scrollLeft,
            y: rect.top - dashboardRect.top + dashboard.scrollTop,
            width: rect.width,
            height: rect.height
          }
        };
        widget.classList.add('is-resizing');
      });
    });

    widget.querySelectorAll('.widget-window-action').forEach(button => {
      button.addEventListener('click', () => {
        const action = button.dataset.windowAction;
        widget.classList.remove('is-window-closed', 'is-window-minimized');
        widget.classList.add(action === 'close' ? 'is-window-closed' : 'is-window-minimized');
        saveDashboardWindows(widgets);
        refreshWindowManager();
        $('layoutMessage').textContent = action === 'close'
          ? `${labels.get(widget.dataset.widget)} fechado · reabra em JANELAS`
          : `${labels.get(widget.dataset.widget)} minimizado`;
      });
    });

    grip.addEventListener('keydown', event => {
      const order = dashboardWidgets();
      const index = order.indexOf(widget);
      const direction = ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1
        : ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : 0;
      if (event.key === 'Home') {
        event.preventDefault();
        moveWidget(widget, order[0]);
      } else if (event.key === 'End') {
        event.preventDefault();
        moveWidget(widget, null);
      } else if (direction && order[index + direction]) {
        event.preventDefault();
        const adjacent = order[index + direction];
        moveWidget(widget, direction < 0 ? adjacent : adjacent.nextElementSibling);
      } else {
        return;
      }
      dashboard.classList.add('is-customized');
      saveDashboardOrder();
      const currentX = parseFloat(widget.style.getPropertyValue('--window-x'));
      const currentY = parseFloat(widget.style.getPropertyValue('--window-y'));
      const geometry = getWidgetGeometry(widget);
      const occupied = dashboardWidgets()
        .filter(item => item !== widget && getComputedStyle(item).display !== 'none')
        .map(getWidgetGeometry);
      const position = findFreeWidgetPosition({
        x: currentX + (event.key === 'ArrowRight' ? 24 : event.key === 'ArrowLeft' ? -24 : 0),
        y: currentY + (event.key === 'ArrowDown' ? 24 : event.key === 'ArrowUp' ? -24 : 0)
      }, geometry.width, geometry.height, occupied, dashboard.clientWidth);
      setWidgetGeometry(widget, {
        ...geometry,
        ...position
      });
      saveDashboardSizes(widgets);
      announceDashboardOrder(widget);
    });

    grip.addEventListener('click', event => event.stopPropagation());
  });

  setEditing(false);
}

/* ---------------- boot ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  const loaded = load();
  const testCoins = applyTestParams();
  const tasksReset = ensureDailyTasks();
  applyDecorVisibility();
  buildDecorShop();
  buildBackgroundList();
  setupDashboardGrid();
  bindGlobal();
  renderAll();

  if ((tasksReset || testCoins) && loaded) save();

  if (!state.tankType) initializeAquarium(DEFAULT_TANK_TYPE);
  else startLoops();
});

function startLoops() {
  startWaterLoop();
  startBubbleLoop();
  startCoinLoop();
  startSwimLoop();
  startEmoteLoop();
  startAquariumMoments();
  // virou o dia com a aba aberta? reseta as tarefas do dia
  setInterval(() => {
    if (ensureDailyTasks()) {
      save();
      renderAll();
      toast('Novas tarefas do dia!');
    }
  }, 30000);
}

/* ---------------- first run ---------------- */
function initializeAquarium(type) {
  state.tankType = type;
  state.water.temp = type === 'salt' ? 26 : 24;
  state.water.ph = type === 'salt' ? 8.1 : 7.2;
  const starters = type === 'salt'
    ? ['clownfish', 'anchovy']
    : ['goldfish', 'angelfish'];
  if (!state.pets.length) starters.forEach((key, i) => addPet(key, { shown: true, depth: i % 3 }));
  renderAll();
  save();
  startLoops();
  toast(type === 'salt' ? 'Aquário de água salgada criado!' : 'Aquário de água doce criado!');
}

function addPet(speciesKey, opts = {}) {
  const sp = speciesOf(speciesKey);
  const slot = state.pets.filter(p => p.shown).length;
  const pet = {
    uid: uidSeq++,
    species: speciesKey,
    name: opts.name || sp.name,
    rarity: sp.rarity,
    stage: 'baby',
    hunger: 65,
    love: 55,
    clean: 75,
    happy: 70,
    affinity: rand(22, 38),
    friendships: {},
    shown: opts.shown !== undefined ? opts.shown : false,
    depth: sp.bottom ? 2 : (opts.depth !== undefined ? opts.depth : Math.floor(rand(0, 3))),
    x: sp.bottom ? rand(16, 58)
      : clamp(10 + (slot % 4) * 17 + rand(-4, 4), 3, 70),
    y: sp.bottom
      ? clamp(10 + rand(0, 3), 9, 14)
      : clamp(30 + (slot % 3) * 13 + rand(-3, 3), 27, 60),
    facing: Math.random() < 0.5 ? 'left' : 'right'
  };
  state.pets.push(pet);
  state.stats.hatched++;
  return pet;
}

/* ---------------- rendering ---------------- */
function renderAll() {
  renderHeader();
  renderLevel();
  renderTankSummary();
  renderFishList();
  renderParams();
  renderTasks();
  renderTank();
  if (DECOR_ENABLED) renderDecorShop();
  renderBackgroundList();
  renderLightDots();
}

function renderHeader() {
  $('coins').textContent = state.coins;
  $('foodCount').textContent = state.food;
  $('gems').textContent = state.gems;
}

function renderLevel() {
  const l = levelInfo();
  $('levelNum').textContent = l.level;
  $('expNow').textContent = Math.round(l.now);
  $('expMax').textContent = l.max;
  $('expFill').style.width = (l.now / l.max * 100) + '%';
}

function renderTankSummary() {
  const shown = shownPets();
  const adults = shown.filter(p => p.stage === 'adult').length;
  const babies = shown.length - adults;
  const averageMood = shown.length
    ? Math.round(shown.reduce((sum, p) => sum + avgStats(p), 0) / shown.length)
    : 0;
  const summary = [
    { label: 'Felicidade', value: averageMood + '%', tone: averageMood >= 70 ? 'good' : averageMood >= 45 ? 'warn' : 'alert' },
    { label: 'Adultos', value: adults + '/' + Math.max(1, shown.length), tone: adults > 0 ? 'good' : 'warn' },
    { label: 'Bebês', value: babies, tone: babies > 0 ? 'info' : 'good' }
  ];

  const summaryEl = $('tankSummary');
  if (!summaryEl) return;
  summaryEl.innerHTML = summary.map(item => `
    <div class="summary-card">
      <span class="summary-label">${item.label}</span>
      <span class="summary-value ${item.tone}">${item.value}</span>
    </div>
  `).join('');
}

function renderFishList() {
  const list = $('fishList');
  const shown = shownPets();
  $('fishCount').textContent = shown.length;
  $('fishMax').textContent = state.capacity;

  if (!shown.length) {
    list.innerHTML = '<div class="empty-row">Nenhum peixe no tanque.<br>Adicione um na aba PEIXES.</div>';
    return;
  }

  list.innerHTML = shown.map(p => {
    const sp = speciesOf(p.species);
    const mood = moodOf(p);
    return `<div class="fish-item" data-uid="${p.uid}">
        <img src="${sp.img}" alt="">
        <div class="fi-body">
          <div class="fi-name">${escapeHTML(p.name)}</div>
          <div class="fi-mood ${mood.cls}">${mood.emoji} ${mood.label}</div>
        </div>
      </div>`;
  }).join('');

  list.querySelectorAll('.fish-item').forEach(el => {
    el.onclick = () => openFish(Number(el.dataset.uid));
  });
}

function toggleFishInTank(pet) {
  if (!pet) return false;
  if (pet.shown) {
    pet.shown = false;
    toast('Peixe removido do tanque');
  } else {
    if (shownPets().length >= state.capacity) {
      toast('Capacidade cheia! Expanda o aquário');
      return false;
    }
    const species = speciesOf(pet.species);
    pet.shown = true;
    pet.x = species.bottom ? rand(16, 58) : rand(10, 72);
    pet.y = species.bottom ? rand(10, 14) : rand(16, 50);
    if (species.bottom) pet.depth = 2;
    toast('Peixe adicionado ao tanque');
  }
  renderAll();
  refreshView();
  save();
  return true;
}

function renderParams() {
  const w = state.water;
  const base = waterBase();
  const oxygen = waterOxygen();

  $('paramTemp').textContent = Math.round(w.temp) + '°C';
  $('paramPh').textContent = w.ph.toFixed(1);
  $('paramOxy').textContent = oxygen + '%';
  $('paramClean').textContent = Math.round(w.clean) + '%';

  $('paramTempLabel').title = 'Temperatura ideal: ' + base.temp + '°C';
  $('paramTempLabel').setAttribute('aria-label', 'Temperatura, ideal ' + base.temp + ' graus Celsius');
  $('paramPhLabel').title = 'pH ideal: ' + base.ph.toFixed(1);
  $('paramPhLabel').setAttribute('aria-label', 'pH, ideal ' + base.ph.toFixed(1));

  const tDev = Math.abs(w.temp - base.temp);
  const pDev = Math.abs(w.ph - base.ph);

  const tempFill = $('tempFill');
  tempFill.style.width = clamp((w.temp - 15) / 20 * 100, 8, 100) + '%';
  tempFill.className = 'param-fill ' + (tDev <= 1 ? 'green' : tDev <= 2.2 ? 'warn' : 'bad');

  const phFill = $('phFill');
  phFill.style.width = clamp(w.ph / 14 * 100, 8, 100) + '%';
  phFill.className = 'param-fill ' + (pDev <= 0.2 ? 'green' : pDev <= 0.4 ? 'warn' : 'bad');

  const oxyFill = $('oxyFill');
  oxyFill.style.width = oxygen + '%';
  oxyFill.className = 'param-fill ' + (oxygen < 50 ? 'bad' : oxygen < 70 ? 'warn' : 'green');

  const cleanFill = $('cleanFill');
  cleanFill.style.width = w.clean + '%';
  cleanFill.className = 'param-fill ' + (w.clean < 35 ? 'bad' : w.clean < 60 ? 'warn' : 'green');

  const badge = $('waterQuality');
  if (badge) {
    const q = Math.round(100 - waterStress() * 100);
    badge.textContent = q >= 80 ? 'IDEAL' : q >= 60 ? 'ATENÇÃO' : 'CRÍTICO';
    badge.className = 'panel-badge ' + (q >= 80 ? '' : q >= 60 ? 'warn' : 'bad');
  }
}

function renderTasks() {
  const tasks = [
    { key: 'feed',  text: 'Alimentar' },
    { key: 'pet',   text: 'Carinho' },
    { key: 'clean', text: 'Limpar' }
  ];
  $('taskList').innerHTML = tasks.map(t => `
    <div class="task ${state.tasks[t.key] ? 'done' : ''}">
      <span class="task-check">✓</span>
      <span class="task-text">${t.text}</span>
    </div>`).join('');
}

function renderTank() {
  const water = $('water');
  const tank = $('tank');
  const bg = BACKGROUNDS.find(b => b.key === state.background) || BACKGROUNDS[0];
  const bgCss = `url("${bg.img}") center bottom / cover no-repeat`;
  water.style.setProperty('--tank-bg', bgCss);
  water.style.background = bgCss;
  tank.classList.toggle('bg-photo', !!bg.img);

  const uv = uvLevel();
  const lc = lightColorOf(state.lightColor);
  tank.style.setProperty('--light-rgb', uv > 0 ? lc.rgb : '120 200 255');
  tank.classList.toggle('lit', uv > 0);

  if (state.water.clean < 40) water.classList.add('dirty');
  else water.classList.remove('dirty');

  renderMurk();

  const decorSig = DECOR_ENABLED ? JSON.stringify(state.decor) : '';
  if (decorSig !== renderTank._decorSig) {
    renderTank._decorSig = decorSig;
    renderDecorInTank();
  }

  // a profundidade não entra na assinatura: ela é aplicada direto no DOM,
  // então trocar de plano não pode recriar (e "teleportar") os peixes
  const fishSig = shownPets().slice(0, state.capacity)
    .map(p => p.uid + ':' + p.stage + ':' + p.name).join('|');
  if (fishSig !== renderTank._fishSig) {
    renderTank._fishSig = fishSig;
    renderFishInTank();
  }
}

function renderMurk() {
  const murk = $('murk');
  const dirtiness = (100 - state.water.clean) / 100;
  murk.style.opacity = (dirtiness * 0.9).toFixed(2);
  murk.querySelectorAll('.murk-dot').forEach(d => d.remove());
  const dots = Math.round(dirtiness * 45);
  for (let i = 0; i < dots; i++) {
    const d = document.createElement('span');
    d.className = 'murk-dot';
    d.style.left = rand(0, 98) + '%';
    d.style.top = rand(5, 92) + '%';
    d.style.opacity = rand(0.3, 0.9).toFixed(2);
    murk.appendChild(d);
  }
}

const DEPTH_CLASS = ['back', 'mid', 'front'];
const DEPTH_Z = [2, 4, 7];
const BENTHIC_Z = 10;

/* pixel art: largura sempre em múltiplos inteiros do sprite (em pixels de tela),
   senão o navegador estica e os pixels ficam com tamanhos diferentes */
function snapSpriteWidth(nat, targetCss) {
  if (!nat) return targetCss;
  const dpr = window.devicePixelRatio || 1;
  const k = Math.max(1, Math.round((targetCss * dpr) / nat));
  return (nat * k) / dpr;
}

function fishTargetWidth(el, tankW) {
  const front = el.classList.contains('front');
  const mid = el.classList.contains('mid');
  const pct = front ? 0.145 : mid ? 0.115 : 0.085;
  const lo = front ? 56 : mid ? 44 : 34;
  const hi = front ? 92 : mid ? 70 : 52;
  const s = parseFloat(el.style.getPropertyValue('--s')) || 1;
  const adult = el.classList.contains('adult') ? 1.14 : 1;
  return Math.max(lo, Math.min(tankW * pct, hi)) * s * adult;
}

function sizeFishEl(el, img, tankW) {
  if (!img || !img.naturalWidth) return;
  const w = snapSpriteWidth(img.naturalWidth, fishTargetWidth(el, tankW || 780));
  el.style.width = w.toFixed(2) + 'px';
}

function sizeFishSprites() {
  const tankW = $('tank').clientWidth || 780;
  document.querySelectorAll('.fish').forEach(el => sizeFishEl(el, el.querySelector('img'), tankW));
}

let _resizeTimer = 0;
window.addEventListener('resize', () => {
  clearTimeout(_resizeTimer);
  _resizeTimer = setTimeout(() => {
    sizeFishSprites();
    renderDecorInTank();
  }, 130);
});

function renderFishInTank() {
  closeFishInteractionMenu();
  $('fishLayer').innerHTML = '';

  shownPets().slice(0, state.capacity).forEach((p, i) => {
    const sp = speciesOf(p.species);
    const depth = ((p.depth % 3) + 3) % 3;
    const el = document.createElement('div');
    el.className = 'fish ' + DEPTH_CLASS[depth]
      + (p.stage === 'adult' ? ' adult' : '')
      + (sp.float ? ' float' : '');
    el.style.setProperty('--z', sp.bottom ? BENTHIC_Z : DEPTH_Z[depth]);
    el.dataset.uid = p.uid;
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-haspopup', 'true');
    el.setAttribute('aria-expanded', 'false');
    el.setAttribute('aria-label', `${p.name}, abrir interações`);
    el.style.setProperty('--s', sp.scale || 1);
    el.style.left = p.x + '%';
    el.style.bottom = p.y + '%';
    el.style.setProperty('--fx', p.facing === 'left' ? -1 : 1);
    el.style.animationDelay = (i * 0.6) + 's';

    const img = document.createElement('img');
    img.src = sp.img;
    img.alt = p.name;
    img.style.animationDuration = (2.8 + (p.uid % 4) * 0.4) + 's';
    img.style.animationDelay = (i * 0.35) + 's';
    el.appendChild(img);

    if (img.complete && img.naturalWidth) sizeFishEl(el, img, $('tank').clientWidth || 780);
    else img.addEventListener('load', () => sizeFishEl(el, img, $('tank').clientWidth || 780), { once: true });

    el.onclick = (ev) => {
      ev.stopPropagation();
      toggleFishInteractionMenu(p, el);
    };
    el.onkeydown = event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      event.stopPropagation();
      toggleFishInteractionMenu(p, el);
    };

    $('fishLayer').appendChild(el);
  });
}

function closeFishInteractionMenu() {
  document.querySelectorAll('.fish.interaction-open').forEach(fish => {
    fish.classList.remove('interaction-open');
    fish.setAttribute('aria-expanded', 'false');
  });
  document.querySelectorAll('.fish-interaction-menu').forEach(menu => menu.remove());
}

function toggleFishInteractionMenu(pet, fish) {
  if (fish.classList.contains('interaction-open')) {
    closeFishInteractionMenu();
    return;
  }
  closeFishInteractionMenu();
  fish.classList.add('interaction-open');
  fish.setAttribute('aria-expanded', 'true');

  const menu = document.createElement('div');
  menu.className = 'fish-interaction-menu';
  menu.setAttribute('role', 'group');
  menu.setAttribute('aria-label', `Interações com ${pet.name}`);
  const friend = bestFishFriend(pet);
  const actions = [
    { key: 'dice', label: '🎲 1d6' },
    { key: 'trick', label: bondLevel(pet) >= 2 ? '✨ Pose' : '🌀 Manobra' },
    { key: 'cuddle', label: '💗 Carinho' },
    { key: 'play', label: '🐟 Brincar', disabled: !friend,
      title: friend ? `Brincar com ${friend.name}` : 'Não há outro peixe compatível no tanque' }
  ];
  actions.forEach(action => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'fish-interaction-action';
    button.dataset.action = action.key;
    button.textContent = action.label;
    button.disabled = !!action.disabled;
    if (action.title) button.title = action.title;
    button.addEventListener('click', event => {
      event.stopPropagation();
      closeFishInteractionMenu();
      runFishInteraction(pet, action.key);
    });
    menu.appendChild(button);
  });
  const water = $('water');
  const rect = water.getBoundingClientRect();
  water.appendChild(menu);
  const menuWidth = menu.offsetWidth;
  const menuHeight = menu.offsetHeight;
  menu.style.left = clamp(pet.x / 100 * rect.width - menuWidth / 2, 4,
    Math.max(4, rect.width - menuWidth - 4)) + 'px';
  menu.style.bottom = clamp(pet.y / 100 * rect.height + 12, 8,
    Math.max(8, rect.height - menuHeight - 8)) + 'px';
  menu.querySelector('button').focus({ preventScroll: true });
}

function showDiceRollEmote(pet, result) {
  const fish = document.querySelector('.fish[data-uid="' + pet.uid + '"]');
  if (!fish) return;
  const previous = fish.querySelector('.fish-dice-emote');
  if (previous) previous.remove();
  const emote = document.createElement('span');
  emote.className = 'fish-dice-emote rolling';
  emote.style.backgroundImage = 'url("assets/emotes/fish-dice.png")';
  emote.setAttribute('role', 'img');
  emote.setAttribute('aria-label', 'O dado está rolando');
  fish.appendChild(emote);
  setTimeout(() => {
    if (!emote.isConnected) return;
    emote.classList.remove('rolling');
    emote.style.backgroundPositionX = -48 * (result - 1) + 'px';
    emote.setAttribute('aria-label', `Resultado do dado: ${result}`);
  }, 1050);
  setTimeout(() => emote.remove(), 2900);
}

function playFishTrick(pet) {
  const fish = document.querySelector('.fish[data-uid="' + pet.uid + '"]');
  if (!fish) return;
  fish.classList.remove('fish-trick', 'fish-special-pose');
  fish.classList.remove('fish-cuddled');
  void fish.offsetWidth;
  const poseClass = bondLevel(pet) >= 2 ? 'fish-special-pose' : 'fish-trick';
  fish.classList.add(poseClass);
  const duration = poseClass === 'fish-special-pose' ? 1250 : 800;
  animateFishSprite(fish, poseClass === 'fish-special-pose' ? 'fishSpecialPose' : 'fishTrick', duration);
  setTimeout(() => fish.classList.remove('fish-trick', 'fish-special-pose'), duration);
  showFishEmote(pet, bondLevel(pet) >= 3 ? 'grateful' : 'happy', true);
}

function animateFishSprite(fish, animationName, duration) {
  const image = fish.querySelector('img');
  if (!image) return;
  const token = (fish._spriteAnimationToken || 0) + 1;
  fish._spriteAnimationToken = token;
  const previousAnimation = image.style.animation;
  const previousDuration = image.style.animationDuration;
  image.style.animation = `${animationName} ${duration}ms ease-in-out`;
  setTimeout(() => {
    if (fish._spriteAnimationToken !== token) return;
    image.style.animation = previousAnimation;
    image.style.animationDuration = previousDuration;
  }, duration);
}

function updateFishAffinity(pet, amount) {
  pet.affinity = clamp((pet.affinity || 0) + amount, 0, 100);
}

function runFishInteraction(pet, action) {
  if (!pet || !pet.shown) return;
  if (action === 'dice') {
    const result = Math.floor(Math.random() * 6) + 1;
    updateFishAffinity(pet, result >= 5 ? 3 : result >= 3 ? 2 : 1);
    pet.happy = clamp(pet.happy + (result >= 5 ? 4 : 2), 0, 100);
    save();
    showDiceRollEmote(pet, result);
    setTimeout(() => {
      const reaction = result === 1 ? 'surprised' : result >= 5 ? 'grateful' : 'happy';
      showFishEmote(pet, reaction, true);
      toast(`${pet.name} tirou ${result} no dado!`);
      maybeAquariumMoment(pet);
    }, 1100);
    return;
  }
  if (action === 'trick') {
    updateFishAffinity(pet, 2);
    playFishTrick(pet);
    save();
    toast(bondLevel(pet) >= 2 ? `${pet.name} mostrou sua pose especial!` : `${pet.name} fez uma manobra!`);
    maybeAquariumMoment(pet);
    return;
  }
  if (action === 'cuddle') {
    pet.love = clamp(pet.love + 12, 0, 100);
    pet.happy = clamp(pet.happy + 7, 0, 100);
    updateFishAffinity(pet, 5);
    completeTask('pet');
    renderFishList();
    save();
    setTimeout(() => {
      const fish = document.querySelector('.fish[data-uid="' + pet.uid + '"]');
      if (fish) {
        fish.classList.remove('fish-cuddled');
        void fish.offsetWidth;
        fish.classList.add('fish-cuddled');
        setTimeout(() => fish.classList.remove('fish-cuddled'), 1100);
      }
      showFishEmote(pet, 'affection', true);
    }, 80);
    toast(`Carinho para ${pet.name}!`);
    maybeAquariumMoment(pet);
    return;
  }
  if (action === 'play') playWithFish(pet);
}

function playWithFish(pet) {
  const friend = bestFishFriend(pet);
  if (!friend) {
    toast('Não há outro peixe compatível no tanque');
    return;
  }
  const first = document.querySelector('.fish[data-uid="' + pet.uid + '"]');
  const second = document.querySelector('.fish[data-uid="' + friend.uid + '"]');
  if (!first || !second) return;

  const firstSpecies = speciesOf(pet.species);
  const secondSpecies = speciesOf(friend.species);
  const centerX = clamp((pet.x + friend.x) / 2, 8, 78);
  const centerY = firstSpecies.bottom ? 12 : clamp((pet.y + friend.y) / 2, 26, 62);
  [
    { fish: first, pet, species: firstSpecies, x: centerX - 4 },
    { fish: second, pet: friend, species: secondSpecies, x: centerX + 4 }
  ].forEach(({ fish, pet: swimmer, species, x }) => {
    swimmer.x = clamp(x, species.bottom ? 4 : 2, 88);
    swimmer.y = species.bottom ? clamp(centerY, 9, 14) : centerY;
    swimmer.facing = swimmer.x < centerX ? 'right' : 'left';
    swimmer._nextMove = Date.now() + 2600;
    fish.style.transitionDuration = '1.2s';
    fish.style.left = swimmer.x + '%';
    fish.style.bottom = swimmer.y + '%';
    fish.style.setProperty('--fx', swimmer.facing === 'left' ? -1 : 1);
    fish.classList.add('fish-playing');
    animateFishSprite(fish, 'fishPlay', 1100);
    setTimeout(() => fish.classList.remove('fish-playing'), 1400);
  });
  pet.friendships = pet.friendships || {};
  friend.friendships = friend.friendships || {};
  pet.friendships[friend.uid] = clamp(friendshipOf(pet, friend) + 8, 0, 100);
  friend.friendships[pet.uid] = clamp(friendshipOf(friend, pet) + 8, 0, 100);
  updateFishAffinity(pet, 3);
  updateFishAffinity(friend, 2);
  pet.happy = clamp(pet.happy + 4, 0, 100);
  friend.happy = clamp(friend.happy + 4, 0, 100);
  showFishEmote(pet, 'happy', true);
  showFishEmote(friend, 'grateful', true);
  renderFishList();
  save();
  toast(`${pet.name} e ${friend.name} brincaram juntos!`);
  maybeAquariumMoment(pet);
}

function spawnFishVisitor() {
  const pool = SPECIES[state.tankType === 'fresh' ? 'fresh' : 'salt'];
  const visitor = pool[Math.floor(Math.random() * pool.length)];
  const fish = document.createElement('div');
  fish.className = 'fish mid fish-visitor';
  fish.style.left = '-12%';
  fish.style.bottom = '58%';
  const image = document.createElement('img');
  image.src = visitor.img;
  image.alt = `Visitante: ${visitor.name}`;
  fish.appendChild(image);
  $('fishLayer').appendChild(fish);
  requestAnimationFrame(() => fish.classList.add('arriving'));
  setTimeout(() => fish.remove(), 6500);
  toast(`Uma visita de ${visitor.name} passou pelo aquário!`);
}

function placeFoundShell(pet) {
  const shell = document.createElement('button');
  shell.type = 'button';
  shell.className = 'fish-found-shell';
  shell.textContent = '🐚';
  shell.setAttribute('aria-label', `Pegar a concha que ${pet.name} encontrou`);
  shell.style.left = clamp(pet.x + rand(-7, 7), 5, 88) + '%';
  shell.style.bottom = clamp(pet.y + rand(8, 18), 18, 78) + '%';
  shell.onclick = event => {
    event.stopPropagation();
    state.coins += 3;
    state.stats.earned += 3;
    renderHeader();
    shell.remove();
    save();
    toast('Concha encontrada! +3 moedas');
  };
  $('coinLayer').appendChild(shell);
  setTimeout(() => shell.remove(), 20000);
  toast(`${pet.name} encontrou uma concha! Toque nela para pegar.`);
}

function maybeAquariumMoment(pet) {
  const now = Date.now();
  if (now - lastAquariumMoment < 90000 || Math.random() > 0.12) return;
  lastAquariumMoment = now;
  const moment = Math.floor(Math.random() * 3);
  if (moment === 0) {
    showFishEmote(pet, 'happy', true);
    toast(`${pet.name} está chamando você para brincar!`);
  } else if (moment === 1) {
    placeFoundShell(pet);
  } else {
    spawnFishVisitor();
  }
}

function startAquariumMoments() {
  setInterval(() => {
    if (document.hidden || !shownPets().length) return;
    if (Date.now() - lastAquariumMoment < 90000 || Math.random() > 0.012) return;
    lastAquariumMoment = Date.now();
    const pet = shownPets()[Math.floor(Math.random() * shownPets().length)];
    const moment = Math.floor(Math.random() * 3);
    if (moment === 0) {
      showFishEmote(pet, 'happy', true);
      toast(`${pet.name} está chamando você para brincar!`);
    } else if (moment === 1) {
      placeFoundShell(pet);
    } else {
      spawnFishVisitor();
    }
  }, 30000);
}

function cursorTargetForFish(pet, profile, cursor) {
  if (!cursor || Date.now() - cursor.time > 2200) return null;
  const distance = Math.hypot((cursor.x - pet.x), (cursor.y - pet.y) * 0.8);
  if (distance > 35) return null;

  if (profile.shy && pet.affinity < 58) {
    const direction = pet.x >= cursor.x ? 1 : -1;
    return {
      x: clamp(pet.x + direction * rand(10, 17), profile.bottom ? 3 : 2, 78),
      y: profile.bottom ? clamp(pet.y, 9, 14) : clamp(pet.y + rand(-7, 7), 24, 66),
      fleeing: true
    };
  }

  const trustThreshold = profile.playful ? 34 : profile.schooling ? 48 : 58;
  if (pet.affinity < trustThreshold) return null;
  const side = pet.x >= cursor.x ? 1 : -1;
  return {
    x: clamp(cursor.x + side * rand(5, profile.playful ? 10 : 15), profile.bottom ? 3 : 2, 78),
    y: profile.bottom
      ? clamp(pet.y, 9, 14)
      : clamp(cursor.y + rand(-5, 5), 24, 66),
    following: true
  };
}

/* fish swim around freely, keeping their depth layer */
function startSwimLoop() {
  setInterval(() => {
    if (document.hidden) return;
    const now = Date.now();
    shownPets().slice(0, state.capacity).forEach((p) => {
      if (now < (p._nextMove || 0)) return;

      const el = document.querySelector('.fish[data-uid="' + p.uid + '"]');
      if (!el) return;

      const sp = speciesOf(p.species);
      const others = shownPets().slice(0, state.capacity).filter(o => o.uid !== p.uid);
      const profile = { ...personalityOf(p.species), bottom: !!sp.bottom };
      const coinTarget = document.querySelector(
        `.coin-float[data-target-uid="${p.uid}"]`
      );
      let nx = 0, ny = 0;
      const cursorTarget = cursorTargetForFish(p, profile, playerCursor);
      if (coinTarget) {
        nx = parseFloat(coinTarget.style.left) || p.x;
        ny = sp.bottom
          ? clamp(p.y, 9, 14)
          : clamp(parseFloat(coinTarget.style.bottom) || p.y, 22, 72);
        const distance = Math.hypot(nx - p.x, (ny - p.y) * 0.8);
        if (distance < 7) {
          collectFloatingCoin(coinTarget, p);
          return;
        }
        p._nextMove = now + 1900;
        el.classList.remove('fish-resting', 'fish-hiding');
      } else if (cursorTarget) {
        p._nextMove = now + rand(3500, 8000);
        nx = cursorTarget.x;
        ny = cursorTarget.y;
        if (cursorTarget.following && profile.playful
          && Date.now() - (fishPlayTimes.get(p) || 0) > 18000) {
          p.affinity = clamp((p.affinity || 0) + 1, 0, 100);
          p.happy = clamp(p.happy + 1, 0, 100);
          fishPlayTimes.set(p, Date.now());
        }
      } else {
        p._nextMove = now + rand(3500, 8000);
        const schoolmates = others.filter(other => areFishCompatible(p, other));
        const leader = schoolmates.length
          ? [p, ...schoolmates].reduce((first, second) => {
            const firstBond = friendshipOf(p, first);
            const secondBond = friendshipOf(p, second);
            return secondBond > firstBond
              || (secondBond === firstBond && second.uid < first.uid) ? second : first;
          })
          : p;
        const followsSchool = leader.uid !== p.uid && Math.random() < 0.8;
        nx = sp.bottom ? rand(4, 78) : rand(2, 78);
        ny = sp.bottom ? rand(9, 14) : rand(27, 62);
        if (followsSchool) {
          nx = clamp(leader.x + rand(-12, 12), sp.bottom ? 3 : 2, 94);
          ny = sp.bottom ? clamp(leader.y, 9, 14) : clamp(leader.y + rand(-9, 9), 24, 66);
        }
        if (!followsSchool) {
          for (let t = 0; t < 12; t++) {
            const crowding = others.some(o => Math.abs((o.x || 0) - nx) < 11
              && Math.abs((o.y || 0) - ny) < 17
              && !(profile.schooling && personalityOf(o.species).schooling));
            if (!crowding) break;
            nx = sp.bottom ? rand(4, 78) : rand(2, 78);
            ny = sp.bottom ? rand(9, 14) : rand(27, 62);
          }
        }
      }
      const shelters = !coinTarget && !cursorTarget && !sp.bottom && DECOR_ENABLED
        ? state.decor.filter(decoration => decoration.front)
        : [];
      if (shelters.length && Math.random() < 0.025) {
        const shelter = shelters[Math.floor(Math.random() * shelters.length)];
        nx = clamp(shelter.x + rand(-6, 6), 2, 84);
        ny = clamp((shelter.bottom || 10) + 7, 18, 42);
        p.depth = 0;
        p._nextMove = now + rand(5000, 9000);
        el.className = 'fish back'
          + (p.stage === 'adult' ? ' adult' : '')
          + (sp.float ? ' float' : '');
        el.style.setProperty('--z', DEPTH_Z[0]);
        sizeFishEl(el, el.querySelector('img'), $('tank').clientWidth || 780);
        el.classList.add('fish-hiding');
        setTimeout(() => el.classList.remove('fish-hiding'), p._nextMove - now);
      }
      if (!coinTarget && !cursorTarget && Math.random() < 0.025) {
        p._nextMove = now + rand(9000, 15000);
        el.classList.add('fish-resting');
        animateFishSprite(el, 'fishRest', 1100);
        setTimeout(() => el.classList.remove('fish-resting'), p._nextMove - now);
        return;
      }
      el.classList.remove('fish-resting');
      p.facing = nx > p.x ? 'right' : 'left';
      p.x = nx;
      p.y = ny;

      el.style.transitionDuration = (sp.bottom ? rand(6, 9) : rand(3.6, 5.6)).toFixed(2) + 's';
      el.style.left = nx + '%';
      el.style.bottom = ny + '%';
      el.style.setProperty('--fx', p.facing === 'left' ? -1 : 1);

      // de vez em quando o peixe desce um plano (fundo) ou sobe um (frente)
      if (!sp.bottom && Math.random() < 0.35) {
        const cur = ((p.depth % 3) + 3) % 3;
        const nd = Math.random() < 0.5 ? cur - 1 : cur + 1;
        if (nd >= 0 && nd <= 2) {
          p.depth = nd;
          el.className = 'fish ' + DEPTH_CLASS[nd]
            + (p.stage === 'adult' ? ' adult' : '')
            + (sp.float ? ' float' : '');
          el.style.setProperty('--z', DEPTH_Z[nd]);
          sizeFishEl(el, el.querySelector('img'), $('tank').clientWidth || 780);
        }
      }
    });
  }, 1000);
}

function showFishEmote(pet, emotion, force = false) {
  if (!pet || !pet.shown || !FISH_EMOTES[emotion]) return;
  const fish = document.querySelector('.fish[data-uid="' + pet.uid + '"]');
  if (!fish) return;

  const now = Date.now();
  if (!force && now - (fishEmoteTimes.get(pet) || 0) < FISH_EMOTE_COOLDOWN) return;
  fishEmoteTimes.set(pet, now);

  if (fish._emoteTimeout) clearTimeout(fish._emoteTimeout);
  const previousEmote = fish.querySelector('.fish-emote');
  if (previousEmote) previousEmote.remove();

  const emote = document.createElement('span');
  emote.className = 'fish-emote';
  emote.style.backgroundImage = 'url("' + FISH_EMOTES[emotion].sprite + '")';
  emote.setAttribute('role', 'img');
  emote.setAttribute('aria-label', FISH_EMOTES[emotion].label);
  fish.appendChild(emote);
  fish._emoteTimeout = setTimeout(() => {
    emote.remove();
    fish._emoteTimeout = null;
  }, 2400);
}

function fishNeedsEmote(pet) {
  const needs = [
    { emotion: 'hungry', score: (52 - pet.hunger) / 52 },
    { emotion: 'clean', score: Math.max(
      (48 - pet.clean) / 48,
      (30 - state.water.clean) / 30
    ) },
    { emotion: 'affection', score: (45 - pet.love) / 45 },
    { emotion: 'sad', score: Math.max(
      (45 - pet.happy) / 45,
      (35 - avgStats(pet)) / 35
    ) }
  ];
  const need = needs.reduce((mostUrgent, candidate) =>
    candidate.score > mostUrgent.score ? candidate : mostUrgent);
  return need.score > 0 ? need.emotion : null;
}

function fishNeedScore(pet) {
  const emotion = fishNeedsEmote(pet);
  if (!emotion) return 0;
  const needs = {
    hungry: (52 - pet.hunger) / 52,
    clean: Math.max((48 - pet.clean) / 48, (30 - state.water.clean) / 30),
    affection: (45 - pet.love) / 45,
    sad: Math.max((45 - pet.happy) / 45, (35 - avgStats(pet)) / 35)
  };
  return needs[emotion];
}

function reactToFishAction(pets, stat, emotion) {
  const available = pets.filter(pet => pet.shown);
  if (!available.length) return;
  const pet = available.reduce((neediest, candidate) =>
    candidate[stat] < neediest[stat] ? candidate : neediest);
  showFishEmote(pet, fishNeedsEmote(pet) || emotion, true);
}

function startEmoteLoop() {
  setInterval(() => {
    if (document.hidden) return;
    const pets = shownPets().slice(0, state.capacity);
    if (!pets.length) return;

    const now = Date.now();
    const needingAttention = pets
      .filter(pet => fishNeedsEmote(pet)
        && now - (fishEmoteTimes.get(pet) || 0) >= FISH_EMOTE_COOLDOWN)
      .sort((first, second) => fishNeedScore(second) - fishNeedScore(first));
    if (needingAttention.length) {
      const mostUrgent = needingAttention[0];
      showFishEmote(mostUrgent, fishNeedsEmote(mostUrgent));
      return;
    }

    const healthyFish = pets.filter(pet => !fishNeedsEmote(pet)
      && now - (fishEmoteTimes.get(pet) || 0) >= FISH_EMOTE_COOLDOWN);
    if (healthyFish.length && Math.random() < 0.08) {
      showFishEmote(healthyFish[Math.floor(Math.random() * healthyFish.length)], 'happy');
    }
  }, 3000);
}

function renderDecorInTank() {
  $('decorBack').innerHTML = '';
  $('decorFront').innerHTML = '';

  // sistema de decoração desativado: nada é desenhado no tanque
  if (!DECOR_ENABLED) return;

  state.decor.forEach((d, i) => {
    const el = document.createElement('div');
    el.className = d.front ? 'decor-plant' : 'decor-item';
    el.style.left = d.x + '%';
    el.style.bottom = (d.bottom != null ? d.bottom : 6) + '%';
    if (d.kind === 'plant') el.style.animationDelay = (i * 0.7) + 's';

    const img = document.createElement('img');
    img.src = d.sprite || 'assets/outros/Alga 1 A.png';
    img.alt = '';
    const maxW = d.w || 64;
    el.style.width = 'clamp(' + Math.round(maxW * 0.55) + 'px, ' + (maxW / 7.96).toFixed(1) + '%, ' + maxW + 'px)';
    img.style.width = '100%';
    img.style.height = 'auto';
    el.appendChild(img);

    (d.front ? $('decorFront') : $('decorBack')).appendChild(el);
  });
}

/* ---------------- water simulation ---------------- */
function advancePetGrowth(pet) {
  const avg = avgStats(pet);
  if (pet.stage !== 'adult' && avg >= 72 && pet.hunger >= 50 && pet.love >= 50 && pet.clean >= 55) {
    pet.stage = 'adult';
    pet.happy = clamp(pet.happy + 15, 0, 100);
    pet.love = clamp(pet.love + 12, 0, 100);
    state.coins += 12;
    state.stats.earned += 12;
    addExp(20);
    toast('Seu peixe evoluiu para adulto! 🐟');
  }
}

function waterTick() {
  const base = waterBase();
  const n = shownPets().length;
  const uv = uvLevel();
  const lightOn = uv > 0;

  // filtro + luz ciano seguram a sujeira
  const cyanCut = lightOn && state.lightColor === 'cyan' ? uv * 0.05 : 0;
  const decay = (0.5 + n * 0.12) * filterMultiplier() * (1 - cyanCut);
  state.water.clean = clamp(state.water.clean - decay, 0, 100);

  // aquecedor: sem ele a água esfria devagar até 4 °C abaixo do ideal
  const heater = equipLvl('heater');
  const tTarget = base.temp - 4 * (1 - heater / 3);
  const tJitter = [0.22, 0.12, 0.07, 0.03][heater];
  state.water.temp = clamp(
    state.water.temp + (tTarget - state.water.temp) * 0.04 + rand(-tJitter, tJitter), 12, 36);

  // condicionador de pH: sem ele o pH cai devagar até 0.45 fora do ideal
  const buffer = equipLvl('buffer');
  const pTarget = base.ph - 0.45 * (1 - buffer / 3);
  const pJitter = [0.03, 0.016, 0.009, 0.004][buffer];
  state.water.ph = clamp(
    state.water.ph + (pTarget - state.water.ph) * 0.03 + rand(-pJitter, pJitter), 5, 10);

  // água fora do ideal acelera a queda de felicidade; a luz UV segura um pouco
  const stress = waterStress();
  const lightCut = uv * 0.05 + (lightOn && state.lightColor === 'green' ? uv * 0.06 : 0);
  const happyMult = Math.max(0.35, 1 - lightCut) * (1 + stress * 1.2);
  const loveMult = Math.max(0.4, 1 - (lightOn && state.lightColor === 'pink' ? uv * 0.08 : 0));

  state.pets.forEach(p => {
    if (!p.shown) return;
    const personality = personalityOf(p.species);
    p.hunger = clamp(p.hunger - 0.55 * personality.appetite, 0, 100);
    p.love = clamp(p.love - 0.3 * loveMult, 0, 100);
    p.clean = clamp(p.clean - (personality.tidy ? 0.31 : 0.25), 0, 100);
    p.happy = clamp(p.happy - 0.35 * happyMult * (personality.playful ? 0.9 : 1), 0, 100);
    advancePetGrowth(p);
  });

  renderFishList();
  renderParams();
  renderTank();
  save();
}

function startWaterLoop() {
  setInterval(waterTick, 6000);
}

function startBubbleLoop() {
  setInterval(() => {
    const layer = $('bubbles');
    if (!layer || document.hidden) return;
    const oxy = equipLvl('oxygen');
    const count = 1 + (Math.random() < oxy / 3 ? 1 : 0) + (oxy >= 3 && Math.random() < 0.5 ? 1 : 0);
    for (let i = 0; i < count; i++) {
      const b = document.createElement('span');
      b.className = 'bubble';
      const size = rand(2, 5);
      b.style.width = size + 'px';
      b.style.height = size + 'px';
      b.style.left = rand(6, 94) + '%';
      b.style.bottom = '10%';
      b.style.animationDuration = rand(4, 8) + 's';
      layer.appendChild(b);
      setTimeout(() => b.remove(), 8500);
    }
  }, 900);
}

function startCoinLoop() {
  setInterval(() => {
    if (document.hidden || !state.tankType) return;
    // luz âmbar atrai mais moedas (e cada uma vale mais)
    const amber = lightBonus('amber') ? uvLevel() : 0;
    if (Math.random() > 0.35 * (1 + amber * 0.2)) return;
    spawnFloatingCoin(5 + amber);
  }, 12000);
}

function spawnFloatingCoin(value = 5) {
  const coin = document.createElement('button');
  coin.type = 'button';
  coin.className = 'coin-float';
  coin.style.left = rand(8, 82) + '%';
  coin.style.bottom = rand(20, 55) + '%';
  coin.dataset.value = value;
  coin.setAttribute('aria-label', `Moeda de ${value} moedas`);
  const eligibleFish = shownPets().slice(0, state.capacity).filter(pet =>
    !document.querySelector(`.coin-float[data-target-uid="${pet.uid}"]`));
  if (eligibleFish.length) {
    const collector = eligibleFish[Math.floor(Math.random() * eligibleFish.length)];
    coin.dataset.targetUid = collector.uid;
    coin.classList.add('coin-targeted');
    collector._nextMove = 0;
  }
  coin.addEventListener('click', event => {
    event.stopPropagation();
    collectFloatingCoin(coin);
  });
  $('coinLayer').appendChild(coin);
  setTimeout(() => {
    if (!coin.isConnected) return;
    if (coin.dataset.targetUid) {
      delete coin.dataset.targetUid;
      coin.classList.remove('coin-targeted');
      coin.style.left = rand(8, 82) + '%';
      coin.style.bottom = rand(20, 55) + '%';
      const nextCollector = shownPets().slice(0, state.capacity)
        .find(pet => !document.querySelector(`.coin-float[data-target-uid="${pet.uid}"]`));
      if (nextCollector) {
        coin.dataset.targetUid = nextCollector.uid;
        coin.classList.add('coin-targeted');
        nextCollector._nextMove = 0;
      }
      setTimeout(() => coin.remove(), 9000);
    } else {
      coin.remove();
    }
  }, 18000);
  return coin;
}

function collectFloatingCoin(coin, pet = null) {
  if (!coin || !coin.isConnected) return false;
  const value = Number(coin.dataset.value) || 5;
  coin.remove();
  state.coins += value;
  state.stats.earned += value;
  if (pet) {
    updateFishAffinity(pet, 1);
    pet.happy = clamp(pet.happy + 1, 0, 100);
    showFishEmote(pet, 'grateful', true);
  }
  renderHeader();
  save();
  toast(pet ? `${pet.name} pegou uma moeda! +${value}` : `+${value} moedas`);
  return true;
}

/* ---------------- actions ---------------- */
function feedAll() {
  const pets = shownPets();
  if (!pets.length) { toast('Nenhum peixe no tanque'); return; }
  if (state.food <= 0) {
    toast('Sem comida! Compre na loja');
    openView('shop');
    return;
  }
  state.food--;
  pets.forEach(p => {
    p.hunger = clamp(p.hunger + 20, 0, 100);
    p.happy = clamp(p.happy + 4, 0, 100);
    p.affinity = clamp((p.affinity || 0) + (personalityOf(p.species).appetite > 1 ? 4 : 2), 0, 100);
  });
  dropFood();
  completeTask('feed');
  addExp(6);
  reactToFishAction(pets, 'hunger', 'grateful');
  renderAll();
  save();
  toast('Peixes alimentados!');
}

function dropFood() {
  const layer = $('foodLayer');
  for (let i = 0; i < 8; i++) {
    const f = document.createElement('span');
    f.className = 'food-bit';
    f.style.left = rand(20, 78) + '%';
    f.style.top = '12%';
    f.style.animationDelay = (i * 0.1) + 's';
    layer.appendChild(f);
    setTimeout(() => f.remove(), 2800);
  }
}

function petAll() {
  const pets = shownPets();
  if (!pets.length) { toast('Nenhum peixe no tanque'); return; }
  pets.forEach(p => {
    p.love = clamp(p.love + 14, 0, 100);
    p.happy = clamp(p.happy + 8, 0, 100);
    p.affinity = clamp((p.affinity || 0) + 8 + (personalityOf(p.species).playful ? 3 : 0), 0, 100);
  });
  completeTask('pet');
  addExp(5);
  reactToFishAction(pets, 'love', 'affection');
  renderAll();
  save();
  toast('♥ Carinho nos peixinhos!');
}

function cleanTank() {
  if (state.water.clean >= 100) {
    toast('O aquário já está limpo!');
    return;
  }

  state.water.clean = clamp(state.water.clean + 35, 0, 100);
  const isClean = state.water.clean >= 100;
  if (isClean) {
    state.pets.forEach(p => {
      const personality = personalityOf(p.species);
      p.clean = clamp(p.clean + (personality.tidy ? 26 : 20), 0, 100);
      p.happy = clamp(p.happy + (personality.tidy ? 9 : 3), 0, 100);
      p.affinity = clamp((p.affinity || 0) + (personality.tidy ? 5 : 1), 0, 100);
    });
    state.stats.cleans++;
    sparkleBurst();
    completeTask('clean');
    addExp(12);
    reactToFishAction(shownPets(), 'clean', 'grateful');
  }
  renderAll();
  save();
  toast(isClean
    ? 'Aquário limpo!'
    : `A água está ${Math.round(state.water.clean)}% limpa. Continue limpando!`);
}

function sparkleBurst() {
  const tank = $('tank');
  for (let i = 0; i < 14; i++) {
    const s = document.createElement('span');
    s.className = 'sparkle';
    s.textContent = '✨';
    s.style.left = rand(5, 90) + '%';
    s.style.top = rand(10, 85) + '%';
    s.style.animationDelay = rand(0, 0.5) + 's';
    tank.appendChild(s);
    setTimeout(() => s.remove(), 1600);
  }
}

function completeTask(key) {
  if (state.tasks[key]) return;
  state.tasks[key] = true;
  state.coins += 10;
  state.stats.earned += 10;
  addExp(10);

  const allDone = ['feed', 'pet', 'clean'].every(k => state.tasks[k]);
  if (allDone) {
    state.coins += 15;
    state.stats.earned += 15;
    addExp(15);
  }

  save();
  setTimeout(renderAll, 50);

  if (allDone) {
    toast('Tarefas do dia completas! Bônus +15');
  }
}

function addExp(n) {
  // luz violeta acelera o crescimento
  const boost = lightBonus('violet') ? uvLevel() * 0.08 : 0;
  state.exp += Math.max(1, Math.round(n * (1 + boost)));
}

/* ---------------- fish modal ---------------- */
function openFish(uid) {
  closeFishInteractionMenu();
  const p = state.pets.find(x => x.uid === uid);
  if (!p) return;
  currentFish = p;
  const sp = speciesOf(p.species);

  $('fmName').textContent = p.name;
  $('fmNameInput').value = p.name;
  $('fmSpecies').textContent = sp.name;
  $('fmImg').src = sp.img;
  $('fmStage').textContent = p.stage === 'baby' ? 'BEBÊ' : 'ADULTO';
  $('fmRarity').textContent = RARITY_LABEL[p.rarity] || 'COMUM';

  $('fmHunger').style.width = p.hunger + '%';
  $('fmLove').style.width = p.love + '%';
  $('fmClean').style.width = p.clean + '%';
  $('fmHappy').style.width = p.happy + '%';
  $('fmHungerTxt').textContent = Math.round(p.hunger) + '%';
  $('fmLoveTxt').textContent = Math.round(p.love) + '%';
  $('fmCleanTxt').textContent = Math.round(p.clean) + '%';
  $('fmHappyTxt').textContent = Math.round(p.happy) + '%';
  $('fmBond').style.width = (p.affinity || 0) + '%';
  $('fmBondTxt').textContent = `${bondLabel(p)} · ${Math.round(p.affinity || 0)}%`;
  const friend = bestFishFriend(p);
  $('fmFriend').textContent = friend
    ? `${friend.name} · ${Math.round(friendshipOf(p, friend))}%`
    : 'Ainda sem amizade';

  $('fmToggle').textContent = p.shown ? 'OCULTAR DO TANQUE' : 'MOSTRAR NO TANQUE';

  // peixe fora do aquário: sem interações até voltar para o tanque
  const inTank = !!p.shown;
  $('fmOffline').hidden = inTank;
  $('fmFeed').disabled = !inTank;
  $('fmPet').disabled = !inTank;
  $('fishModal').querySelector('.fm-stats').classList.toggle('off', !inTank);

  openModal('fishModal');
}

function bindFishModal() {
  $('fmClose').onclick = () => closeModal('fishModal');

  $('fmNameSave').onclick = () => {
    if (!currentFish) return;
    const name = $('fmNameInput').value.trim().slice(0, 24);
    if (!name) {
      toast('Digite um nome para o peixe');
      return;
    }
    currentFish.name = name;
    renderAll();
    openFish(currentFish.uid);
    save();
    toast('Nome do peixe atualizado!');
  };
  $('fmNameInput').addEventListener('keydown', event => {
    if (event.key === 'Enter') $('fmNameSave').click();
  });

  $('fmFeed').onclick = () => {
    if (!currentFish) return;
    if (!currentFish.shown) { toast('Coloque o peixe no tanque para alimentar'); return; }
    if (state.food <= 0) {
      closeModal('fishModal');
      openView('shop');
      toast('Sem comida! Compre na loja');
      return;
    }
    state.food--;
    currentFish.hunger = clamp(currentFish.hunger + 25, 0, 100);
    currentFish.happy = clamp(currentFish.happy + 5, 0, 100);
    currentFish.affinity = clamp((currentFish.affinity || 0)
      + (personalityOf(currentFish.species).appetite > 1 ? 5 : 3), 0, 100);
    completeTask('feed');
    showFishEmote(currentFish, fishNeedsEmote(currentFish) || 'grateful', true);
    renderAll();
    openFish(currentFish.uid);
    save();
    toast('Alimentado!');
  };

  $('fmPet').onclick = () => {
    if (!currentFish) return;
    if (!currentFish.shown) { toast('Coloque o peixe no tanque para dar carinho'); return; }
    currentFish.love = clamp(currentFish.love + 18, 0, 100);
    currentFish.happy = clamp(currentFish.happy + 10, 0, 100);
    currentFish.affinity = clamp((currentFish.affinity || 0)
      + 10 + (personalityOf(currentFish.species).playful ? 3 : 0), 0, 100);
    showFishEmote(currentFish, fishNeedsEmote(currentFish) || 'affection', true);
    renderAll();
    openFish(currentFish.uid);
    save();
    toast('♥ Carinho!');
  };

  $('fmToggle').onclick = () => {
    if (!currentFish) return;
    if (toggleFishInTank(currentFish)) openFish(currentFish.uid);
  };
}

/* ---------------- overlays ---------------- */
function openView(key) {
  closeFishInteractionMenu();
  const cfg = {
    fish:     { title: 'PEIXES', render: viewFish },
    shop:     { title: 'LOJA', render: viewShop },
    achiev:   { title: 'CONQUISTAS', render: viewAchiev },
    settings: { title: 'CONFIGURAÇÕES', render: viewSettings }
  }[key];
  if (!cfg) return;

  $('overlayTitle').textContent = cfg.title;
  cfg.render($('overlayBody'));
  $('overlay').classList.add('open');
  currentView = key;
}

function closeOverlay() {
  $('overlay').classList.remove('open');
  currentView = null;
}

function refreshView() {
  if (!currentView || !$('overlay').classList.contains('open')) return;
  // mantém a posição de rolagem ao recarregar a mesma tela (a loja é longa)
  const body = $('overlayBody');
  const top = body.scrollTop;
  openView(currentView);
  body.scrollTop = top;
}

function viewFish(body) {
  const all = state.pets;
  const inTank = all.filter(p => p.shown);
  const outside = all.filter(p => !p.shown);

  const card = (p) => {
    const sp = speciesOf(p.species);
    const mood = moodOf(p);
    const full = !p.shown && inTank.length >= state.capacity;
    return `<div class="card ${p.shown ? '' : 'out'}" data-uid="${p.uid}">
        <img src="${sp.img}" alt="">
        <div class="c-name">${escapeHTML(p.name)}</div>
        <div class="c-sub">${mood.emoji} ${mood.label} • ${p.stage === 'baby' ? 'Bebê' : 'Adulto'}</div>
        <div class="c-sub">${p.shown ? 'No tanque' : 'Fora do aquário'} • ${RARITY_LABEL[p.rarity]}</div>
        <button class="btn fish-card-toggle ${p.shown ? '' : 'primary'}" data-fish-toggle="${p.uid}" ${full ? 'disabled' : ''}>
          ${full ? 'AQUÁRIO CHEIO' : p.shown ? 'RETIRAR DO AQUÁRIO' : 'COLOCAR NO AQUÁRIO'}
        </button>
      </div>`;
  };

  let html = '';
  if (!all.length) {
    html = '<div class="empty-row">Nenhum peixe ainda. Compre um ovo na loja.</div>';
  } else {
    html += `<div class="section-title">NO TANQUE — ${inTank.length}/${state.capacity}</div>`;
    html += '<div class="overlay-grid">';
    html += inTank.length ? inTank.map(card).join('') : '<div class="empty-row">Nenhum peixe no tanque.</div>';
    html += '</div>';
    if (outside.length) {
      html += `<div class="section-title">FORA DO AQUÁRIO — ${outside.length}</div>`;
      html += '<div class="overlay-grid">' + outside.map(card).join('') + '</div>';
      html += '<p class="modal-text" style="margin-top:12px">Peixes fora do aquário ficam com as interações bloqueadas. Coloque de volta no tanque para alimentar e dar carinho.</p>';
    }
  }

  body.innerHTML = html;
  body.querySelectorAll('.card').forEach(c => {
    c.onclick = () => openFish(Number(c.dataset.uid));
  });
  body.querySelectorAll('[data-fish-toggle]').forEach(btn => {
    btn.onclick = (event) => {
      event.stopPropagation();
      const pet = state.pets.find(p => p.uid === Number(btn.dataset.fishToggle));
      toggleFishInTank(pet);
    };
  });
}

function spawnDecor(cat) {
  const sprite = cat.sprites[Math.floor(Math.random() * cat.sprites.length)];
  const w = cat.widths[Math.floor(Math.random() * cat.widths.length)];
  return {
    key: cat.key,
    kind: cat.kind,
    sprite,
    x: rand(2, 72),
    bottom: rand(12, 14),
    w,
    front: !!cat.front
  };
}

function buyDecor(key) {
  if (!DECOR_ENABLED) return;
  const item = DECOR_CATALOG.find(d => d.key === key);
  if (!item) return;
  if (state.coins < item.price) { toast('Moedas insuficientes'); return; }
  state.coins -= item.price;
  state.ownedDecor[key] = (state.ownedDecor[key] || 0) + 1;
  state.decor.push(spawnDecor(item));
  addExp(8);
  renderAll();
  save();
  toast(item.name + ' comprada!');
}

function eggCandidatesForRarity(rarity) {
  const species = SPECIES[state.tankType] || SPECIES.salt;
  let pool = species.filter(s => s.rarity === rarity);
  if (!pool.length) pool = species.filter(s => s.rarity === 'rare');
  if (!pool.length) pool = species;
  return pool;
}

function showEggInfo(rarity, name) {
  const candidates = eggCandidatesForRarity(rarity);
  const chance = candidates.length ? (100 / candidates.length).toFixed(1) : '0';
  const label = RARITY_LABEL[rarity] || 'ESPECIAL';

  $('eggInfoTitle').textContent = name;
  $('eggInfoBody').innerHTML = `
    <p class="modal-text">Peixes possíveis neste ovo ${label.toLowerCase()} de ${state.tankType === 'salt' ? 'água salgada' : 'água doce'}:</p>
    <div class="egg-odds-list">
      ${candidates.map(s => `
        <div class="egg-odds-item">
          <span class="egg-odds-sprite"><img src="${s.img}" alt="${s.name}"></span>
          <span class="egg-odds-name">${s.name}</span>
          <span class="egg-odds-chance">${chance}%</span>
        </div>
      `).join('')}
    </div>
    <p class="egg-odds-note">Cada peixe desta lista tem a mesma chance de nascer.</p>`;
  openModal('eggInfoModal');
}

function viewShop(body) {
  const eggs = [
    { rarity: 'common', name: 'Ovo Comum', price: 50 },
    { rarity: 'rare', name: 'Ovo Raro', price: 100 },
    { rarity: 'legendary', name: 'Ovo Lendário', price: 200 }
  ];
  const maxCap = state.capacity >= MAX_CAPACITY;
  const uv = uvLevel();
  const activeColor = lightColorOf(state.lightColor);

  body.innerHTML = `
    <div class="section-title">OVOS — ${state.tankType === 'salt' ? 'ÁGUA SALGADA' : 'ÁGUA DOCE'}</div>
    ${eggs.map(e => `
      <div class="row-item">
        <span class="deco-thumb"><img src="assets/outros/egg.png" alt=""></span>
        <div class="ri-body">
          <div class="ri-name">${e.name}</div>
          <div class="ri-desc">${RARITY_LABEL[e.rarity]} • Confira os peixes possíveis</div>
        </div>
        <span class="ri-price"><i class="coin"></i> ${e.price}</span>
        <button class="btn egg-info-btn" data-egg-info="${e.rarity}" data-egg-name="${e.name}" aria-label="Informações do ${e.name}" title="Ver peixes e chances">i</button>
        <button class="btn primary" data-egg="${e.rarity}" data-price="${e.price}">COMPRAR</button>
      </div>`).join('')}

    <div class="section-title">EQUIPAMENTOS — ${totalUpgradeLevels()}/15</div>
    <p class="modal-text">Equipamentos seguram a água no ideal. Água ruim deixa os peixes tristes mais rápido.</p>
    ${EQUIPMENT_CATALOG.map(item => {
      const l = equipLvl(item.key);
      const maxed = l >= item.max;
      return `<div class="row-item">
        <span class="deco-thumb">${item.icon}</span>
        <div class="ri-body">
          <div class="ri-name">${item.name}<span class="lvl-tag">NÍVEL ${l}</span></div>
          <div class="ri-desc">${item.effect(l)}</div>
          <div class="lvl-pips">${[0, 1, 2].map(i => `<i class="${i < l ? 'on' : ''}"></i>`).join('')}</div>
        </div>
        ${maxed ? '<span class="ri-max">MÁXIMO</span>' : `<span class="ri-price"><i class="coin"></i> ${item.prices[l]}</span>`}
        <button class="btn ${maxed ? '' : 'primary'}" data-upg="${item.key}" ${maxed ? 'disabled' : ''}>${maxed ? 'MÁX' : 'MELHORAR'}</button>
      </div>`;
    }).join('')}

    <div class="section-title">ILUMINAÇÃO UV</div>
    ${uv === 0
      ? `<div class="empty-row">Compre a <b>Luz UV</b> acima para acender o tanque e liberar as cores.</div>`
      : `<div class="color-grid">
          ${LIGHT_COLORS.map(c => {
            const owned = state.lightColors.includes(c.key);
            const sel = state.lightColor === c.key;
            return `<button class="color-opt ${sel ? 'selected' : ''} ${owned ? '' : 'locked'}" data-color="${c.key}" title="${c.name} — ${c.bonusText(uv)}">
              <span class="color-dot" style="--dot:${c.rgb}"></span>
              <span class="color-name">${c.name}</span>
              ${owned
                ? `<span class="color-sub">${sel ? 'ATIVA' : 'USAR'}</span>`
                : `<span class="color-price"><i class="coin"></i> ${c.price}</span>`}
            </button>`;
          }).join('')}
        </div>
        <p class="color-hint">${activeColor.name}: <b>${activeColor.bonusText(uv)}</b><br>O bônus cresce com o nível da Luz UV.</p>`}

    <div class="section-title">AQUÁRIO</div>
    <div class="row-item">
      <span class="deco-thumb">🏠</span>
      <div class="ri-body">
        <div class="ri-name">Expandir aquário</div>
        <div class="ri-desc">+2 espaços (atual: ${state.capacity}${maxCap ? ' • máximo' : ''})</div>
      </div>
      ${maxCap ? '<span class="ri-max">MÁXIMO</span>' : `<span class="ri-price"><i class="coin"></i> ${expansionCost()}</span>`}
      <button class="btn" id="shopExpand" ${maxCap ? 'disabled' : ''}>COMPRAR</button>
    </div>
    <div class="row-item">
      <span class="deco-thumb">🍤</span>
      <div class="ri-body">
        <div class="ri-name">Ração (5x)</div>
        <div class="ri-desc">Você tem ${state.food} porções</div>
      </div>
      <span class="ri-price"><i class="coin"></i> 10</span>
      <button class="btn primary" id="shopFood">COMPRAR</button>
    </div>`;

  body.querySelectorAll('[data-egg]').forEach(btn => {
    btn.onclick = () => buyEgg(btn.dataset.egg, Number(btn.dataset.price));
  });
  body.querySelectorAll('[data-egg-info]').forEach(btn => {
    btn.onclick = () => showEggInfo(btn.dataset.eggInfo, btn.dataset.eggName);
  });
  body.querySelectorAll('[data-upg]').forEach(btn => {
    btn.onclick = () => buyUpgrade(btn.dataset.upg);
  });
  body.querySelectorAll('[data-color]').forEach(btn => {
    btn.onclick = () => {
      const key = btn.dataset.color;
      if (state.lightColors.includes(key)) {
        selectLightColor(key);
        refreshView();
      } else {
        buyLightColor(key);
      }
    };
  });
  body.querySelector('#shopExpand').onclick = buyExpansion;
  body.querySelector('#shopFood').onclick = () => {
    if (state.coins < 10) { toast('Moedas insuficientes'); return; }
    state.coins -= 10; state.food += 5;
    renderAll(); openView('shop'); save(); toast('+5 comidas');
  };
}

function buyEgg(rarity, price) {
  if (state.coins < price) { toast('Moedas insuficientes'); return; }
  state.coins -= price;
  renderHeader();
  save();
  hatch(rarity);
}

function hatch(rarity) {
  openModal('hatchModal');
  const egg = $('hatchEgg');
  const img = $('hatchImg');
  const text = $('hatchText');
  const ok = $('hatchOk');

  egg.style.display = 'block';
  egg.src = 'assets/outros/egg.png';
  img.style.display = 'none';
  ok.style.display = 'none';
  text.textContent = 'Chocando...';

  setTimeout(() => {
    egg.classList.add('cracking');
    setTimeout(() => {
      egg.style.display = 'none';
      egg.classList.remove('cracking');

      const candidates = eggCandidatesForRarity(rarity);
      const sp = candidates[Math.floor(Math.random() * candidates.length)];

      const pet = addPet(sp.key, { shown: false });
      if (shownPets().length < state.capacity) pet.shown = true;
      pet.stage = 'baby';

      img.src = sp.img;
      img.style.display = 'block';
      text.textContent = sp.name + ' nasceu!';
      ok.style.display = 'inline-block';

      addExp(30);
      renderAll();
      save();

      ok.onclick = () => closeModal('hatchModal');
    }, 800);
  }, 1300);
}

function buyExpansion() {
  if (state.capacity >= MAX_CAPACITY) { toast('Capacidade máxima atingida'); return; }
  const cost = expansionCost();
  if (state.coins < cost) { toast('Moedas insuficientes'); return; }
  state.coins -= cost;
  state.capacity += 2;
  addExp(20);
  renderAll();
  refreshView();
  save();
  toast('Aquário expandido! +2 espaços');
}

/* ---------------- melhorias (equipamentos + luz UV) ---------------- */
function buyUpgrade(key) {
  const item = EQUIPMENT_CATALOG.find(e => e.key === key);
  if (!item) return;
  const lvl = equipLvl(key);
  if (lvl >= item.max) { toast(item.name + ' já está no máximo'); return; }
  const price = item.prices[lvl];
  if (state.coins < price) { toast('Moedas insuficientes'); return; }

  state.coins -= price;
  state.equipment[key] = lvl + 1;
  state.stats.upgrades = (state.stats.upgrades || 0) + 1;
  addExp(18);
  renderAll();
  refreshView();
  save();

  if (key === 'uv' && lvl === 0) toast('Luz UV instalada! Escolha a cor');
  else toast(item.name + ' nível ' + (lvl + 1) + '!');
}

function selectLightColor(key) {
  if (!state.lightColors.includes(key)) return;
  state.lightColor = key;
  renderAll();
  save();
  toast('Luz do aquário: ' + lightColorOf(key).name);
}

function buyLightColor(key) {
  if (uvLevel() <= 0) { toast('Compre a Luz UV primeiro'); return; }
  const color = LIGHT_COLORS.find(c => c.key === key);
  if (!color || state.lightColors.includes(key)) return;
  if (state.coins < color.price) { toast('Moedas insuficientes'); return; }

  state.coins -= color.price;
  state.lightColors.push(key);
  state.lightColor = key;
  addExp(10);
  renderAll();
  refreshView();
  save();
  toast('Luz ' + color.name + ' desbloqueada!');
}

function viewAchiev(body) {
  const items = [
    { icon: '🐣', name: 'Primeiro peixe', desc: 'Choque seu primeiro peixe', done: state.stats.hatched >= 1 },
    { icon: '🐠', name: 'Colecionador', desc: 'Tenha 5 peixes', done: state.pets.length >= 5 },
    { icon: '🧽', name: 'Aquarista', desc: 'Limpe o aquário 5 vezes', done: state.stats.cleans >= 5 },
    { icon: '💰', name: 'Poupador', desc: 'Acumule 150 moedas', done: state.coins >= 150 },
    { icon: '🎮', name: 'Jogador', desc: 'Jogue um minijogo', done: state.stats.games >= 1 },
    { icon: '🐟', name: 'Comilão', desc: 'Coma 25 rações no Peixe Faminto', done: (state.stats.fed || 0) >= 25 },
    { icon: '🛠️', name: 'Equipado', desc: 'Compre 5 níveis de equipamentos', done: (state.stats.upgrades || 0) >= 5 },
    { icon: '💡', name: 'Iluminado', desc: 'Instale a Luz UV', done: uvLevel() >= 1 },
    { icon: '🎨', name: 'Colorido', desc: 'Use uma cor de luz diferente do azul', done: uvLevel() >= 1 && state.lightColor !== 'blue' },
    { icon: '🏠', name: 'Aquário grande', desc: 'Tenha capacidade para 8 peixes', done: state.capacity >= 8 }
  ];
  body.innerHTML = items.map(i => `
    <div class="achiev-item ${i.done ? '' : 'locked'}">
      <span class="achiev-icon">${i.icon}</span>
      <div class="ri-body">
        <div class="ri-name">${i.name}</div>
        <div class="ri-desc">${i.desc}</div>
      </div>
      <span style="color:${i.done ? 'var(--green)' : 'var(--muted)'};font-size:12px">${i.done ? '✓' : '🔒'}</span>
    </div>`).join('');

  body.innerHTML += `<button class="btn" id="achievBack" style="margin-top:14px;width:100%">VOLTAR ÀS CONFIGURAÇÕES</button>`;
  body.querySelector('#achievBack').onclick = () => openView('settings');
}

function viewSettings(body) {
  body.innerHTML = `
    <div class="section-title">AQUÁRIO</div>
    <div class="setting-row">
      <span>Tipo de água</span>
      <b style="color:var(--cyan)">${state.tankType === 'salt' ? 'SALGADA' : 'DOCE'}</b>
    </div>

    <div class="section-title">PROGRESSO</div>
    <div class="setting-row">
      <span>Conquistas</span>
      <button class="btn" id="openAchiev">VER CONQUISTAS</button>
    </div>

    <div class="section-title">DADOS</div>
    <div class="setting-row">
      <span>Resetar jogo</span>
      <button class="btn danger" id="resetGame">APAGAR SAVE</button>
    </div>
    <p class="modal-text" style="margin-top:8px">Resetar apaga o progresso e inicia um novo aquário de água salgada.</p>`;

  body.querySelector('#resetGame').onclick = () => {
    if (!confirm('Apagar todo o progresso e recomeçar?')) return;
    localStorage.removeItem(SAVE_KEY);
    location.reload();
  };
  body.querySelector('#openAchiev').onclick = () => openView('achiev');
}

/* ---------------- decor shop (right panel) ---------------- */
/* mostra/esconde o painel de decorações conforme o flag DECOR_ENABLED */
function applyDecorVisibility() {
  const panel = $('decorPanel');
  if (panel) panel.hidden = !DECOR_ENABLED;
}

function buildDecorShop() {
  applyDecorVisibility();
  if (!DECOR_ENABLED) return;
  renderDecorShop();
}

function renderDecorShop() {
  const el = $('decoList');
  if (!el) return;
  if (!DECOR_ENABLED) { el.innerHTML = ''; return; }
  el.innerHTML = DECOR_CATALOG.map(d => {
    const owned = state.ownedDecor[d.key] || 0;
    return `<button class="deco-tile" data-decor="${d.key}" title="${d.name}">
      <span class="dt-thumb"><img src="${d.thumb}" alt=""></span>
      <span class="dt-name">${d.name}</span>
      <span class="dt-price"><i class="coin"></i> ${d.price}</span>
      ${owned ? `<span class="dt-owned">x${owned}</span>` : ''}
    </button>`;
  }).join('');

  el.querySelectorAll('[data-decor]').forEach(btn => {
    btn.onclick = () => buyDecor(btn.dataset.decor);
  });
}

/* ---------------- background list (right panel) ---------------- */
function buildBackgroundList() {
  renderBackgroundList();
}

function renderBackgroundList() {
  const el = $('bgList');
  if (!el) return;
  el.innerHTML = BACKGROUNDS.map(b => {
    const owned = state.backgroundsOwned.includes(b.key);
    const selected = state.background === b.key;
    return `<button class="bg-opt ${selected ? 'selected' : ''} ${owned ? '' : 'locked'}" data-bg="${b.key}">
      <span class="bg-preview" style="background-image:url('${b.img}');background-size:cover;background-position:center bottom"></span>
      <span class="bg-name">${b.name}</span>
      ${owned ? '' : `<span class="bg-price"><i class="coin"></i> ${b.price}</span>`}
    </button>`;
  }).join('');

  el.querySelectorAll('[data-bg]').forEach(btn => {
    btn.onclick = () => {
      const key = btn.dataset.bg;
      const bg = BACKGROUNDS.find(b => b.key === key);
      if (!state.backgroundsOwned.includes(key)) {
        if (state.coins < bg.price) { toast('Moedas insuficientes'); return; }
        state.coins -= bg.price;
        state.backgroundsOwned.push(key);
        addExp(10);
      }
      state.background = key;
      renderAll();
      save();
      toast('Fundo: ' + bg.name);
    };
  });
}

/* ---------------- light colors (right panel) ---------------- */
function renderLightDots() {
  const el = $('lightDots');
  if (!el) return;
  const uv = uvLevel();
  const on = uv > 0;

  el.innerHTML = LIGHT_COLORS.map(c => {
    const owned = state.lightColors.includes(c.key);
    const selected = on && state.lightColor === c.key;
    return `<button class="light-dot ${selected ? 'selected' : ''} ${on && owned ? '' : 'locked'}"
      data-color="${c.key}" style="--dot:${c.rgb}"
      title="${c.name} — ${c.bonusText(Math.max(1, uv))}"></button>`;
  }).join('');

  el.querySelectorAll('[data-color]').forEach(btn => {
    btn.onclick = () => {
      if (!on) { openView('shop'); toast('Compre a Luz UV primeiro'); return; }
      const key = btn.dataset.color;
      if (state.lightColors.includes(key)) selectLightColor(key);
      else { openView('shop'); toast('Cor bloqueada: desbloqueie na loja'); }
    };
  });

  const stateEl = $('lightState');
  if (stateEl) stateEl.textContent = on ? 'NÍVEL ' + uv : 'DESLIGADA';

  const hint = $('lightHint');
  if (hint) {
    const c = lightColorOf(state.lightColor);
    hint.textContent = on ? c.name + ' · ' + c.bonusText(uv) : 'Compre a Luz UV na loja';
  }
}

/* ---------------- modals & global bindings ---------------- */
function openModal(id) { $(id).classList.add('open'); }
function closeModal(id) { $(id).classList.remove('open'); }

function bindGlobal() {
  $('btnSettings').onclick = () => openView('settings');

  $('overlayClose').onclick = closeOverlay;
  $('overlay').addEventListener('click', (e) => {
    if (e.target === $('overlay')) closeOverlay();
  });

  $('fishHead').onclick = () => openView('fish');

  $('actFeed').onclick = feedAll;
  $('actPet').onclick = petAll;
  $('actClean').onclick = cleanTank;
  $('actGame').onclick = () => { closeOverlay(); openModal('pickGameModal'); };
  $('actShop').onclick = () => openView('shop');
  $('paramsHead').onclick = () => openView('shop');

  bindFishModal();

  $('hatchClose').onclick = () => closeModal('hatchModal');
  $('eggInfoClose').onclick = () => closeModal('eggInfoModal');
  $('eggInfoModal').addEventListener('click', (e) => {
    if (e.target === $('eggInfoModal')) closeModal('eggInfoModal');
  });
  $('gameClose').onclick = () => { stopGame(); closeModal('gameModal'); };
  $('gameStart').onclick = startGame;

  $('pickGameClose').onclick = () => closeModal('pickGameModal');
  $('pickBubbles').onclick = () => {
    closeModal('pickGameModal');
    openModal('gameModal');
  };
  $('pickFeed').onclick = openFeedGame;
  $('feedClose').onclick = () => { stopFeedGame(); closeModal('feedModal'); };
  $('feedStart').onclick = startFeedGame;
  $('feedModal').addEventListener('click', (e) => {
    if (e.target === $('feedModal')) { stopFeedGame(); closeModal('feedModal'); }
  });

  const feedAreaEl = $('feedArea');
  const feedPointer = (e) => {
    if (!feedState || !feedState.running) return;
    const r = feedAreaEl.getBoundingClientRect();
    setFeedFishX(e.clientX - r.left);
  };
  feedAreaEl.addEventListener('pointermove', feedPointer);
  feedAreaEl.addEventListener('pointerdown', feedPointer);

  const water = $('water');
  document.addEventListener('pointerdown', event => {
    if (!event.target.closest('.fish, .fish-interaction-menu')) closeFishInteractionMenu();
  });
  water.addEventListener('pointermove', event => {
    const rect = water.getBoundingClientRect();
    const now = Date.now();
    playerCursor = {
      x: clamp((event.clientX - rect.left) / rect.width * 100, 0, 100),
      y: clamp((rect.bottom - event.clientY) / rect.height * 100, 0, 100),
      time: now
    };
    if (now - (water._lastFishNudge || 0) < 450) return;
    water._lastFishNudge = now;
    shownPets().slice(0, state.capacity).forEach(pet => {
      pet._nextMove = Math.min(pet._nextMove || now + 350, now + 350);
    });
  });
  water.addEventListener('pointerleave', () => { playerCursor = null; });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeFish = document.querySelector('.fish.interaction-open');
      closeFishInteractionMenu();
      if (activeFish) activeFish.focus({ preventScroll: true });
      stopFeedGame();
      closeModal('fishModal'); closeModal('gameModal'); closeModal('eggInfoModal');
      closeModal('feedModal'); closeModal('pickGameModal');
      closeOverlay();
    }
    if ($('feedModal').classList.contains('open') && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      e.preventDefault();
      nudgeFeedFish(e.key === 'ArrowLeft' ? -30 : 30);
    }
  });
}

/* ---------------- minigame ---------------- */
function startGame() {
  gameScore = 0;
  gameTimeLeft = 30;
  $('gameScore').textContent = '0';
  $('gameTime').textContent = '30';
  $('gameArea').innerHTML = '';
  $('gameStart').style.display = 'none';

  gameSpawner = setInterval(spawnGameBubble, 650);
  spawnGameBubble();

  gameTimer = setInterval(() => {
    gameTimeLeft--;
    $('gameTime').textContent = gameTimeLeft;
    if (gameTimeLeft <= 0) endGame();
  }, 1000);
}

function spawnGameBubble() {
  const area = $('gameArea');
  if (!area || area.querySelectorAll('.game-bubble').length > 4) return;
  const b = document.createElement('div');
  b.className = 'game-bubble';
  b.innerHTML = '<i class="coin coin-lg"></i>';
  b.style.left = rand(4, 82) + '%';
  b.style.top = rand(6, 74) + '%';
  b.onclick = (ev) => {
    ev.stopPropagation();
    gameScore += 5;
    $('gameScore').textContent = gameScore;
    b.remove();
  };
  area.appendChild(b);
  setTimeout(() => b.remove(), 2600);
}

function endGame() {
  stopGame();
  state.coins += gameScore;
  state.stats.earned += gameScore;
  state.stats.games++;
  addExp(15);
  $('gameArea').innerHTML = `<div style="height:100%;display:grid;place-items:center;font-weight:800;color:#bfe8ff">
    FIM! +${gameScore} moedas</div>`;
  $('gameStart').style.display = 'inline-block';
  $('gameStart').textContent = 'JOGAR NOVAMENTE';
  renderAll();
  save();
  toast('Você ganhou ' + gameScore + ' moedas');
}

function stopGame() {
  clearInterval(gameTimer);
  clearInterval(gameSpawner);
}

/* ---------------- minigame: peixe faminto ---------------- */
const FEED_TIME = 30;
const FEED_LIVES = 3;
const FEED_FISH_H = 54;
let feedState = null;
let feedRaf = null;

function playerFishSprite() {
  const pet = shownPets()[0] || state.pets[0];
  const key = pet ? pet.species : (state.tankType === 'fresh' ? 'goldfish' : 'clownfish');
  return speciesOf(key).img;
}

function buildFeedFish() {
  const el = document.createElement('div');
  el.className = 'feed-fish';
  const img = document.createElement('img');
  img.src = playerFishSprite();
  img.alt = '';
  el.appendChild(img);
  return el;
}

function openFeedGame() {
  closeModal('pickGameModal');
  stopFeedGame();
  openModal('feedModal');

  const area = $('feedArea');
  area.innerHTML = '';
  area.appendChild(buildFeedFish());
  $('feedScore').textContent = '0';
  $('feedLives').textContent = '♥'.repeat(FEED_LIVES);
  $('feedTime').textContent = FEED_TIME;
  $('feedStart').style.display = 'inline-block';
  $('feedStart').textContent = 'COMEÇAR';
  $('feedHint').textContent = 'Arraste o peixe (ou use ← →) para comer a ração';
}

function startFeedGame() {
  stopFeedGame();
  const area = $('feedArea');
  area.innerHTML = '';
  const fish = buildFeedFish();
  area.appendChild(fish);

  feedState = {
    running: true,
    score: 0,
    lives: FEED_LIVES,
    caught: 0,
    missed: 0,
    timeLeft: FEED_TIME,
    elapsed: 0,
    foods: [],
    fishX: area.clientWidth / 2,
    fishEl: fish,
    spawnAcc: 0,
    lastFrame: 0
  };

  setFeedFishX(feedState.fishX);
  $('feedScore').textContent = '0';
  $('feedLives').textContent = '♥'.repeat(FEED_LIVES);
  $('feedTime').textContent = FEED_TIME;
  $('feedStart').style.display = 'none';
  $('feedHint').textContent = 'Ração = 2 moedas · dourada = 10 · 3 que caírem e acabou';

  spawnFeedPellet();

  feedState.timer = setInterval(() => {
    const s = feedState;
    if (!s || !s.running) return;
    s.timeLeft--;
    s.elapsed = FEED_TIME - s.timeLeft;
    $('feedTime').textContent = Math.max(0, s.timeLeft);
    if (s.timeLeft <= 0) endFeedGame();
  }, 1000);

  feedRaf = requestAnimationFrame(feedTick);
}

function setFeedFishX(px) {
  const s = feedState;
  if (!s || !s.running || !s.fishEl) return;
  const w = $('feedArea').clientWidth;
  const nx = clamp(px, 28, Math.max(28, w - 28));
  if (Math.abs(nx - s.fishX) > 1) s.fishEl.style.setProperty('--fx', nx < s.fishX ? -1 : 1);
  s.fishX = nx;
  s.fishEl.style.left = nx + 'px';
}

function nudgeFeedFish(dx) {
  if (!feedState || !feedState.running) return;
  setFeedFishX(feedState.fishX + dx);
}

function spawnFeedPellet() {
  const s = feedState;
  if (!s || !s.running) return;
  const area = $('feedArea');
  const gold = Math.random() < 0.12;
  const size = gold ? 17 : 13;
  const el = document.createElement('div');
  el.className = 'feed-pellet' + (gold ? ' gold' : '');
  const x = rand(10, Math.max(10, area.clientWidth - size - 10));
  el.style.left = x + 'px';
  el.style.top = '-20px';
  area.appendChild(el);
  s.foods.push({
    el, x, y: -20, size,
    vy: rand(115, 165) + s.elapsed * 6 + (gold ? 30 : 0),
    pts: gold ? 10 : 2
  });
}

function feedPop(x, y, text, gold) {
  const p = document.createElement('div');
  p.className = 'feed-pop';
  p.textContent = text;
  p.style.left = x + 'px';
  p.style.top = y + 'px';
  if (gold) p.style.color = '#ffd257';
  $('feedArea').appendChild(p);
  setTimeout(() => p.remove(), 750);
}

function updateFeedLives() {
  const s = feedState;
  if (!s) return;
  const left = Math.max(0, s.lives);
  $('feedLives').innerHTML = '<span>♥</span>'.repeat(left) +
    '<span class="lost">♡</span>'.repeat(FEED_LIVES - left);
}

function feedTick(ts) {
  const s = feedState;
  if (!s || !s.running) return;
  const area = $('feedArea');
  const h = area.clientHeight;
  const dt = Math.min(60, ts - (s.lastFrame || ts));
  s.lastFrame = ts;

  const every = Math.max(430, 900 - s.elapsed * 15);
  s.spawnAcc += dt;
  if (s.spawnAcc >= every) {
    s.spawnAcc = 0;
    spawnFeedPellet();
  }

  const fishTop = h - FEED_FISH_H - 4;
  for (let i = s.foods.length - 1; i >= 0; i--) {
    const f = s.foods[i];
    f.y += f.vy * dt / 1000;
    f.el.style.top = f.y + 'px';

    const cx = f.x + f.size / 2;
    if (f.y + f.size >= fishTop && Math.abs(cx - s.fishX) <= 34) {
      s.score += f.pts;
      s.caught++;
      $('feedScore').textContent = s.score;
      feedPop(cx, fishTop - 4, '+' + f.pts, f.pts >= 10);
      f.el.remove();
      s.foods.splice(i, 1);
      continue;
    }

    if (f.y > h) {
      f.el.remove();
      s.foods.splice(i, 1);
      s.missed++;
      s.lives--;
      updateFeedLives();
      area.classList.add('feed-shake');
      setTimeout(() => area.classList.remove('feed-shake'), 300);
      if (s.lives <= 0) { endFeedGame(); return; }
    }
  }

  feedRaf = requestAnimationFrame(feedTick);
}

function endFeedGame() {
  const s = feedState;
  if (!s || !s.running) return;
  s.running = false;
  clearInterval(s.timer);
  cancelAnimationFrame(feedRaf);

  const area = $('feedArea');
  const caughtTxt = s.caught === 1 ? '1 ração comida' : s.caught + ' rações comidas';
  const missedTxt = s.missed === 1 ? '1 perdida' : s.missed + ' perdidas';
  area.innerHTML = `<div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center">
      <span style="font-weight:800;color:#bfe8ff">FIM! +${s.score} moedas</span>
      <span style="font-size:11px;color:#8fc7de">${caughtTxt} · ${missedTxt}</span>
    </div>`;

  const earned = s.score;
  feedState = null;

  state.coins += earned;
  state.stats.earned += earned;
  state.stats.games++;
  state.stats.fed = (state.stats.fed || 0) + s.caught;
  addExp(15);

  $('feedStart').style.display = 'inline-block';
  $('feedStart').textContent = 'JOGAR NOVAMENTE';
  $('feedHint').textContent = 'Arraste o peixe (ou use ← →) para comer a ração';
  renderAll();
  save();
  toast(earned > 0 ? 'Você ganhou ' + earned + ' moedas' : 'Não foi dessa vez! Tente de novo');
}

function stopFeedGame() {
  if (feedState) {
    feedState.running = false;
    clearInterval(feedState.timer);
    feedState = null;
  }
  cancelAnimationFrame(feedRaf);
}
