import { Scene } from 'phaser';
export class GameScene extends Scene {
  constructor() {
    super('game');
  }

  create(): void {
    this.add.text(640, 180, 'マッチ棒パズル', { fontSize: '96px', color: '#ffffff' }).setOrigin(0.5).setPadding(20, 20, 20, 20);
    this.add.text(640, 300, 'マッチ棒を動かして、正しい形にしてください。', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5).setPadding(20, 20, 20, 20);
    const playtext = this.add.text(640, 360, 'クリックしてゲームを開始', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5, 0.5).setPadding(20, 20, 20, 20).setInteractive();
    playtext.on('pointerdown', () => {
      playtext.setStyle({ fontSize: '36px', color: '#ff0000' });
      //this.scene.transition({ target: 'normal', duration: 1000 });
      this.scene.stop('game');
      this.scene.start('normal');
    }).on('pointerover', () => {
      playtext.setStyle({ fontSize: '36px', color: '#ffff00' });
    }).on('pointerout', () => {
      playtext.setStyle({ fontSize: '32px', color: '#ffffff' });
    });
  }
}