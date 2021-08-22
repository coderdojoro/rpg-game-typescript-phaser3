import * as configs from './../game';

export default class MainScene extends Phaser.Scene {
    fpsText: Phaser.GameObjects.Text;
    logo1: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        this.load.image('phaser-logo', 'assets/img/phaser-logo.png');
        this.load.image('logo1', 'assets/img/coder-1.png');
        this.load.image('logo2', 'assets/img/coder-2.png');
        this.load.image('phaser', 'assets/img/phaser-dude.png');
        this.load.image('fps', 'assets/img/fps.png');
    }

    create() {
        this.cameras.main.fadeIn(2000);
        this.cameras.main.setBackgroundColor(configs.mainSceneBackground);

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.logo1 = this.physics.add.image(screenCenterX, 500, 'logo1');
        this.logo1.setOrigin(0.5, 0.5);
        this.logo1.setScale(0.3);
        this.logo1.body.setAllowGravity(false);

        const logo2 = this.add.sprite(screenCenterX, 500, 'logo2');
        logo2.setScale(0.3);

        var tween = this.tweens.add({
            targets: this.logo1,
            angle: 360.0,
            duration: 8500,
            repeat: -1
        });

        var txt = this.add.text(screenCenterX, 290, 'Bine ati venit la atelierele CoderDojo!');
        txt.setOrigin(0.5, 1);
        txt.setColor('#8888ff');
        txt.setFontFamily('VT323');
        txt.setFontSize(60);

        var txt = this.add.text(screenCenterX, 350, '- Phaser 3 în TypeSript -');
        txt.setOrigin(0.5, 1);
        txt.setColor('#0000ff');
        txt.setFontFamily('VT323');
        txt.setFontSize(40);

        // display the Phaser.VERSION
        let dude = this.physics.add.image(this.cameras.main.width - 265, 40, 'phaser');
        dude.setOrigin(1, 0.5);

        this.add
            .text(this.cameras.main.width - 15, 40, `Phaser v${Phaser.VERSION}`, {
                color: '#0000ff',
                fontSize: '28px',
                fontStyle: 'bold'
            })
            .setOrigin(1, 0.5);

        let fps = this.physics.add.image(15, 40, 'fps');
        fps.setOrigin(0, 0.5);

        this.fpsText = this.add.text(90, 40, '', { color: '#0000ff', fontSize: '28px', fontStyle: 'bold' });
        this.fpsText.setOrigin(0, 0.5);
    }

    update(time, delta) {
        this.fpsText.setText(`fps: ${Math.floor(this.game.loop.actualFps)}`);
    }
}
