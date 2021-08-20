import PhaserLogo from '../objects/phaserLogo';
import FpsText from '../objects/fpsText';

export default class MainScene extends Phaser.Scene {
    fpsText;
    logo1;
    logo1Tween;

    constructor() {
        super({ key: 'MainScene' });
        console.log('!!!!!!!!!!!!!!!constructor');
    }

    preload() {
        this.load.image('phaser-logo', 'assets/img/phaser-logo.png');
        this.load.image('logo1', 'assets/img/coder-1.png');
        this.load.image('logo2', 'assets/img/coder-2.png');
    }

    create() {
        this.cameras.main.fadeIn();
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

        this.cameras.main.fadeIn(2000);
        this.cameras.main.setBackgroundColor(0xeeeeff);

        // var rect = this.add.rectangle(20, 20, 1240, 680, 0xeeeeff);
        // rect.setOrigin(0, 0);
        // rect.setStrokeStyle(6, 0x8888ff);

        this.logo1 = this.physics.add.image(130, 380, 'logo1');
        this.logo1.setScale(0.3);
        this.logo1.body.setAllowGravity(false);

        const logo2 = this.add.sprite(130, 380, 'logo2');
        logo2.setScale(0.3);

        var tween = this.tweens.add({
            targets: this.logo1,
            angle: 360.0,
            duration: 3500,
            repeat: -1
        });

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        var txt = this.add.text(screenCenterX, 290, 'Bine ati venit la atelierele CoderDojo!');
        txt.setOrigin(0.5, 0.5);
        txt.setColor('#8888ff');
        txt.setFontFamily('VT323');
        txt.setFontSize(60);

        var txt = this.add.text(screenCenterX, 350, '- JavaScript cu Phaser 3 -');
        txt.setOrigin(0.5, 0.5);
        txt.setColor('#0000ff');
        txt.setFontFamily('VT323');
        txt.setFontSize(40);

        // new PhaserLogo(this, this.cameras.main.width / 2, 0);
        // this.fpsText = new FpsText(this);

        // display the Phaser.VERSION
        this.add
            .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
                color: '#000000',
                fontSize: '24px'
            })
            .setOrigin(1, 0);

        this.fpsText = this.add.text(10, 10, '', { color: 'black', fontSize: '28px' });
        this.fpsText.setOrigin(0);
    }

    update(time, delta) {
        this.fpsText.setText(`fps: ${Math.floor(this.game.loop.actualFps)}`);

        // console.log('update');
        // this.fpsText.preupdate();
        // var pointer = this.input.activePointer;
        // if (pointer.isDown) {
        //     if (this.logo1Tween) {
        //         this.logo1Tween.stop();
        //         this.logo1Tween = undefined;
        //     }
        //     var distance = Phaser.Math.Distance.Between(this.logo1.x, this.logo1.y, pointer.x, pointer.y);
        //     if (this.logo1.body.speed > 0 && distance < 50) {
        //         this.logo1.body.reset(pointer.x, pointer.y);
        //     } else {
        //         this.physics.moveToObject(this.logo1, pointer, 1540);
        //     }
        // } else {
        //     if (this.logo1Tween === undefined) {
        //         this.logo1.body.velocity.setTo(0, 0);
        //         this.logo1Tween = this.tweens.add({
        //             targets: this.logo1,
        //             x: 130,
        //             y: 380,
        //             duration: 3000,
        //             ease: 'Elastic',
        //             easeParams: [1.5, 0.5]
        //         });
        //     }
        // }
    }
}
