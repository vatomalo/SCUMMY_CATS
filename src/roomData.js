export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 640;
export const UI_HEIGHT = 170;
export const ROOM_HEIGHT = GAME_HEIGHT - UI_HEIGHT;
export const ROOM_WORLD_WIDTH = 1560;

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
        fit: 'cover',
        width: ROOM_WORLD_WIDTH,
        height: ROOM_HEIGHT
      },
      {
        key: 'background-overlay',
        texture: 'room-zero-items',
        depth: 40,
        scrollFactorX: 0.9,
        scrollFactorY: 1,
        fit: 'cover',
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
        origin: [0.5, 1]
      },
      {
        key: 'cat',
        texture: 'sprite-stealthy-cat',
        x: 1210,
        y: 352,
        depth: 25,
        origin: [0.5, 1],
        scale: 0.22,
        bob: { distance: 8, duration: 1.4 }
      },
      {
        key: 'fish',
        texture: 'sprite-fish',
        x: 214,
        y: 136,
        depth: 12,
        origin: [0.5, 0.5]
      }
    ],
    hotspots: [
      {
        key: 'cat',
        targetKey: 'cat',
        x: 1210,
        y: 250,
        width: 150,
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
