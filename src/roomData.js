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
  { key: 'lab-layer-6-floor', width: ROOM_WORLD_WIDTH, height: ROOM_HEIGHT },
  { key: 'lab-layer-7-foreground', width: ROOM_WORLD_WIDTH, height: ROOM_HEIGHT },
  { key: 'sprite-shelf', width: 210, height: 250 },
  { key: 'sprite-machine-off', width: 250, height: 220 },
  { key: 'sprite-machine-on', width: 250, height: 220 },
  { key: 'sprite-cat', width: 180, height: 170 },
  { key: 'sprite-fish', width: 86, height: 42 }
];

export const ROOMS = {
  lab: {
    key: 'lab',
    title: 'Cat Mansion Lab',
    worldWidth: ROOM_WORLD_WIDTH,
    cameraPanPadding: 140,
    layers: [
      { key: 'sky', texture: 'lab-layer-1-sky', depth: -70, scrollFactorX: 0.1, scrollFactorY: 1, originY: 0 },
      { key: 'moon', texture: 'lab-layer-2-moon', depth: -60, scrollFactorX: 0.18, scrollFactorY: 1, originY: 0 },
      { key: 'city', texture: 'lab-layer-3-city', depth: -50, scrollFactorX: 0.28, scrollFactorY: 1, originY: 0 },
      { key: 'roofs', texture: 'lab-layer-4-roofs', depth: -40, scrollFactorX: 0.38, scrollFactorY: 1, originY: 0 },
      { key: 'arches', texture: 'lab-layer-5-arches', depth: -30, scrollFactorX: 0.55, scrollFactorY: 1, originY: 0 },
      { key: 'floor', texture: 'lab-layer-6-floor', depth: -20, scrollFactorX: 0.78, scrollFactorY: 1, originY: 0 },
      { key: 'foreground', texture: 'lab-layer-7-foreground', depth: 60, scrollFactorX: 1.12, scrollFactorY: 1, originY: 0 }
    ],
    sprites: [
      {
        key: 'shelf',
        texture: 'sprite-shelf',
        x: 210,
        y: 250,
        depth: 10,
        origin: [0.5, 1]
      },
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
        texture: 'sprite-cat',
        x: 1210,
        y: 330,
        depth: 25,
        origin: [0.5, 1],
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
        targetKey: 'shelf',
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
    ]
  }
};
