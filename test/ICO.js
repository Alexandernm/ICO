const DES = artifacts.require("./ICO.sol");


async function timeTravelTo(tm) {
  const currentTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp;
  await web3.currentProvider.send(
    { jsonrpc: "2.0"
    , method: "evm_increaseTime"
    , params: [tm - currentTime]
    , id: currentTime
    });
  await web3.currentProvider.send(
    { jsonrpc: "2.0"
    , method: "evm_mine"
    , params: []
    , id: tm
    });
}

contract("DES", () => {

  let ico;

  it("should be able to create ICO", async () => {
    ico = await DES.new();
    assert.isOk(ico && ico.address, "has invalid address");
  });


  it("should be able to sell DES after ICO has started", async () => {
    const startTime = ico.START_TIMESTAMP.call();
    await timeTravelTo(startTime);
    assert.isOk(await ico.hasStarted.call(), "ICO has started");

    const addr = web3.eth.accounts[0];
    await web3.eth.sendTransaction(
      { to: ico.address
      , from: addr
      , value: web3.toWei(0.1, 'ether')
      , gas: 111 * 1000
      });
    const balance = await ico.balanceOf.call(addr);
    const desBalance = web3.fromWei(StatsEthereumRaised, 'ether').toFixed();
    assert.equal(100, desBalance, "balance is updated");
  });

  // split into files
  //   - running_ICO
  //     - can pay
  //     - constant functions
  //   - failed_ICO
  //     - chk refund
  //   - successfull_ICO
  //     - chk withdraw
  //     - chk liquidity
  //
})
