export default class Dog extends Phaser.GameObjects.Sprite {
    constructor(x: number, y: number, scene: Phaser.Scene) {
        super(scene, x, y, scene.make.renderTexture({ width: 32, height: 32 }).texture);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);

        this.scene.load.spritesheet('dog-spritesheet', 'assets/objects/dog.png', { frameWidth: 32, frameHeight: 32 });
        this.scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
            this.scene.anims.create({
                key: 'dog-idle-down-anim',
                frames: this.scene.anims.generateFrameNumbers('dog-spritesheet', { start: 0, end: 2 }),
                frameRate: 10,
                repeat: -1
            });
            this.anims.play('dog-idle-down-anim');
        });
        this.scene.load.start();
    }
}
