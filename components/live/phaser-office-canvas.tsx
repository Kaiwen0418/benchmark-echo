'use client';

import { useEffect, useRef } from 'react';

type ZoneId = 'file-io' | 'web-ui' | 'security' | 'mcp-skill';

type PhaserOfficeCanvasProps = {
  activeRuns: number;
  failedRuns: number;
  passedRuns: number;
  selectedZoneId: ZoneId;
  securityFailed: boolean;
  syncActive: boolean;
  workingActive: boolean;
  onReady?: () => void;
};

declare global {
  interface Window {
    Phaser?: any;
  }
}

type SceneApi = {
  setSelectedZone: (zoneId: ZoneId) => void;
  setRuntimeState: (next: Pick<PhaserOfficeCanvasProps, 'securityFailed' | 'syncActive' | 'workingActive'>) => void;
  destroy: () => void;
};

const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;

const zoneRects: Record<ZoneId, { x: number; y: number; width: number; height: number }> = {
  'file-io': { x: 130, y: 350, width: 250, height: 170 },
  'web-ui': { x: 150, y: 100, width: 280, height: 170 },
  security: { x: 900, y: 80, width: 240, height: 180 },
  'mcp-skill': { x: 760, y: 480, width: 270, height: 150 }
};

const bubbleTexts = {
  idle: ['Stand by.', 'Room is quiet.', 'Waiting for next task.'],
  working: ['Focus mode on.', 'Pipeline is running.', 'Working through the queue.'],
  syncing: ['Syncing backup.', 'Committing changes.', 'Protocol room is active.'],
  error: ['Alert raised.', 'Bug surfaced.', 'Investigating failure.'],
  cat: ['Meow.', 'Purrr...', 'Best seat in the office.']
} as const;

function loadPhaserScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.Phaser) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-phaser-local="true"]');

    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Failed to load Phaser script')), {
        once: true
      });
      return;
    }

    const script = document.createElement('script');
    script.src = '/star-office/phaser.min.js';
    script.async = true;
    script.dataset.phaserLocal = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Phaser script'));
    document.body.appendChild(script);
  });
}

