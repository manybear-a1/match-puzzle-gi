import * as Phaser from 'phaser';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('main-menu');
  }

  create(): void {
    this.add.rectangle(640, 360, 1280, 720, 0x21213b);
    this.add.circle(640, 360, 250, 0x30345a, 0.45);
    this.add.text(640, 130, 'ループを避けろ', {
      color: '#ffffff',
      fontSize: '64px',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add.text(640, 215, 'CLOSED CYCLE', {
      color: '#72ddf7',
      fontSize: '22px',
    }).setOrigin(0.5);

    this.add.text(640, 300, '2人で交互に頂点を2つ選び、辺を追加します。\n全ての辺が閉路に分解できる形になったら負けです。', {
      color: '#d8e1ff',
      fontSize: '22px',
      align: 'center',
      lineSpacing: 12,
    }).setOrigin(0.5);

    const startButton = this.add.text(640, 480, 'ゲーム開始', {
      color: '#111827',
      backgroundColor: '#ffd166',
      fontSize: '28px',
      fontStyle: 'bold',
      padding: { left: 34, right: 34, top: 16, bottom: 16 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    startButton.on('pointerover', () => startButton.setScale(1.05));
    startButton.on('pointerout', () => startButton.setScale(1));
    startButton.on('pointerdown', () => this.scene.start('euler-circuit'));

    const botButton = this.add.text(640, 560, 'ボットと対戦', {
      color: '#111827',
      backgroundColor: '#72ddf7',
      fontSize: '24px',
      fontStyle: 'bold',
      padding: { left: 30, right: 30, top: 14, bottom: 14 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    botButton.on('pointerover', () => botButton.setScale(1.05));
    botButton.on('pointerout', () => botButton.setScale(1));
    botButton.on('pointerdown', () => this.scene.start('vs-bot'));

    this.add.text(640, 650, 'ゲーム開始: 同じPCで交互に操作 / ボットと対戦: ランダムなボットと対戦', {
      color: '#9aa8d6',
      fontSize: '16px',
    }).setOrigin(0.5);
  }
}