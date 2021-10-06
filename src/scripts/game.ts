import 'phaser';
import GameScene from './scenes/gameScene';
import Level1 from './scenes/level1';
import MainMenuScene from './scenes/mainMenuScene';

const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 1080;
export const mainSceneBackground = '#008080';

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
        antialiasGL: false,
        pixelArt: true
    },
    scene: [MainMenuScene, GameScene, Level1],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
            debugShowVelocity: true,
            debugShowBody: true,
            debugShowStaticBody: true
        }
    },
    audio: {
        disableWebAudio: false
    },
    autoFocus: true
};

export let game: Phaser.Game;
window.addEventListener('load', () => {
    game = new Phaser.Game(phaserConfiguration);
});
