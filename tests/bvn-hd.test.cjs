/**
 * 死神VS火影 HD：重制版 (Bleach vs Naruto HD Rebirth)
 * 核心格斗引擎与规则自动化测试套件
 * 执行方式: node tests/bvn-hd.test.cjs
 */

const assert = require('node:assert/strict');
const path = require('node:path');

const root = path.join(__dirname, '..');
const BVN_DATA = require(path.join(root, 'tools/bvn-hd/data.js'));
const BVN_ENGINE = require(path.join(root, 'tools/bvn-hd/engine.js'));

let passed = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] ${name}`);
    console.error(err);
    process.exit(1);
  }
}

console.log('=== 开始执行《死神VS火影 HD：重制版》自动化测试 ===\n');

// 1. 数据完整性测试
test('全 4 名参战角色数据结构与招式帧配置完整', () => {
  assert.equal(BVN_DATA.CHARACTERS.length, 4);
  const ids = BVN_DATA.CHARACTERS.map(c => c.id);
  assert.deepEqual(ids, ['ichigo', 'naruto', 'sasuke', 'hitsugaya']);

  for (const c of BVN_DATA.CHARACTERS) {
    assert(c.hp >= 900 && c.hp <= 1100);
    assert(c.moves.attack1);
    assert(c.moves.attack2);
    assert(c.moves.attack3);
    assert(c.moves.jumpAttack);
    assert(c.moves.skill);
    assert(c.moves.special);
    assert(c.moves.ultimate);
    assert(c.awakeningName);
  }
});

test('全 4 名经典援助伙伴与技能效果完整', () => {
  assert.equal(BVN_DATA.ASSISTS.length, 4);
  const ids = BVN_DATA.ASSISTS.map(a => a.id);
  assert.deepEqual(ids, ['rukia', 'itachi', 'orihime', 'shino']);
  for (const a of BVN_DATA.ASSISTS) {
    assert(a.cooldown >= 15);
    assert(a.effect && a.effect.type);
  }
});

test('全 4 个高清对战舞台场景配置完整', () => {
  assert.equal(BVN_DATA.STAGES.length, 4);
  for (const s of BVN_DATA.STAGES) {
    assert(s.name && s.bgGradient && s.particleType);
  }
});

// 2. 物理与位移测试
test('角色重力下落与地面阻挡判定', () => {
  const engine = new BVN_ENGINE.BattleEngine();
  const p1 = engine.p1;
  p1.y = 200;
  p1.vy = 0;
  p1.onGround = false;

  for (let i = 0; i < 60; i++) {
    engine.step(1 / 60);
  }
  assert.equal(p1.y, BVN_ENGINE.STAGE_FLOOR_Y);
  assert.equal(p1.onGround, true);
  assert.equal(p1.vy, 0);
});

test('左右移动与边界限制阻挡', () => {
  const engine = new BVN_ENGINE.BattleEngine();
  const p1 = engine.p1;
  p1.x = 200;
  p1.handleMoveInput(-1);
  for (let i = 0; i < 60; i++) engine.step(1 / 60);
  // 不得超出左边界 40
  assert(p1.x >= 40);

  p1.handleMoveInput(1);
  for (let i = 0; i < 180; i++) engine.step(1 / 60);
  // 不得超出右边界 960
  assert(p1.x <= BVN_ENGINE.STAGE_WIDTH - 40);
});

test('跳跃物理与落地状态恢复', () => {
  const engine = new BVN_ENGINE.BattleEngine();
  const p1 = engine.p1;
  p1.handleJump();
  assert.equal(p1.onGround, false);
  assert(p1.vy < 0);
  assert.equal(p1.state, 'jump');

  for (let i = 0; i < 60; i++) engine.step(1 / 60);
  assert.equal(p1.onGround, true);
  assert.equal(p1.state, 'idle');
});

// 3. 普攻与连段机制
test('普攻 3 段连击正常衔接与打断窗口', () => {
  const engine = new BVN_ENGINE.BattleEngine();
  const p1 = engine.p1;

  p1.handleAttack();
  assert.equal(p1.state, 'attack');
  assert.equal(p1.currentMoveKey, 'attack1');

  // 推进若干帧进入连击窗口
  p1.moveFrame = 5;
  p1.handleAttack();
  assert.equal(p1.currentMoveKey, 'attack2');

  p1.moveFrame = 6;
  p1.handleAttack();
  assert.equal(p1.currentMoveKey, 'attack3');
  assert.equal(p1.currentMove.knockup, true);
});

test('空中跳跃攻击正确触发', () => {
  const engine = new BVN_ENGINE.BattleEngine();
  const p1 = engine.p1;
  p1.handleJump();
  engine.step(1 / 60);
  p1.handleAttack();
  assert.equal(p1.currentMoveKey, 'jumpAttack');
});

// 4. 技能与特技
test('技能 U 释放并生成飞行投射物', () => {
  const engine = new BVN_ENGINE.BattleEngine();
  const p1 = engine.p1;
  p1.handleSkill();
  assert.equal(p1.state, 'skill');
  // 推进到 startup 帧
  for (let i = 0; i < p1.currentMove.startup; i++) {
    p1.update(1 / 60, engine.p2, engine);
  }
  assert.equal(engine.projectiles.length, 1);
  assert.equal(engine.projectiles[0].owner, p1);
});

test('特技 I 消耗 30 点能量并附带瞬步突进', () => {
  const engine = new BVN_ENGINE.BattleEngine();
  const p1 = engine.p1;
  p1.energy = 25;
  assert.equal(p1.handleSpecial(), false); // 能量不足
  p1.energy = 50;
  assert.equal(p1.handleSpecial(), true);
  assert.equal(p1.energy, 20);
  assert.equal(p1.state, 'special');
  assert(p1.invincibleTimer > 0);
});

test('奥义大招 O 消耗 100 点能量并触发全屏攻击判定', () => {
  const engine = new BVN_ENGINE.BattleEngine();
  const p1 = engine.p1;
  p1.energy = 90;
  assert.equal(p1.handleUltimate(), false);
  p1.energy = 100;
  assert.equal(p1.handleUltimate(), true);
  assert.equal(p1.energy, 0);
  assert.equal(p1.state, 'ultimate');
  assert.equal(p1.currentMove.isSuper, true);
});

// 5. 觉醒与替身术
test('满 100 能量触发觉醒变身，提升 25% 伤害', () => {
  const engine = new BVN_ENGINE.BattleEngine();
  const p1 = engine.p1;
  p1.energy = 100;
  assert.equal(p1.handleAwaken(engine), true);
  assert.equal(p1.isAwakened, true);
  assert.equal(p1.awakeningTimer, 15);
  assert.equal(p1.energy, 0);

  // 攻击伤害受觉醒加成
  p1.startMove('attack1', p1.config.moves.attack1);
  p1.moveFrame = p1.currentMove.startup;
  const hb = p1.getActiveHitbox();
  assert.equal(hb.damage, Math.round(p1.config.moves.attack1.damage * 1.25));
});

test('受击僵直中按替身术瞬移至对手身后并消耗 80 能量', () => {
  const engine = new BVN_ENGINE.BattleEngine();
  const p1 = engine.p1;
  const p2 = engine.p2;

  p1.energy = 100;
  p1.state = 'hurt';
  p1.beingComboed = 3;
  p1.x = 300;
  p2.x = 400;
  p2.facing = 1;

  assert.equal(p1.handleSubstitute(engine), true);
  assert.equal(p1.energy, 20);
  assert.equal(p1.substituteCd, 10);
  assert.equal(p1.state, 'idle');
  assert(p1.invincibleTimer > 0);
  assert.equal(p1.x, p2.x - 90);
});

test('替身术在冷却中或未受击时无法释放', () => {
  const engine = new BVN_ENGINE.BattleEngine();
  const p1 = engine.p1;
  p1.energy = 100;
  p1.state = 'idle';
  p1.beingComboed = 0;
  assert.equal(p1.handleSubstitute(engine), false);

  p1.state = 'hurt';
  p1.beingComboed = 1;
  p1.substituteCd = 5;
  assert.equal(p1.handleSubstitute(engine), false);
});

// 6. 判定与受击
test('判定盒 AABB 碰撞精准重叠判定', () => {
  const engine = new BVN_ENGINE.BattleEngine();
  const rect1 = { x: 100, y: 100, w: 50, h: 50 };
  const rect2 = { x: 140, y: 120, w: 50, h: 50 };
  const rect3 = { x: 200, y: 200, w: 50, h: 50 };

  assert.equal(engine.checkCollision(rect1, rect2), true);
  assert.equal(engine.checkCollision(rect1, rect3), false);
});

test('连击伤害保护递减机制 (Damage Scaling)', () => {
  const engine = new BVN_ENGINE.BattleEngine();
  const p1 = engine.p1;
  const p2 = engine.p2;

  const initialHp = p2.hp;
  const hitbox = { damage: 100, hitstun: 20, knockbackX: 2, knockbackY: 0 };

  // 第 1 击 100%
  p2.takeHit(hitbox, p1, engine);
  const dmg1 = initialHp - p2.hp;
  assert.equal(dmg1, 100);

  // 第 2 击 88%
  const hpAfter1 = p2.hp;
  p2.takeHit(hitbox, p1, engine);
  const dmg2 = hpAfter1 - p2.hp;
  assert.equal(dmg2, 88);

  // 第 3 击 76%
  const hpAfter2 = p2.hp;
  p2.takeHit(hitbox, p1, engine);
  const dmg3 = hpAfter2 - p2.hp;
  assert.equal(dmg3, 76);
});

test('倒地起身无敌保护', () => {
  const engine = new BVN_ENGINE.BattleEngine();
  const p2 = engine.p2;
  p2.state = 'knockdown';
  assert.equal(p2.takeHit({ damage: 50 }, engine.p1, engine), false);

  p2.knockdownTimer = 0;
  p2.update(1 / 60, engine.p1, engine);
  assert.equal(p2.state, 'wakeup');
  assert(p2.invincibleTimer > 0);
  assert.equal(p2.takeHit({ damage: 50 }, engine.p1, engine), false);
});

// 7. 援助系统测试
test('露琪亚援助冻结对手', () => {
  const engine = new BVN_ENGINE.BattleEngine({
    p1Assist: BVN_DATA.ASSISTS.find(a => a.id === 'rukia')
  });
  engine.callAssist(1);
  assert(engine.p2.hitstun > 60);
  assert(engine.p1.assistCd > 0);
});

test('织姬援助为自身治疗生命值', () => {
  const engine = new BVN_ENGINE.BattleEngine({
    p1Assist: BVN_DATA.ASSISTS.find(a => a.id === 'orihime')
  });
  engine.p1.hp = 500;
  engine.callAssist(1);
  assert.equal(engine.p1.hp, 750);
});

test('志乃援助吸取对手能量并转移给玩家', () => {
  const engine = new BVN_ENGINE.BattleEngine({
    p1Assist: BVN_DATA.ASSISTS.find(a => a.id === 'shino')
  });
  engine.p1.energy = 10;
  engine.p2.energy = 80;
  engine.callAssist(1);
  assert.equal(engine.p1.energy, 62); // 10 + 40(吸取) + 12(命中怒气)
  assert.equal(engine.p2.energy, 48); // 80 - 40(被吸) + 8(受击怒气补偿)
});

// 8. 胜负结算与AI模拟
test('对手生命值归零触发胜利结算', () => {
  let finishWinner = null;
  const engine = new BVN_ENGINE.BattleEngine({
    onMatchEnd: (w) => { finishWinner = w; }
  });
  engine.p2.hp = 0;
  engine.checkMatchOver();
  assert.equal(engine.gameState, 'victory');
  assert.equal(engine.winner, 1);
  assert.equal(finishWinner, 1);
});

test('回合超时判定高血量一方获胜', () => {
  let finishWinner = null;
  const engine = new BVN_ENGINE.BattleEngine({
    onMatchEnd: (w) => { finishWinner = w; }
  });
  engine.p1.hp = 800;
  engine.p2.hp = 300;
  engine.roundTimer = 0.01;
  engine.step(0.02);
  assert.equal(engine.gameState, 'victory');
  assert.equal(finishWinner, 1);
});

test('AI 正常进行立回、逼近与攻击决策', () => {
  const engine = new BVN_ENGINE.BattleEngine({
    p2IsAi: true,
    difficulty: 'hard'
  });
  const startX = engine.p2.x;
  for (let i = 0; i < 40; i++) {
    engine.step(1 / 60);
  }
  // AI 向 P1 逼近位移
  assert(engine.p2.x < startX);
});

console.log(`\n全部 ${passed} 项格斗引擎单元与回归测试通过！`);
