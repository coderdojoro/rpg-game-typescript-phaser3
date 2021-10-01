import * as configs from './../game';

declare var beforeinstallevent: any;
declare var serviceWorkerState: string;
declare var appInstalled: boolean;
declare function runningStandalone(): boolean;
//declare var phaserConfiguration: any;
//declare var game: Phaser.Game;

export default class PreloadScene extends Phaser.Scene {
    install: Phaser.GameObjects.Sprite | null;
    launch: Phaser.GameObjects.Sprite | null;

    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        this.load.image('install', 'assets/buttons/install.png');
        this.load.image('install-focus', 'assets/buttons/install-focus.png');
        this.load.image('start', 'assets/buttons/start-browser.png');
        this.load.image('start-focus', 'assets/buttons/start-browser-focus.png');
        this.load.image('launch', 'assets/buttons/launch.png');
        this.load.image('launch-focus', 'assets/buttons/launch-focus.png');
    }

    create() {
        console.log('Start preloadScreen');
        this.cameras.main.fadeIn(1000, 0, 128, 128);

        this.windowResized(false);

        window.addEventListener('resize', () => this.windowResized(true), false);
        window.addEventListener('orientationchange', () => this.windowResized(true), false); // Look at the missing parentheses.

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

        // if (runningStandalone()) {
        //     this.runGame();
        //     return;
        // }

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;

        let start = this.add.sprite(screenCenterX, 310, 'start').setInteractive();
        start.setOrigin(0.5, 1);

        start.on(Phaser.Input.Events.POINTER_OVER, () => {
            start.setTexture('start-focus');
        });
        start.on(Phaser.Input.Events.POINTER_OUT, () => {
            start.setTexture('start');
        });
        start.on(Phaser.Input.Events.POINTER_DOWN, () => {
            start.setTexture('start');
        });
        start.on(Phaser.Input.Events.POINTER_UP, () => {
            start.setTexture('start-focus');
            this.runGame();
        });
    }

    preDestroy(): void {
        //window.removeEventListener('resize', this.resizeListener);
    }

    windowResized(restart) {
        console.log('canvas resized' + Math.random());
        //this.scale.scaleMode = Phaser.ScaleModes.SHOW_ALL;

        // let canvas: HTMLElement | null = document.getElementById('htmlBody');
        // let htmlCanvas: HTMLCollectionOf<HTMLElementTagNameMap[keyof HTMLElementTagNameMap]> = document.getElementsByTagName('canvas');
        // //image-rendering: pixelated; margin-left: 279px; margin-top: 184px;
        // htmlCanvas[0].style.imageRendering = 'pixelated';
        // htmlCanvas[0].style.marginLeft = '0';
        // htmlCanvas[0].style.marginTop = '0';

        // htmlCanvas[0].style.width = String(window.innerWidth);
        // htmlCanvas[0].style.height = String(window.innerHeight);
        // if (this.scale) this.scale.autoCenter = Phaser.Scale.Center.CENTER_BOTH;
        // if (this.scale) this.scale.setGameSize(window.innerWidth, window.innerHeight).getParentBounds();
        // if (this.scale) this.scale.displaySize.resize(window.innerWidth, window.innerHeight);
        // if (this.scale) this.physics.world.setBounds(0, 0, window.innerWidth, window.innerHeight);

        // var canvas: HTMLElement | null = document.querySelector('canvas');
        // var windowWidth = window.innerWidth;
        // var windowHeight = window.innerHeight;
        // var windowRatio = windowWidth / windowHeight;
        // var gameRatio = window.innerWidth / window.innerHeight;
        // (<HTMLElement>canvas).style.marginLeft = '0';
        // (<HTMLElement>canvas).style.marginTop = '0';
        // if (windowRatio < gameRatio) {
        //     (<HTMLElement>canvas).style.width = String((<HTMLElement>canvas).offsetWidth) + 'px';
        //     (<HTMLElement>canvas).style.height = String((<HTMLElement>canvas).offsetHeight) + 'px';
        // } else {
        //     (<HTMLElement>canvas).style.width = windowHeight * gameRatio + 'px';
        //     (<HTMLElement>canvas).style.height = windowHeight + 'px';
        // }
        // this.scene.start('PreloadScene');
        // this.scale.scaleMode = Phaser.ScaleModes.SHOW_ALL;

        let htmlCanvas: HTMLCollectionOf<HTMLCanvasElement> = document.getElementsByTagName('canvas');
        //image-rendering: pixelated; margin-left: 279px; margin-top: 184px;
        htmlCanvas[0].style.imageRendering = 'pixelated';
        htmlCanvas[0].style.marginLeft = '0';
        htmlCanvas[0].style.marginTop = '0';
        // htmlCanvas[0].style.width = String(window.innerWidth);
        // htmlCanvas[0].style.height = String(window.innerHeight);
        htmlCanvas[0].style.width = '100%';
        htmlCanvas[0].style.height = '100%';
        // ...then set the internal size to match
        htmlCanvas[0].width = htmlCanvas[0].offsetWidth;
        htmlCanvas[0].height = htmlCanvas[0].offsetHeight;
        if (this.scale) this.scale.autoCenter = Phaser.Scale.Center.CENTER_BOTH;
        if (this.scale) this.scale.setGameSize(window.innerWidth, window.innerHeight).getParentBounds();
        // if (this.scale) this.scale.displaySize.resize(window.innerWidth, window.innerHeight);
        if (this.scale) this.physics.world.setBounds(0, 0, window.innerWidth, window.innerHeight);
        console.log('restart' + !restart);
        if (!restart) {
            this.scene.restart();
        }
    }
    // resize() {
    //     console.log('ewasize v2');

    //     var canvas: HTMLElement | null = document.querySelector('canvas');
    //     var windowWidth = window.innerWidth;
    //     var windowHeight = window.innerHeight;
    //     var windowRatio = windowWidth / windowHeight;
    //     var gameRatio = window.innerWidth / window.innerHeight;

    //     (<HTMLElement>canvas).style.marginLeft = '0';
    //     (<HTMLElement>canvas).style.marginTop = '0';

    //     if (windowRatio < gameRatio) {
    //         (<HTMLElement>canvas).style.width = windowWidth + 'px';
    //         (<HTMLElement>canvas).style.height = windowWidth / gameRatio + 'px';
    //     } else {
    //         (<HTMLElement>canvas).style.width = windowHeight * gameRatio + 'px';
    //         (<HTMLElement>canvas).style.height = windowHeight + 'px';
    //     }
    //     // this.scene.start('MainMenuScene');
    // }

    runGame() {
        // this.scale.autoCenter = Phaser.Scale.Center.CENTER_BOTH;
        // this.scale.setGameSize(window.innerWidth, window.innerHeight).getParentBounds();
        // this.scale.displaySize.resize(window.innerWidth, window.innerHeight);
        // this.scale.scaleMode = Phaser.Scale.ScaleModes.FIT;
        // this.physics.world.setBounds(0, 0, window.innerWidth, window.innerHeight);
        this.scene.start('MainMenuScene');
    }

    update() {
        // if (runningStandalone()) {
        //     this.runGame();
        //     return;
        // }

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
