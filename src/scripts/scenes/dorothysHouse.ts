import * as configs from '../game';
import { ToolbarItem } from './toolbarItem';

export default class DorothysHouse extends Phaser.Scene {
    cursors;
    hero;

    toolbarItems: Array<ToolbarItem> = [];
    toolbar: Phaser.GameObjects.Image;
    life: Phaser.GameObjects.Image;

    popupGraphics?: Phaser.GameObjects.Graphics;
    popupText?: Phaser.GameObjects.Text;
    spaceKey: Phaser.Input.Keyboard.Key;

    constructor() {
        super({ key: 'DorothysHouse' });
    }

    preload() {
        this.load.image('interiorTiles', 'assets/tilesets/interior-tileset.png');
        this.load.image('toolbar', 'assets/toolbar.png');
        this.load.spritesheet('life-spritesheet', 'assets/life.png', { frameWidth: 47, frameHeight: 42 });

        this.load.spritesheet('objects-tileset-spritesheet', 'assets/tilesets/objects-tileset.png', { frameWidth: 32, frameHeight: 32 });

        this.load.tilemapTiledJSON('dorothysHouseMap', 'assets/tilemaps/dorothysHouse.json');
        this.load.atlas('atlas', 'assets/atlas/atlas.png', 'assets/atlas/atlas.json');
    }

    create() {
        //TODO: temporary the first scene:
        // remove the loading screen
        let loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('transparent');
            this.time.addEvent({
                delay: 1000,
                callback: () => {
                    // @ts-ignore
                    loadingScreen.remove();
                }
            });
        }

        const map: Phaser.Tilemaps.Tilemap = this.make.tilemap({ key: 'dorothysHouseMap' });

        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        const tileset = map.addTilesetImage('ground', 'interiorTiles', 16, 16, 0, 0);
        const objectsTileset = map.addTilesetImage('objects', 'objects-tileset-spritesheet', 32, 32, 0, 0);

        // Parameters: layer name (or index) from Tiled, tileset, x, y
        const belowLayer = map.createLayer('Below hero', tileset, 0, 0);
        const objectsBelowLayer = map.createLayer('Objects below hero', tileset, 0, 0);
        const worldLayer = map.createLayer('World', tileset, 0, 0);
        const aboveWorldLayer = map.createLayer('Objects above world', tileset, 0, 0);
        const aboveLayer = map.createLayer('Above hero', tileset, 0, 0);

        // worldLayer.setCollisionByProperty({ collides: true });
        worldLayer.setCollisionBetween(tileset.firstgid, tileset.firstgid + tileset.total, true);

        // By default, everything gets depth sorted on the screen in the order we created things. Here, we
        // want the "Above this.hero" layer to sit on top of the this.hero, so we explicitly give it a depth.
        // Higher depths will sit on top of lower depth objects.
        aboveLayer.setDepth(10);

        // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
        // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
        const spawnPoint = map.findObject('Objects', (obj) => obj.name === 'Spawn Point');

        // Create a sprite with physics enabled via the physics system. The image used for the sprite has
        // a bit of whitespace, so I'm using setSize & setOffset to control the size of the this.hero's body.
        this.hero = this.physics.add
            .sprite(spawnPoint.x as number, spawnPoint.y as number, 'atlas', 'misa-front')
            .setSize(30, 40)
            .setOffset(0, 24);
        this.hero.setDepth(9);

        // Watch the this.hero and worldLayer for collisions, for the duration of the scene:
        this.physics.add.collider(this.hero, worldLayer);

        this.physics.world.setBoundsCollision(true, true, true, true);

        let animObjects: Phaser.Types.Tilemaps.TiledObject[] = map.filterObjects('Objects', (obj: any) => {
            let tileInTileset: any = objectsTileset.getTileProperties(obj.gid);
            if (tileInTileset && tileInTileset.animated === true) {
                return true;
            }
            return false;
        });

        for (let animObject of animObjects) {
            let spritesheetName: string = (objectsTileset.getTileProperties(animObject.gid!)! as any).spritesheet;
            let width: number = (objectsTileset.getTileProperties(animObject.gid!)! as any).width;
            let height: number = (objectsTileset.getTileProperties(animObject.gid!)! as any).height;
            this.load.spritesheet(spritesheetName + '-spritesheet', 'assets/objects/' + spritesheetName, { frameWidth: width, frameHeight: height });

            this.load.once(Phaser.Loader.Events.COMPLETE, () => {
                this.anims.create({
                    key: spritesheetName + '-anim',
                    frames: this.anims.generateFrameNumbers(spritesheetName + '-spritesheet', {}),
                    frameRate: 7,
                    repeat: -1
                });
                let object = this.physics.add.sprite(animObject.x!, animObject.y!, spritesheetName + '-spritesheet', animObject.gid! - objectsTileset.firstgid);
                object.setOrigin(0, 1);
                object.anims.play(spritesheetName + '-anim');
                object.setName(spritesheetName);
                object.body.immovable = true;
                object.body.setAllowGravity(false);
                this.physics.add.overlap(
                    this.hero,
                    object,
                    (hero: Phaser.Types.Physics.Arcade.GameObjectWithBody, sprite: Phaser.Types.Physics.Arcade.GameObjectWithBody) => {
                        if (this.popupGraphics) {
                            return;
                        }
                        if (sprite.name == 'key-white.png') {
                            this.popupMessage('Ai găsit o cheie!', sprite.body.x, sprite.body.y, 190, 50);
                            sprite.destroy();
                            this.toolbarItems.push({
                                name: 'key',
                                image: this.add.image(
                                    this.cameras.main.worldView.x + 745 + this.toolbarItems.length * 32,
                                    this.cameras.main.worldView.y + 1065,
                                    'objects-tileset-spritesheet',
                                    0
                                )
                            });
                            this.toolbarItems[this.toolbarItems.length - 1].image.setOrigin(0, 1);
                            this.toolbarItems[this.toolbarItems.length - 1].image.setDepth(110);
                        }
                    },
                    undefined,
                    this.hero
                );
            });
        }

