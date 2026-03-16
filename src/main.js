const GAME_WIDTH = 960;
const GAME_HEIGHT = 640;
const UI_HEIGHT = 170;
const ROOM_HEIGHT = GAME_HEIGHT - UI_HEIGHT;

const VERBS = ['Walk to', 'Look at', 'Pick up', 'Use', 'Talk to'];

class AdventureState {
  constructor(statusCallback) {
    this.selectedVerb = 'Walk to';
    this.selectedInventory = null;
    this.inventory = [];
    this.flags = {
      shelfOpened: false,
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
  }

  preload() {
    this.load.audio('uiClick', 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    this.load.audio('pickup', 'https://assets.mixkit.co/active_storage/sfx/209/209-preview.mp3');
  }

  create() {
    this.statusLine = this.add.text(18, ROOM_HEIGHT + 10, 'Welcome to Cat Mansion Lab.', {
      fontFamily: 'Trebuchet MS',
      fontSize: '20px',
      color: '#fcefcf'
    });

    this.state = new AdventureState((message) => {
      this.statusLine.setText(message);
    });

    this.buildRoomBackdrop();
    this.buildHotspots();
    this.buildUiPanel();

    this.sfx.click = new Howl({ src: [this.cache.audio.get('uiClick').url], volume: 0.3 });
    this.sfx.pickup = new Howl({ src: [this.cache.audio.get('pickup').url], volume: 0.35 });

    gsap.from(this.cameras.main, { duration: 0.6, alpha: 0, ease: 'power2.out' });
    this.refreshUi();
  }

  buildRoomBackdrop() {
    this.add.rectangle(GAME_WIDTH / 2, ROOM_HEIGHT / 2, GAME_WIDTH, ROOM_HEIGHT, 0x293341);
    this.add.rectangle(120, 130, 180, 220, 0x4a5f77).setStrokeStyle(3, 0x7fc2ff);
    this.add.text(48, 36, 'Cat Mansion Lab', {
      fontFamily: 'Trebuchet MS',
      fontSize: '32px',
      color: '#f5d48b'
    });

    const cat = this.add.ellipse(740, 260, 110, 130, 0xd38f64).setStrokeStyle(2, 0x2f231d);
    this.add.text(695, 324, 'Professor Nibbles', { fontSize: '18px', color: '#f9f4de' });

    gsap.to(cat, { y: 255, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
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
    this.hotspots = [
      this.makeHotspot({
        key: 'cat',
        x: 742,
        y: 258,
        width: 120,
        height: 146,
        label: 'Professor Nibbles',
        onAction: (verb) => {
          if (verb === 'Look at') this.statusLine.setText('A very serious cat scientist.');
          else if (verb === 'Talk to') this.statusLine.setText('"Bring me fish and I shall power the machine."');
          else this.statusLine.setText('Professor Nibbles flicks his tail unimpressed.');
        }
      }),
      this.makeHotspot({
        key: 'shelf',
        x: 120,
        y: 130,
        width: 180,
        height: 220,
        label: 'Dusty Shelf',
        onAction: (verb) => {
          if (verb === 'Look at') {
            this.statusLine.setText(this.state.flags.shelfOpened ? 'A fish can used to be here.' : 'There is a suspiciously fresh fish on the shelf.');
            return;
          }

          if (verb === 'Pick up' && !this.state.flags.fishPicked) {
            this.state.flags.fishPicked = true;
            this.state.addItem('fish');
            this.playPickup();
            return;
          }

          this.statusLine.setText('Nothing else useful happens.');
        }
      }),
      this.makeHotspot({
        key: 'machine',
        x: 450,
        y: 170,
        width: 230,
        height: 190,
        label: 'Purr Machine',
        onAction: (verb, item) => {
          if (verb === 'Look at') {
            this.statusLine.setText(this.state.flags.machinePowered ? 'The machine hums with feline energy.' : 'A machine waiting for a bio-snack input.');
            return;
          }

          if (verb === 'Use' && item === 'fish') {
            this.state.flags.machinePowered = true;
            this.state.removeItem('fish');
            this.statusLine.setText('The fish powers the machine. A tunnel door opens!');
            this.playPickup();
            return;
          }

          this.statusLine.setText('The machine rejects your offering.');
        }
      })
    ];

    const machineGlow = this.add.rectangle(450, 170, 230, 190, 0x8bffbf, 0.08);
    gsap.to(machineGlow, { alpha: 0.2, duration: 1, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }

  buildUiPanel() {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - UI_HEIGHT / 2, GAME_WIDTH, UI_HEIGHT, 0x19161c);
    this.add.line(0, ROOM_HEIGHT, 0, 0, GAME_WIDTH, 0, 0xf0b35a).setOrigin(0, 0);

    this.add.text(20, ROOM_HEIGHT + 44, 'Verbs', { fontSize: '20px', color: '#f7d17b' });
    this.add.text(20, ROOM_HEIGHT + 108, 'Inventory', { fontSize: '20px', color: '#f7d17b' });

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
    const bg = this.add.rectangle(x, y, width, height, 0x382f3f).setStrokeStyle(2, 0x8a7ba1);
    const text = this.add.text(x, y, label, {
      fontSize: '16px',
      color: '#f8eede',
      align: 'center'
    }).setOrigin(0.5);

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
  scene: [LabScene]
};

new Phaser.Game(config);
