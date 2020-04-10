const Propinas = artifacts.require("Propinas");
const Atacante = artifacts.require("Atacante");

module.exports = async function(deployer) {
  await deployer.deploy(Propinas);
  
  await deployer.deploy(Atacante, Propinas.address);
};