const XYZCoin = artifacts.require("XYZCoin");
const truffleAssert = require('truffle-assertions');
const assert = require('assert');

contract('XYZCoin', (accounts) => {
  const [deployer, alice, bob, carol] = accounts;
  let token;

  // 每个用例前重新部署，避免相互影响
  beforeEach(async () => {
    token = await XYZCoin.new({ from: deployer });
  });

  // 老师示例：验证 token 名称（按你的合约："XYZ Coin"）
  it('should set the token name correctly', async () => {
    const name = await token.name();
    assert.strictEqual(name, 'XYZ Coin'); // 如果你改成了 "XYZCoin"，这里同步改
  });

  // (h-1) 初始余额 = 总供给
  it('initial balance of deployer equals total supply', async () => {
    const total = await token.totalSupply();
    const bal = await token.balanceOf(deployer);
    assert.strictEqual(bal.toString(), total.toString());
  });

  // (h-2) transfer() 能转账
  it('can transfer tokens using transfer()', async () => {
    await token.transfer(alice, 10, { from: deployer });
    const balAlice = await token.balanceOf(alice);
    const balDeployer = await token.balanceOf(deployer);
    assert.strictEqual(balAlice.toString(), '10');
    assert.strictEqual(balDeployer.toString(), '990'); // 总量 1000，decimals=0
  });

  // (h-3) allowance 能设置并读取
  it('allowance can be set and read', async () => {
    await token.approve(bob, 15, { from: deployer });
    const a = await token.allowance(deployer, bob);
    assert.strictEqual(a.toString(), '15');
  });

  // (h-4) 可通过 transferFrom 代表他人转账
  it('accounts can transfer on behalf of others using transferFrom()', async () => {
    await token.approve(bob, 20, { from: deployer });
    await token.transferFrom(deployer, carol, 20, { from: bob });

    const balCarol = await token.balanceOf(carol);
    const balDeployer = await token.balanceOf(deployer);
    const remaining = await token.allowance(deployer, bob);

    assert.strictEqual(balCarol.toString(), '20');
    assert.strictEqual(balDeployer.toString(), '980');
    assert.strictEqual(remaining.toString(), '0');
  });

  // ======================
  // (i) 高级测试（revert + 事件）
  // ======================

  // (i-1) 余额不足时 transfer 应该失败（revert）
  it('reverts when transferring more than balance', async () => {
    await truffleAssert.reverts(
      token.transfer(bob, 1, { from: alice }), // alice 初始为 0
      'ERC20: transfer amount exceeds balance'
    );
  });

  // (i-2) 未授权的 transferFrom 应该失败（revert）
  it('reverts transferFrom without prior approval', async () => {
    await truffleAssert.reverts(
      token.transferFrom(deployer, carol, 1, { from: bob }),
      'ERC20: transfer amount exceeds allowance'
    );
  });

  // (i-3) transfer() 必须触发 Transfer 事件（包括 0 值）
  it('emits Transfer event on transfer() including zero-value', async () => {
    const tx0 = await token.transfer(alice, 0, { from: deployer });
    truffleAssert.eventEmitted(tx0, 'Transfer', (ev) =>
      ev.from === deployer && ev.to === alice && ev.value.toString() === '0'
    );

    const tx = await token.transfer(alice, 5, { from: deployer });
    truffleAssert.eventEmitted(tx, 'Transfer', (ev) =>
      ev.from === deployer && ev.to === alice && ev.value.toString() === '5'
    );
  });

  // (i-4) transferFrom() 必须触发 Transfer 事件（包括 0 值）
  it('emits Transfer event on transferFrom() including zero-value', async () => {
    await token.approve(bob, 10, { from: deployer });

    const tx0 = await token.transferFrom(deployer, carol, 0, { from: bob });
    truffleAssert.eventEmitted(tx0, 'Transfer', (ev) =>
      ev.from === deployer && ev.to === carol && ev.value.toString() === '0'
    );

    const tx = await token.transferFrom(deployer, carol, 5, { from: bob });
    truffleAssert.eventEmitted(tx, 'Transfer', (ev) =>
      ev.from === deployer && ev.to === carol && ev.value.toString() === '5'
    );
  });

  // (i-5) approve() 必须触发 Approval 事件
  it('emits Approval event on approve()', async () => {
    const tx = await token.approve(bob, 12, { from: deployer });
    truffleAssert.eventEmitted(tx, 'Approval', (ev) =>
      ev.owner === deployer && ev.spender === bob && ev.value.toString() === '12'
    );
  });
});
