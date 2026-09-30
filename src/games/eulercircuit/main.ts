import * as Phaser from 'phaser';

import { MainMenuScene } from './scenes/mainmenu.scene.ts';
import { GameScene as VsPlayerScene } from './scenes/vsplayer.scene.ts';
import { GameScene as VsBotScene } from './scenes/vsbot.scene.ts';

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
  scene: [MainMenuScene, VsPlayerScene, VsBotScene],
  backgroundColor: '#21213B',
};

export default new Phaser.Game(config);