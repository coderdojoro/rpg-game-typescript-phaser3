import 'phaser';
import MainScene from './scenes/mainScene';
import PreloadScene from './scenes/preloadScene';

const DEFAULT_WIDTH = 500;
const DEFAULT_HEIGHT = 500;

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
    scene: [PreloadScene, MainScene],
    physics: {
        default: 'arcade'
    }
};

// //main scene - stratch
// export const mainScene = {
//     key: 'MainScene',
//     type: Phaser.WEBGL,
//     backgroundColor: '#ff0000',
//     scale: {
//         parent: 'phaser-game',
//         mode: Phaser.Scale.FIT,
//         autoCenter: Phaser.Scale.CENTER_BOTH,
//         width: DEFAULT_WIDTH,
//         height: DEFAULT_HEIGHT
//     },
//     render: {
//         pixelArt: true
//     },
//     scene: [MainScene],
//     physics: {
//         default: 'arcade',
//         arcade: {
//             gravity: { y: 400 },
//             debug: false,
//             debugShowVelocity: true,
//             debugShowBody: true,
//             debugShowStaticBody: true
//         }
//     }
// };
export let game: Phaser.Game;
window.addEventListener('load', () => {
    game = new Phaser.Game(preloadScene);
});
