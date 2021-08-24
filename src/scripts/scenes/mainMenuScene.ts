import 'phaser';

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        this.load.image('play', 'assets/buttons/play.png');
        this.load.image('play-focus', 'assets/buttons/play-focus.png');
        this.load.image('character', 'assets/buttons/character.png');
        this.load.image('character-focus', 'assets/buttons/character-focus.png');
        this.load.image('options', 'assets/buttons/options.png');
        this.load.image('options-focus', 'assets/buttons/options-focus.png');
        this.load.image('credits', 'assets/buttons/credits.png');
        this.load.image('credits-focus', 'assets/buttons/credits-focus.png');

        this.load.image('bg', 'assets/main-menu-background.jpg');
        this.load.image('title', 'assets/main-menu-game-titletitle2.png');
    }

    create() {
        console.log('Main Menu');
        this.cameras.main.fadeIn();

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        let bg = this.add.image(screenCenterX, screenCenterY, 'bg');
        bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor('#008080');

        let title = this.add.image(200, screenCenterY - 100, 'title');
        title.setOrigin(0, 0.5);

        let buttonDistance = 100;
        let firstButtonY = 400;
        let buttonsX = window.innerWidth - 200;

        let play = this.add.sprite(buttonsX, firstButtonY, 'play').setInteractive();
        play.setOrigin(1, 1);
        let character = this.add.sprite(buttonsX, firstButtonY + buttonDistance, 'character').setInteractive();
        character.setOrigin(1, 1);
        let options = this.add.sprite(buttonsX, firstButtonY + buttonDistance * 2, 'options').setInteractive();
        options.setOrigin(1, 1);
        let credits = this.add.sprite(buttonsX, firstButtonY + buttonDistance * 3, 'credits').setInteractive();
        credits.setOrigin(1, 1);

        play.on(Phaser.Input.Events.POINTER_OVER, () => {
            play.setTexture('play-focus');
        });
        play.on(Phaser.Input.Events.POINTER_OUT, () => {
            play.setTexture('play');
        });
        play.on(Phaser.Input.Events.POINTER_DOWN, () => {
            play.setTexture('play');
        });
        play.on(Phaser.Input.Events.POINTER_UP, () => {
            play.setTexture('install-focus');
            this.scene.start('GameScene');
        });

        character.on(Phaser.Input.Events.POINTER_OVER, () => {
            character.setTexture('character-focus');
        });
        character.on(Phaser.Input.Events.POINTER_OUT, () => {
            character.setTexture('character');
        });
        character.on(Phaser.Input.Events.POINTER_DOWN, () => {
            character.setTexture('character');
        });
        character.on(Phaser.Input.Events.POINTER_UP, () => {
            character.setTexture('character-focus');
        });

        options.on(Phaser.Input.Events.POINTER_OVER, () => {
            options.setTexture('options-focus');
        });
        options.on(Phaser.Input.Events.POINTER_OUT, () => {
            options.setTexture('options');
        });
        options.on(Phaser.Input.Events.POINTER_DOWN, () => {
            options.setTexture('options');
        });
        options.on(Phaser.Input.Events.POINTER_UP, () => {
            options.setTexture('options-focus');
        });

        credits.on(Phaser.Input.Events.POINTER_OVER, () => {
            credits.setTexture('credits-focus');
        });
        credits.on(Phaser.Input.Events.POINTER_OUT, () => {
            credits.setTexture('credits');
        });
        credits.on(Phaser.Input.Events.POINTER_DOWN, () => {
            credits.setTexture('credits');
        });
        credits.on(Phaser.Input.Events.POINTER_UP, () => {
            credits.setTexture('credits-focus');
        });
    }
}
