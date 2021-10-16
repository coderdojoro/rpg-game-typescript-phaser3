import * as configs from '../game';
import { ToolbarItem } from '../objects/toolbarItem';
import Dog from '../sprites/dog';

class Node {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export default class VillageScene extends Phaser.Scene {
    cursors;
    hero;

    toolbarItems: Array<ToolbarItem> = [];
    toolbar: Phaser.GameObjects.Image;
    life: Phaser.GameObjects.Image;

    popupGraphics?: Phaser.GameObjects.Graphics;
    popupText?: Phaser.GameObjects.Text;
    spaceKey: Phaser.Input.Keyboard.Key;

    map: Phaser.Tilemaps.Tilemap;
    pathsMatrix: number[][];

    constructor() {
        super({ key: 'VillageScene' });
    }

    preload() {
        this.load.image('tiles', 'assets/tilesets/ground-tileset.png');
        this.load.image('toolbar', 'assets/toolbar.png');
        this.load.spritesheet('life-spritesheet', 'assets/life.png', { frameWidth: 47, frameHeight: 42 });

        this.load.spritesheet('objects-tileset-spritesheet', 'assets/tilesets/objects-tileset.png', { frameWidth: 32, frameHeight: 32 });

        this.load.tilemapTiledJSON('map', 'assets/tilemaps/town.json');
        this.load.atlas('atlas', 'assets/atlas/atlas.png', 'assets/atlas/atlas.json');
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
        this.hero = this.physics.add
            .sprite(spawnPoint.x as number, spawnPoint.y as number, 'atlas', 'misa-front')
            .setSize(30, 40)
            .setOffset(0, 24);
        this.hero.setDepth(9);

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

        this.cursors = this.input.keyboard.createCursorKeys();

        let dog: Phaser.Types.Tilemaps.TiledObject = this.map.findObject('Objects', (obj) => obj.name === 'Dog');

        let dogSprite = new Dog(dog.x!, dog.y!, this);

        let dogTile: Phaser.Math.Vector2 = this.map.worldToTileXY(dog.x!, dog.y!);
        let heroTile: Phaser.Math.Vector2 = this.map.worldToTileXY(spawnPoint.x!, spawnPoint.y!);

        // map.forEachTile((t: Phaser.Tilemaps.Tile) => {
        //     let tile = t as Phaser.Tilemaps.Tile & PathNode;
        //     console.log(tile.x + ', ' + tile.y);
        //     tile.cost = -1;
        // });

        // let tile = map.getTileAt(1, 1) as Phaser.Tilemaps.Tile & PathNode;
        // console.log(tile.x + ', ' + tile.y);

        // this.pathsMatrix = new Array(this.map.width).fill(new Array(this.map.height).fill(-1));

        this.pathsMatrix = new Array<Array<number>>();
        for (let x = 0; x < this.map.width; x++) {
            this.pathsMatrix[x] = new Array<number>();
            for (let y = 0; y < this.map.height; y++) {
                this.pathsMatrix[x][y] = -1;
            }
        }

        this.pathsMatrix[dogTile.x][dogTile.y] = 0;
        this.pathsMatrix[heroTile.x][heroTile.y] = -2;

        this.findCosts();
        let path = this.findPath(heroTile.x, heroTile.y);
        for (let node of path) {
            let coord = this.map.tileToWorldXY(node.x, node.y);
            let style: Phaser.Types.GameObjects.Text.TextStyle = {
                fontSize: '16px',
                fontStyle: 'normal',
                strokeThickness: 0,
                fontFamily: 'Lobster',
                align: 'left'
            };
            let text = this.add.text(coord.x + 16, coord.y + 16, '*', style);
        }
    }

    private findPath(heroX: number, heroY: number): Array<Node> {
        let lastX = heroX;
        let lastY = heroY;
        let cost = this.pathsMatrix[lastX][lastY];
        let path: Array<Node> = [];
        path.push(new Node(lastX, lastY));
        while (cost > 0) {
            cost--;
            let neighbors = this.getNeighbors(lastX, lastY);
            // console.log('find: ' + cost);
            for (let neighbor of neighbors) {
                // console.log(this.pathsMatrix[neighbor[0]][neighbor[1]]);
                if (this.pathsMatrix[neighbor.x][neighbor.y] == cost) {
                    lastX = neighbor.x;
                    lastY = neighbor.y;
                    path.push(new Node(lastX, lastY));
                    break;
                }
            }
        }
        return path.reverse();
    }

    private findCosts() {
        // let style: Phaser.Types.GameObjects.Text.TextStyle = {
        //     fontSize: '16px',
        //     fontStyle: 'normal',
        //     strokeThickness: 0,
        //     fontFamily: 'Lobster',
        //     align: 'left'
        // };

        let finished = false;
        let currentCost = 0;
        while (!finished) {
            finished = true;
            // console.log('loop');
            for (let x = 0; x < this.map.width; x++) {
                for (let y = 0; y < this.map.height; y++) {
                    if (this.pathsMatrix[x][y] == currentCost) {
                        finished = false;
                        let neighbors = this.getEmptyNeighbors(x, y);
                        for (let neighbor of neighbors) {
                            if (this.pathsMatrix[neighbor.x][neighbor.y] == -2) {
                                this.pathsMatrix[neighbor.x][neighbor.y] = currentCost + 1;
                                // let coord = this.map.tileToWorldXY(neighbor[0], neighbor[1]);
                                // let text = this.add.text(coord.x + 16, coord.y + 16, '[' + (currentCost + 1) + ']', style);
                                return;
                            }
                            this.pathsMatrix[neighbor.x][neighbor.y] = currentCost + 1;
                            // let coord = this.map.tileToWorldXY(neighbor[0], neighbor[1]);
                            // let text = this.add.text(coord.x + 16, coord.y + 16, '' + (currentCost + 1), style);
                        }
                    }
                }
            }
            currentCost++;
        }
    }

    getNeighbors(x: number, y: number): Array<Node> {
        let result = new Array();
        let anglePaths = new Array();
        if (y > 0) {
            if (x > 0) {
                anglePaths.push(new Node(x - 1, y - 1));
            }
            result.push(new Node(x, y - 1));
            if (x < this.map.width) {
                anglePaths.push(new Node(x + 1, y - 1));
            }
        }
        if (x > 0) {
            result.push(new Node(x - 1, y));
        }
        if (x < this.map.width) {
            result.push(new Node(x + 1, y));
        }
        if (y < this.map.height) {
            if (x > 0) {
                anglePaths.push(new Node(x - 1, y + 1));
            }
            result.push(new Node(x, y + 1));
            if (x < this.map.width) {
                anglePaths.push(new Node(x + 1, y + 1));
            }
        }
        result.push(...anglePaths);
        return result;
    }

    getEmptyNeighbors(x: number, y: number): Array<Node> {
        // console.log('found: ' + x + ', ' + y);
        let neighbors: Array<Node> = this.getNeighbors(x, y);
        let emptyNeighbors: Array<Node> = [];
        for (let a = 0; a < neighbors.length; a++) {
            let neighbor = neighbors[a];
            // console.log('N: ' + neighbor[0] + ', ' + neighbor[1]);
            if (this.pathsMatrix[neighbor.x][neighbor.y] < 0 && !this.map.getTileAt(neighbor.x, neighbor.y, false, 'World')) {
                // console.log('remove');
                emptyNeighbors.push(neighbor);
            }
        }
        return emptyNeighbors;
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