/**
 * 死神VS火影 HD：重制版 (Bleach vs Naruto HD Rebirth)
 * 手机触控交互引擎与键盘双轨控制器
 * 支持虚拟全向摇杆、双击疾跑、弧形按键轮盘、触觉震动反馈与全屏适配
 */

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.BVN_TOUCH = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  class InputController {
    constructor(engine, audio) {
      this.engine = engine;
      this.audio = audio;
      this.keys = {};

      // 触控摇杆状态
      this.joystickActive = false;
      this.joystickTouchId = null;
      this.joystickOrigin = { x: 0, y: 0 };
      this.joystickCurrent = { x: 0, y: 0 };
      this.joystickDelta = { x: 0, y: 0 };

      // 双击疾跑检测
      this.lastTapDir = 0;
      this.lastTapTime = 0;

      // 触觉反馈开关
      this.hapticsEnabled = true;

      this.initKeyboard();
    }

    vibrate(pattern = 12) {
      if (!this.hapticsEnabled) return;
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate(pattern);
        } catch (e) {}
      }
    }

    // 绑定手机虚拟轮盘与触控元素
    bindTouchControls(elements) {
      const {
        stickZone, stickKnob,
        btnAttack, btnJump, btnDash,
        btnSkill, btnSpecial, btnUltimate,
        btnAssist, btnSubstitute, btnAwaken
      } = elements;

      if (!stickZone || !stickKnob) return;

      // 1. 左侧虚拟摇杆全向拖拽
      const onTouchStart = (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          if (this.joystickTouchId === null) {
            this.joystickTouchId = t.identifier;
            this.joystickActive = true;
            const rect = stickZone.getBoundingClientRect();
            this.joystickOrigin = {
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2
            };
            this.handleStickMove(t.clientX, t.clientY, stickKnob);
            this.vibrate(8);
            break;
          }
        }
      };

      const onTouchMove = (e) => {
        if (!this.joystickActive) return;
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          if (t.identifier === this.joystickTouchId) {
            this.handleStickMove(t.clientX, t.clientY, stickKnob);
            break;
          }
        }
      };

      const onTouchEnd = (e) => {
        if (!this.joystickActive) return;
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          if (t.identifier === this.joystickTouchId) {
            this.joystickActive = false;
            this.joystickTouchId = null;
            this.joystickDelta = { x: 0, y: 0 };
            stickKnob.style.transform = `translate(0px, 0px)`;
            if (this.engine && this.engine.p1) {
              this.engine.p1.handleMoveInput(0);
            }
            break;
          }
        }
      };

      stickZone.addEventListener('touchstart', onTouchStart, { passive: false });
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd, { passive: false });
      window.addEventListener('touchcancel', onTouchEnd, { passive: false });

      // 2. 绑定右侧动作按键 (普攻 J, 跳跃 K, 瞬步 L, 技能 U, 特技 I, 奥义 O, 援助 P, 替身, 觉醒)
      const bindButton = (btn, action) => {
        if (!btn) return;
        const trigger = (e) => {
          e.preventDefault();
          this.vibrate(15);
          action();
        };
        btn.addEventListener('touchstart', trigger, { passive: false });
        btn.addEventListener('mousedown', trigger);
      };

      bindButton(btnAttack, () => this.engine && this.engine.p1 && this.engine.p1.handleAttack());
      bindButton(btnJump, () => this.engine && this.engine.p1 && this.engine.p1.handleJump());
      bindButton(btnDash, () => this.engine && this.engine.p1 && this.engine.p1.handleDash());
      bindButton(btnSkill, () => this.engine && this.engine.p1 && this.engine.p1.handleSkill());
      bindButton(btnSpecial, () => this.engine && this.engine.p1 && this.engine.p1.handleSpecial());
      bindButton(btnUltimate, () => this.engine && this.engine.p1 && this.engine.p1.handleUltimate());
      bindButton(btnAssist, () => this.engine && this.engine.callAssist(1));
      bindButton(btnSubstitute, () => this.engine && this.engine.p1 && this.engine.p1.handleSubstitute(this.engine));
      bindButton(btnAwaken, () => this.engine && this.engine.p1 && this.engine.p1.handleAwaken(this.engine));
    }

    handleStickMove(cx, cy, knob) {
      const maxRadius = 45;
      let dx = cx - this.joystickOrigin.x;
      let dy = cy - this.joystickOrigin.y;
      const dist = Math.hypot(dx, dy);

      if (dist > maxRadius) {
        dx = (dx / dist) * maxRadius;
        dy = (dy / dist) * maxRadius;
      }

      knob.style.transform = `translate(${dx}px, ${dy}px)`;
      this.joystickDelta = { x: dx / maxRadius, y: dy / maxRadius };

      if (!this.engine || !this.engine.p1) return;

      // 水平死区判定
      if (Math.abs(this.joystickDelta.x) > 0.25) {
        const dir = this.joystickDelta.x > 0 ? 1 : -1;
        this.engine.p1.handleMoveInput(dir);

        // 双击疾跑判定
        const now = Date.now();
        if (dir === this.lastTapDir && now - this.lastTapTime < 260) {
          this.engine.p1.handleDash();
          this.vibrate(20);
        }
        this.lastTapDir = dir;
        this.lastTapTime = now;
      } else {
        this.engine.p1.handleMoveInput(0);
      }

      // 向上推摇杆跳跃
      if (this.joystickDelta.y < -0.65) {
        this.engine.p1.handleJump();
      }
    }

    // 绑定电脑键盘事件
    initKeyboard() {
      if (typeof window === 'undefined') return;

      window.addEventListener('keydown', (e) => {
        if (e.repeat) return;
        this.keys[e.code] = true;

        if (!this.engine || !this.engine.p1) return;
        const p1 = this.engine.p1;

        switch (e.code) {
          case 'KeyA':
          case 'ArrowLeft':
            p1.handleMoveInput(-1);
            break;
          case 'KeyD':
          case 'ArrowRight':
            p1.handleMoveInput(1);
            break;
          case 'KeyW':
          case 'ArrowUp':
            p1.handleJump();
            break;
          case 'KeyJ':
            p1.handleAttack();
            break;
          case 'KeyK':
            p1.handleJump();
            break;
          case 'KeyL':
            p1.handleDash();
            break;
          case 'KeyU':
            p1.handleSkill();
            break;
          case 'KeyI':
            p1.handleSpecial();
            break;
          case 'KeyO':
            p1.handleUltimate();
            break;
          case 'KeyP':
            this.engine.callAssist(1);
            break;
          case 'Space':
            p1.handleSubstitute(this.engine);
            break;
          case 'KeyQ':
            p1.handleAwaken(this.engine);
            break;
          default:
            break;
        }
      });

      window.addEventListener('keyup', (e) => {
        this.keys[e.code] = false;
        if (!this.engine || !this.engine.p1) return;

        if (e.code === 'KeyA' || e.code === 'KeyD' || e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
          const a = this.keys['KeyA'] || this.keys['ArrowLeft'];
          const d = this.keys['KeyD'] || this.keys['ArrowRight'];
          if (a && !d) {
            this.engine.p1.handleMoveInput(-1);
          } else if (d && !a) {
            this.engine.p1.handleMoveInput(1);
          } else {
            this.engine.p1.handleMoveInput(0);
          }
        }
      });
    }

    // 全屏切换工具方法
    toggleFullscreen(element) {
      if (!document.fullscreenElement) {
        const el = element || document.documentElement;
        if (el.requestFullscreen) {
          el.requestFullscreen();
        } else if (el.webkitRequestFullscreen) {
          el.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
  }

  return InputController;
});
