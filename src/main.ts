import * as Phaser from 'phaser';

import { PreloaderScene } from './scenes/preloader.scene';
import { GameScene } from './scenes/game.scene';
import { ClearScene } from './scenes/clear.scene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 500 }
        }
    },
    scene: [PreloaderScene, GameScene, ClearScene],
    backgroundColor: '#21213B',
};

export default new Phaser.Game(config);