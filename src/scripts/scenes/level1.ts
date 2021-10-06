import * as configs from './../game';

export default class Level1 extends Phaser.Scene {
    cursors;
    hero;

    constructor() {
        super({ key: 'Level1' });
    }

    preload() {
        this.load.image('tiles', 'assets/tilesets/ground-tileset.png');
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/town.json');
        this.load.atlas('atlas', 'assets/atlas/atlas.png', 'assets/atlas/atlas.json');
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });

        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        const tileset = map.addTilesetImage('tuxmon-sample-32px-extruded', 'tiles', 32, 32, 1, 2);

        // Parameters: layer name (or index) from Tiled, tileset, x, y
        const belowLayer = map.createLayer('Below hero', tileset, 0, 0);
        const objectsBelowLayer = map.createLayer('Objects below hero', tileset, 0, 0);
        const worldLayer = map.createLayer('World', tileset, 0, 0);
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

        // Watch the this.hero and worldLayer for collisions, for the duration of the scene:
        this.physics.add.collider(this.hero, worldLayer);

        // Create the this.hero's walking animations from the texture atlas. These are stored in the global
        // animation manager so any sprite can access them.
        const anims = this.anims;
        anims.create({
            key: 'misa-left-walk',
            frames: anims.generateFrameNames('atlas', {
                prefix: 'misa-left-walk.',
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'misa-right-walk',
            frames: anims.generateFrameNames('atlas', {
                prefix: 'misa-right-walk.',
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'misa-front-walk',
            frames: anims.generateFrameNames('atlas', {
                prefix: 'misa-front-walk.',
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'misa-back-walk',
            frames: anims.generateFrameNames('atlas', {
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

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update(time, delta) {
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
