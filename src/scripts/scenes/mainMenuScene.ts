import 'phaser';

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

    // resizeCanvas() {
    //     console.log('------------------  DEVICE INFO ------------------');

    //     let screenOrientation = window.innerHeight > window.innerWidth ? 90 : 0;
    //     if (screenOrientation) {
    //         console.log('| Orietation: portrait');
    //     } else {
    //         console.log('| Orietation: landscape');
    //     }
    //     console.log('| Resolution: ' + window.innerHeight * window.devicePixelRatio + ':' + window.innerWidth * window.devicePixelRatio);
    //     console.log('| Pixel ratio: ' + window.devicePixelRatio);
    //     console.log('| Pixel height x width: ' + window.screen.availHeight + ' x ' + window.screen.availWidth);

    //     //compute closest aspect ratio
    //     function closest(num, arr) {
    //         var curr = arr[0];
    //         var diff = Math.abs(num - curr);
    //         for (var val = 0; val < arr.length; val++) {
    //             var newdiff = Math.abs(num - arr[val]);
    //             if (newdiff < diff) {
    //                 diff = newdiff;
    //                 curr = arr[val];
    //             }
    //         }
    //         return curr;
    //     }

    //     //compute closest aspect ratio, continued
    //     var ratiosArray = ['16:9', '16:10', '3:2', '4:3', '1:1', '4:3', '3:2', '16:10', '16:9'];
    //     var ratioFloatsArray = [1.77, 1.6, 1.5, 1.33, 1, 0.75, 0.66, 0.625, 0.56];
    //     var width = window.screen.availWidth;
    //     var height = window.screen.availHeight;
    //     var currentRatioFloat = width / height;
    //     var matchedRatioFloat = parseFloat(closest(currentRatioFloat, ratioFloatsArray));
    //     var matchedRatio = ratiosArray[ratioFloatsArray.indexOf(matchedRatioFloat)];
    //     console.log('| Aspect ratio: ' + matchedRatio);

    //     //greatest common divisor
    //     function gcd(a, b) {
    //         return b == 0 ? a : gcd(b, a % b);
    //     }
    //     var w = screen.width;
    //     var h = screen.height;
    //     var r = gcd(w, h);

    //     console.log('| Dimension ≈ ' + w + ' x ' + h);
    //     console.log('| Gcd: ' + r);
    //     //gcd = 1 => error
    //     console.log('| Aspect: ' + w / r + ':' + h / r);

    //     this.displayDeviceInfo();

    //     // this.alterCanvas();
    // }

    // displayDeviceInfo() {
    //     //UAParser
    //     var parser = new UAParser();
    //     var result = parser.getResult();
    //     console.debug();
    //     console.debug('************************************************************');
    //     console.debug('* --> Browser Name: ' + result.browser.name); // {name: "Chromium", version: "15.0.874.106"}
    //     console.debug('* --> Browser Version: ' + result.browser.version); // {name: "Chromium", version: "15.0.874.106"}
    //     console.debug('* --> Device: ' + result.device.model); // {model: undefined, type: undefined, vendor: undefined}
    //     console.debug('* --> Device Type: ' + result.device.type); // {model: undefined, type: undefined, vendor: undefined}
    //     console.debug('* --> Device Vendor: ' + result.device.vendor); // {model: undefined, type: undefined, vendor: undefined}
    //     console.debug('* --> OS Name: ' + result.os.name); // {name: "Ubuntu", version: "11.10"}
    //     console.debug('* --> OS Name: ' + result.os.name); // {name: "Ubuntu", version: "11.10"}
    //     console.debug('* --> OS Version:' + result.os.version); // "11.10"
    //     console.debug('* --> Engine name: ' + result.engine.name); // "WebKit"
    //     console.debug('* --> CPU Architecture: ' + result.cpu.architecture); // "amd64"

    //     // Do some other tests
    //     var uastring2 = 'Mozilla/5.0 (compatible; Konqueror/4.1; OpenBSD) KHTML/4.1.4 (like Gecko)';
    //     console.debug('* --> UI:' + parser.setUA(uastring2).getBrowser().name); // "Konqueror"

    //     console.debug('* --> OS Name: ' + parser.getOS().name); // {name: "OpenBSD", version: undefined}
    //     console.debug('* --> OS Version: ' + parser.getOS().version); // {name: "OpenBSD", version: undefined}
    //     console.debug('* --> Browser Engine Name:' + parser.getEngine().name); // {name: "KHTML", version: "4.1.4"}
    //     console.debug('* --> Browser Engine Version:' + parser.getEngine().version); // {name: "KHTML", version: "4.1.4"}

    //     var uastring3 = 'Mozilla/5.0 (PlayBook; U; RIM Tablet OS 1.0.0; en-US) AppleWebKit/534.11 (KHTML, like Gecko) Version/7.1.0.7 Safari/534.11';
    //     console.debug('* --> UA Device: ' + parser.setUA(uastring3).getDevice().model); // "PlayBook"
    //     console.debug('* --> OS: ' + parser.getOS().name); // {name: "RIM Tablet OS", version: "1.0.0"}
    //     console.debug('* --> OS: ' + parser.getOS().version); // {name: "RIM Tablet OS", version: "1.0.0"}
    //     console.debug('* --> Browser Name: ' + parser.getBrowser().name); // "Safari"
    //     // Extension
    //     // Example:
    //     var myOwnListOfBrowsers = [[/(mybrowser)\/([\w\.]+)/i], [UAParser.BROWSER.NAME, UAParser.BROWSER.VERSION]];
    //     var myParser = new UAParser({ browser: myOwnListOfBrowsers });
    //     var myUA = 'Mozilla/5.0 MyBrowser/1.3';
    //     console.debug('* --> UA Browser Name: ' + myParser.setUA(myUA).getBrowser().name); // {name: "MyBrowser", version: "1.3"}
    //     console.debug('* --> UA Browser Version: ' + myParser.setUA(myUA).getBrowser().version); // {name: "MyBrowser", version: "1.3"}
    //     console.debug('************************************************************');
    //     console.debug();
    //     //end UAParser
    // }

    // alterCanvas() {
    //     let htmlCanvas: HTMLCollectionOf<HTMLCanvasElement> = document.getElementsByTagName('canvas');
    //     htmlCanvas[0].style.display = 'block';
    //     htmlCanvas[0].style.imageRendering = 'pixelated';
    //     htmlCanvas[0].style.marginLeft = '0';
    //     htmlCanvas[0].style.marginTop = '0';
    //     htmlCanvas[0].style.width = '100%';
    //     htmlCanvas[0].style.height = '100%';
    //     htmlCanvas[0].width = htmlCanvas[0].offsetWidth;
    //     htmlCanvas[0].height = htmlCanvas[0].offsetHeight;

    //     this.game.scale.resize(htmlCanvas[0].offsetWidth, htmlCanvas[0].offsetHeight);
    //     this.cameras.main.setViewport(0, 0, htmlCanvas[0].offsetWidth, htmlCanvas[0].offsetHeight);

    //     // this.image.displayHeight = window.innerHeight;
    //     // this.image.displayWidth = window.innerWidth;
    // }

    create() {
        this.cameras.main.fadeIn();

        // let bg = this.add.image(0, 0, 'bg');
        // bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        // bg.setOrigin(0, 0);
        // bg.setX(0);
        // bg.setY(0);

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

        // this.image.displayHeight = window.innerHeight;
        // this.image.displayWidth = window.innerWidth;

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        let title = this.add.image(screenCenterX, screenCenterY, 'title');
        // title.setDisplaySize(this.cameras.main.worldView.x, this.cameras.main.worldView.y);
        // title.setOrigin(0, 0);
        // title.setScale(0.7);

        this.play = this.add.sprite(this.buttonsX, this.firstButtonY, 'play').setInteractive();
        this.play.setOrigin(1, 0);
        this.character = this.add.sprite(this.buttonsX, this.firstButtonY + this.buttonDistance, 'character').setInteractive();
        this.character.setOrigin(1, 0);
        this.options = this.add.sprite(this.buttonsX, this.firstButtonY + this.buttonDistance * 2, 'options').setInteractive();
        this.options.setOrigin(1, 0);
        this.credits = this.add.sprite(this.buttonsX, this.firstButtonY + this.buttonDistance * 3, 'credits').setInteractive();
        this.credits.setOrigin(1, 0);

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
        }); //
        this.credits.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.credits.setTexture('credits');
        });
        this.credits.on(Phaser.Input.Events.POINTER_UP, () => {
            this.credits.setTexture('credits-focus');
        });
    }

    // windowResized(restart) {
    //     console.log('canvas resized' + window.innerWidth);

    //     let htmlCanvas: HTMLCollectionOf<HTMLCanvasElement> = document.getElementsByTagName('canvas');
    //     //image-rendering: pixelated; margin-left: 279px; margin-top: 184px;
    //     htmlCanvas[0].style.imageRendering = 'pixelated';
    //     htmlCanvas[0].style.marginLeft = '0';
    //     htmlCanvas[0].style.marginTop = '0';
    //     // htmlCanvas[0].style.width = String(window.innerWidth);
    //     // htmlCanvas[0].style.height = String(window.innerHeight);
    //     htmlCanvas[0].style.width = '100%';
    //     htmlCanvas[0].style.height = '100%';
    //     // ...then set the internal size to match
    //     htmlCanvas[0].width = htmlCanvas[0].offsetWidth;
    //     htmlCanvas[0].height = htmlCanvas[0].offsetHeight;
    //     if (this.scale) this.scale.autoCenter = Phaser.Scale.Center.CENTER_BOTH;
    //     if (this.scale) this.scale.setGameSize(window.innerWidth, window.innerHeight).getParentBounds();
    //     // if (this.scale) this.scale.displaySize.resize(window.innerWidth, window.innerHeight);
    //     if (this.scale) this.physics.world.setBounds(0, 0, window.innerWidth, window.innerHeight);
    //     console.log('restart' + !restart);

    //     this.play.setX(this.buttonsX);
    //     this.play.setY(this.firstButtonY);

    // }

    relatedApps: any;
    update() {
        if (!this.relatedApps) {
            this.relatedApps = (navigator as any).getInstalledRelatedApps();
            this.relatedApps.then((val) => {
                console.log('related apps: ' + val.length);
                this.relatedApps = undefined;
                val.forEach((app) => {
                    console.log(app.id, app.platform, app.url);
                });
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
