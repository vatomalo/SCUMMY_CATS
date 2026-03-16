import {
  GAME_HEIGHT,
  GAME_WIDTH,
  GENERATED_TEXTURES,
  ROOM_HEIGHT,
  ROOM_IMAGE_ASSETS,
  ROOMS,
  UI_DEPTH,
  UI_HEIGHT,
  VERBS
} from './roomData.js';

class AdventureState {
  constructor(statusCallback) {
    this.selectedVerb = 'Walk to';
    this.selectedInventory = null;
    this.inventory = [];
    this.flags = {
      fishPicked: false,
      machinePowered: false
    };
    this.setStatus = statusCallback;
  }

  setVerb(verb) {
    this.selectedVerb = verb;
    this.setStatus(`Selected verb: ${verb}`);
  }

  addItem(itemId) {
    if (!this.inventory.includes(itemId)) {
      this.inventory.push(itemId);
      this.setStatus(`Picked up ${itemId}.`);
    }
  }

  removeItem(itemId) {
    this.inventory = this.inventory.filter((entry) => entry !== itemId);
    if (this.selectedInventory === itemId) {
      this.selectedInventory = null;
    }
  }

  selectItem(itemId) {
    this.selectedInventory = this.selectedInventory === itemId ? null : itemId;
    const suffix = this.selectedInventory ? `Selected item: ${itemId}` : 'Item deselected.';
    this.setStatus(suffix);
  }
}

class LabScene extends Phaser.Scene {
  constructor() {
    super('lab');
    this.state = null;
    this.statusLine = null;
    this.verbButtons = [];
    this.inventoryButtons = [];
    this.sfx = {};
    this.room = ROOMS.lab;
    this.roomSprites = new Map();
    this.pointerTargetX = GAME_WIDTH / 2;
  }

