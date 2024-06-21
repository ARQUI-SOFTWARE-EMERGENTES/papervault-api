const ResearchsContract = artifacts.require("ResearchsContract");

module.exports = function(deployer) {
    deployer.deploy(ResearchsContract);
}