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
      this.load.spritesheet('star_idle', '/star-office/star-idle-v5.png', {
        frameWidth: 128,
        frameHeight: 128
      });
      this.load.spritesheet('star_working', '/star-office/star-working-spritesheet-grid.webp', {
        frameWidth: 230,
        frameHeight: 144
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
      this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'office_bg');

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
          start: 0,
          end: getTextureFrameEnd(this, 'star_working', 191)
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

      starWorking = this.add.sprite(217, 333, 'star_working', 0).setOrigin(0.5).setScale(1.32).setDepth(900);
      starWorking.anims.play('star_working', true);

      errorBug = this.add.sprite(1007, 221, 'error_bug', 0).setOrigin(0.5).setScale(0.9).setDepth(50);
      errorBug.anims.play('error_bug', true);

      syncAnim = this.add.sprite(1157, 592, 'sync_anim', 0).setOrigin(0.5).setDepth(40);
      syncAnim.anims.play('sync_anim', true);

      updateSceneState();

      function updateSceneState() {
        starWorking.setVisible(sceneState.workingActive);
        starIdle.setVisible(!sceneState.workingActive);

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
