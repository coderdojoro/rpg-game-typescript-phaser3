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

        //this.scale.resize(2024, 768);

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        let install = this.add.sprite(screenCenterX, 200, 'install').setInteractive();
        install.setOrigin(1, 1);

        let start = this.add.sprite(screenCenterX, 400, 'start').setInteractive();
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
            this.scene.start('MainScene');
        });
        const yt = this.textures.get('install');
        yt.setFilter(Phaser.Textures.FilterMode.LINEAR);

        start.on(Phaser.Input.Events.POINTER_OVER, () => {
            start.setTexture('start-focus');
        });
        start.on(Phaser.Input.Events.POINTER_OUT, () => {
            start.setTexture('start');
        });
        start.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.scene.start('MainScene');
        });

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
    }
}
