import * as configs from '../game';
import { ToolbarItem } from '../objects/toolbarItem';
import Dog from '../sprites/dog';

export default class VillageScene extends Phaser.Scene {
    keyLeft: Phaser.Input.Keyboard.Key;
    keyRight: Phaser.Input.Keyboard.Key;
    keyUp: Phaser.Input.Keyboard.Key;
    keyDown: Phaser.Input.Keyboard.Key;
    keyFire: Phaser.Input.Keyboard.Key;

    hero: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    heroState = 'idle';

    toolbarItems: Array<ToolbarItem> = [];
    toolbar: Phaser.GameObjects.Image;
    life: Phaser.GameObjects.Image;

    popupGraphics?: Phaser.GameObjects.Graphics;
    popupText?: Phaser.GameObjects.Text;
    spaceKey: Phaser.Input.Keyboard.Key;

    map: Phaser.Tilemaps.Tilemap;

    constructor() {
        super({ key: 'VillageScene' });
    }

    preload() {
        this.load.image('tiles', 'assets/tilesets/ground-tileset.png');
        this.load.image('toolbar', 'assets/toolbar.png');
        this.load.spritesheet('life-spritesheet', 'assets/life.png', { frameWidth: 47, frameHeight: 42 });

        this.load.spritesheet('objects-tileset-spritesheet', 'assets/tilesets/objects-tileset.png', { frameWidth: 32, frameHeight: 32 });

        this.load.tilemapTiledJSON('map', 'assets/tilemaps/town.json');

        this.load.spritesheet('hero-idle-aggro-E-spritesheet', 'assets/hero/idle_aggro_E.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-idle-aggro-N-spritesheet', 'assets/hero/idle_aggro_N.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-idle-aggro-S-spritesheet', 'assets/hero/idle_aggro_S.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-walk-aggro-E-spritesheet', 'assets/hero/walk_aggro_E.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-walk-aggro-N-spritesheet', 'assets/hero/walk_aggro_N.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-walk-aggro-S-spritesheet', 'assets/hero/walk_aggro_S.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-atk-heavy-E-spritesheet', 'assets/hero/atk_heavy_E.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-atk-heavy-N-spritesheet', 'assets/hero/atk_heavy_N.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-atk-heavy-S-spritesheet', 'assets/hero/atk_heavy_S.png', { frameWidth: 128, frameHeight: 128 });
    }