  preload() {
    this.load.audio('uiClick', 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    this.load.audio('pickup', 'https://assets.mixkit.co/active_storage/sfx/209/209-preview.mp3');
    ROOM_IMAGE_ASSETS.forEach((asset) => {
      this.load.image(asset.key, asset.path);
    });
  }

  create() {
    this.createGeneratedTextures();
    this.configureCamera();

    this.statusLine = this.add.text(18, ROOM_HEIGHT + 10, 'Welcome to Cat Mansion Lab.', {
      fontFamily: 'Trebuchet MS',
      fontSize: '20px',
      color: '#fcefcf'
    }).setScrollFactor(0);

    this.state = new AdventureState((message) => {
      this.statusLine.setText(message);
    });

    this.buildRoomBackdrop();
    this.buildRoomSprites();
    this.buildHotspots();
    this.buildUiPanel();
    this.wireCameraParallax();

    this.sfx.click = new Howl({ src: [this.cache.audio.get('uiClick').url], volume: 0.3 });
    this.sfx.pickup = new Howl({ src: [this.cache.audio.get('pickup').url], volume: 0.35 });

    gsap.from(this.cameras.main, { duration: 0.6, alpha: 0, ease: 'power2.out' });
    this.refreshUi();
  }

  configureCamera() {
    const camera = this.cameras.main;
    camera.setBounds(0, 0, this.room.worldWidth, GAME_HEIGHT);
    camera.scrollX = (this.room.worldWidth - GAME_WIDTH) / 2;
  }

  createGeneratedTextures() {
    GENERATED_TEXTURES.forEach(({ key, width, height }) => {
      if (this.textures.exists(key)) {
        return;
      }

      const graphics = this.make.graphics({ x: 0, y: 0, add: false });
      this.drawGeneratedTexture(graphics, key, width, height);
      graphics.generateTexture(key, width, height);
      graphics.destroy();
    });
  }

  drawGeneratedTexture(graphics, key, width, height) {
    const drawMap = {
      'lab-layer-1-sky': () => {
        graphics.fillGradientStyle(0x1a2230, 0x1a2230, 0x32486c, 0x32486c, 1);
        graphics.fillRect(0, 0, width, height);
        graphics.fillStyle(0x8db4ff, 0.12);
        for (let index = 0; index < 18; index += 1) {
          const x = 60 + index * 82;
          graphics.fillCircle(x, 60 + (index % 3) * 28, 2 + (index % 2));
        }
      },
      'lab-layer-2-moon': () => {
        graphics.fillStyle(0xfff3bc, 0.95);
        graphics.fillCircle(1250, 86, 44);
        graphics.fillStyle(0xc0d5ff, 0.16);
        graphics.fillEllipse(990, 88, 300, 48);
        graphics.fillEllipse(1110, 132, 360, 40);
      },
      'lab-layer-3-city': () => {
        graphics.fillStyle(0x243246, 0.9);
        for (let x = 0; x < width; x += 95) {
          const buildingHeight = 110 + (x % 5) * 26;
          graphics.fillRect(x, height - 245 - buildingHeight, 70, buildingHeight);
        }
      },
      'lab-layer-4-roofs': () => {
        graphics.fillStyle(0x314156, 0.98);
        for (let x = -30; x < width + 80; x += 180) {
          graphics.fillTriangle(x, height - 160, x + 90, height - 260, x + 180, height - 160);
        }
      },
      'lab-layer-5-arches': () => {
        graphics.fillStyle(0x54657c, 1);
        for (let x = 0; x < width; x += 200) {
          graphics.fillRect(x, height - 250, 34, 250);
          graphics.fillRect(x + 134, height - 250, 34, 250);
          graphics.fillRoundedRect(x + 18, height - 230, 134, 165, 50);
          graphics.fillStyle(0x324457, 1);
          graphics.fillRoundedRect(x + 38, height - 212, 94, 128, 42);
          graphics.fillStyle(0x54657c, 1);
        }
      },
      'lab-layer-6-floor': () => {
        graphics.fillStyle(0x2d3139, 1);
        graphics.fillRect(0, height - 148, width, 148);
        graphics.fillStyle(0x454c58, 1);
        for (let x = 0; x < width; x += 96) {
          graphics.fillRect(x, height - 148, 6, 148);
        }
        for (let y = height - 148; y < height; y += 44) {
          graphics.fillRect(0, y, width, 5);
        }
      },
      'lab-layer-7-foreground': () => {
        graphics.fillStyle(0x121820, 0.95);
        graphics.fillRect(0, height - 182, 112, 182);
        graphics.fillRect(width - 136, height - 224, 136, 224);
        graphics.fillRect(310, height - 96, 280, 96);
        graphics.fillStyle(0xf0b35a, 0.12);
        graphics.fillRect(325, height - 90, 250, 8);
      },
      'sprite-shelf': () => {
        graphics.fillStyle(0x3f2c26, 1);
        graphics.fillRoundedRect(8, 18, 194, 220, 10);
        graphics.fillStyle(0x6b4c3f, 1);
        [60, 116, 172].forEach((y) => graphics.fillRect(18, y, 174, 12));
        graphics.fillStyle(0x8db4ff, 0.35);
        graphics.fillRect(36, 34, 42, 22);
        graphics.fillRect(128, 88, 28, 24);
      },
      'sprite-machine-off': () => {
        graphics.fillStyle(0x55606d, 1);
        graphics.fillRoundedRect(10, 14, 230, 184, 18);
        graphics.fillStyle(0x28323b, 1);
        graphics.fillRoundedRect(30, 34, 190, 92, 16);
        graphics.fillStyle(0xe79d48, 1);
        graphics.fillCircle(74, 160, 16);
        graphics.fillStyle(0x9cb7cf, 1);
        graphics.fillRect(130, 146, 50, 18);
        graphics.fillStyle(0x83909d, 1);
        graphics.fillRect(48, 198, 152, 14);
      },
      'sprite-machine-on': () => {
        drawMap['sprite-machine-off']();
        graphics.fillStyle(0x7ef7c1, 0.9);
        graphics.fillRoundedRect(36, 40, 178, 80, 16);
        graphics.fillStyle(0xa7ffe5, 0.65);
        graphics.fillCircle(74, 160, 16);
      },
      'sprite-cat': () => {
        graphics.fillStyle(0xd38f64, 1);
        graphics.fillEllipse(92, 100, 110, 118);
        graphics.fillEllipse(92, 136, 126, 60);
        graphics.fillTriangle(54, 46, 70, 12, 86, 52);
        graphics.fillTriangle(98, 52, 116, 12, 134, 46);
        graphics.fillStyle(0x2d231d, 1);
        graphics.fillCircle(74, 92, 5);
        graphics.fillCircle(110, 92, 5);
        graphics.fillStyle(0xf3d8c3, 1);
        graphics.fillEllipse(92, 116, 34, 22);
      },
      'sprite-fish': () => {
        graphics.fillStyle(0x6fc1d3, 1);
        graphics.fillEllipse(34, 21, 52, 28);
        graphics.fillTriangle(58, 21, 84, 4, 84, 38);
        graphics.fillStyle(0xf8f2dd, 1);
        graphics.fillCircle(18, 18, 3);
      }
    };

    drawMap[key]?.();
  }

  buildRoomBackdrop() {
    this.room.layers.forEach((layer) => {
      const image = this.add.image(0, layer.originY ?? 0, layer.texture)
        .setOrigin(0, 0)
        .setDepth(layer.depth)
        .setScrollFactor(layer.scrollFactorX, layer.scrollFactorY);

      if (layer.fit === 'stretch') {
        const targetWidth = layer.width ?? this.room.worldWidth;
        const targetHeight = layer.height ?? ROOM_HEIGHT;
        image
          .setPosition(0, 0)
          .setOrigin(0, 0)
          .setDisplaySize(targetWidth, targetHeight);
      }
    });

    this.add.text(48, 36, this.room.title, {
      fontFamily: 'Trebuchet MS',
      fontSize: '32px',
      color: '#f5d48b'
    }).setScrollFactor(0);
  }

  buildRoomSprites() {
    this.room.sprites.forEach((spriteData) => {
      const baseTextureKey = spriteData.chromaKey
        ? this.getChromaKeyTextureKey(spriteData.texture, spriteData.chromaKey)
        : spriteData.texture;
      const textureKey = spriteData.sheet
        ? this.getSheetCellTextureKey(baseTextureKey, spriteData.sheet)
        : spriteData.frame
        ? this.getFramedTextureKey(baseTextureKey, spriteData.frame)
        : Number.isInteger(spriteData.stickerIndex)
          ? this.getStickerTextureKey(baseTextureKey, spriteData.stickerIndex)
          : baseTextureKey;

      const sprite = this.add.sprite(spriteData.x, spriteData.y, textureKey)
        .setOrigin(...spriteData.origin)
        .setDepth(spriteData.depth);

      if (spriteData.scale) {
        sprite.setScale(spriteData.scale);
      }

      if (spriteData.visible === false) {
        sprite.setVisible(false);
      }

      if (spriteData.bob) {
        gsap.to(sprite, {
          y: sprite.y - spriteData.bob.distance,
          duration: spriteData.bob.duration,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut'
        });
      }

      this.roomSprites.set(spriteData.key, sprite);
    });
  }

  makeHotspot({ key, x, y, width, height, label, onAction }) {
    const zone = this.add.rectangle(x, y, width, height, 0xffffff, 0.001).setInteractive({ useHandCursor: true });
    const hint = this.add.text(x - width / 2, y - height / 2 - 20, label, {
      fontSize: '16px',
      color: '#b8dcff'
    });
    hint.setAlpha(0);

    zone.on('pointerover', () => {
      hint.setAlpha(1);
      gsap.to(hint, { duration: 0.15, alpha: 1 });
      this.statusLine.setText(`${this.state.selectedVerb} ${label}`);
    });

    zone.on('pointerout', () => {
      gsap.to(hint, { duration: 0.2, alpha: 0 });
      this.statusLine.setText('');
    });

    zone.on('pointerdown', () => {
      this.playClick();
      onAction(this.state.selectedVerb, this.state.selectedInventory);
      this.refreshUi();
    });

    return { key, zone };
  }

  buildHotspots() {
    this.hotspots = this.room.hotspots.map((hotspot) => this.makeHotspot({
      ...hotspot,
      onAction: (verb, item) => {
        if (hotspot.key === 'cat') {
          if (verb === 'Look at') this.statusLine.setText('A very serious cat scientist.');
          else if (verb === 'Talk to') this.statusLine.setText('"Bring me fish and I shall power the machine."');
          else this.statusLine.setText('Professor Nibbles flicks his tail unimpressed.');
          return;
        }

        if (hotspot.key === 'shelf') {
          if (verb === 'Look at') {
            this.statusLine.setText(this.state.flags.fishPicked ? 'A fish used to be here.' : 'There is a suspiciously fresh fish on the shelf.');
            return;
          }

          if (verb === 'Pick up' && !this.state.flags.fishPicked) {
            this.state.flags.fishPicked = true;
            this.state.addItem('fish');
            this.roomSprites.get('fish')?.setVisible(false);
            this.playPickup();
            return;
          }

          this.statusLine.setText('Nothing else useful happens.');
          return;
        }

        if (hotspot.key === 'machine') {
          if (verb === 'Look at') {
            this.statusLine.setText(this.state.flags.machinePowered ? 'The machine hums with feline energy.' : 'A machine waiting for a bio-snack input.');
            return;
          }

          if (verb === 'Use' && item === 'fish') {
            this.state.flags.machinePowered = true;
            this.state.removeItem('fish');
            this.roomSprites.get('machine')?.setTexture('sprite-machine-on');
            this.statusLine.setText('The fish powers the machine. A tunnel door opens!');
            this.playPickup();
            return;
          }

          this.statusLine.setText('The machine rejects your offering.');
        }
      }
    }));

    const machineGlow = this.add.rectangle(760, 188, 250, 220, 0x8bffbf, 0.08).setDepth(17);
    gsap.to(machineGlow, { alpha: 0.2, duration: 1, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }

  buildUiPanel() {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - UI_HEIGHT / 2, GAME_WIDTH, UI_HEIGHT, 0x19161c)
      .setDepth(UI_DEPTH)
      .setScrollFactor(0);
    this.add.line(0, ROOM_HEIGHT, 0, 0, GAME_WIDTH, 0, 0xf0b35a)
      .setOrigin(0, 0)
      .setDepth(UI_DEPTH + 1)
      .setScrollFactor(0);

    this.add.text(20, ROOM_HEIGHT + 44, 'Verbs', { fontSize: '20px', color: '#f7d17b' })
      .setDepth(UI_DEPTH + 1)
      .setScrollFactor(0);
    this.add.text(20, ROOM_HEIGHT + 108, 'Inventory', { fontSize: '20px', color: '#f7d17b' })
      .setDepth(UI_DEPTH + 1)
      .setScrollFactor(0);

    VERBS.forEach((verb, index) => {
      const button = this.makeUiButton(130 + index * 150, ROOM_HEIGHT + 48, 138, 38, verb, () => {
        this.state.setVerb(verb);
        this.playClick();
        this.refreshUi();
      });
      this.verbButtons.push({ verb, ...button });
    });
  }

  makeUiButton(x, y, width, height, label, onClick) {
    const bg = this.add.rectangle(x, y, width, height, 0x382f3f)
      .setStrokeStyle(2, 0x8a7ba1)
      .setDepth(UI_DEPTH + 2)
      .setScrollFactor(0);
    const text = this.add.text(x, y, label, {
      fontSize: '16px',
      color: '#f8eede',
      align: 'center'
    }).setOrigin(0.5)
      .setDepth(UI_DEPTH + 3)
      .setScrollFactor(0);

    bg.setInteractive({ useHandCursor: true });
    bg.on('pointerdown', onClick);
    bg.on('pointerover', () => gsap.to(bg, { fillColor: 0x5b4766, duration: 0.2 }));
    bg.on('pointerout', () => gsap.to(bg, { fillColor: 0x382f3f, duration: 0.2 }));

    return { bg, text };
  }

  refreshUi() {
    this.verbButtons.forEach((button) => {
      const selected = button.verb === this.state.selectedVerb;
      button.bg.setFillStyle(selected ? 0x6f4f86 : 0x382f3f);
      button.bg.setStrokeStyle(2, selected ? 0xf7d17b : 0x8a7ba1);
    });

    this.inventoryButtons.forEach((button) => {
      button.bg.destroy();
      button.text.destroy();
    });
    this.inventoryButtons = [];

    const items = this.state.inventory.length > 0 ? this.state.inventory : ['(empty)'];
    items.forEach((item, index) => {
      const button = this.makeUiButton(180 + index * 160, ROOM_HEIGHT + 112, 145, 36, item, () => {
        if (item === '(empty)') return;
        this.state.selectItem(item);
        this.playClick();
        this.refreshUi();
      });

      if (item === this.state.selectedInventory) {
        button.bg.setFillStyle(0x2f6c6d);
        button.bg.setStrokeStyle(2, 0x93f6da);
      }

      if (item === '(empty)') {
        button.bg.disableInteractive();
        button.bg.setFillStyle(0x2a2932);
        button.text.setColor('#8e93a1');
      }

      this.inventoryButtons.push(button);
    });
  }

  wireCameraParallax() {
    this.input.on('pointermove', (pointer) => {
      const cameraPanPadding = this.room.cameraPanPadding ?? 0;
      const minX = GAME_WIDTH / 2;
      const maxX = this.room.worldWidth - GAME_WIDTH / 2;
      const normalized = Phaser.Math.Clamp((pointer.x - cameraPanPadding) / (GAME_WIDTH - cameraPanPadding * 2), 0, 1);
      this.pointerTargetX = Phaser.Math.Linear(minX, maxX, normalized);
    });
  }

  getStickerTextureKey(textureKey, stickerIndex = 0) {
    const stickerKey = `${textureKey}__sticker_${stickerIndex}`;
    if (this.textures.exists(stickerKey)) {
      return stickerKey;
    }

    const stickerBounds = this.getStickerBounds(textureKey)[stickerIndex];
    if (!stickerBounds) {
      return textureKey;
    }

    const { minX, minY, width, height } = stickerBounds;
    const sourceImage = this.textures.get(textureKey).getSourceImage();
    const stickerCanvas = document.createElement('canvas');
    stickerCanvas.width = width;
    stickerCanvas.height = height;

    stickerCanvas
      .getContext('2d')
      .drawImage(sourceImage, minX, minY, width, height, 0, 0, width, height);

    this.textures.addCanvas(stickerKey, stickerCanvas);
    return stickerKey;
  }

  getFramedTextureKey(textureKey, frame, explicitKey = null) {
    const frameKey = explicitKey ?? `${textureKey}__frame_${frame.x}_${frame.y}_${frame.width}_${frame.height}`;
    if (this.textures.exists(frameKey)) {
      return frameKey;
    }

    const sourceImage = this.textures.get(textureKey).getSourceImage();
    const frameCanvas = document.createElement('canvas');
    frameCanvas.width = frame.width;
    frameCanvas.height = frame.height;

    frameCanvas
      .getContext('2d')
      .drawImage(
        sourceImage,
        frame.x,
        frame.y,
        frame.width,
        frame.height,
        0,
        0,
        frame.width,
        frame.height
      );

    this.textures.addCanvas(frameKey, frameCanvas);
    return frameKey;
  }

  getSheetCellTextureKey(textureKey, sheet) {
    const { columns, rows, index = 0, trim = false } = sheet;
    const cellKey = `${textureKey}__sheet_${columns}x${rows}_${index}_${trim ? 'trim' : 'raw'}`;
    if (this.textures.exists(cellKey)) {
      return cellKey;
    }

    const sourceImage = this.textures.get(textureKey).getSourceImage();
    const cellWidth = Math.floor(sourceImage.width / columns);
    const cellHeight = Math.floor(sourceImage.height / rows);
    const cellX = (index % columns) * cellWidth;
    const cellY = Math.floor(index / columns) * cellHeight;

    const rawCellKey = `${textureKey}__sheet_${columns}x${rows}_${index}_raw_source`;
    const rawTextureKey = this.textures.exists(rawCellKey)
      ? rawCellKey
      : this.getFramedTextureKey(textureKey, {
          x: cellX,
          y: cellY,
          width: cellWidth,
          height: cellHeight
        }, rawCellKey);

    if (!trim) {
      if (rawTextureKey !== cellKey && !this.textures.exists(cellKey)) {
        const rawImage = this.textures.get(rawTextureKey).getSourceImage();
        this.textures.addCanvas(cellKey, rawImage);
      }
      return cellKey;
    }

    return this.getTrimmedOpaqueTextureKey(rawTextureKey, cellKey);
  }

  getTrimmedOpaqueTextureKey(textureKey, targetKey = `${textureKey}__trimmed`) {
    if (this.textures.exists(targetKey)) {
      return targetKey;
    }

    const sourceImage = this.textures.get(textureKey).getSourceImage();
    const canvas = document.createElement('canvas');
    canvas.width = sourceImage.width;
    canvas.height = sourceImage.height;

    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(sourceImage, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;

    let minX = canvas.width;
    let minY = canvas.height;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < canvas.height; y += 1) {
      for (let x = 0; x < canvas.width; x += 1) {
        const alpha = imageData[(y * canvas.width + x) * 4 + 3];
        if (alpha <= 10) {
          continue;
        }

        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }

    if (maxX < minX || maxY < minY) {
      return textureKey;
    }

    const trimmedCanvas = document.createElement('canvas');
    const trimmedWidth = maxX - minX + 1;
    const trimmedHeight = maxY - minY + 1;
    trimmedCanvas.width = trimmedWidth;
    trimmedCanvas.height = trimmedHeight;

    trimmedCanvas
      .getContext('2d')
      .drawImage(sourceImage, minX, minY, trimmedWidth, trimmedHeight, 0, 0, trimmedWidth, trimmedHeight);

    this.textures.addCanvas(targetKey, trimmedCanvas);
    return targetKey;
  }

  getChromaKeyTextureKey(textureKey, chromaKey) {
    const { r, g, b, tolerance = 0 } = chromaKey;
    const chromaTextureKey = `${textureKey}__ck_${r}_${g}_${b}_${tolerance}`;
    if (this.textures.exists(chromaTextureKey)) {
      return chromaTextureKey;
    }

    const sourceImage = this.textures.get(textureKey).getSourceImage();
    const canvas = document.createElement('canvas');
    canvas.width = sourceImage.width;
    canvas.height = sourceImage.height;

    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(sourceImage, 0, 0);

    const image = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = image.data;

    for (let index = 0; index < data.length; index += 4) {
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];

      if (
        Math.abs(red - r) <= tolerance &&
        Math.abs(green - g) <= tolerance &&
        Math.abs(blue - b) <= tolerance
      ) {
        data[index + 3] = 0;
      }
    }

    context.putImageData(image, 0, 0);
    this.textures.addCanvas(chromaTextureKey, canvas);
    return chromaTextureKey;
  }

  getStickerBounds(textureKey) {
    if (!this.stickerBoundsCache) {
      this.stickerBoundsCache = new Map();
    }

    if (this.stickerBoundsCache.has(textureKey)) {
      return this.stickerBoundsCache.get(textureKey);
    }

    const sourceImage = this.textures.get(textureKey).getSourceImage();
    const canvas = document.createElement('canvas');
    canvas.width = sourceImage.width;
    canvas.height = sourceImage.height;

    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(sourceImage, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const width = canvas.width;
    const height = canvas.height;
    const visited = new Uint8Array(width * height);
    const alphaThreshold = 10;
    const minPixels = 120;
    const bounds = [];

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const index = y * width + x;
        if (visited[index]) {
          continue;
        }

        visited[index] = 1;
        if (imageData[index * 4 + 3] <= alphaThreshold) {
          continue;
        }

        const queue = [index];
        let head = 0;
        let pixels = 0;
        let minX = x;
        let minY = y;
        let maxX = x;
        let maxY = y;

        while (head < queue.length) {
          const current = queue[head];
          head += 1;

          const cx = current % width;
          const cy = Math.floor(current / width);
          pixels += 1;
          minX = Math.min(minX, cx);
          minY = Math.min(minY, cy);
          maxX = Math.max(maxX, cx);
          maxY = Math.max(maxY, cy);

          for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
            for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
              if (offsetX === 0 && offsetY === 0) {
                continue;
              }

              const nx = cx + offsetX;
              const ny = cy + offsetY;
              if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
                continue;
              }

              const neighbor = ny * width + nx;
              if (visited[neighbor]) {
                continue;
              }

              visited[neighbor] = 1;
              if (imageData[neighbor * 4 + 3] > alphaThreshold) {
                queue.push(neighbor);
              }
            }
          }
        }

        if (pixels >= minPixels) {
          bounds.push({
            minX,
            minY,
            maxX,
            maxY,
            width: maxX - minX + 1,
            height: maxY - minY + 1,
            pixels
          });
        }
      }
    }

    bounds.sort((left, right) => right.pixels - left.pixels);
    this.stickerBoundsCache.set(textureKey, bounds);
    return bounds;
  }

  update() {
    const camera = this.cameras.main;
    const targetScrollX = Phaser.Math.Clamp(this.pointerTargetX - GAME_WIDTH / 2, 0, this.room.worldWidth - GAME_WIDTH);
    camera.scrollX = Phaser.Math.Linear(camera.scrollX, targetScrollX, 0.07);
  }

  playClick() {
    this.sfx.click?.play();
  }

  playPickup() {
    this.sfx.pickup?.play();
  }
}

const config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game-container',
  backgroundColor: '#111111',
  scene: [LabScene],
  pixelArt: true
};

new Phaser.Game(config);
