import 'phaser';
import GameScene from './scenes/gameScene';
import PreloadScene from './scenes/preloadScene';
import MainMenuScene from './scenes/mainMenuScene';

const DEFAULT_WIDTH = 1024;
const DEFAULT_HEIGHT = 768;
export const preloadSceneBackground = '#ffffff';
export const mainSceneBackground = '#ffffff';

let width = window.innerWidth * window.devicePixelRatio;
let height = window.innerHeight * window.devicePixelRatio;

export const phaserConfiguration = {
    type: Phaser.WEBGL,
    backgroundColor: '#008080',
    scale: {
        parent: 'phaser-game',
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: width, //DEFAULT_WIDTH
        height: height //DEFAULT_HEIGHT
    },
    render: {
        pixelArt: true
    },
    scene: [PreloadScene, MainMenuScene, GameScene],
    physics: {
        default: 'arcade'
    }
};

export let game: Phaser.Game;
window.addEventListener('load', () => {
    game = new Phaser.Game(phaserConfiguration);
});