    create() {
        this.cameras.main.fadeIn();

        this.map = this.make.tilemap({ key: 'map' });

        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        const tileset = this.map.addTilesetImage('ground', 'tiles', 32, 32, 1, 2);
        const objectsTileset = this.map.addTilesetImage('objects', 'objects-tileset-spritesheet', 32, 32, 0, 0);

        // Parameters: layer name (or index) from Tiled, tileset, x, y
        const belowLayer = this.map.createLayer('Below hero', tileset, 0, 0);
        const objectsBelowLayer = this.map.createLayer('Objects below hero', tileset, 0, 0);
        const worldLayer = this.map.createLayer('World', tileset, 0, 0);
        const aboveLayer = this.map.createLayer('Above hero', tileset, 0, 0);

        // worldLayer.setCollisionByProperty({ collides: true });
        worldLayer.setCollisionBetween(tileset.firstgid, tileset.firstgid + tileset.total, true);

        // By default, everything gets depth sorted on the screen in the order we created things. Here, we
        // want the "Above this.hero" layer to sit on top of the this.hero, so we explicitly give it a depth.
        // Higher depths will sit on top of lower depth objects.
        aboveLayer.setDepth(10);

        // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
        // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
        const spawnPoint = this.map.findObject('Objects', (obj) => obj.name === 'Spawn Point');

        // Create a sprite with physics enabled via the physics system. The image used for the sprite has
        // a bit of whitespace, so I'm using setSize & setOffset to control the size of the this.hero's body.
        this.hero = this.physics.add.sprite(spawnPoint.x as number, spawnPoint.y as number, 'hero-walk-aggro-S-spritesheet', 0);
        this.hero.setSize(15, 35);
        this.hero.setOffset(57, 49);
        this.hero.setScale(1.4);

        this.hero.setDepth(9);
        this.hero.setOrigin(0.5, 0.5);

        // Watch the this.hero and worldLayer for collisions, for the duration of the scene:
        this.physics.add.collider(this.hero, worldLayer);

        this.physics.world.setBoundsCollision(true, true, true, true);

        const dorothyDoor = this.map.findObject('Objects', (obj) => obj.name === "Dorothy's House");
        let dorothyDoorTile: Phaser.Tilemaps.Tile = worldLayer.getTileAtWorldXY(dorothyDoor.x!, dorothyDoor.y!);
        worldLayer.setTileLocationCallback(
            dorothyDoorTile.x - 1,
            dorothyDoorTile.y,
            2,
            1,
            (hero, tile) => {
                if (this.popupGraphics) {
                    return;
                }
                let found = this.toolbarItems.find((element) => element.name === 'key');
                if (found) {
                    this.scene.sleep(this);
                    this.scene.launch('DorothysHouseScene');
                    this.cameras.main.fadeOut(1000, 0, 0, 0);
                } else {
                    this.popupMessage(
                        'Dorothy și-a pierdut cheia și nu poate intra în casă. Poți să o ajuți să își găsească cheia?',
                        dorothyDoorTile.pixelX,
                        dorothyDoorTile.pixelY,
                        300,
                        150
                    );
                }
            },
            this
        );

        let animObjects: Phaser.Types.Tilemaps.TiledObject[] = this.map.filterObjects('Objects', (obj: any) => {
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
            key: 'hero-idle-aggro-E-anim',
            frames: this.anims.generateFrameNumbers('hero-idle-aggro-E-spritesheet', {}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'hero-idle-aggro-N-anim',
            frames: this.anims.generateFrameNumbers('hero-idle-aggro-N-spritesheet', {}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'hero-idle-aggro-S-anim',
            frames: this.anims.generateFrameNumbers('hero-idle-aggro-S-spritesheet', {}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'hero-walk-aggro-E-anim',
            frames: this.anims.generateFrameNumbers('hero-walk-aggro-E-spritesheet', {}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'hero-walk-aggro-N-anim',
            frames: this.anims.generateFrameNumbers('hero-walk-aggro-N-spritesheet', {}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'hero-walk-aggro-S-anim',
            frames: this.anims.generateFrameNumbers('hero-walk-aggro-S-spritesheet', {}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'hero-atk-heavy-E-anim',
            frames: this.anims.generateFrameNumbers('hero-atk-heavy-E-spritesheet', {}),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'hero-atk-heavy-N-anim',
            frames: this.anims.generateFrameNumbers('hero-atk-heavy-N-spritesheet', {}),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'hero-atk-heavy-S-anim',
            frames: this.anims.generateFrameNumbers('hero-atk-heavy-S-spritesheet', {}),
            frameRate: 10,
            repeat: 0
        });

        this.hero.anims.play('hero-idle-aggro-S-anim');

        const camera = this.cameras.main;
        camera.startFollow(this.hero);
        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
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

        this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyFire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        let dog: Phaser.Types.Tilemaps.TiledObject = this.map.findObject('Objects', (obj) => obj.name === 'Dog');

        let dogSprite = new Dog(dog.x!, dog.y!, this, this.hero, this.map);

        // map.forEachTile((t: Phaser.Tilemaps.Tile) => {
        //     let tile = t as Phaser.Tilemaps.Tile & PathNode;
        //     console.log(tile.x + ', ' + tile.y);
        //     tile.cost = -1;
        // });

        // let tile = map.getTileAt(1, 1) as Phaser.Tilemaps.Tile & PathNode;
        // console.log(tile.x + ', ' + tile.y);

        // this.pathsMatrix = new Array(this.map.width).fill(new Array(this.map.height).fill(-1));
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

        if (
            this.keyFire.isDown &&
            (this.heroState == 'walk-E' || this.heroState == 'idle-E' || this.heroState == 'walk-W' || this.heroState == 'idle-W') &&
            !this.heroState.startsWith('atk-')
        ) {
            this.hero.anims.play('hero-atk-heavy-E-anim');
            this.heroState = 'atk-E';
            this.hero.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.heroState = 'idle-E';
                this.hero.anims.play('hero-idle-aggro-E-anim');
            });
        }

        if (this.keyFire.isDown && (this.heroState == 'walk-N' || this.heroState == 'idle-N') && !this.heroState.startsWith('atk-')) {
            this.hero.anims.play('hero-atk-heavy-N-anim');
            this.heroState = 'atk-N';
            this.hero.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.heroState = 'idle-N';
                this.hero.anims.play('hero-idle-aggro-N-anim');
            });
        }

        if (this.keyFire.isDown && (this.heroState == 'walk-S' || this.heroState == 'idle-S') && !this.heroState.startsWith('atk-')) {
            this.hero.anims.play('hero-atk-heavy-S-anim');
            this.heroState = 'atk-S';
            this.hero.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.heroState = 'idle-S';
                this.hero.anims.play('hero-idle-aggro-S-anim');
            });
        }

        console.log(this.heroState);
        if (this.heroState.startsWith('atk-')) {
            return;
        }

        // Update the animation last and give left/right animations precedence over up/down animations
        if (this.keyLeft.isDown) {
            this.hero.body.setVelocityX(-speed);
            this.hero.setFlipX(true);
            this.hero.anims.play('hero-walk-aggro-E-anim', true);
            this.heroState = 'walk-W';
        } else if (this.keyRight.isDown) {
            this.hero.body.setVelocityX(speed);
            this.hero.setFlipX(false);
            this.hero.anims.play('hero-walk-aggro-E-anim', true);
            this.heroState = 'walk-E';
        } else if (this.keyUp.isDown) {
            this.hero.body.setVelocityY(-speed);
            this.hero.anims.play('hero-walk-aggro-N-anim', true);
            this.heroState = 'walk-N';
        } else if (this.keyDown.isDown) {
            this.hero.body.setVelocityY(speed);
            this.hero.anims.play('hero-walk-aggro-S-anim', true);
            this.heroState = 'walk-S';
        } else {
            if (this.heroState == 'walk-E' || this.heroState == 'walk-W') {
                this.hero.anims.play('hero-idle-aggro-E-anim', true);
            } else if (this.heroState == 'walk-N') {
                this.hero.anims.play('hero-idle-aggro-N-anim', true);
            } else if (this.heroState == 'walk-S') {
                this.hero.anims.play('hero-idle-aggro-S-anim', true);
            }
            if (this.heroState == 'walk-N') {
                this.heroState = 'idle-N';
            } else if (this.heroState == 'walk-S') {
                this.heroState = 'idle-S';
            } else if (this.heroState == 'walk-E') {
                this.heroState = 'idle-E';
            } else if (this.heroState == 'walk-W') {
                this.heroState = 'idle-W';
            }
        }
        // Normalize and scale the velocity so that this.hero can't move faster along a diagonal
        this.hero.body.velocity.normalize().scale(speed);
    }
}
