import 'phaser';

export default class MainMenuScene extends Phaser.Scene {
    play: Phaser.GameObjects.Sprite;
    character: Phaser.GameObjects.Sprite;
    options: Phaser.GameObjects.Sprite;
    credits: Phaser.GameObjects.Sprite;

    buttonDistance = 100;
    firstButtonY = 400;
    buttonsX = window.innerWidth - 200;

    constructor() {
        super({ key: 'MainMenuScene' });
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

        this.load.image('bg', 'assets/main-menu-background.jpg');
        this.load.image('title', 'assets/main-menu-game-titletitle2.png');
    }

    create() {
        window.addEventListener('resize', () => this.windowResized(true), false);

        console.log('Main Menu');
        this.cameras.main.fadeIn();

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        let bg = this.add.image(screenCenterX, screenCenterY, 'bg');
        bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor('#008080');

        let title = this.add.image(200, screenCenterY - 100, 'title');
        title.setOrigin(0, 0.5);

        this.play = this.add.sprite(this.buttonsX, this.firstButtonY, 'play').setInteractive();
        this.play.setOrigin(1, 1);
        this.character = this.add.sprite(this.buttonsX, this.firstButtonY + this.buttonDistance, 'character').setInteractive();
        this.character.setOrigin(1, 1);
        this.options = this.add.sprite(this.buttonsX, this.firstButtonY + this.buttonDistance * 2, 'options').setInteractive();
        this.options.setOrigin(1, 1);
        this.credits = this.add.sprite(this.buttonsX, this.firstButtonY + this.buttonDistance * 3, 'credits').setInteractive();
        this.credits.setOrigin(1, 1);

        this.setInnteractiveButtons();

        this.windowResized(true);
    }

    setInnteractiveButtons() {
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
            this.play.setTexture('install-focus');
            this.scene.start('GameScene');
        });

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

        this.credits.on(Phaser.Input.Events.POINTER_OVER, () => {
            this.credits.setTexture('credits-focus');
        });
        this.credits.on(Phaser.Input.Events.POINTER_OUT, () => {
            this.credits.setTexture('credits');
        });
        this.credits.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.credits.setTexture('credits');
        });
        this.credits.on(Phaser.Input.Events.POINTER_UP, () => {
            this.credits.setTexture('credits-focus');
        });
    }

    windowResized(restart) {
        console.log('canvas resized' + window.innerWidth);

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

        this.play.setX(this.buttonsX);
        this.play.setY(this.firstButtonY);
        
    }
}