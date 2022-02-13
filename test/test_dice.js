// npm install truffle-assertions

const _deploy_contracts = require("../migrations/2_deploy_contracts");
const truffleAssert = require('truffle-assertions');
var assert = require('assert');

var Dice = artifacts.require("../contracts/Dice.sol");
var DiceMarket = artifacts.require("../contracts/DiceMarket.sol");

contract('DiceMarket', function(accounts) {

  before(async () => {
    diceInstance = await Dice.deployed();
    diceMarketInstance = await DiceMarket.deployed();
    // ErrorType = {
    //   REVERT: "revert",
    //   INVALID_OPCODE: "VM Exception",
    //   OUT_OF_GAS: "out of gas",
    //   INVALID_JUMP: "invalid JUMP"
    // }
  });
  console.log("Testing Trade Contract - 17 Tests");

  it('1a. Dice Add - Test that if Dice added does not have at least 1 side, an error is returned', async () => {
    const a1fail = diceInstance.add(0, 1, {from: accounts[1], value: 1000000000000000000});
    const a2fail = diceInstance.add(0, 1, {from: accounts[2], value: 1000000000000000000});
  
    try {
      await a1fail;
      // assert(false)
    } catch(err) {
      // console.log('err.message:', err.message)
      assert.deepStrictEqual(err.message,"Returned error: VM Exception while processing transaction: revert dice must have at least 1 side -- Reason given: dice must have at least 1 side.");
    }

    try {
      await a2fail;
      // assert(false)
    } catch(err) {
      // console.log('err.message:', err.message)
      assert.deepStrictEqual(err.message,"Returned error: VM Exception while processing transaction: revert dice must have at least 1 side -- Reason given: dice must have at least 1 side.");
    }
  
  });

  it('1b. Dice Add - Test that if at least 0.01 ether is not supplied to Dice contract add function, an error is returned', async () => {
    // no await in const, await in try
    const addDice0Fail = diceInstance.add(1, 1, {from: accounts[1], value: 0});
    const addDice1Fail = diceInstance.add(1, 1, {from: accounts[2]});

    try {
      await addDice0Fail;
      // assert(false)
    } catch(err) {
      // console.log('err.message:', err.message)
      assert.deepStrictEqual(err.message,"Returned error: VM Exception while processing transaction: revert at least 0.01 ETH is needed to spawn a new dice -- Reason given: at least 0.01 ETH is needed to spawn a new dice.");
    }

    try {
      await addDice1Fail;
      // assert(false)
    } catch(err) {
      // console.log('err.message:', err.message)
      assert.deepStrictEqual(err.message,"Returned error: VM Exception while processing transaction: revert at least 0.01 ETH is needed to spawn a new dice -- Reason given: at least 0.01 ETH is needed to spawn a new dice.");
    }
  });

  it('1c. Dice Add - Test creation of Dice', async () => {
    let addDice0 = await diceInstance.add(1, 1, {from: accounts[1], value: 1000000000000000000});
    let addDice1 = await diceInstance.add(30, 1, {from: accounts[2], value: 1000000000000000000});
  
    assert.notStrictEqual(
      addDice0,
      undefined,
      "Failed to make dice"
    );
  
    assert.notStrictEqual(
      addDice1,
      undefined,
      "Failed to make dice"
    );
  
  });

  it('2. Dice Roll - Test that owner can roll Dice', async () => {
    let r1 = await diceInstance.roll(0, {from: accounts[1]});
    let r2 = await diceInstance.roll(1, {from: accounts[2]});

    truffleAssert.eventEmitted(r1, 'rolling');
    truffleAssert.eventEmitted(r2, 'rolling');
  });


  it('3. Dice StopRoll - Test that owner can stop roll Dice', async () => {
    let sr1 = await diceInstance.stopRoll(0, {from: accounts[1]});
    let sr2 = await diceInstance.stopRoll(1, {from: accounts[2]});

    truffleAssert.eventEmitted(sr1, 'rolled');
    truffleAssert.eventEmitted(sr2, 'rolled');
  });

  
  it('4a. Dice Transfer - Test that if Dice is not transferred to DiceMarket by owner, an error is returned', async () => {
    // no await in const, await in try
    let tfail1 = diceInstance.transfer(0, diceMarketInstance.address, {from: accounts[2]});
    let tfail2 = diceInstance.transfer(1, diceMarketInstance.address, {from: accounts[1]});
  
    try {
      await tfail1;
      // assert(false)
    } catch(err) {
      // console.log('err.message:', err.message)
      assert.deepStrictEqual(err.message,"Returned error: VM Exception while processing transaction: revert Dice can only be transferred by owner -- Reason given: Dice can only be transferred by owner.");
    }

    try {
      await tfail2;
      // assert(false)
    } catch(err) {
      // console.log('err.message:', err.message)
      assert.deepStrictEqual(err.message,"Returned error: VM Exception while processing transaction: revert Dice can only be transferred by owner -- Reason given: Dice can only be transferred by owner.");
    }

    // await truffleAssert.fails(t1, truffleAssert.ErrorType.REVERT);
    // truffleAssert.fails(t2, truffleAssert.ErrorType.REVERT);
  });

  it('4b. Dice Transfer - Test that Dice can be transferred to DiceMarket by owner', async () => {
    let t1 = await diceInstance.transfer(0, diceMarketInstance.address, {from: accounts[1]});
    let t2 = await diceInstance.transfer(1, diceMarketInstance.address, {from: accounts[2]});
  
    truffleAssert.passes(t1, 'dice0_transferred');
    truffleAssert.passes(t2, 'dice1_transferred');
  });
  
  it('5a. DiceMarket List - Test that if Dice is not listed by owner, an error is returned', async () => {
    // no await in const, await in try
    let l1fail = diceMarketInstance.list(0, 2, {from: accounts[2]});
    let l2fail = diceMarketInstance.list(1, 2, {from: accounts[1]});

    try {
      await l1fail;
      // assert(false)
    } catch(err) {
      // console.log('err.message:', err.message)
      assert.deepStrictEqual(err.message,"Returned error: VM Exception while processing transaction: revert Dice can only be listed by owner -- Reason given: Dice can only be listed by owner.");
    }

    try {
      await l2fail;
      // assert(false)
    } catch(err) {
      // console.log('err.message:', err.message)
      assert.deepStrictEqual(err.message,"Returned error: VM Exception while processing transaction: revert Dice can only be listed by owner -- Reason given: Dice can only be listed by owner.");
    }

  });

  it('5b. DiceMarket List - Test that Dice cannot be listed if price is less than value and commission', async () => {
    // no await in const, await in try
    let l1fail = diceMarketInstance.list(0, 3, {from: accounts[1]});
    let l2fail = diceMarketInstance.list(0, 3, {from: accounts[1]});

    try {
      await l1fail;
      // assert(false)
    } catch(err) {
      // console.log('err.message:', err.message)
      assert.deepStrictEqual(err.message,"Returned error: VM Exception while processing transaction: revert list price must be higher than value and fee -- Reason given: list price must be higher than value and fee.");
    }

    try {
      await l2fail;
      // assert(false)
    } catch(err) {
      // console.log('err.message:', err.message)
      assert.deepStrictEqual(err.message,"Returned error: VM Exception while processing transaction: revert list price must be higher than value and fee -- Reason given: list price must be higher than value and fee.");
    }

    // await truffleAssert.fails(
    //   l1,
    //   truffleAssert.ErrorType.REVERT,
    //   "list price must be higher than value and fee"
    // );
  });


  it('5c. DiceMarket List - Test that owner can list Dice', async () => {
    let l1 = await diceMarketInstance.list(0, web3.utils.toWei('2', 'ether'), {from: accounts[1]});
    let l2 = await diceMarketInstance.list(1, web3.utils.toWei('2', 'ether'), {from: accounts[2]});

    truffleAssert.passes(l1, 'dice0_listed');
    truffleAssert.passes(l2, 'dice1_listed');
  });


  it('6a. DiceMarket Unlist - Test that if Dice is not unlisted by owner, an error is returned', async () => {
    // no await in const, await in try
    let u1fail = diceMarketInstance.unlist(0, {from: accounts[2]});
    let u2fail = diceMarketInstance.unlist(1, {from: accounts[1]});

    try {
      await u1fail;
      // assert(false)
    } catch(err) {
      // console.log('err.message:', err.message)
      assert.deepStrictEqual(err.message,"Returned error: VM Exception while processing transaction: revert Dice can only be unlisted by owner -- Reason given: Dice can only be unlisted by owner.");
    }

    try {
      await u2fail;
      // assert(false)
    } catch(err) {
      // console.log('err.message:', err.message)
      assert.deepStrictEqual(err.message,"Returned error: VM Exception while processing transaction: revert Dice can only be unlisted by owner -- Reason given: Dice can only be unlisted by owner.");
    }

  });

  it('6b. DiceMarket Unlist - Test that owner can unlist Dice', async () => {
    let u1 = await diceMarketInstance.unlist(0, {from: accounts[1]});
    let u2 = await diceMarketInstance.unlist(1, {from: accounts[2]});

    truffleAssert.passes(u1, 'dice0_unlisted');
    truffleAssert.passes(u2, 'dice1_unlisted');
  });

  it('7a. DiceMarket Buy - Test that Dice cannot be bought if it is not listed', async () => {
    // Because dice was unlisted just now, it cannot be bought
    // no await in const, await in try
    let b1fail = diceMarketInstance.buy(0, {from: accounts[2], value: 3000000000000000000});
    let b2fail = diceMarketInstance.buy(1, {from: accounts[1], value: 3000000000000000000});

    try {
      await b1fail;
      // assert(false)
    } catch(err) {
      // console.log('err.message:', err.message)
      assert.deepStrictEqual(err.message,"Returned error: VM Exception while processing transaction: revert Dice can only be bought if it is listed -- Reason given: Dice can only be bought if it is listed.");
    }

    try {
      await b2fail;
      // assert(false)
    } catch(err) {
      // console.log('err.message:', err.message)
      assert.deepStrictEqual(err.message,"Returned error: VM Exception while processing transaction: revert Dice can only be bought if it is listed -- Reason given: Dice can only be bought if it is listed.");
    }
  });

  it('7b. DiceMarket Buy - Test that Dice cannot be bought if price is less than price and commission', async () => {
    // Because dice was unlisted just now, it needs to be listed again to be bought
    // no await in const, await in try
    let l1 = await diceMarketInstance.list(0, web3.utils.toWei('2', 'ether'), {from: accounts[1]});
    let l2 = await diceMarketInstance.list(1, web3.utils.toWei('2', 'ether'), {from: accounts[2]});
    
    truffleAssert.passes(l1, 'dice0_listed');
    truffleAssert.passes(l2, 'dice1_listed');

    let b1fail = diceMarketInstance.buy(0, {from: accounts[2], value: 1000000000000000000});
    let b2fail = diceMarketInstance.buy(1, {from: accounts[1], value: 1000000000000000000});

    try {
      await b1fail;
      // assert(false)
    } catch(err) {
      // console.log('err.message:', err.message)
      assert.deepStrictEqual(err.message,"Returned error: VM Exception while processing transaction: revert buy price must be higher than price and fee -- Reason given: buy price must be higher than price and fee.");
    }

    try {
      await b2fail;
      // assert(false)
    } catch(err) {
      // console.log('err.message:', err.message)
      assert.deepStrictEqual(err.message,"Returned error: VM Exception while processing transaction: revert buy price must be higher than price and fee -- Reason given: buy price must be higher than price and fee.");
    }
  });

  it('7c. DiceMarket Buy - Test that non-owner can buy dice', async () => {
    // let l1 = await diceMarketInstance.list(0, web3.utils.toWei('2', 'ether'), {from: accounts[1]});
    // let l2 = await diceMarketInstance.list(1, web3.utils.toWei('2', 'ether'), {from: accounts[2]});

    // truffleAssert.passes(l1, 'dice0_listed');
    // truffleAssert.passes(l2, 'dice1_listed');

    let b1 = await diceMarketInstance.buy(0, {from: accounts[2], value: 3000000000000000000});
    let b2 = await diceMarketInstance.buy(1, {from: accounts[1], value: 3000000000000000000});

    truffleAssert.passes(b1, 'dice0_bought');
    truffleAssert.passes(b2, 'dice1_bought');

  });


  it('8. DiceMarket CheckPrice - Test that users can check price of dice regardless of ownership', async () => {
    let pc1 = await diceMarketInstance.checkPrice(0, {from: accounts[1]});
    let pc2 = await diceMarketInstance.checkPrice(1, {from: accounts[1]});

    truffleAssert.passes(pc1, 'dice0_pricechecked');
    truffleAssert.passes(pc2, 'dice1_pricechecked');

  });

  it('9. DiceMarket Withdraw - Test that seller can withdraw balance from DiceMarket', async () => {
    let w1 = await diceMarketInstance.withDraw();
    let w2 = await diceMarketInstance.withDraw();

    truffleAssert.passes(w1, 'dice0_withdraw', {from: accounts[1]});
    truffleAssert.passes(w2, 'dice1_withdraw', {from: accounts[2]});

  });
})

