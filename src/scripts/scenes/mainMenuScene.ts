import 'phaser';
import BouncyText from '../objects/bouncyText';

declare var game: Phaser.Game;
declare var beforeinstallevent: any;
declare function runningStandalone(): boolean;

export default class MainMenuScene extends Phaser.Scene {
    play: Phaser.GameObjects.Sprite;
    character: Phaser.GameObjects.Sprite;
    options: Phaser.GameObjects.Sprite;
    credits: Phaser.GameObjects.Sprite;

    buttonDistance = 100;
    firstButtonY = 150;
    buttonsX = 400;

    screenCenterX: number;
    rect: Phaser.GameObjects.Rectangle;

    image: Phaser.GameObjects.Image;
    install: Phaser.GameObjects.Sprite | null;

    bouncyText: BouncyText = new BouncyText(this);

    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        this.load.image('play', 'assets/mainMenu/buttons/play.png');
        this.load.image('play-focus', 'assets/mainMenu/buttons/play-focus.png');

        this.load.image('install', 'assets/mainMenu/buttons/install.png');
        this.load.image('install-focus', 'assets/mainMenu/buttons/install-focus.png');
        this.load.image('launch', 'assets/mainMenu/buttons/launch.png');
        this.load.image('launch-focus', 'assets/mainMenu/buttons/launch-focus.png');

        this.load.image('character', 'assets/mainMenu/buttons/character.png');
        this.load.image('character-focus', 'assets/mainMenu/buttons/character-focus.png');
        this.load.image('options', 'assets/mainMenu/buttons/options.png');
        this.load.image('options-focus', 'assets/mainMenu/buttons/options-focus.png');
        this.load.image('credits', 'assets/mainMenu/buttons/credits.png');
        this.load.image('credits-focus', 'assets/mainMenu/buttons/credits-focus.png');

        this.load.image('bg', 'assets/mainMenu/background.jpg');
        this.load.image('title', 'assets/mainMenu/title-bg.png');
    }

    create() {
        this.cameras.main.fadeIn();

        this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;

        let w: number = 0;
        let h: number = 0;
        while (w <= 1920) {
            while (h <= 1080) {
                let image = this.add.image(w, h, 'bg');
                image.setOrigin(0, 0);
                h = h + 400;
            }
            h = 0;
            w = w + 400;
        }

        let title = this.add.image(this.screenCenterX, 100, 'title');
        title.setOrigin(0.5, 0);

        this.setInnteractiveButtons();

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

    setInnteractiveButtons() {
        this.play = this.add.sprite(this.buttonsX, this.firstButtonY, 'play').setInteractive();
        this.play.setOrigin(1, 0);
        this.play.on(Phaser.Input.Events.POINTER_OVER, () => {
            this.play.setTexture('play-focus');
        });
        this.play.on(Phaser.Input.Events.POINTER_OUT, () => {
            this.play.setTexture('play');
        });
        this.play.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.play.setTexture('play');
        });
        this.play.on(Phaser.Input.Events.POINTER_UP, () => {
            this.play.setTexture('play-focus');
            this.scene.start('GameScene');
        });

        this.character = this.add.sprite(this.buttonsX, this.firstButtonY + this.buttonDistance, 'character').setInteractive();
        this.character.setOrigin(1, 0);
        this.character.on(Phaser.Input.Events.POINTER_OVER, () => {
            this.character.setTexture('character-focus');
        });
        this.character.on(Phaser.Input.Events.POINTER_OUT, () => {
            this.character.setTexture('character');
        });
        this.character.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.character.setTexture('character');
        });
        this.character.on(Phaser.Input.Events.POINTER_UP, () => {
            this.character.setTexture('character-focus');
            this.scene.start('VillageScene');
            this.cameras.main.fadeOut(1000, 0, 0, 0);
        });

        this.options = this.add.sprite(this.buttonsX, this.firstButtonY + this.buttonDistance * 2, 'options').setInteractive();
        this.options.setOrigin(1, 0);
        this.options.on(Phaser.Input.Events.POINTER_OVER, () => {
            this.options.setTexture('options-focus');
        });
        this.options.on(Phaser.Input.Events.POINTER_OUT, () => {
            this.options.setTexture('options');
        });
        this.options.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.options.setTexture('options');
        });
        this.options.on(Phaser.Input.Events.POINTER_UP, () => {
            this.options.setTexture('options-focus');
        });

        this.credits = this.add.sprite(this.buttonsX, this.firstButtonY + this.buttonDistance * 3, 'credits').setInteractive();
        this.credits.setOrigin(1, 0);
        this.credits.on(Phaser.Input.Events.POINTER_OVER, () => {
            this.credits.setTexture('credits-focus');
        });
        this.credits.on(Phaser.Input.Events.POINTER_OUT, () => {
            this.credits.setTexture('credits');
        }); //
        this.credits.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.credits.setTexture('credits');
        });
        this.credits.on(Phaser.Input.Events.POINTER_UP, () => {
            this.credits.setTexture('credits-focus');
        });
    }

    update(time, delta) {
        this.bouncyText.update();

        if (this.install && runningStandalone()) {
            this.install.destroy();
            this.install = null;
        }

        if (beforeinstallevent && !this.install && !runningStandalone()) {
            this.install = this.add.sprite(this.buttonsX, this.firstButtonY - this.buttonDistance, 'install').setInteractive();
            this.install.setOrigin(1, 0);
            this.install.on(Phaser.Input.Events.POINTER_OVER, () => {
                (<Phaser.GameObjects.Sprite>this.install).setTexture('install-focus');
            });
            this.install.on(Phaser.Input.Events.POINTER_OUT, () => {
                (<Phaser.GameObjects.Sprite>this.install).setTexture('install');
            });
            this.install.on(Phaser.Input.Events.POINTER_DOWN, () => {
                (<Phaser.GameObjects.Sprite>this.install).setTexture('install');
            });
            this.install.on(Phaser.Input.Events.POINTER_UP, () => {
                console.log('click install');
                console.log(beforeinstallevent);
                (<Phaser.GameObjects.Sprite>this.install).setTexture('install-focus');
                //if (serviceWorkerState === 'activated') {
                beforeinstallevent.prompt();
                //}
            });
        }
    }
}