        this.load.start();

        // Create the this.hero's walking animations from the texture atlas. These are stored in the global
        // animation manager so any sprite can access them.
        this.anims.create({
            key: 'misa-left-walk',
            frames: this.anims.generateFrameNames('atlas', {
                prefix: 'misa-left-walk.',
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'misa-right-walk',
            frames: this.anims.generateFrameNames('atlas', {
                prefix: 'misa-right-walk.',
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'misa-front-walk',
            frames: this.anims.generateFrameNames('atlas', {
                prefix: 'misa-front-walk.',
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'misa-back-walk',
            frames: this.anims.generateFrameNames('atlas', {
                prefix: 'misa-back-walk.',
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });

        const camera = this.cameras.main;
        camera.startFollow(this.hero);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        (this.hero.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);

        this.toolbar = this.add.image(this.cameras.main.worldView.x + this.cameras.main.width / 2, this.cameras.main.worldView.y + 1080, 'toolbar');
        this.toolbar.setOrigin(0.5, 1);
        this.toolbar.setDepth(100);
        this.physics.add.existing(this.toolbar);
        this.physics.add.collider(this.hero, this.toolbar);
        (this.toolbar.body as Phaser.Physics.Arcade.Body).setImmovable(true);

        this.life = this.add.image(this.cameras.main.worldView.x + 100, this.cameras.main.worldView.y + 1080, 'life-spritesheet', 0);
        this.life.setOrigin(0, 1);
        this.life.setDepth(110);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    popupMessage(text: string, x: number, y: number, w: number, h: number) {
        this.popupGraphics = this.add.graphics();
        this.popupGraphics.lineStyle(4, 0xc0c0c0, 1);
        this.popupGraphics.fillStyle(0x272822, 1);
        this.popupGraphics.setDepth(10);
        this.popupGraphics.fillRoundedRect(x - 5, y - h - 5, w + 10, h + 10, 32);
        this.popupGraphics.strokeRoundedRect(x, y - h, w, h, 32);

        let style: Phaser.Types.GameObjects.Text.TextStyle = {
            fontSize: '24px',
            fontStyle: 'normal',
            strokeThickness: 0,
            fontFamily: 'Lobster',
            align: 'left',
            wordWrap: { width: w - 30, useAdvancedWrap: true }
        };
        this.popupText = this.add.text(x + 15, y - h + 10, text, style);
        this.popupText.setDepth(15);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(time, delta) {
        if (this.popupGraphics) {
            if (this.spaceKey.isDown) {
                this.popupGraphics.destroy();
                this.popupText!.destroy();
                this.popupGraphics = undefined;
                this.popupText = undefined;
            }
            this.hero.body.setVelocity(0);
            this.hero.anims.stop();
            return;
        }

        this.toolbar.setPosition(this.cameras.main.worldView.x + this.cameras.main.width / 2, this.cameras.main.worldView.y + 1080);
        this.life.setPosition(this.cameras.main.worldView.x + 651, this.cameras.main.worldView.y + 1071);
        this.life.setTexture('life-spritesheet', 5);

        for (let a = 0; a < this.toolbarItems.length; a++) {
            this.toolbarItems[a].image.setPosition(this.cameras.main.worldView.x + 745 + a * 32, this.cameras.main.worldView.y + 1065);
        }

        const speed = 175;
        const prevVelocity = this.hero.body.velocity.clone();

        // Stop any previous movement from the last frame
        this.hero.body.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown) {
            this.hero.body.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.hero.body.setVelocityX(speed);
        }

        // Vertical movement
        if (this.cursors.up.isDown) {
            this.hero.body.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.hero.body.setVelocityY(speed);
        }

        // Normalize and scale the velocity so that this.hero can't move faster along a diagonal
        this.hero.body.velocity.normalize().scale(speed);

        // Update the animation last and give left/right animations precedence over up/down animations
        if (this.cursors.left.isDown) {
            this.hero.anims.play('misa-left-walk', true);
        } else if (this.cursors.right.isDown) {
            this.hero.anims.play('misa-right-walk', true);
        } else if (this.cursors.up.isDown) {
            this.hero.anims.play('misa-back-walk', true);
        } else if (this.cursors.down.isDown) {
            this.hero.anims.play('misa-front-walk', true);
        } else {
            this.hero.anims.stop();

            // If we were moving, pick and idle frame to use
            if (prevVelocity.x < 0) this.hero.setTexture('atlas', 'misa-left');
            else if (prevVelocity.x > 0) this.hero.setTexture('atlas', 'misa-right');
            else if (prevVelocity.y < 0) this.hero.setTexture('atlas', 'misa-back');
            else if (prevVelocity.y > 0) this.hero.setTexture('atlas', 'misa-front');
        }
    }
}
