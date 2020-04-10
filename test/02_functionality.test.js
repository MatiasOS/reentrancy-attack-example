const { expectRevert } = require('@openzeppelin/test-helpers');
const Propinas = artifacts.require('./Propinas.sol');
const Atacante = artifacts.require('./Atacante.sol');

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Propinas', accounts => {
  let propinas;

  const deployer = accounts[0];
  const donador = accounts[1];
  const mozo = accounts[2];
  const camarera = accounts[3];
  const empleadoSospechoso = accounts[4];
  const giverA = accounts[5];
  const giverB = accounts[6];

  before(async () => {
    propinas = await Propinas.deployed();
  })

  describe('Propinas', async () => {
    it('should be able of get balance of and addreess', async () => {
      const balance = await propinas.balanceOf(mozo);
      assert.equal(balance, 0);
    });

    it('should be able of receive ether as tip', async () => {
      let balance = await propinas.balanceOf(mozo);
      assert.equal(balance, 0);
      const a = await propinas.sendTip(mozo, { from: donador, value: 10000000000000000000 }); // WEI
      balance = await propinas.balanceOf(mozo);
      assert.equal(balance, 10000000000000000000);
    });

    it('should be able of receive ether as tip', async () => {
      let camareraBalance = await propinas.balanceOf(camarera);
      assert.equal(camareraBalance, 0);
    });

    it('should sum multiple tips', async () => {
      let initialBalance = await propinas.balanceOf(mozo);
      const a = await propinas.sendTip(mozo, { from: donador, value: 10000000000000000000 }); // WEI
      const balance = await propinas.balanceOf(mozo);
      assert.equal(balance, initialBalance + 10000000000000000000);
    });

    it('should not be able of withdraw balance if balance is 0', async () => {
      const camareraBalance = await propinas.balanceOf(camarera);
      assert.equal(camareraBalance, 0);
      await expectRevert(
        propinas.get({from: camarera}),
        'Balance is zero',
      );
    });

    it('should be able of withdraw balance', async () => {
      let mozoTips = await propinas.balanceOf(mozo);
      const mozoInitialBalance = await web3.eth.getBalance(mozo);
      assert.notEqual(mozoTips, 0);
      await propinas.get({from: mozo});
      mozoTips = await propinas.balanceOf(mozo);
      assert.equal(mozoTips, 0);
      const mozoFinalBalance = await web3.eth.getBalance(mozo);
      assert.notEqual(mozoInitialBalance, mozoFinalBalance);
    });
  })

  describe('Atacante', async () => {
    it('should be to get target address', async () => {
      const atacante = await Atacante.deployed();
      const addressPropinas = await atacante.propinas();
      assert.equal(addressPropinas, Propinas.address)
    });

    it('should be able to withdraw ether from', async () => {
      const empleadoSospechosoInitialBalance = await web3.eth.getBalance(empleadoSospechoso);
      assert.notEqual(empleadoSospechosoInitialBalance, 0);
      Atacante.new( Propinas.address ,{ from: empleadoSospechoso, value: 1000000000 });
      const atacante = await Atacante.deployed();
      const empleadoSospechosoFinalBalance = await web3.eth.getBalance(empleadoSospechoso);
      assert.notEqual(empleadoSospechosoFinalBalance, 0);

      const a = await atacante.withdraw({from: empleadoSospechoso});
      // console.log(a);
    });
  });
});
