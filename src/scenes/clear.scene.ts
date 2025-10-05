import { Scene } from 'phaser';
export class ClearScene extends Scene {
  constructor() {
    super('clear');
  }
  create(): void {
    this.add.text(640, 360, 'Puzzle Solved!', { fontSize: '48px', color: '#00ff00' }).setOrigin(0.5);
    this.add.text(640, 440, 'Click anywhere to Restart', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5);
    this.scene.bringToTop();
    this.input.setDefaultCursor('pointer');
    this.input.once('pointerdown', () => {
      this.scene.stop('clear');
      this.scene.stop('game');
      this.scene.start('game');
    });
  }
}