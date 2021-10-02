import 'phaser';
import GameScene from './scenes/gameScene';
import PreloadScene from './scenes/preloadScene';
import MainMenuScene from './scenes/mainMenuScene';

const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 1080;
export const preloadSceneBackground = '#ffffff';
export const mainSceneBackground = '#ffffff';

// let width = window.innerWidth * window.devicePixelRatio;
// let height = window.innerHeight * window.devicePixelRatio;

export const phaserConfiguration = {
    type: Phaser.AUTO,
    backgroundColor: '#008080',
    scale: {
        parent: 'phaser-game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH, //width, //DEFAULT_WIDTH
        height: DEFAULT_HEIGHT //height //DEFAULT_HEIGHT
    },
    render: {
        pixelArt: true
    },
    scene: [MainMenuScene, GameScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
            debugShowVelocity: true,
            debugShowBody: true,
            debugShowStaticBody: true
        }
    }
};

export let game: Phaser.Game;
window.addEventListener('load', () => {
    game = new Phaser.Game(phaserConfiguration);
});
