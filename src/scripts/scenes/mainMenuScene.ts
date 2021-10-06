import 'phaser';

declare var game: Phaser.Game;
declare var beforeinstallevent: any;
declare function runningStandalone(): boolean;

class BouncingText {
    text: string;
    startLetters(): Array<number> {
        return [0];
    }
}
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

    letterDistance: number = 21;
    gravity: number = 4300;
    letters: Array<Phaser.GameObjects.Text> = [];
    letterYDistance: number = 2;
    bounceY: number = 0.8;
    currentBouncingText: number = -1;
    colors: string[] = ['33ff33', '3399ff', 'ff3333', 'fff833'];
    changeText = false;

    bouncingTexts: Array<BouncingText> = [
        {
            text: 'Move the hero with W,A,S,D keys and use SPACE for interactions with the game items.',
            startLetters(): Array<number> {
                return [this.text.length / 2];
            }
        },
        {
            text: 'This is a demo project for CoderDojo clubs. It was build for București Nord Dojo.',
            startLetters(): Array<number> {
                return [0];
            }
        },
        {
            text: 'The project is built using TypeScript language and Phaser game engine.',
            startLetters(): Array<number> {
                return [this.text.length - 1];
            }
        },
        {
            text: 'Start working on the project by editing the GameScene class in /src/scenes folder.',
            startLetters(): Array<number> {
                return [this.text.length / 4, (this.text.length / 4) * 3];
            }
        },
        {
            text: 'CoderDojo -The community of 2379 free, open and local programming clubs for young people',
            startLetters(): Array<number> {
                let fallLetters: Array<number> = [];
                for (let a = 0; a < this.text.length; a++) {
                    if (a % 4 == 0) {
                        fallLetters.push(a);
                    }
                }
                return fallLetters;
            }
        }
    ];

    image: Phaser.GameObjects.Image;
    install: Phaser.GameObjects.Sprite | null;

    constructor() {
        super({ key: 'MainMenuScene' });
        // var mediaQueryList = window.matchMedia('(orientation: portrait)');

        // mediaQueryList.addEventListener('change', (m) => {
        //     if (m.matches) {
        //         this.resizeCanvas();
        //     } else {
        //         this.resizeCanvas();
        //     }
        // });

        // Phaser.Scenes.Events.POST_UPDATE
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

        // const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        let title = this.add.image(this.screenCenterX, 100, 'title');
        title.setOrigin(0.5, 0);

        this.setInnteractiveButtons();

        // this.rect = this.add.rectangle(0, 1070, 1920, 1, 0x008080);
        // this.physics.add.existing(this.rect);
        // this.rect.setOrigin(0, 1);
        // (this.rect.body as Phaser.Physics.Arcade.Body).setImmovable(true);

        // let rect2 = this.add.rectangle(0 + 20, 10, 1920 - 40, 2, 0x1c0000);
        // rect2.setOrigin(0, 1);

        this.startText();

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

    startText() {
        this.currentBouncingText++;
        if (this.currentBouncingText >= this.bouncingTexts.length) {
            this.currentBouncingText = 0;
        }
        for (var i = 0; i < this.letters.length; i++) {
            this.letters[i].destroy();
        }
        this.letters = [];
        this.printText(this.bouncingTexts[this.currentBouncingText].text);

        for (var i = 0; i < this.bouncingTexts[this.currentBouncingText].startLetters().length; i++) {
            (this.letters[Math.round(this.bouncingTexts[this.currentBouncingText].startLetters()[i])].body as Phaser.Physics.Arcade.Body).setGravityY(this.gravity);
        }
    }

    printText(text: string) {
        for (var i = 0; i < text.length; i++) {
            let letterX: number = this.screenCenterX + this.letterDistance * (i - text.length / 2);
            this.printLetter(text.charAt(i), letterX);
        }
    }

    printLetter(letter: string, letterX: number) {
        let text = this.add.text(0, 760, letter);
        this.letters.push(text);
        text.setX(letterX);
        text.setColor('#' + this.colors[Math.floor(Math.random() * this.colors.length)]);
        text.setFontSize(44);
        text.setStroke('#000000', 4);
        text.setFontFamily('"VT323"');
        // text.setFontStyle('bold');
        text.setOrigin(0, 1);

        this.physics.world.setBoundsCollision(true, true, true, true);
        this.physics.add.existing(text);
        // this.physics.add.collider(this.rect, text);

        (text.body as Phaser.Physics.Arcade.Body).setGravityY(0);
        (text.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
        (text.body as Phaser.Physics.Arcade.Body).setBounceY(this.bounceY);
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
            this.scene.start('Level1');
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
        let isMoving = false;
        for (var i = 0; i < this.letters.length; i++) {
            let letterBody = this.letters[i].body as Phaser.Physics.Arcade.Body;
            if (!letterBody.onFloor()) {
                isMoving = true;
            }
            if (i > 0) {
                let leftBody = this.letters[i - 1].body as Phaser.Physics.Arcade.Body;
                if (letterBody.gravity.y > 0 && leftBody.top + this.letterYDistance < letterBody.top) {
                    leftBody.setGravityY(this.gravity);
                }
            }
            if (i < this.letters.length - 1) {
                let rightBody = this.letters[i + 1].body as Phaser.Physics.Arcade.Body;
                if (letterBody.gravity.y > 0 && rightBody.top + this.letterYDistance < letterBody.top) {
                    rightBody.setGravityY(this.gravity);
                }
            }
        }
        if (!isMoving && !this.changeText) {
            this.changeText = true;
            this.time.delayedCall(3000, () => {
                this.startText();
                this.changeText = false;
            });
        }

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
