var LuckyDraw = artifacts.require("./LuckyDraw.sol");

module.exports = function(deployer) {
  deployer.deploy(LuckyDraw);
};
