const CharContract = artifacts.require("CharContract");

module.exports = function (deployer) {
    deployer.deploy(CharContract);
}