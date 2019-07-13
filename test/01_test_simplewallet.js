const SimpleWallet = artifacts.require("SimpleWallet");

contract("Simple Wallet Test", async accounts => {
  it("Should be empty at the beginning", async () => {
    let instance = await SimpleWallet.deployed();
    let balance = await web3.eth.getBalance(instance.address);
    assert.equal(balance, 0, "The balance wasn't zero");
  });

  it("Admin only should be able to deposit and withdraw ether", async () => {
    let instance = await SimpleWallet.deployed();
    let isAllowed = await instance.isAllowed.call(accounts[0]);
    assert.equal(
      isAllowed,
      true,
      "Admin wasn't allowed to deposit or withdraw"
    );

    let shouldNotAllow = await instance.isAllowed.call(accounts[2]);
    assert.equal(shouldNotAllow, false, "User is allowed");
  });

  it("should be possible to add and remove an account", async () => {
    let instance = await SimpleWallet.deployed();
    let isAllowedBefore = await instance.isAllowed.call(accounts[1]);
    assert.equal(isAllowedBefore, false, "Account was allowed");

    await instance.allowToSend(accounts[1]);
    let shouldAllow = await instance.isAllowed.call(accounts[1]);
    assert.equal(shouldAllow, true, "Account was not allowed");

    await instance.disallowAddressToSend(accounts[1]);
    let shouldNotAllow = await instance.isAllowed.call(accounts[1]);
    assert.equal(shouldNotAllow, false, "Account was allowed");
  });

  it("should emit a Deposit event", async () => {
    let instance = await SimpleWallet.deployed();
    let result = await instance.depositEther({
      from: accounts[0],
      value: web3.utils.toWei("1", "ether")
    });
    assert.equal(result.logs[0].event, "Deposit", "No Deposit event");
    assert.equal(result.logs[0].args._amount, web3.utils.toWei("1", "ether"));
  });

  it("should throw error when depositing from account#2", async () => {
    let instance = await SimpleWallet.deployed();
    let errHappened = false;
    try {
      await instance.depositEther({from: accounts[1], value: 10000});
    } catch (e) {
      assert.isTrue(e.message.includes("Unauthorized"), "Error was not Unauthorized")
      errHappened = true;
    }
    assert.equal(errHappened, true, "No error happened");
  });
});
