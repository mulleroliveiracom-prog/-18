import React, { useEffect, useRef } from 'react';

interface NeonPulseGameProps {
  userName: string;
  partnerName: string;
  onGameOver: (score: number) => void;
}

export const NeonPulseGame: React.FC<NeonPulseGameProps> = ({ userName, partnerName, onGameOver }) => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<any>(null);

  useEffect(() => {
    if (!gameContainerRef.current) return;

    const Phaser = (window as any).Phaser;
    if (!Phaser) return;

    const config = {
      type: Phaser.AUTO,
      width: gameContainerRef.current.clientWidth,
      height: 300,
      parent: gameContainerRef.current,
      backgroundColor: '#0f1525',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: {
        preload: preload,
        create: create,
        update: update
      }
    };

    let player: any;
    let crystals: any;
    let obstacles: any;
    let score = 0;
    let scoreText: any;
    let namesText: any;
    let currentLane = 0; // 0 for Left, 1 for Right
    const lanes = [config.width * 0.3, config.width * 0.7];
    let isGameOver = false;

    function preload(this: any) {}

    function create(this: any) {
      // Names at the top
      namesText = this.add.text(config.width / 2, 20, `${userName} ❤️ ${partnerName}`, {
        fontSize: '10px',
        fontWeight: '900',
        color: '#ffffff',
        fontFamily: 'Montserrat'
      }).setOrigin(0.5).setAlpha(0.6);

      // Score
      scoreText = this.add.text(config.width / 2, 45, '0', {
        fontSize: '24px',
        fontWeight: '900',
        color: '#FFD700',
        fontFamily: 'Montserrat'
      }).setOrigin(0.5);

      // Player
      player = this.add.circle(lanes[currentLane], 250, 12, 0xFF007A);
      this.physics.add.existing(player);
      player.body.setCircle(12);

      // Groups
      crystals = this.physics.add.group();
      obstacles = this.physics.add.group();

      // Input
      this.input.on('pointerdown', () => {
        if (isGameOver) return;
        currentLane = currentLane === 0 ? 1 : 0;
        this.tweens.add({
          targets: player,
          x: lanes[currentLane],
          duration: 100,
          ease: 'Power2'
        });
      });

      // Events
      this.time.addEvent({
        delay: 800,
        callback: spawnObject,
        callbackScope: this,
        loop: true
      });

      // Overlap
      this.physics.add.overlap(player, crystals, collectCrystal, null, this);
      this.physics.add.overlap(player, obstacles, hitObstacle, null, this);
    }

    function spawnObject(this: any) {
      if (isGameOver) return;
      const lane = Phaser.Math.Between(0, 1);
      const isCrystal = Phaser.Math.Between(0, 10) > 4;

      if (isCrystal) {
        const crystal = crystals.create(lanes[lane], -20, null);
        crystal.setDisplaySize(15, 15);
        // Using graphics as a placeholder for crystal shape
        const graphics = this.add.graphics();
        graphics.fillStyle(0xFFD700, 1);
        graphics.fillCircle(0, 0, 8);
        crystal.setTexture(null); // Just use a circle/rect if texture not loaded
        // For simplicity with primitive shapes in Phaser arcade group
        crystal.body.velocity.y = 200 + score * 0.5;
      } else {
        const obstacle = obstacles.create(lanes[lane], -20, null);
        obstacle.setDisplaySize(25, 25);
        obstacle.body.velocity.y = 200 + score * 0.5;
      }
    }

    function collectCrystal(this: any, p: any, crystal: any) {
      crystal.destroy();
      score += 50;
      scoreText.setText(score);
      
      // Feedback
      this.cameras.main.flash(100, 255, 0, 122, 0.1);
      
      if (score >= 500) {
        scoreText.setColor('#00ff00');
        const msg = this.add.text(config.width / 2, 150, 'CONEXÃO MÁXIMA!', {
          fontSize: '12px',
          fontWeight: '900',
          color: '#00ff00'
        }).setOrigin(0.5);
        this.tweens.add({ targets: msg, alpha: 0, duration: 1000, onComplete: () => msg.destroy() });
      }
    }

    function hitObstacle(this: any, p: any, obs: any) {
      isGameOver = true;
      this.physics.pause();
      this.cameras.main.shake(300, 0.02);
      
      player.setFillStyle(0x555555);
      
      const overText = this.add.text(config.width / 2, 150, 'GAME OVER', {
        fontSize: '32px',
        fontWeight: '900',
        color: '#ff0000'
      }).setOrigin(0.5);

      setTimeout(() => {
        onGameOver(score);
      }, 1500);
    }

    function update(this: any) {
      crystals.children.iterate((child: any) => {
        if (child && child.y > 320) child.destroy();
      });
      obstacles.children.iterate((child: any) => {
        if (child && child.y > 320) child.destroy();
      });
    }

    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
  }, []);

  return (
    <div className="w-full bg-black rounded-3xl overflow-hidden shadow-2xl relative">
       <div ref={gameContainerRef} className="w-full h-[300px]" />
       <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
         <p className="text-[7px] text-zinc-600 font-black uppercase tracking-widest">TOQUE PARA MUDAR DE LADO</p>
       </div>
    </div>
  );
};