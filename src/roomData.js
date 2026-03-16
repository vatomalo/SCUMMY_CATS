export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 640;
export const UI_HEIGHT = 170;
export const ROOM_HEIGHT = GAME_HEIGHT - UI_HEIGHT;
export const ROOM_WORLD_WIDTH = 1560;
export const UI_DEPTH = 500;

export const VERBS = ['Walk to', 'Look at', 'Pick up', 'Use', 'Talk to'];

export const GENERATED_TEXTURES = [
  { key: 'lab-layer-1-sky', width: ROOM_WORLD_WIDTH, height: ROOM_HEIGHT },
  { key: 'lab-layer-2-moon', width: ROOM_WORLD_WIDTH, height: ROOM_HEIGHT },
  { key: 'lab-layer-3-city', width: ROOM_WORLD_WIDTH, height: ROOM_HEIGHT },
  { key: 'lab-layer-4-roofs', width: ROOM_WORLD_WIDTH, height: ROOM_HEIGHT },
  { key: 'lab-layer-5-arches', width: ROOM_WORLD_WIDTH, height: ROOM_HEIGHT },
  { key: 'lab-layer-7-foreground', width: ROOM_WORLD_WIDTH, height: ROOM_HEIGHT },
  { key: 'sprite-shelf', width: 210, height: 250 },
  { key: 'sprite-machine-off', width: 250, height: 220 },
  { key: 'sprite-machine-on', width: 250, height: 220 },
  { key: 'sprite-cat', width: 180, height: 170 },
  { key: 'sprite-fish', width: 86, height: 42 }
];

export const ROOM_IMAGE_ASSETS = [
  { key: 'room-zero-background', path: 'RoomZero.png' },
  { key: 'room-zero-items', path: 'RoomZeroItems.png' },
  { key: 'sprite-cozy-cat-2', path: 'CozyCat2.png' },
  { key: 'sprite-lazy-cat', path: 'LazyCat.png' },
  { key: 'sprite-lazy-cat-2', path: 'LazyCat2.png' },
  { key: 'sprite-stealthy-cat', path: 'StealthyCat.png' },
  { key: 'sprite-uwu-cat', path: 'UWUCat.png' },
  { key: 'sprite-human-sheet', path: 'Sprites.png' }
];