function createScene(
  container: HTMLDivElement,
  props: PhaserOfficeCanvasProps
): SceneApi {
  const PhaserRef = window.Phaser;

  const sceneState = {
    selectedZoneId: props.selectedZoneId,
    securityFailed: props.securityFailed,
    syncActive: props.syncActive,
    workingActive: props.workingActive
  };

  const zoneHighlights: Partial<Record<ZoneId, any>> = {};
  let starIdle: any;
  let starWorking: any;
  let serverroom: any;
  let coffeeMachine: any;
  let errorBug: any;
  let syncAnim: any;
  let cat: any;
  let bubble: any;
  let catBubble: any;
  let bubbleTimer: any;
  let catBubbleTimer: any;
  let errorDirection = 1;

  function destroyBubble(target: 'main' | 'cat') {
    if (target === 'main' && bubble) {
      bubble.destroy();
      bubble = null;
    }

    if (target === 'cat' && catBubble) {
      catBubble.destroy();
      catBubble = null;
    }
  }

  function showBubble(scene: any, target: 'main' | 'cat') {
    const textPool =
      target === 'cat'
        ? bubbleTexts.cat
        : sceneState.securityFailed
          ? bubbleTexts.error
          : sceneState.syncActive
            ? bubbleTexts.syncing
            : sceneState.workingActive
              ? bubbleTexts.working
              : bubbleTexts.idle;

    if (target === 'main' && !sceneState.workingActive && !sceneState.syncActive && !sceneState.securityFailed) {
      return;
    }

    const text = textPool[Math.floor(Math.random() * textPool.length)];

    let anchorX = starIdle?.x ?? 640;
    let anchorY = starIdle?.y ?? 176;

    if (target === 'cat' && cat) {
      anchorX = cat.x;
      anchorY = cat.y - 58;
    } else if (sceneState.securityFailed && errorBug) {
      anchorX = errorBug.x;
      anchorY = errorBug.y - 72;
    } else if (sceneState.syncActive && syncAnim) {
      anchorX = syncAnim.x;
      anchorY = syncAnim.y - 76;
    } else if (sceneState.workingActive && starWorking) {
      anchorX = starWorking.x;
      anchorY = starWorking.y - 84;
    }

    destroyBubble(target);

    const bg = scene.add.rectangle(anchorX, anchorY, text.length * 8 + 26, 26, 0xffffff, 0.94);
    bg.setStrokeStyle(2, target === 'cat' ? 0xd4a574 : 0x000000);
    const label = scene.add
      .text(anchorX, anchorY, text, {
        fontFamily: 'ArkPixelLatin, ArkPixelZH, monospace',
        fontSize: '11px',
        color: target === 'cat' ? '#8b6914' : '#000000'
      })
      .setOrigin(0.5);

    const container = scene.add.container(0, 0, [bg, label]).setDepth(target === 'cat' ? 2100 : 1300);
    scene.time.delayedCall(target === 'cat' ? 4000 : 3200, () => destroyBubble(target));

    if (target === 'cat') {
      catBubble = container;
    } else {
      bubble = container;
    }
  }

  function getTextureFrameEnd(scene: any, textureKey: string, desiredEnd: number) {
    const texture = scene.textures.get(textureKey);

    if (!texture) {
      return desiredEnd;
    }

    // Phaser texture frame collections include "__BASE", so subtract one to get the last numeric frame.
    const availableEnd = Math.max(0, texture.frameTotal - 2);
    return Math.min(desiredEnd, availableEnd);
  }

  const scene = {
    preload(this: any) {
      this.load.image('office_bg', '/star-office/office_bg_small.webp');
      this.load.image('desk', '/star-office/desk-v3.webp');
      this.load.image('sofa_idle', '/star-office/sofa-idle-v3.png');
      this.load.spritesheet('plants', '/star-office/plants-spritesheet.webp', {
        frameWidth: 160,
        frameHeight: 160
      });
      this.load.spritesheet('posters', '/star-office/posters-spritesheet.webp', {
        frameWidth: 160,
        frameHeight: 160
      });
      this.load.spritesheet('cats', '/star-office/cats-spritesheet.webp', {
        frameWidth: 160,
        frameHeight: 160
      });
      this.load.spritesheet('flowers', '/star-office/flowers-bloom-v2.webp', {
        frameWidth: 64,
        frameHeight: 64
      });
      this.load.spritesheet('star_idle', '/star-office/star-idle-v5.png', {
        frameWidth: 128,
        frameHeight: 128
      });
      this.load.spritesheet('star_working', '/star-office/star-working-spritesheet-grid.webp', {
        frameWidth: 300,
        frameHeight: 300
      });
      this.load.spritesheet('coffee_machine', '/star-office/coffee-machine-v3-grid.webp', {
        frameWidth: 230,
        frameHeight: 230
      });
      this.load.spritesheet('serverroom', '/star-office/serverroom-spritesheet.webp', {
        frameWidth: 180,
        frameHeight: 251
      });
      this.load.spritesheet('error_bug', '/star-office/error-bug-spritesheet-grid.webp', {
        frameWidth: 180,
        frameHeight: 180
      });
      this.load.spritesheet('sync_anim', '/star-office/sync-animation-v3-grid.webp', {
        frameWidth: 256,
        frameHeight: 256
      });
    },
    create(this: any) {
      const scene = this;
      this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'office_bg');

      const plaqueX = 640;
      const plaqueY = CANVAS_HEIGHT - 36;
      const plaqueBg = this.add.rectangle(plaqueX, plaqueY, 420, 44, 0x5d4037);
      plaqueBg.setStrokeStyle(3, 0x3e2723);
      plaqueBg.setDepth(1200);
      this.add
        .text(plaqueX, plaqueY, 'Star Office Benchmark', {
          fontFamily: 'ArkPixelLatin, ArkPixelZH, monospace',
          fontSize: '18px',
          color: '#ffd700',
          stroke: '#000000',
          strokeThickness: 2
        })
        .setOrigin(0.5)
        .setDepth(1201);
      this.add
        .text(plaqueX - 188, plaqueY, '*', {
          fontFamily: 'ArkPixelLatin, ArkPixelZH, monospace',
          fontSize: '18px',
          color: '#ffd700'
        })
        .setOrigin(0.5)
        .setDepth(1201);
      this.add
        .text(plaqueX + 188, plaqueY, '*', {
          fontFamily: 'ArkPixelLatin, ArkPixelZH, monospace',
          fontSize: '18px',
          color: '#ffd700'
        })
        .setOrigin(0.5)
        .setDepth(1201);

      Object.entries(zoneRects).forEach(([zoneId, rect]) => {
        const highlight = this.add.rectangle(
          rect.x + rect.width / 2,
          rect.y + rect.height / 2,
          rect.width,
          rect.height
        );
        highlight.setStrokeStyle(3, 0x8b5cf6, 0);
        highlight.setFillStyle(0xffffff, 0);
        highlight.setDepth(4);
        zoneHighlights[zoneId as ZoneId] = highlight;
      });

      const plantPositions = [
        { x: 565, y: 178, depth: 5, frame: 0 },
        { x: 230, y: 185, depth: 5, frame: 5 },
        { x: 977, y: 496, depth: 5, frame: 10 }
      ];

      plantPositions.forEach((plant) => {
        this.add
          .sprite(plant.x, plant.y, 'plants', plant.frame)
          .setOrigin(0.5)
          .setDepth(plant.depth);
      });

      this.add.sprite(252, 66, 'posters', 7).setOrigin(0.5).setDepth(4);
      this.add.sprite(310, 390, 'flowers', 4).setOrigin(0.5).setScale(0.8).setDepth(1100);
      cat = this.add.sprite(94, 557, 'cats', 2).setOrigin(0.5).setDepth(2000);

      this.add.image(218, 417, 'desk').setOrigin(0.5).setDepth(1000);
      this.add.image(670, 144, 'sofa_idle').setOrigin(0, 0).setDepth(10);

      this.anims.create({
        key: 'star_idle',
        frames: this.anims.generateFrameNumbers('star_idle', {
          start: 0,
          end: getTextureFrameEnd(this, 'star_idle', 29)
        }),
        frameRate: 12,
        repeat: -1
      });
      this.anims.create({
        key: 'star_working',
        frames: this.anims.generateFrameNumbers('star_working', {
          start: 1,
          end: getTextureFrameEnd(this, 'star_working', 39)
        }),
        frameRate: 12,
        repeat: -1
      });
      this.anims.create({
        key: 'coffee_machine',
        frames: this.anims.generateFrameNumbers('coffee_machine', {
          start: 0,
          end: getTextureFrameEnd(this, 'coffee_machine', 95)
        }),
        frameRate: 12,
        repeat: -1
      });
      this.anims.create({
        key: 'serverroom_on',
        frames: this.anims.generateFrameNumbers('serverroom', {
          start: 0,
          end: getTextureFrameEnd(this, 'serverroom', 39)
        }),
        frameRate: 6,
        repeat: -1
      });
      this.anims.create({
        key: 'error_bug',
        frames: this.anims.generateFrameNumbers('error_bug', {
          start: 0,
          end: getTextureFrameEnd(this, 'error_bug', 95)
        }),
        frameRate: 12,
        repeat: -1
      });
      this.anims.create({
        key: 'sync_anim',
        frames: this.anims.generateFrameNumbers('sync_anim', {
          start: 1,
          end: getTextureFrameEnd(this, 'sync_anim', 52)
        }),
        frameRate: 12,
        repeat: -1
      });

      coffeeMachine = this.add.sprite(659, 397, 'coffee_machine', 0).setOrigin(0.5).setDepth(99);
      coffeeMachine.anims.play('coffee_machine', true);

      serverroom = this.add.sprite(1021, 142, 'serverroom', 0).setOrigin(0.5).setDepth(2);

      starIdle = this.add.sprite(640, 176, 'star_idle', 0).setOrigin(0.5).setScale(1.35).setDepth(40);
      starIdle.anims.play('star_idle', true);

      starWorking = this.add.sprite(217, 333, 'star_working', 1).setOrigin(0.5).setScale(0.66).setDepth(900);
      starWorking.setVisible(false);
      starWorking.anims.play('star_working', true);

      errorBug = this.add.sprite(1007, 221, 'error_bug', 0).setOrigin(0.5).setScale(0.9).setDepth(50);
      errorBug.anims.play('error_bug', true);

      syncAnim = this.add.sprite(1157, 592, 'sync_anim', 0).setOrigin(0.5).setDepth(40);
      syncAnim.anims.play('sync_anim', true);

      this.tweens.add({
        targets: cat,
        y: cat.y - 5,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      bubbleTimer = this.time.addEvent({
        delay: 8000,
        loop: true,
        callback: () => showBubble(this, 'main')
      });

      catBubbleTimer = this.time.addEvent({
        delay: 18000,
        loop: true,
        callback: () => showBubble(this, 'cat')
      });

      updateSceneState();

      function updateSceneState() {
        const mode = sceneState.securityFailed
          ? 'error'
          : sceneState.syncActive
            ? 'syncing'
            : sceneState.workingActive
              ? 'working'
              : 'idle';

        // Original implementation hides the main star sprite in all settled states.
        starIdle.setVisible(false);
        starWorking.setVisible(false);
        starWorking.setAlpha(0);

        if (mode === 'working') {
          starWorking.setVisible(true);
          starWorking.setAlpha(1);
        }

        if (sceneState.syncActive) {
          syncAnim.setVisible(true);
          if (!syncAnim.anims.isPlaying) {
            syncAnim.anims.play('sync_anim', true);
          }
        } else {
          syncAnim.setVisible(false);
          syncAnim.anims.stop();
          syncAnim.setFrame(0);
        }

        if (sceneState.securityFailed) {
          errorBug.setVisible(true);
          if (!errorBug.anims.isPlaying) {
            errorBug.anims.play('error_bug', true);
          }
        } else {
          errorBug.setVisible(false);
          errorBug.anims.stop();
          errorBug.setFrame(0);
          errorBug.x = 1007;
          errorDirection = 1;
        }

        if (sceneState.workingActive || sceneState.syncActive || sceneState.securityFailed) {
          if (!serverroom.anims.isPlaying) {
            serverroom.anims.play('serverroom_on', true);
          }
        } else {
          serverroom.anims.stop();
          serverroom.setFrame(0);
        }

        Object.entries(zoneHighlights).forEach(([zoneId, highlight]) => {
          highlight.setStrokeStyle(
            3,
            sceneState.selectedZoneId === zoneId ? 0x5eead4 : 0xfbbf24,
            sceneState.selectedZoneId === zoneId ? 0.95 : 0.18
          );
          highlight.setFillStyle(
            sceneState.selectedZoneId === zoneId ? 0x5eead4 : 0xffffff,
            sceneState.selectedZoneId === zoneId ? 0.08 : 0
          );
        });
      }

      (this as any).updateSceneState = updateSceneState;
      (this as any).stepLiveScene = () => {
        if (!sceneState.securityFailed || !errorBug?.visible) {
          return;
        }

        errorBug.x += 0.6 * errorDirection;

        if (errorBug.x >= 1111) {
          errorBug.x = 1111;
          errorDirection = -1;
        } else if (errorBug.x <= 1007) {
          errorBug.x = 1007;
          errorDirection = 1;
        }
      };
      (this as any).cleanupLiveScene = () => {
        bubbleTimer?.remove(false);
        catBubbleTimer?.remove(false);
        destroyBubble('main');
        destroyBubble('cat');
      };
    },
    update(this: any) {
      this.stepLiveScene?.();
    }
  };

  const game = new PhaserRef.Game({
    type: PhaserRef.AUTO,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    parent: container,
    backgroundColor: '#0b1020',
    pixelArt: true,
    scene
  });

  return {
    setSelectedZone(zoneId) {
      sceneState.selectedZoneId = zoneId;
      const phaserScene = game.scene.scenes[0] as any;
      phaserScene?.updateSceneState?.();
    },
    setRuntimeState(next) {
      sceneState.securityFailed = next.securityFailed;
      sceneState.syncActive = next.syncActive;
      sceneState.workingActive = next.workingActive;
      const phaserScene = game.scene.scenes[0] as any;
      phaserScene?.updateSceneState?.();
    },
    destroy() {
      const phaserScene = game.scene.scenes[0] as any;
      phaserScene?.cleanupLiveScene?.();
      game.destroy(true);
    }
  };
}

export function PhaserOfficeCanvas(props: PhaserOfficeCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<SceneApi | null>(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      await loadPhaserScript();

      if (!mounted || !containerRef.current) {
        return;
      }

      sceneRef.current = createScene(containerRef.current, props);
      props.onReady?.();
    }

    init();

    return () => {
      mounted = false;
      sceneRef.current?.destroy();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.setSelectedZone(props.selectedZoneId);
  }, [props.selectedZoneId]);

  useEffect(() => {
    sceneRef.current?.setRuntimeState({
      securityFailed: props.securityFailed,
      syncActive: props.syncActive,
      workingActive: props.workingActive
    });
  }, [props.securityFailed, props.syncActive, props.workingActive]);

  return <div ref={containerRef} className="office-phaser-root" />;
}
