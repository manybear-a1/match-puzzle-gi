import * as Phaser from 'phaser';

import { PreloaderScene } from './scenes/preloader.scene';
import { GameScene } from './scenes/mainmenu.scene.ts';
import { ClearScene } from './scenes/clear.scene';
import { difficulties } from './scenes/difficulty/difficulties.ts';

const config: Phaser.Types.Core.GameConfig = {
  parent: 'game-container',
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 500 }
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
  },
  scene: [PreloaderScene, GameScene, ClearScene, ...difficulties],
  backgroundColor: '#21213B',
};

export default new Phaser.Game(config);