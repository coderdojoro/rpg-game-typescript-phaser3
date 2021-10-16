class TextDefinition {
    text: string;
    startLetters(): Array<number> {
        return [0];
    }
}

export default class BouncyText {
    scene: Phaser.Scene;
    letterDistance: number = 21;
    gravity: number = 4300;
    letters: Array<Phaser.GameObjects.Text> = [];
    letterYDistance: number = 2;
    bounceY: number = 0.8;
    currentBouncingText: number = -1;
    colors: string[] = ['33ff33', '3399ff', 'ff3333', 'fff833'];
    changeText: boolean = false;
    started: boolean = false;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    bouncingTexts: Array<TextDefinition> = [
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
        let screenCenterX = this.scene.cameras.main.worldView.x + this.scene.cameras.main.width / 2;
        for (var i = 0; i < text.length; i++) {
            let letterX: number = screenCenterX + this.letterDistance * (i - text.length / 2);
            this.printLetter(text.charAt(i), letterX);
        }
    }

    printLetter(letter: string, letterX: number) {
        let text = this.scene.add.text(0, 760, letter);
        this.letters.push(text);
        text.setX(letterX);
        text.setColor('#' + this.colors[Math.floor(Math.random() * this.colors.length)]);
        text.setFontSize(44);
        text.setStroke('#000000', 4);
        text.setFontFamily('"VT323"');
        text.setOrigin(0, 1);

        this.scene.physics.world.setBoundsCollision(true, true, true, true);
        this.scene.physics.add.existing(text);

        (text.body as Phaser.Physics.Arcade.Body).setGravityY(0);
        (text.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
        (text.body as Phaser.Physics.Arcade.Body).setBounceY(this.bounceY);
    }

    update() {
        if (!this.started) {
            this.started = true;
            this.startText();
            return;
        }

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
            this.scene.time.delayedCall(3000, () => {
                this.startText();
                this.changeText = false;
            });
        }
    }
}
