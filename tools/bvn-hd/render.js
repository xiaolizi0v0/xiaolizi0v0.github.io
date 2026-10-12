/**
 * 死神VS火影 HD：重制版 (Bleach vs Naruto HD Rebirth)
 * 2D Canvas 矢量与真实高清图像混合渲染管线
 * 支持 4K 视差舞台贴图、官方原版位图 vs AI超分对比、奥义大招超清立绘 Cut-in 与冲击定格
 */

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.BVN_RENDER = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  class GameRenderer {
    constructor(canvas, engine) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.engine = engine;
      this.renderMode = 'hd'; // 'hd' (AI超分矢量+4K贴图) 或 'pixel' (原版低清像素)
      this.showHitboxes = false; // 训练场判定框开关

      this.virtualW = 1000;
      this.virtualH = 560;
      this.animTime = 0;

      // 视差背景粒子
      this.bgParticles = [];
      this.initBgParticles();

      // 图像资源管理器
      this.images = {};
      this.initImageAssets();
    }

    setRenderMode(mode) {
      this.renderMode = mode === 'pixel' ? 'pixel' : 'hd';
    }

    initImageAssets() {
      if (typeof Image === 'undefined') return;

      const assetMap = {
        // 4K 超清对战舞台
        stage_valley: 'bvn-hd/assets/hd/stage_valley.jpg',
        stage_soukyoku: 'bvn-hd/assets/hd/stage_soukyoku.jpg',
        stage_training: 'bvn-hd/assets/hd/stage_training.jpg',
        stage_las_noches: 'bvn-hd/assets/hd/stage_las_noches.jpg',

        // AI 超清奥义特写 Cut-in
        cutin_ichigo: 'bvn-hd/assets/hd/cutin_ichigo.jpg',
        cutin_naruto: 'bvn-hd/assets/hd/cutin_naruto.jpg',
        cutin_sasuke: 'bvn-hd/assets/hd/cutin_sasuke.jpg',
        cutin_hitsugaya: 'bvn-hd/assets/hd/cutin_hitsugaya.jpg',

        // 官方 Gitee 原版美术资源
        orig_map: 'bvn-hd/assets/orig/bvnmap.png',
        orig_logo: 'bvn-hd/assets/orig/logo_new.png',
        orig_congrats: 'bvn-hd/assets/orig/congratulations.png',
        orig_title: 'bvn-hd/assets/orig/title.png',
        facekk: 'bvn-hd/assets/orig/facekk.png',
        face_ichigo: 'bvn-hd/assets/orig/bigface_1.png',
        face_naruto: 'bvn-hd/assets/orig/bigface_2.png',
        face_sasuke: 'bvn-hd/assets/orig/bigface_3.png',

        // 官方角色与援助对战头像
        face_ichigo_orig: 'bvn-hd/assets/orig/face/ichigo.png',
        face_naruto_orig: 'bvn-hd/assets/orig/face/naruto.png',
        face_sasuke_orig: 'bvn-hd/assets/orig/face/sasuke.png',
        face_hitsugaya_orig: 'bvn-hd/assets/orig/face/toushirou.png',
        face_rukia_orig: 'bvn-hd/assets/orig/face/rukia.png',
        face_orihime_orig: 'bvn-hd/assets/orig/face/orihime.png',
        face_itachi_orig: 'bvn-hd/assets/orig/face/itachi.png'
      };

      for (const [key, src] of Object.entries(assetMap)) {
        const img = new Image();
        img.src = src;
        this.images[key] = img;
      }

      // 预加载官方原版与高清重制角色动作切片帧
      this.spriteCache = {};
      const manifest = (typeof window !== 'undefined' && window.BVN_SPRITES_MANIFEST) ? window.BVN_SPRITES_MANIFEST : (typeof BVN_SPRITES_MANIFEST !== 'undefined' ? BVN_SPRITES_MANIFEST : null);
      if (manifest) {
        for (const actions of Object.values(manifest)) {
          for (const actData of Object.values(actions)) {
            const list = [...(actData.frames_orig || []), ...(actData.frames_hd || [])];
            for (const relPath of list) {
              if (!this.spriteCache[relPath]) {
                const img = new Image();
                img.src = relPath;
                this.spriteCache[relPath] = img;
              }
            }
          }
        }
      }
    }

    initBgParticles() {
      this.bgParticles = [];
      for (let i = 0; i < 40; i++) {
        this.bgParticles.push({
          x: Math.random() * this.virtualW,
          y: Math.random() * this.virtualH,
          vx: (Math.random() - 0.5) * 1.5 - 0.8,
          vy: Math.random() * 1.5 + 0.6,
          size: Math.random() * 5 + 3,
          rot: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 0.08
        });
      }
    }

    // 主渲染帧入口
    render() {
      const ctx = this.ctx;
      this.animTime += 0.016;

      ctx.save();
      ctx.clearRect(0, 0, this.virtualW, this.virtualH);

      // 震屏位移偏移
      if (this.engine.screenShakeTimer > 0) {
        const str = this.engine.screenShakeIntensity;
        ctx.translate((Math.random() - 0.5) * str, (Math.random() - 0.5) * str);
      }

      // 如果处于像素复古模式，开启图片抗锯齿禁用以呈现经典原版锯齿感
      if (this.renderMode === 'pixel') {
        ctx.imageSmoothingEnabled = false;
      } else {
        ctx.imageSmoothingEnabled = true;
      }

      // 1. 渲染多层视差场景背景（带真实图像贴图）
      this.renderStage(ctx, this.engine.stage);

      // 2. 渲染投射物 (月牙天冲、手里剑、豪火球、冰刺)
      this.renderProjectiles(ctx);

      // 3. 渲染双方角色
      this.renderFighter(ctx, this.engine.p1);
      this.renderFighter(ctx, this.engine.p2);

      // 4. 渲染击打粒子与特效
      this.renderParticles(ctx);

      // 5. 渲染浮动伤害与状态飘字
      this.renderFloatingTexts(ctx);

      // 6. 渲染奥义释放高燃 Cut-in 特写
      this.renderSuperCutin(ctx);

      // 7. 渲染黑白冲击定格帧 (Impact Frame)
      if (this.engine.impactFrameTimer > 0) {
        this.renderImpactFrame(ctx);
      }

      // 8. 渲染经典格斗 HUD (血条、灵压查克拉条、计时器、连击数)
      this.renderHUD(ctx);

      // 9. 调试/道场模式：受击盒与判定盒绘制
      if (this.showHitboxes) {
        this.renderHitboxes(ctx);
      }

      ctx.restore();
    }

    // 渲染舞台背景
    renderStage(ctx, stage) {
      const w = this.virtualW;
      const h = this.virtualH;

      // 如果处于像素模式，并且官方 bvnmap 加载完毕，优先渲染原版地图
      if (this.renderMode === 'pixel' && this.images.orig_map && this.images.orig_map.complete) {
        ctx.drawImage(this.images.orig_map, 0, 0, w, h);
        return;
      }

      // HD 模式：优先渲染对应的 4K 超清舞台背景
      let stageKey = 'stage_valley';
      if (stage.id === 'soukyoku_hill') stageKey = 'stage_soukyoku';
      else if (stage.id === 'training_ground') stageKey = 'stage_training';
      else if (stage.id === 'las_noches') stageKey = 'stage_las_noches';

      const hdImg = this.images[stageKey];
      if (hdImg && hdImg.complete && hdImg.naturalWidth > 0) {
        // 动态微视差漂移
        const camX = ((this.engine.p1.x + this.engine.p2.x) / 2 - 500) * 0.05;
        ctx.drawImage(hdImg, -20 - camX, 0, w + 40, h);
      } else {
        // 图像加载中的高品质渐变兜底
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
        const gradColors = stage.bgGradient || ['#0f172a', '#1e293b', '#334155'];
        gradColors.forEach((col, idx) => {
          skyGrad.addColorStop(idx / (gradColors.length - 1), col);
        });
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 460, w, h - 460);
      }

      // 动态飘落环境粒子 (落叶、樱花、水汽)
      ctx.save();
      for (const p of this.bgParticles) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vrot;
        if (p.y > h - 80) p.y = 0;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;

        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = stage.id === 'soukyoku_hill' ? 'rgba(244, 114, 182, 0.65)' :
                        (stage.id === 'training_ground' ? 'rgba(74, 222, 128, 0.6)' : 'rgba(56, 189, 248, 0.5)');
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
        ctx.rotate(-p.rot);
        ctx.translate(-p.x, -p.y);
      }
      ctx.restore();
    }

    // 渲染角色
    renderFighter(ctx, fighter) {
      ctx.save();
      ctx.translate(fighter.x, fighter.y);
      ctx.scale(fighter.facing, 1);

      // 觉醒气焰特效 (Bankai / Kyuubi Aura)
      if (fighter.isAwakened) {
        this.renderAwakeningAura(ctx, fighter);
      }

      // 瞬步残影 (Ghosting trails)
      if (fighter.state === 'dash') {
        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.translate(-fighter.facing * 35, 0);
        this.drawFighterBody(ctx, fighter);
        ctx.restore();
      }

      // 角色主体绘制
      this.drawFighterBody(ctx, fighter);

      // 招式专属前置光效 (刀光、螺旋丸、千鸟、冰环)
      this.drawMoveEffects(ctx, fighter);

      ctx.restore();
    }

    // 绘制角色身体与动作贴图
    drawFighterBody(ctx, fighter) {
      const cfg = fighter.config;
      const isPixel = this.renderMode === 'pixel';
      const isHurt = fighter.state === 'hurt';

      // 地面阴影
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(0, 0, 32, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // 受击闪白
      if (isHurt && Math.floor(fighter.hitstun) % 2 === 0) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-24, -85, 48, 85);
        return;
      }

      // 状态机动作映射
      const state = fighter.state;
      let actionKey = 'idle';
      if (state === 'idle') actionKey = 'idle';
      else if (state === 'walk') actionKey = 'walk';
      else if (state === 'dash' || state === 'run') actionKey = 'run';
      else if (state === 'jump') actionKey = 'jump';
      else if (state === 'attack') {
        if (fighter.currentMoveKey === 'attack2') actionKey = 'attack2';
        else if (fighter.currentMoveKey === 'attack3') actionKey = 'attack3';
        else if (fighter.currentMoveKey === 'jumpAttack') actionKey = 'air_attack';
        else actionKey = 'attack1';
      }
      else if (state === 'skill') actionKey = 'skill_u';
      else if (state === 'special') actionKey = 'skill_i';
      else if (state === 'ultimate') actionKey = 'skill_o';
      else if (state === 'hurt') actionKey = 'hurt';
      else if (state === 'knockdown' || state === 'wakeup') actionKey = 'knockdown';
      else if (state === 'win') actionKey = 'win';

      const manifest = (typeof window !== 'undefined' && window.BVN_SPRITES_MANIFEST) ? window.BVN_SPRITES_MANIFEST :
                       (typeof BVN_DATA !== 'undefined' && BVN_DATA.SPRITES_MANIFEST ? BVN_DATA.SPRITES_MANIFEST :
                       (typeof BVN_SPRITES_MANIFEST !== 'undefined' ? BVN_SPRITES_MANIFEST : null));
      let spriteImg = null;

      if (manifest && manifest[cfg.id] && manifest[cfg.id][actionKey]) {
        const actInfo = manifest[cfg.id][actionKey];
        const frames = isPixel ? actInfo.frames_orig : actInfo.frames_hd;
        if (frames && frames.length > 0) {
          let fIdx = 0;
          if (['attack', 'skill', 'special', 'ultimate'].includes(state)) {
            fIdx = Math.floor((fighter.moveFrame || 0) / 4);
          } else {
            const t = (typeof fighter.stateTimer === 'number' ? fighter.stateTimer : this.animTime) * 6;
            fIdx = Math.floor(t);
          }
          if (isNaN(fIdx) || fIdx < 0) fIdx = 0;
          fIdx = fIdx % frames.length;

          const fPath = frames[fIdx];
          if (fPath) {
            spriteImg = this.spriteCache ? this.spriteCache[fPath] : null;
            if (!spriteImg && typeof Image !== 'undefined') {
              spriteImg = new Image();
              spriteImg.src = fPath;
              if (this.spriteCache) this.spriteCache[fPath] = spriteImg;
            }
          }
        }
      }

      // 如果当前帧仍在解码，优先降级到已就绪的待机帧/首帧，绝不展示方块
      if ((!spriteImg || !spriteImg.complete || spriteImg.naturalWidth === 0) && manifest && manifest[cfg.id]) {
        const fallbackList = isPixel ? (manifest[cfg.id].idle?.frames_orig || []) : (manifest[cfg.id].idle?.frames_hd || []);
        for (const p of fallbackList) {
          const cand = this.spriteCache ? this.spriteCache[p] : null;
          if (cand && cand.complete && cand.naturalWidth > 0) {
            spriteImg = cand;
            break;
          }
        }
      }

      // 若官方切片动作帧已就绪，渲染真实动作！
      if (spriteImg && spriteImg.complete && spriteImg.naturalWidth > 0) {
        const natW = spriteImg.naturalWidth;
        const natH = spriteImg.naturalHeight;

        // 统一缩放至格斗视口标准人物身高 (~85-95px)
        const scale = isPixel ? 1.55 : 0.78;
        const drawW = natW * scale;
        const drawH = natH * scale;

        // 脚底对齐 (x = 0, y = 0)
        const drawX = -drawW / 2;
        const drawY = -drawH;

        if (!isPixel) {
          // HD 超分重制模式：立体边缘泛光与平滑抗锯齿
          ctx.save();
          ctx.shadowColor = cfg.avatarColor;
          ctx.shadowBlur = fighter.isAwakened ? 16 : 4;
          ctx.drawImage(spriteImg, drawX, drawY, drawW, drawH);
          ctx.restore();
        } else {
          // 怀旧像素模式：纯净点阵直出
          ctx.drawImage(spriteImg, drawX, drawY, drawW, drawH);
        }
        return;
      }

      // 图片加载保护兜底
      this.drawFallbackFighter(ctx, fighter, isPixel);
    }

    // 动作帧未就绪时的容错兜底绘制
    drawFallbackFighter(ctx, fighter, isPixel) {
      const cfg = fighter.config;
      const col = cfg.avatarColor || '#38bdf8';
      const dark = cfg.darkColor || '#0f172a';

      if (isPixel) {
        ctx.fillStyle = dark;
        ctx.fillRect(-18, -80, 36, 75);
        ctx.fillStyle = col;
        ctx.fillRect(-12, -75, 24, 30);
        ctx.fillStyle = '#fed7aa';
        ctx.fillRect(-10, -85, 20, 20);
        return;
      }

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#020617';

      ctx.fillStyle = dark;
      ctx.beginPath();
      ctx.roundRect(-16, -65, 32, 45, [6, 6, 4, 4]);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(0, -72, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(-14, -76);
      ctx.lineTo(-20, -92);
      ctx.lineTo(0, -96);
      ctx.lineTo(18, -90);
      ctx.lineTo(14, -74);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = dark;
      ctx.fillRect(-14, -20, 10, 20);
      ctx.fillRect(4, -20, 10, 20);
    }

    // 招式专属实时光效
    drawMoveEffects(ctx, fighter) {
      if (!fighter.currentMove) return;
      const m = fighter.currentMove;
      const f = fighter.moveFrame;

      // 普攻剑光斩芒
      if (fighter.state === 'attack') {
        ctx.save();
        ctx.strokeStyle = fighter.config.avatarColor;
        ctx.lineWidth = 6;
        ctx.shadowColor = fighter.config.avatarColor;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(20, -50, 45, -0.6, 1.2);
        ctx.stroke();
        ctx.restore();
      }

      // 技能螺旋丸 (鸣人 U)
      if (fighter.currentMoveKey === 'skill' && fighter.config.id === 'naruto') {
        ctx.save();
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(38, -48, 16 + Math.sin(f * 0.8) * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 特技千鸟电弧 (佐助 I)
      if (fighter.currentMoveKey === 'special' && fighter.config.id === 'sasuke') {
        ctx.save();
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#818cf8';
        ctx.shadowBlur = 16;
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(25, -50);
          ctx.lineTo(35 + Math.random() * 20, -50 + (Math.random() - 0.5) * 30);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 卍解千年冰牢冰晶 (冬狮郎 O)
      if (fighter.currentMoveKey === 'ultimate' && fighter.config.id === 'hitsugaya') {
        ctx.save();
        ctx.fillStyle = 'rgba(165, 243, 252, 0.7)';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 20;
        ctx.fillRect(40, -120, 60, 120);
        ctx.fillRect(-80, -120, 60, 120);
        ctx.restore();
      }
    }

    // 觉醒灵压气焰
    renderAwakeningAura(ctx, fighter) {
      ctx.save();
      const auraCol = fighter.config.id === 'ichigo' ? 'rgba(239, 68, 68, 0.35)' :
                      (fighter.config.id === 'naruto' ? 'rgba(245, 158, 11, 0.35)' :
                      (fighter.config.id === 'sasuke' ? 'rgba(168, 85, 247, 0.35)' : 'rgba(56, 189, 248, 0.35)'));

      ctx.fillStyle = auraCol;
      ctx.shadowColor = fighter.config.accentColor;
      ctx.shadowBlur = 24;
      ctx.beginPath();
      ctx.ellipse(0, -42, 38 + Math.sin(this.animTime * 10) * 4, 52, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 奥义超杀 Cut-in 特写横幅
    renderSuperCutin(ctx) {
      const p1 = this.engine.p1;
      const p2 = this.engine.p2;
      const activeFighter = (p1.state === 'ultimate' && p1.moveFrame < 32) ? p1 :
                            ((p2.state === 'ultimate' && p2.moveFrame < 32) ? p2 : null);

      if (!activeFighter) return;

      const cutinKey = `cutin_${activeFighter.config.id}`;
      const img = this.images[cutinKey];

      if (img && img.complete && img.naturalWidth > 0) {
        ctx.save();
        // 黑色横幅遮罩
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 100, this.virtualW, 360);

        // 立绘居中投影
        const size = 340;
        const x = (this.virtualW - size) / 2;
        const y = 110;

        ctx.shadowColor = activeFighter.config.accentColor;
        ctx.shadowBlur = 25;
        ctx.drawImage(img, x, y, size, size);

        // 闪耀光条
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, size, size);

        // 必杀名称飘带
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px "Host Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`【${activeFighter.currentMove.name}】`, this.virtualW / 2, 470);
        ctx.restore();
      }
    }

    // 渲染投射物
    renderProjectiles(ctx) {
      for (const p of this.engine.projectiles) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.scale(p.facing, 1);

        if (p.config.shape === 'crescent') {
          // 月牙天冲：巨大月牙刃
          ctx.fillStyle = p.config.color || '#38bdf8';
          ctx.shadowColor = p.config.glow || '#0284c7';
          ctx.shadowBlur = 18;
          ctx.beginPath();
          ctx.arc(0, 0, 32, -Math.PI / 2, Math.PI / 2, false);
          ctx.quadraticCurveTo(8, 0, 0, -Math.PI / 2);
          ctx.fill();
        } else if (p.config.shape === 'fireball') {
          // 豪火球：旋转烈焰
          ctx.fillStyle = '#f97316';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 22;
          ctx.beginPath();
          ctx.arc(0, 0, 28, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // 手里剑 / 冰棱
          ctx.fillStyle = p.config.color || '#93c5fd';
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }

        ctx.restore();
      }
    }

    // 渲染粒子
    renderParticles(ctx) {
      for (const pt of this.engine.particles) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // 渲染飘字
    renderFloatingTexts(ctx) {
      ctx.save();
      ctx.font = 'bold 20px "Host Grotesk", sans-serif';
      ctx.textAlign = 'center';
      for (const ft of this.engine.floatingTexts) {
        ctx.globalAlpha = ft.alpha;
        ctx.fillStyle = ft.color;
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 6;
        ctx.fillText(ft.text, ft.x, ft.y);
      }
      ctx.restore();
    }

    // 黑白高反差冲击定格帧
    renderImpactFrame(ctx) {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(0, 0, this.virtualW, this.virtualH);
      ctx.restore();
    }

    // 经典格斗 HUD 绘制
    renderHUD(ctx) {
      const p1 = this.engine.p1;
      const p2 = this.engine.p2;

      ctx.save();

      // P1 头像与血条 (左上)
      this.drawHealthBar(ctx, 70, 24, 350, 24, p1, false);
      this.drawEnergyBar(ctx, 70, 52, 260, 10, p1, false);

      // P2 头像与血条 (右上)
      this.drawHealthBar(ctx, 580, 24, 350, 24, p2, true);
      this.drawEnergyBar(ctx, 670, 52, 260, 10, p2, true);

      // 回合倒计时圆盘 (中央)
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(500, 36, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px "Host Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(Math.ceil(this.engine.roundTimer), 500, 37);

      // 连击数展示 (Combo!)
      if (p1.comboCount > 1) {
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'italic bold 28px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`${p1.comboCount} HITS!`, 70, 95);
      }
      if (p2.comboCount > 1) {
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'italic bold 28px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`${p2.comboCount} HITS!`, 930, 95);
      }

      ctx.restore();
    }

    // 绘制血条与角色名称 (含官方经典头像与金属头像框)
    drawHealthBar(ctx, x, y, w, h, fighter, isRight) {
      ctx.save();

      // 官方头像与头像框
      const avatarSize = 46;
      const avatarX = isRight ? (x + w + 8) : (x - avatarSize - 8);
      const avatarY = y - 4;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);

      const faceKey = `face_${fighter.config.id}_orig`;
      const faceImg = this.images[faceKey] || this.images[`face_${fighter.config.id}`];
      if (faceImg && faceImg.complete && faceImg.naturalWidth > 0) {
        ctx.drawImage(faceImg, avatarX + 3, avatarY + 3, avatarSize - 6, avatarSize - 6);
      } else {
        ctx.fillStyle = fighter.config.avatarColor;
        ctx.fillRect(avatarX + 3, avatarY + 3, avatarSize - 6, avatarSize - 6);
      }

      // 官方金属头像框
      if (this.images.facekk && this.images.facekk.complete && this.images.facekk.naturalWidth > 0) {
        ctx.drawImage(this.images.facekk, avatarX - 2, avatarY - 2, avatarSize + 4, avatarSize + 4);
      } else {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.strokeRect(avatarX, avatarY, avatarSize, avatarSize);
      }

      // 底框
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.fillRect(x, y, w, h);
      ctx.strokeRect(x, y, w, h);

      // 血量填充
      const pct = Math.max(0, fighter.hp / fighter.maxHp);
      const fillW = w * pct;
      ctx.fillStyle = pct > 0.3 ? '#22c55e' : '#ef4444';
      if (isRight) {
        ctx.fillRect(x + w - fillW, y, fillW, h);
      } else {
        ctx.fillRect(x, y, fillW, h);
      }

      // 角色名称标签
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = isRight ? 'right' : 'left';
      ctx.fillText(fighter.config.name, isRight ? x + w : x, y - 6);

      ctx.restore();
    }

    // 绘制3格灵压查克拉能量槽
    drawEnergyBar(ctx, x, y, w, h, fighter, isRight) {
      ctx.save();
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x, y, w, h);

      const segmentW = w / 3;
      const energy = fighter.energy;

      for (let i = 0; i < 3; i++) {
        const segEnergy = Math.min(100, Math.max(0, energy - i * 100));
        const fillW = (segEnergy / 100) * (segmentW - 2);

        if (fillW > 0) {
          ctx.fillStyle = i === 2 ? '#f59e0b' : (i === 1 ? '#38bdf8' : '#818cf8');
          const sx = isRight ? (x + w - (i + 1) * segmentW) : (x + i * segmentW);
          ctx.fillRect(sx, y, fillW, h);
        }
      }

      // 替身冷却状态提示
      ctx.font = '10px sans-serif';
      ctx.fillStyle = fighter.substituteCd > 0 ? '#94a3b8' : '#38bdf8';
      ctx.textAlign = isRight ? 'right' : 'left';
      ctx.fillText(fighter.substituteCd > 0 ? `替身: ${fighter.substituteCd.toFixed(1)}s` : '替身: 就绪', isRight ? x + w : x, y + h + 12);

      ctx.restore();
    }

    // 碰撞盒可视化
    renderHitboxes(ctx) {
      const p1 = this.engine.p1;
      const p2 = this.engine.p2;

      ctx.save();
      ctx.lineWidth = 1.5;

      // P1 Hurtbox (绿)
      const p1Hurt = p1.getHurtbox();
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.8)';
      ctx.strokeRect(p1Hurt.x, p1Hurt.y, p1Hurt.w, p1Hurt.h);

      // P1 Hitbox (红)
      const p1Hit = p1.getActiveHitbox();
      if (p1Hit) {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.9)';
        ctx.strokeRect(p1Hit.x, p1Hit.y, p1Hit.w, p1Hit.h);
      }

      // P2 Hurtbox
      const p2Hurt = p2.getHurtbox();
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.8)';
      ctx.strokeRect(p2Hurt.x, p2Hurt.y, p2Hurt.w, p2Hurt.h);

      // P2 Hitbox
      const p2Hit = p2.getActiveHitbox();
      if (p2Hit) {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.9)';
        ctx.strokeRect(p2Hit.x, p2Hit.y, p2Hit.w, p2Hit.h);
      }

      ctx.restore();
    }
  }

  return GameRenderer;
});
