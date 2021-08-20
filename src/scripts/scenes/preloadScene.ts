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
        /**
         * This is how you would dynamically import the mainScene class (with code splitting),
         * add the mainScene to the Scene Manager
         * and start the scene.
         * The name of the chunk would be 'mainScene.chunk.js
         * Find more about code splitting here: https://webpack.js.org/guides/code-splitting/
         */
        // let someCondition = true
        // if (someCondition)
        //   import(/* webpackChunkName: "mainScene" */ './mainScene').then(mainScene => {
        //     this.scene.add('MainScene', mainScene.default, true)
        //   })
        // else console.log('The mainScene class will not even be loaded by the browser')

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
            if (htmlBody) htmlBody.style.backgroundColor = configs.preloadScene.backgroundColor;

            this.scale.autoCenter = Phaser.Scale.Center.CENTER_BOTH;
            this.scale.setGameSize(window.innerWidth, window.innerHeight).getParentBounds();
            this.scale.displaySize.resize(window.innerWidth, window.innerHeight);
            this.physics.world.setBounds(0, 0, window.innerWidth, window.innerHeight);

            // this.game.scale.scaleMode = Phaser.Scale.NONE;
            // this.game.scale.updateCenter();

            // this.game.scale.pageAlignVertically = true;

            this.scene.start('MainScene', {
                name: 'MainScene',
                x: 0,
                y: 0,
                width: this.scene.systems.scale.width,
                height: this.scene.systems.scale.height,
                zoom: 1,
                rotation: 0,
                scrollX: 0,
                scrollY: 0,
                roundPixels: false,
                visible: true,
                backgroundColor: false,
                bounds: null // {x, y, width, height}
            });

            const mainSceneData = {
                key: 'MainScene',
                active: true,
                visible: true,
                pack: undefined,
                cameras: {
                    name: 'MainCamera',
                    x: 0,
                    y: 0,
                    width: this.scene.systems.scale.width,
                    height: this.scene.systems.scale.height,
                    zoom: 1,
                    rotation: 0,
                    roundPixels: false,
                    scrollX: 0,
                    scrollY: 0,
                    backgroundColor: '#ff0000',
                    bounds: undefined
                }
            };

            // this.scene.remove();
            // this.scene.add('MainScene', mainSceneData, true);

            // let scene: Phaser.Scenes.ScenePlugin = this.scene.start('mainScene');
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
