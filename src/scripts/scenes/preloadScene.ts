import MainScene from './mainScene';
import * as configs from './../game';

declare var beforeinstallevent: any;
declare var serviceWorkerState: string;
declare var appInstalled: boolean;
declare function runningStandalone(): boolean;

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    install: Phaser.GameObjects.Sprite | null;
    launch: Phaser.GameObjects.Sprite | null;

    preload() {
        this.load.image('install', 'assets/buttons/install.png');
        this.load.image('install-focus', 'assets/buttons/install-focus.png');
        this.load.image('start', 'assets/buttons/start.png');
        this.load.image('start-focus', 'assets/buttons/start-focus.png');
        this.load.image('launch', 'assets/buttons/launch.png');
        this.load.image('launch-focus', 'assets/buttons/launch-focus.png');
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

        if (runningStandalone()) {
            this.runGame();
            return;
        }

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;

        let start = this.add.sprite(screenCenterX + 240 / 2, 310, 'start').setInteractive();
        start.setOrigin(1, 1);

        start.on(Phaser.Input.Events.POINTER_OVER, () => {
            start.setTexture('start-focus');
        });
        start.on(Phaser.Input.Events.POINTER_OUT, () => {
            start.setTexture('start');
        });
        start.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.runGame();
        });
    }

    runGame() {
        let htmlBody: HTMLElement | null = document.getElementById('htmlBody');
        if (htmlBody) htmlBody.style.backgroundColor = configs.mainSceneBackground;
        this.scale.autoCenter = Phaser.Scale.Center.CENTER_BOTH;
        this.scale.setGameSize(window.innerWidth, window.innerHeight).getParentBounds();
        this.scale.displaySize.resize(window.innerWidth, window.innerHeight);
        this.scale.scaleMode = Phaser.Scale.ScaleModes.FIT;
        this.physics.world.setBounds(0, 0, window.innerWidth, window.innerHeight);
        this.scene.start('MainScene');
    }

    update() {
        if (runningStandalone()) {
            this.runGame();
            return;
        }

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;

        if (beforeinstallevent && !this.install) {
            this.launch = null;
            this.install = this.add.sprite(screenCenterX + 240 / 2, 200, 'install').setInteractive();
            this.install.setOrigin(1, 1);

            this.install.on(Phaser.Input.Events.POINTER_OVER, () => {
                (<Phaser.GameObjects.Sprite>this.install).setTexture('install-focus');
            });
            this.install.on(Phaser.Input.Events.POINTER_OUT, () => {
                (<Phaser.GameObjects.Sprite>this.install).setTexture('install');
            });
            this.install.on(Phaser.Input.Events.POINTER_DOWN, () => {
                (<Phaser.GameObjects.Sprite>this.install).setTexture('install');
            });

            console.log('appInstalled: ' + appInstalled);
            this.install.on(Phaser.Input.Events.POINTER_UP, () => {
                console.log('click install');
                console.log(beforeinstallevent);
                console.log('[PWA] state on install button click:' + serviceWorkerState);
                (<Phaser.GameObjects.Sprite>this.install).setTexture('install-focus');
                if (serviceWorkerState === 'activated') {
                    beforeinstallevent.prompt();
                }
            });
        }
        if (!beforeinstallevent && !this.launch) {
            this.install = null;
            this.launch = this.add.sprite(screenCenterX + 240 / 2, 200, 'launch').setInteractive();
            this.launch.setOrigin(1, 1);

            this.launch.on(Phaser.Input.Events.POINTER_OVER, () => {
                (<Phaser.GameObjects.Sprite>this.launch).setTexture('launch-focus');
            });
            this.launch.on(Phaser.Input.Events.POINTER_OUT, () => {
                (<Phaser.GameObjects.Sprite>this.launch).setTexture('launch');
            });
            this.launch.on(Phaser.Input.Events.POINTER_DOWN, () => {
                (<Phaser.GameObjects.Sprite>this.launch).setTexture('launch');
            });

            console.log('appInstalled: ' + appInstalled);
            this.launch.removeListener(Phaser.Input.Events.POINTER_UP);
            this.launch.on(Phaser.Input.Events.POINTER_UP, () => {
                (<Phaser.GameObjects.Sprite>this.launch).setTexture('launch-focus');
                window.open('https://phaser-rpg.herokuapp.com/');
            });
        }
    }
}
