/**
 * 死神VS火影 HD：重制版 (Bleach vs Naruto HD Rebirth)
 * 2D 动作格斗物理与状态机引擎内核
 * 支持 Node.js 自动化单元测试与浏览器 Canvas 60FPS 渲染
 */

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    const data = require('./data.js');
    module.exports = factory(data);
  } else {
    root.BVN_ENGINE = factory(root.BVN_DATA);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (BVN_DATA) {
  'use strict';

  const STAGE_WIDTH = 1000;
  const STAGE_FLOOR_Y = 460;
  const GRAVITY = 0.68;
  const MAX_FALL_SPEED = 16;
  const GROUND_FRICTION = 0.82;
  const AIR_FRICTION = 0.94;

  // 战斗角色实例类
  class Fighter {
    constructor(charConfig, playerIndex = 1, isAi = false) {
      this.config = JSON.parse(JSON.stringify(charConfig));
      this.playerIndex = playerIndex;
      this.isAi = isAi;

      // 坐标与朝向
      this.x = playerIndex === 1 ? 260 : 740;
      this.y = STAGE_FLOOR_Y;
      this.vx = 0;
      this.vy = 0;
      this.facing = playerIndex === 1 ? 1 : -1;
      this.onGround = true;

      // 属性与数值
      this.maxHp = this.config.hp || 1000;
      this.hp = this.maxHp;
      this.maxEnergy = 300; // 3条气，每条100
      this.energy = 100;    // 开局赠送1条气

      // 状态机
      this.state = 'idle'; // idle, walk, jump, dash, attack, skill, special, ultimate, hurt, knockdown, wakeup, guard
      this.currentMoveKey = null;
      this.currentMove = null;
      this.moveFrame = 0;
      this.stateTimer = 0;
      this.hitstun = 0;
      this.blockstun = 0;
      this.invincibleTimer = 0;
      this.superArmor = 0;
      this.knockdownTimer = 0;
      this.isGuarding = false;

      // 连击与机制
      this.comboCount = 0;        // 造成对手连击数
      this.beingComboed = 0;      // 自身受击连续次数
      this.damageScaling = 1.0;   // 连击伤害保护递减
      this.substituteCd = 0;      // 替身术冷却（秒）
      this.substituteMaxCd = 10;
      this.assistCd = 0;          // 援助冷却（秒）
      this.assistMaxCd = 18;

      // 觉醒系统 (Bankai / Kyuubi)
      this.isAwakened = false;
      this.awakeningTimer = 0;
      this.awakeningDuration = 15; // 持续15秒

      // 输入缓冲
      this.inputBuffer = [];
      this.doubleTapDash = { dir: 0, timer: 0 };
    }

    // 重置角色单局状态
    reset(startX, facing) {
      this.x = startX;
      this.y = STAGE_FLOOR_Y;
      this.vx = 0;
      this.vy = 0;
      this.facing = facing;
      this.onGround = true;
      this.hp = this.maxHp;
      this.energy = 100;
      this.state = 'idle';
      this.currentMoveKey = null;
      this.currentMove = null;
      this.moveFrame = 0;
      this.stateTimer = 0;
      this.hitstun = 0;
      this.blockstun = 0;
      this.invincibleTimer = 0;
      this.superArmor = 0;
      this.knockdownTimer = 0;
      this.isGuarding = false;
      this.comboCount = 0;
      this.beingComboed = 0;
      this.damageScaling = 1.0;
      this.substituteCd = 0;
      this.assistCd = 0;
      this.isAwakened = false;
      this.awakeningTimer = 0;
    }

    // 获取当前受击盒 (Hurtbox)
    getHurtbox() {
      // 蹲下/倒地/浮空自适应
      if (this.state === 'knockdown') {
        return {
          x: this.x - 45,
          y: this.y - 20,
          w: 90,
          h: 20
        };
      }
      return {
        x: this.x - 30,
        y: this.y - 85,
        w: 60,
        h: 85
      };
    }

    // 获取当前生效攻击判定盒 (Hitbox)
    getActiveHitbox() {
      if (!this.currentMove) return null;
      const m = this.currentMove;
      // 判定是否在 active 帧区间
      if (this.moveFrame >= m.startup && this.moveFrame < m.startup + m.active) {
        if (!m.hitbox) return null;
        const hb = m.hitbox;
        const rx = this.facing === 1 ? this.x + hb.x : this.x - hb.x - hb.w;
        return {
          x: rx,
          y: this.y + hb.y,
          w: hb.w,
          h: hb.h,
          damage: Math.round(m.damage * (this.isAwakened ? 1.25 : 1.0)),
          hitstun: m.hitstun || 18,
          blockstun: m.blockstun || 8,
          knockbackX: (m.knockbackX || 4) * this.facing,
          knockbackY: m.knockbackY || 0,
          knockup: !!m.knockup,
          sound: m.sound,
          isSuper: !!m.isSuper
        };
      }
      return null;
    }

    // 核心物理与状态帧推进 (60fps)
    update(dt, opponent, engine) {
      // 冷却计时递减
      if (this.substituteCd > 0) this.substituteCd = Math.max(0, this.substituteCd - dt);
      if (this.assistCd > 0) this.assistCd = Math.max(0, this.assistCd - dt);
      if (this.invincibleTimer > 0) this.invincibleTimer = Math.max(0, this.invincibleTimer - dt);

      // 觉醒计时
      if (this.isAwakened) {
        this.awakeningTimer -= dt;
        if (this.awakeningTimer <= 0) {
          this.isAwakened = false;
          engine.emitFloatingText(this.x, this.y - 100, '觉醒结束', '#94a3b8');
        }
      }

      // 重力与位移更新
      if (!this.onGround) {
        this.vy += GRAVITY;
        if (this.vy > MAX_FALL_SPEED) this.vy = MAX_FALL_SPEED;
        this.vx *= AIR_FRICTION;
      } else {
        this.vx *= GROUND_FRICTION;
      }

      this.x += this.vx;
      this.y += this.vy;

      // 地面检测
      if (this.y >= STAGE_FLOOR_Y) {
        this.y = STAGE_FLOOR_Y;
        this.vy = 0;
        if (!this.onGround) {
          this.onGround = true;
          // 空中着地重置
          if (this.state === 'jump' || (this.state === 'attack' && this.currentMoveKey === 'jumpAttack')) {
            this.state = 'idle';
            this.currentMove = null;
          }
        }
      } else {
        this.onGround = false;
      }

      // 战场边缘阻挡限制
      const margin = 40;
      if (this.x < margin) {
        this.x = margin;
        this.vx = 0;
      } else if (this.x > STAGE_WIDTH - margin) {
        this.x = STAGE_WIDTH - margin;
        this.vx = 0;
      }

      // 状态机处理
      this.stateTimer += dt;

      // 倒地与起身保护
      if (this.state === 'knockdown') {
        this.knockdownTimer -= dt;
        if (this.knockdownTimer <= 0) {
          this.state = 'wakeup';
          this.invincibleTimer = 0.5; // 起身0.5秒无敌
          this.stateTimer = 0;
        }
        return;
      }

      if (this.state === 'wakeup') {
        if (this.stateTimer >= 0.25) {
          this.state = 'idle';
          this.beingComboed = 0;
        }
        return;
      }

      // 受击僵直
      if (this.state === 'hurt') {
        this.hitstun--;
        if (this.hitstun <= 0) {
          this.state = 'idle';
          this.currentMove = null;
        }
        return;
      }

      // 招式动作帧推进
      if (['attack', 'skill', 'special', 'ultimate'].includes(this.state)) {
        this.moveFrame++;
        const m = this.currentMove;
        if (!m) {
          this.state = 'idle';
          return;
        }

        const totalFrames = m.startup + m.active + m.recovery;

        // 技能瞬步/突进位移处理
        if (m.dashRush && this.moveFrame >= m.startup && this.moveFrame <= m.startup + m.active) {
          this.vx = (m.dashRush * 0.4) * this.facing;
        }

        // 招式发射投射物
        if (m.projectile && this.moveFrame === m.startup) {
          engine.spawnProjectile(this, m.projectile);
        }

        if (this.moveFrame >= totalFrames) {
          this.state = 'idle';
          this.currentMove = null;
          this.currentMoveKey = null;
          this.moveFrame = 0;
        }
      }

      // 自动面向敌人（处于站立或跑动时）
      if (opponent && (this.state === 'idle' || this.state === 'walk')) {
        this.facing = opponent.x >= this.x ? 1 : -1;
      }
    }

    // 处理移动输入
    handleMoveInput(dx) {
      if (this.state === 'hurt' || this.state === 'knockdown' || this.state === 'wakeup') return;
      if (['attack', 'skill', 'special', 'ultimate'].includes(this.state)) return;

      const spd = (this.isAwakened ? this.config.speed * 1.25 : this.config.speed);
      if (dx !== 0) {
        this.vx = dx * spd;
        if (this.onGround && this.state !== 'dash') {
          this.state = 'walk';
        }
        this.facing = dx > 0 ? 1 : -1;
      } else {
        if (this.onGround && this.state === 'walk') {
          this.state = 'idle';
        }
      }
    }

    // 跳跃
    handleJump() {
      if (this.state === 'hurt' || this.state === 'knockdown' || this.state === 'wakeup') return;
      if (['attack', 'skill', 'special', 'ultimate'].includes(this.state)) return;
      if (!this.onGround) return;

      const jf = this.isAwakened ? this.config.jumpForce * 1.1 : this.config.jumpForce;
      this.vy = -jf;
      this.onGround = false;
      this.state = 'jump';
    }

    // 瞬步 / 瞬身滑行 (Dash)
    handleDash() {
      if (this.state === 'hurt' || this.state === 'knockdown' || this.state === 'wakeup') return;
      if (['attack', 'skill', 'special', 'ultimate'].includes(this.state)) return;

      const dashSpeed = this.isAwakened ? this.config.dashSpeed * 1.2 : this.config.dashSpeed;
      this.vx = this.facing * dashSpeed;
      this.invincibleTimer = 0.22; // 瞬步附带无敌帧
      this.state = 'dash';
      setTimeout(() => {
        if (this.state === 'dash') this.state = 'idle';
      }, 180);
    }

    // 普攻动作 (J键 - 三段连击机制)
    handleAttack() {
      if (this.state === 'hurt' || this.state === 'knockdown' || this.state === 'wakeup') return;

      // 空中跳斩
      if (!this.onGround) {
        if (this.state !== 'attack') {
          this.startMove('jumpAttack', this.config.moves.jumpAttack);
        }
        return;
      }

      // 地面三段连击
      if (this.state === 'idle' || this.state === 'walk' || this.state === 'dash') {
        this.startMove('attack1', this.config.moves.attack1);
      } else if (this.state === 'attack') {
        // 连招判定窗口
        const m = this.currentMove;
        if (this.currentMoveKey === 'attack1' && this.moveFrame >= m.startup + 1) {
          this.startMove('attack2', this.config.moves.attack2);
        } else if (this.currentMoveKey === 'attack2' && this.moveFrame >= m.startup + 1) {
          this.startMove('attack3', this.config.moves.attack3);
        }
      }
    }

    // 释放技能 (U键)
    handleSkill() {
      if (this.state === 'hurt' || this.state === 'knockdown' || this.state === 'wakeup') return;
      if (this.state === 'ultimate') return;
      this.startMove('skill', this.config.moves.skill);
    }

    // 释放特技 (I键 - 需30点能量)
    handleSpecial() {
      if (this.state === 'hurt' || this.state === 'knockdown' || this.state === 'wakeup') return;
      if (this.state === 'ultimate') return;
      const cost = this.config.moves.special.cost || 30;
      if (this.energy < cost) return false;
      this.energy -= cost;
      this.startMove('special', this.config.moves.special);
      return true;
    }

    // 释放奥义大招 (O键 - 需100点能量 / 1条气)
    handleUltimate() {
      if (this.state === 'hurt' || this.state === 'knockdown' || this.state === 'wakeup') return false;
      const cost = this.config.moves.ultimate.energyCost || 100;
      if (this.energy < cost) return false;
      this.energy -= cost;
      this.startMove('ultimate', this.config.moves.ultimate);
      return true;
    }

    // 启动招式动作
    startMove(key, moveDef) {
      if (!moveDef) return;
      this.state = ['attack1', 'attack2', 'attack3', 'jumpAttack'].includes(key) ? 'attack' :
                   (key === 'skill' ? 'skill' : (key === 'special' ? 'special' : 'ultimate'));
      this.currentMoveKey = key;
      this.currentMove = moveDef;
      this.moveFrame = 0;
      this.stateTimer = 0;
      if (moveDef.invincible) {
        this.invincibleTimer = moveDef.invincible / 60;
      }
    }

    // 替身术 / 灵爆 (Combo Breaker - 消耗 1 条气 / 100能量，破除被连死)
    handleSubstitute(engine) {
      if (this.substituteCd > 0) return false;
      if (this.energy < 80) return false;
      if (this.state !== 'hurt' && this.beingComboed === 0) return false;

      this.energy -= 80;
      this.substituteCd = this.substituteMaxCd;
      this.invincibleTimer = 0.6; // 替身术瞬移带0.6秒无敌
      this.hitstun = 0;
      this.state = 'idle';
      this.currentMove = null;

      // 瞬移到对手背后或反方向
      const opp = engine.getOpponent(this);
      if (opp) {
        this.x = opp.x - (opp.facing * 90);
        this.facing = opp.facing;
      }
      this.vx = 0;
      this.vy = 0;

      engine.emitSubstituteEffect(this.x, this.y);
      engine.emitFloatingText(this.x, this.y - 70, '替身术·脱离！', '#38bdf8');
      return true;
    }

    // 觉醒 / 爆气变身 (满能量或超额时触发)
    handleAwaken(engine) {
      if (this.isAwakened) return false;
      if (this.energy < 100) return false;

      this.energy -= 100;
      this.isAwakened = true;
      this.awakeningTimer = this.awakeningDuration;
      this.invincibleTimer = 0.5;

      engine.emitFloatingText(this.x, this.y - 110, `【${this.config.awakeningName}】觉醒！`, '#f59e0b');
      engine.shakeScreen(10, 0.4);
      return true;
    }

    // 受击结算
    takeHit(hitbox, attacker, engine) {
      if (this.invincibleTimer > 0) return false;
      if (this.state === 'knockdown') return false;

      // 连击保护伤害衰减 (1.0 -> 0.85 -> 0.72 -> 0.60 -> 0.50)
      this.beingComboed++;
      attacker.comboCount++;
      const scaling = Math.max(0.45, 1.0 - (this.beingComboed - 1) * 0.12);
      const actualDmg = Math.max(5, Math.round(hitbox.damage * scaling));

      this.hp = Math.max(0, this.hp - actualDmg);
      attacker.energy = Math.min(attacker.maxEnergy, attacker.energy + (hitbox.isSuper ? 3 : 12));
      this.energy = Math.min(this.maxEnergy, this.energy + 8); // 受击者获得怒气补偿

      // 顿帧 (Hitstop)
      engine.triggerHitstop(hitbox.isSuper ? 14 : 5);

      // 受击动画与击退位移
      this.state = 'hurt';
      this.currentMove = null;
      this.hitstun = hitbox.hitstun || 20;
      this.vx = hitbox.knockbackX;
      this.vy = hitbox.knockbackY;

      // 击飞 / 击倒判定
      if (hitbox.knockup || this.beingComboed >= 6 || hitbox.isSuper) {
        this.vy = hitbox.knockbackY < 0 ? hitbox.knockbackY : -9;
        this.onGround = false;
        if (this.beingComboed >= 6) {
          this.state = 'knockdown';
          this.knockdownTimer = 0.8;
        }
      }

      // 飘字伤害与火花
      engine.emitFloatingText(this.x, this.y - 60, `-${actualDmg}`, hitbox.isSuper ? '#ef4444' : '#fbbf24');
      engine.emitHitspark(this.x, this.y - 40, hitbox.isSuper);

      if (this.hp <= 0) {
        this.state = 'knockdown';
        this.knockdownTimer = 999;
        engine.checkMatchOver();
      }

      return true;
    }
  }

  // 投射物类 (月牙天冲、手里剑、豪火球、冰鸟)
  class Projectile {
    constructor(owner, config, x, y, facing) {
      this.owner = owner;
      this.config = config;
      this.x = x;
      this.y = y;
      this.facing = facing;
      this.vx = config.speed * facing;
      this.life = config.life || 60;
      this.w = config.w || 40;
      this.h = config.h || 30;
      this.active = true;
    }

    update(dt) {
      this.x += this.vx;
      this.life--;
      if (this.life <= 0) {
        this.active = false;
      }
    }

    getHitbox() {
      return {
        x: this.x - this.w / 2,
        y: this.y - this.h / 2,
        w: this.w,
        h: this.h,
        damage: Math.round(55 * (this.owner.isAwakened ? 1.25 : 1.0)),
        hitstun: 24,
        knockbackX: 5 * this.facing,
        knockbackY: -2,
        isSuper: false
      };
    }
  }

  // 战斗引擎主管控制器
  class BattleEngine {
    constructor(options = {}) {
      this.stage = options.stage || BVN_DATA.STAGES[0];
      this.mode = options.mode || 'arcade';
      this.aiDifficulty = options.difficulty || 'normal';

      const p1Char = options.p1Char || BVN_DATA.CHARACTERS[0];
      const p2Char = options.p2Char || BVN_DATA.CHARACTERS[1];

      this.p1 = new Fighter(p1Char, 1, false);
      this.p2 = new Fighter(p2Char, 2, options.p2IsAi !== false);

      this.p1Assist = options.p1Assist || BVN_DATA.ASSISTS[0];
      this.p2Assist = options.p2Assist || BVN_DATA.ASSISTS[1];

      this.projectiles = [];
      this.particles = [];
      this.floatingTexts = [];
      this.hitstopFrames = 0;
      this.screenShakeIntensity = 0;
      this.screenShakeTimer = 0;
      this.impactFrameTimer = 0;

      this.roundTimer = 99; // 99秒回合
      this.gameState = 'fighting'; // ready, fighting, paused, victory, defeat
      this.winner = null;

      this.callbacks = {
        onPlaySound: options.onPlaySound || (() => {}),
        onMatchEnd: options.onMatchEnd || (() => {})
      };
    }

    getOpponent(fighter) {
      return fighter.playerIndex === 1 ? this.p2 : this.p1;
    }

    triggerHitstop(frames) {
      this.hitstopFrames = frames;
      if (frames > 10) {
        this.impactFrameTimer = 4; // 触发黑白冲击帧定格
      }
    }

    shakeScreen(intensity, duration) {
      this.screenShakeIntensity = intensity;
      this.screenShakeTimer = duration;
    }

    emitFloatingText(x, y, text, color = '#ffffff') {
      this.floatingTexts.push({
        x: x + (Math.random() * 20 - 10),
        y,
        text,
        color,
        vy: -1.8,
        alpha: 1.0,
        life: 45
      });
    }

    emitHitspark(x, y, isHeavy = false) {
      const count = isHeavy ? 16 : 8;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * (isHeavy ? 8 : 4) + 2;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: isHeavy ? (Math.random() > 0.5 ? '#ef4444' : '#fbbf24') : '#38bdf8',
          size: Math.random() * 4 + 2,
          alpha: 1.0,
          decay: 0.05
        });
      }
    }

    emitSubstituteEffect(x, y) {
      for (let i = 0; i < 20; i++) {
        this.particles.push({
          x: x + (Math.random() * 40 - 20),
          y: y + (Math.random() * 40 - 20),
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          color: '#cbd5e1',
          size: Math.random() * 8 + 4,
          alpha: 0.8,
          decay: 0.04
        });
      }
    }

    spawnProjectile(fighter, projConfig) {
      const spawnX = fighter.x + (projConfig.w / 2 + 30) * fighter.facing;
      const spawnY = fighter.y - 45;
      const p = new Projectile(fighter, projConfig, spawnX, spawnY, fighter.facing);
      this.projectiles.push(p);
      this.callbacks.onPlaySound(projConfig.sound || 'slash_light');
    }

    // 呼叫援助 (Assist)
    callAssist(playerIndex) {
      const fighter = playerIndex === 1 ? this.p1 : this.p2;
      const assist = playerIndex === 1 ? this.p1Assist : this.p2Assist;
      if (fighter.assistCd > 0) return false;

      fighter.assistCd = assist.cooldown || 18;
      const opp = this.getOpponent(fighter);

      this.emitFloatingText(fighter.x, fighter.y - 90, `援助：${assist.name}！`, assist.avatarColor);
      this.callbacks.onPlaySound(assist.sound || 'assist_call');

      // 援助技能效果立即执行
      const eff = assist.effect;
      if (eff.type === 'freeze') {
        opp.state = 'hurt';
        opp.hitstun = Math.round(eff.duration * 60);
        opp.takeHit({ damage: eff.damage, hitstun: 90, knockbackX: 0, knockbackY: 0 }, fighter, this);
        this.emitFloatingText(opp.x, opp.y - 80, '绝对冰封！', '#93c5fd');
      } else if (eff.type === 'burn') {
        opp.takeHit({ damage: eff.damage, hitstun: 30, knockbackX: 3 * fighter.facing, knockbackY: 0 }, fighter, this);
        this.emitFloatingText(opp.x, opp.y - 80, '天照不灭黑炎！', '#f43f5e');
      } else if (eff.type === 'heal_shield') {
        fighter.hp = Math.min(fighter.maxHp, fighter.hp + eff.healAmount);
        fighter.invincibleTimer = 1.5;
        this.emitFloatingText(fighter.x, fighter.y - 80, `治愈 +${eff.healAmount}`, '#4ade80');
      } else if (eff.type === 'drain_silence') {
        opp.energy = Math.max(0, opp.energy - eff.drainEnergy);
        fighter.energy = Math.min(fighter.maxEnergy, fighter.energy + eff.drainEnergy);
        opp.takeHit({ damage: eff.damage, hitstun: 25, knockbackX: 0, knockbackY: 0 }, fighter, this);
        this.emitFloatingText(opp.x, opp.y - 80, '寄坏虫噬灵！', '#34d399');
      }
      return true;
    }

    // 碰撞检测 AABB
    checkCollision(rect1, rect2) {
      return (
        rect1.x < rect2.x + rect2.w &&
        rect1.x + rect1.w > rect2.x &&
        rect1.y < rect2.y + rect2.h &&
        rect1.y + rect1.h > rect2.y
      );
    }

    // AI 决策行为树 (Easy / Normal / Hard)
    updateAI(dt) {
      if (!this.p2.isAi || this.gameState !== 'fighting') return;
      const ai = this.p2;
      const p1 = this.p1;
      const cfg = BVN_DATA.AI_CONFIGS[this.aiDifficulty] || BVN_DATA.AI_CONFIGS.normal;

      const dist = Math.abs(ai.x - p1.x);

      // 1. 被连招时替身反打
      if (ai.state === 'hurt' && ai.beingComboed >= 2 && Math.random() < cfg.substituteChance) {
        ai.handleSubstitute(this);
        return;
      }

      // 2. 满怒气优先大招
      if (ai.energy >= 100 && dist < 220 && Math.random() < cfg.superChance) {
        if (ai.handleUltimate()) {
          this.callbacks.onPlaySound('super_activate');
          return;
        }
      }

      // 3. 特技与技能中距离牵制
      if (dist > 180 && dist < 360) {
        if (ai.energy >= 30 && Math.random() < 0.25) {
          ai.handleSpecial();
          return;
        }
        if (Math.random() < 0.2) {
          ai.handleSkill();
          return;
        }
      }

      // 4. 援助技能呼叫
      if (ai.assistCd <= 0 && Math.random() < 0.15) {
        this.callAssist(2);
      }

      // 5. 走位与近战压制
      if (dist > 75) {
        const dir = p1.x > ai.x ? 1 : -1;
        ai.handleMoveInput(dir);
        if (Math.random() < 0.05 && dist > 150) {
          ai.handleDash();
        }
      } else {
        // 近身普攻连击
        if (Math.random() < cfg.attackAggression) {
          ai.handleAttack();
        }
      }
    }

    // 胜负判定
    checkMatchOver() {
      if (this.p1.hp <= 0 && this.p2.hp <= 0) {
        this.gameState = 'defeat';
        this.winner = 0; // 平局
      } else if (this.p2.hp <= 0) {
        this.gameState = 'victory';
        this.winner = 1;
      } else if (this.p1.hp <= 0) {
        this.gameState = 'defeat';
        this.winner = 2;
      }
      if (this.winner !== null) {
        this.callbacks.onMatchEnd(this.winner);
      }
    }

    // 主战斗帧迭代 (dt 通常为 1/60 秒)
    step(dt = 1 / 60) {
      if (this.gameState === 'paused') return;

      // 震屏与定格递减
      if (this.screenShakeTimer > 0) {
        this.screenShakeTimer -= dt;
      }
      if (this.impactFrameTimer > 0) {
        this.impactFrameTimer--;
      }

      // 顿帧拦截：顿帧期间角色物理暂停，粒子依然微动
      if (this.hitstopFrames > 0) {
        this.hitstopFrames--;
        return;
      }

      // 回合倒计时
      if (this.gameState === 'fighting') {
        this.roundTimer -= dt;
        if (this.roundTimer <= 0) {
          this.roundTimer = 0;
          if (this.p1.hp > this.p2.hp) {
            this.gameState = 'victory';
            this.winner = 1;
          } else if (this.p2.hp > this.p1.hp) {
            this.gameState = 'defeat';
            this.winner = 2;
          } else {
            this.gameState = 'defeat';
            this.winner = 0;
          }
          this.callbacks.onMatchEnd(this.winner);
        }
      }

      // AI 决策
      this.updateAI(dt);

      // 角色更新
      this.p1.update(dt, this.p2, this);
      this.p2.update(dt, this.p1, this);

      // 招式碰撞判定 (P1 攻击 P2)
      const p1Hitbox = this.p1.getActiveHitbox();
      if (p1Hitbox) {
        const p2Hurtbox = this.p2.getHurtbox();
        if (this.checkCollision(p1Hitbox, p2Hurtbox)) {
          this.p2.takeHit(p1Hitbox, this.p1, this);
          this.callbacks.onPlaySound(p1Hitbox.sound || 'slash_light');
        }
      }

      // 招式碰撞判定 (P2 攻击 P1)
      const p2Hitbox = this.p2.getActiveHitbox();
      if (p2Hitbox) {
        const p1Hurtbox = this.p1.getHurtbox();
        if (this.checkCollision(p2Hitbox, p1Hurtbox)) {
          this.p1.takeHit(p2Hitbox, this.p2, this);
          this.callbacks.onPlaySound(p2Hitbox.sound || 'slash_light');
        }
      }

      // 投射物更新与命中判定
      for (let i = this.projectiles.length - 1; i >= 0; i--) {
        const p = this.projectiles[i];
        p.update(dt);
        if (!p.active) {
          this.projectiles.splice(i, 1);
          continue;
        }

        const target = p.owner === this.p1 ? this.p2 : this.p1;
        const targetHurtbox = target.getHurtbox();
        if (this.checkCollision(p.getHitbox(), targetHurtbox)) {
          target.takeHit(p.getHitbox(), p.owner, this);
          this.emitHitspark(p.x, p.y, false);
          this.projectiles.splice(i, 1);
        }
      }

      // 粒子与飘字更新
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const pt = this.particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.alpha -= pt.decay;
        if (pt.alpha <= 0) {
          this.particles.splice(i, 1);
        }
      }

      for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
        const ft = this.floatingTexts[i];
        ft.y += ft.vy;
        ft.life--;
        ft.alpha = Math.max(0, ft.life / 45);
        if (ft.life <= 0) {
          this.floatingTexts.splice(i, 1);
        }
      }
    }
  }

  return {
    STAGE_WIDTH,
    STAGE_FLOOR_Y,
    Fighter,
    Projectile,
    BattleEngine
  };
});
