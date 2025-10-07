import { Scene } from 'phaser';

export class PreloaderScene extends Scene {
  constructor() {
    super('preloader');
  }

  preload(): void {
  }

  create(): void {
    this.scene.start('game');
  }
}