import MainScene from './mainScene';
import * as configs from './../game';

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        this.load.image('install', 'assets/buttons/install.png');
        this.load.image('install-focus', 'assets/buttons/install-focus.png');
        this.load.image('start', 'assets/buttons/start.png');
        this.load.image('start-focus', 'assets/buttons/start-focus.png');
    }

    create() {
        console.log('Start preloadScreen');
        this.cameras.main.fadeIn(1000, 0, 128, 128);
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

        this.scale.autoCenter = Phaser.Scale.Center.CENTER_BOTH;
        this.scale.setGameSize(800, 600).getParentBounds();
        this.scale.displaySize.resize(800, 600);
        this.physics.world.setBounds(0, 0, 800, 600);

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        let install = this.add.sprite(screenCenterX + 240 / 2, 200, 'install').setInteractive();
        install.setOrigin(1, 1);

        let start = this.add.sprite(screenCenterX + 240 / 2, 400, 'start').setInteractive();
        start.setOrigin(1, 1);

        install.on(Phaser.Input.Events.POINTER_OVER, () => {
            install.setTexture('install-focus');
        });
        install.on(Phaser.Input.Events.POINTER_OUT, () => {
            install.setTexture('install');
        });
        install.on(Phaser.Input.Events.POINTER_DOWN, () => {
            install.setTexture('install');
        });
        install.on(Phaser.Input.Events.POINTER_UP, () => {
            let htmlBody: HTMLElement | null = document.getElementById('htmlBody');
            if (htmlBody) htmlBody.style.backgroundColor = configs.mainSceneBackground;

            this.scale.autoCenter = Phaser.Scale.Center.CENTER_BOTH;
            this.scale.setGameSize(window.innerWidth, window.innerHeight).getParentBounds();
            this.scale.displaySize.resize(window.innerWidth, window.innerHeight);
            this.physics.world.setBounds(0, 0, window.innerWidth, window.innerHeight);

            this.scene.start('MainScene');
        });

        start.on(Phaser.Input.Events.POINTER_OVER, () => {
            start.setTexture('start-focus');
        });
        start.on(Phaser.Input.Events.POINTER_OUT, () => {
            start.setTexture('start');
        });
        start.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.scene.add('MainScene', MainScene);
            this.scene.start('MainScene');
        });
    }
}
