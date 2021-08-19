import 'phaser';
import MainScene from './scenes/mainScene';
import PreloadScene from './scenes/preloadScene';

const DEFAULT_WIDTH = 500;
const DEFAULT_HEIGHT = 500;

//main scene - stratch
export const mainScene = {
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
    scene: [MainScene],
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

//PreloadScene - Fixed
export const preloadScene = {
    type: Phaser.WEBGL,
    backgroundColor: '#008080',
    scale: {
        parent: 'phaser-game',
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1024,
        height: 768
    },
    render: {
        pixelArt: false
    },
    scene: [PreloadScene],
    physics: {
        default: 'arcade'
    }
};

window.addEventListener('load', () => {
    const game = new Phaser.Game(preloadScene);
});
