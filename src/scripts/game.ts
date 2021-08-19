import 'phaser';
import MainScene from './scenes/mainScene';
import PreloadScene from './scenes/preloadScene';

const DEFAULT_WIDTH = 900;
const DEFAULT_HEIGHT = 600;

const config = {
    type: Phaser.WEBGL,
    backgroundColor: '#008080',
    scale: {
        parent: 'phaser-game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT
    },
    render: {
        pixelArt: true
    },
    scene: [PreloadScene, MainScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 },
            debug: false,
            debugShowVelocity: true,
            debugShowBody: true,
            debugShowStaticBody: true
        }
    }
};

window.addEventListener('load', () => {
    const game = new Phaser.Game(config);
});
