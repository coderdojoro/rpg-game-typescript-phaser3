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

    letterDistance: number = 23;
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
        this.load.image('play', 'assets/buttons/play.png');
        this.load.image('play-focus', 'assets/buttons/play-focus.png');

        this.load.image('install', 'assets/buttons/install.png');
        this.load.image('install-focus', 'assets/buttons/install-focus.png');
        this.load.image('launch', 'assets/buttons/launch.png');
        this.load.image('launch-focus', 'assets/buttons/launch-focus.png');

        this.load.image('character', 'assets/buttons/character.png');
        this.load.image('character-focus', 'assets/buttons/character-focus.png');
        this.load.image('options', 'assets/buttons/options.png');
        this.load.image('options-focus', 'assets/buttons/options-focus.png');
        this.load.image('credits', 'assets/buttons/credits.png');
        this.load.image('credits-focus', 'assets/buttons/credits-focus.png');

        this.load.image('bg', 'assets/background.jpg');
        this.load.image('title', 'assets/title-bg.png');
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
                console.log('h: ' + h);
            }
            h = 0;
            w = w + 400;
        }

        // const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        let title = this.add.image(this.screenCenterX, 100, 'title');
        title.setOrigin(0.5, 0);

        this.setInnteractiveButtons();

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
            let letterX: number = this.screenCenterX + (text.length * this.letterDistance) / 2 + i * this.letterDistance - text.length * this.letterDistance;
            this.printLetter(text.charAt(i), letterX);
        }
    }

    printLetter(letter: string, letterX: number) {
        let text = this.add.text(0, 770, letter);
        this.letters.push(text);
        text.setX(letterX);
        text.setColor('#' + this.colors[Math.floor(Math.random() * this.colors.length)]);
        text.setFontSize(36);
        text.setStroke('#000000', 4);
        text.setFontFamily('"Syne Mono"');
        text.setFontStyle('bold');
        text.setOrigin(0, 1);

        this.physics.world.setBoundsCollision(true, true, true, true);
        this.physics.add.existing(text);
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