export const ROOMS = {
  lab: {
    key: 'lab',
    title: 'Cat Mansion Lab',
    worldWidth: ROOM_WORLD_WIDTH,
    cameraPanPadding: 140,
    layers: [
      {
        key: 'main-background',
        texture: 'room-zero-background',
        depth: -10,
        scrollFactorX: 0.72,
        scrollFactorY: 1,
        fit: 'stretch',
        width: ROOM_WORLD_WIDTH,
        height: ROOM_HEIGHT
      },
      {
        key: 'background-overlay',
        texture: 'room-zero-items',
        depth: 20,
        scrollFactorX: 0.9,
        scrollFactorY: 1,
        fit: 'stretch',
        width: ROOM_WORLD_WIDTH,
        height: ROOM_HEIGHT
      }
    ],
    sprites: [
      {
        key: 'machine',
        texture: 'sprite-machine-off',
        activeTexture: 'sprite-machine-on',
        x: 760,
        y: 278,
        depth: 18,
        origin: [0.5, 1],
        visible: false
      },
      {
        key: 'cat',
        texture: 'sprite-stealthy-cat',
        x: 1335,
        y: 438,
        depth: 30,
        origin: [0.5, 1],
        scale: 0.32,
        chromaKey: { r: 254, g: 254, b: 254, tolerance: 18 },
        sheet: { columns: 3, rows: 3, index: 7, trim: true },
        bob: { distance: 8, duration: 1.4 }
      },
      {
        key: 'cozy-cat',
        texture: 'sprite-cozy-cat-2',
        x: 470,
        y: 432,
        depth: 28,
        origin: [0.5, 1],
        scale: 0.32,
        chromaKey: { r: 254, g: 254, b: 254, tolerance: 24 },
        sheet: { columns: 3, rows: 3, index: 7, trim: true },
        bob: { distance: 5, duration: 1.9 }
      },
      {
        key: 'uwu-cat',
        texture: 'sprite-uwu-cat',
        x: 250,
        y: 430,
        depth: 28,
        origin: [0.5, 1],
        scale: 0.3,
        chromaKey: { r: 254, g: 254, b: 254, tolerance: 24 },
        sheet: { columns: 3, rows: 3, index: 4, trim: true }
      },
      {
        key: 'lazy-cat',
        texture: 'sprite-lazy-cat-2',
        x: 870,
        y: 438,
        depth: 30,
        origin: [0.5, 1],
        scale: 0.3,
        chromaKey: { r: 254, g: 254, b: 254, tolerance: 24 },
        sheet: { columns: 3, rows: 3, index: 3, trim: true }
      },
      {
        key: 'sleepy-cat',
        texture: 'sprite-lazy-cat',
        x: 1035,
        y: 440,
        depth: 30,
        origin: [0.5, 1],
        scale: 0.28,
        chromaKey: { r: 254, g: 254, b: 254, tolerance: 24 },
        sheet: { columns: 3, rows: 3, index: 4, trim: true }
      },
      {
        key: 'box-cat',
        texture: 'sprite-uwu-cat',
        x: 1185,
        y: 442,
        depth: 30,
        origin: [0.5, 1],
        scale: 0.26,
        chromaKey: { r: 254, g: 254, b: 254, tolerance: 24 },
        sheet: { columns: 3, rows: 3, index: 8, trim: true }
      },
      {
        key: 'elder',
        texture: 'sprite-human-sheet',
        x: 120,
        y: 332,
        depth: 16,
        origin: [0.5, 1],
        scale: 0.36,
        chromaKey: { r: 254, g: 254, b: 254, tolerance: 24 },
        sheet: { columns: 3, rows: 2, index: 0, trim: true }
      },
      {
        key: 'maid',
        texture: 'sprite-human-sheet',
        x: 930,
        y: 332,
        depth: 16,
        origin: [0.5, 1],
        scale: 0.36,
        chromaKey: { r: 254, g: 254, b: 254, tolerance: 24 },
        sheet: { columns: 3, rows: 2, index: 1, trim: true }
      },
      {
        key: 'woodsman',
        texture: 'sprite-human-sheet',
        x: 1480,
        y: 334,
        depth: 16,
        origin: [0.5, 1],
        scale: 0.38,
        chromaKey: { r: 254, g: 254, b: 254, tolerance: 24 },
        sheet: { columns: 3, rows: 2, index: 2, trim: true }
      },
      {
        key: 'farm-girl',
        texture: 'sprite-human-sheet',
        x: 560,
        y: 334,
        depth: 16,
        origin: [0.5, 1],
        scale: 0.35,
        chromaKey: { r: 254, g: 254, b: 254, tolerance: 24 },
        sheet: { columns: 3, rows: 2, index: 3, trim: true }
      },
      {
        key: 'boy',
        texture: 'sprite-human-sheet',
        x: 730,
        y: 334,
        depth: 16,
        origin: [0.5, 1],
        scale: 0.35,
        chromaKey: { r: 254, g: 254, b: 254, tolerance: 24 },
        sheet: { columns: 3, rows: 2, index: 4, trim: true }
      },
      {
        key: 'girl',
        texture: 'sprite-human-sheet',
        x: 1260,
        y: 334,
        depth: 16,
        origin: [0.5, 1],
        scale: 0.35,
        chromaKey: { r: 254, g: 254, b: 254, tolerance: 24 },
        sheet: { columns: 3, rows: 2, index: 5, trim: true }
      },
      {
        key: 'fish',
        texture: 'sprite-fish',
        x: 214,
        y: 136,
        depth: 12,
        origin: [0.5, 0.5],
        visible: false
      }
    ],
    hotspots: [
      {
        key: 'cat',
        targetKey: 'cat',
        x: 1335,
        y: 354,
        width: 170,
        height: 170,
        label: 'Professor Nibbles'
      },
      {
        key: 'shelf',
        x: 210,
        y: 170,
        width: 200,
        height: 240,
        label: 'Dusty Shelf'
      },
      {
        key: 'machine',
        targetKey: 'machine',
        x: 760,
        y: 188,
        width: 250,
        height: 220,
        label: 'Purr Machine'
      }
    ],
    spareSprites: [
      { key: 'sprite-cozy-cat-2', label: 'Cozy Cat alt' },
      { key: 'sprite-lazy-cat', label: 'Lazy Cat alt' },
      { key: 'sprite-lazy-cat-2', label: 'Lazy Cat alt 2' },
      { key: 'sprite-uwu-cat', label: 'UWU Cat alt' },
      { key: 'sprite-human-sheet', label: 'Human sprite sheet' }
    ]
  }
};
