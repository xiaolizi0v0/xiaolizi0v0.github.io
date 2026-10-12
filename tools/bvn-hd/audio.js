/**
 * 死神VS火影 HD：重制版 (Bleach vs Naruto HD Rebirth)
 * Web Audio API 原生程序化打击音效合成器
 * 零外部音频文件依赖，毫秒级零延迟触发，纯纯正正的格斗金石交鸣与必杀爆鸣
 */

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.BVN_AUDIO = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.volume = 0.8;
      this.initialized = false;
    }

    init() {
      if (this.initialized) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
          this.initialized = true;
        }
      } catch (e) {
        console.warn('Web Audio API not supported', e);
      }
    }

    resume() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    play(soundName) {
      if (!this.enabled || !this.ctx) return;
      this.resume();

      const now = this.ctx.currentTime;
      const master = this.ctx.createGain();
      master.gain.setValueAtTime(this.volume, now);
      master.connect(this.ctx.destination);

      switch (soundName) {
        // 轻刀剑斩击
        case 'slash_light': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(160, now + 0.08);
          gain.gain.setValueAtTime(0.5, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
          osc.connect(gain);
          gain.connect(master);
          osc.start(now);
          osc.stop(now + 0.08);
          break;
        }

        // 中刀剑斩击
        case 'slash_medium': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(650, now);
          osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);
          gain.gain.setValueAtTime(0.6, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
          osc.connect(gain);
          gain.connect(master);
          osc.start(now);
          osc.stop(now + 0.12);
          break;
        }

        // 重刀破空重斩
        case 'slash_heavy': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(500, now);
          osc.frequency.exponentialRampToValueAtTime(60, now + 0.22);
          gain.gain.setValueAtTime(0.8, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
          osc.connect(gain);
          gain.connect(master);
          osc.start(now);
          osc.stop(now + 0.22);
          break;
        }

        // 拳击体术打斗
        case 'punch_light':
        case 'punch_medium':
        case 'punch_heavy': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const dur = soundName === 'punch_heavy' ? 0.18 : 0.09;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(soundName === 'punch_heavy' ? 240 : 320, now);
          osc.frequency.exponentialRampToValueAtTime(45, now + dur);
          gain.gain.setValueAtTime(0.7, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + dur);
          osc.connect(gain);
          gain.connect(master);
          osc.start(now);
          osc.stop(now + dur);
          break;
        }

        // 月牙天冲释放
        case 'getsuga': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(380, now);
          osc.frequency.exponentialRampToValueAtTime(80, now + 0.35);
          gain.gain.setValueAtTime(0.9, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
          osc.connect(gain);
          gain.connect(master);
          osc.start(now);
          osc.stop(now + 0.35);
          break;
        }

        // 螺旋丸高频嗡鸣与研磨
        case 'rasengan': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.linearRampToValueAtTime(880, now + 0.15);
          osc.frequency.exponentialRampToValueAtTime(140, now + 0.35);
          gain.gain.setValueAtTime(0.7, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
          osc.connect(gain);
          gain.connect(master);
          osc.start(now);
          osc.stop(now + 0.35);
          break;
        }

        // 千鸟万鸟雷鸣
        case 'chidori': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(950, now);
          osc.frequency.linearRampToValueAtTime(1400, now + 0.1);
          osc.frequency.exponentialRampToValueAtTime(300, now + 0.3);
          gain.gain.setValueAtTime(0.65, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
          osc.connect(gain);
          gain.connect(master);
          osc.start(now);
          osc.stop(now + 0.3);
          break;
        }

        // 火遁豪火球
        case 'fireball': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.exponentialRampToValueAtTime(40, now + 0.4);
          gain.gain.setValueAtTime(0.8, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
          osc.connect(gain);
          gain.connect(master);
          osc.start(now);
          osc.stop(now + 0.4);
          break;
        }

        // 冰轮丸冰晶突刺
        case 'ice_slash':
        case 'ice_heavy':
        case 'ice_shards': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(1200, now);
          osc.frequency.exponentialRampToValueAtTime(350, now + 0.2);
          gain.gain.setValueAtTime(0.6, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
          osc.connect(gain);
          gain.connect(master);
          osc.start(now);
          osc.stop(now + 0.2);
          break;
        }

        // 瞬步 / 瞬身位移
        case 'dash':
        case 'dash_slash': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(150, now + 0.12);
          gain.gain.setValueAtTime(0.5, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
          osc.connect(gain);
          gain.connect(master);
          osc.start(now);
          osc.stop(now + 0.12);
          break;
        }

        // 替身术白烟消散
        case 'substitute': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.linearRampToValueAtTime(780, now + 0.08);
          gain.gain.setValueAtTime(0.6, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
          osc.connect(gain);
          gain.connect(master);
          osc.start(now);
          osc.stop(now + 0.15);
          break;
        }

        // 必杀奥义启动特写钟鸣
        case 'super_activate':
        case 'super_getsuga':
        case 'super_rasenshuriken':
        case 'super_kirin':
        case 'super_ice_prison': {
          const osc = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc2.type = 'sawtooth';
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.exponentialRampToValueAtTime(50, now + 0.6);
          osc2.frequency.setValueAtTime(800, now);
          osc2.frequency.exponentialRampToValueAtTime(220, now + 0.6);
          gain.gain.setValueAtTime(1.0, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
          osc.connect(gain);
          osc2.connect(gain);
          gain.connect(master);
          osc.start(now);
          osc2.start(now);
          osc.stop(now + 0.6);
          osc2.stop(now + 0.6);
          break;
        }

        // 援助召唤
        case 'assist_call': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.linearRampToValueAtTime(1040, now + 0.2);
          gain.gain.setValueAtTime(0.6, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
          osc.connect(gain);
          gain.connect(master);
          osc.start(now);
          osc.stop(now + 0.25);
          break;
        }

        default:
          break;
      }
    }
  }

  return new SoundEngine();
});
