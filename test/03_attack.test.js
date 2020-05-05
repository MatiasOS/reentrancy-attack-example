const Propinas = artifacts.require('./Propinas.sol');
const Atacante = artifacts.require('./Atacante.sol');

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Reentracny attack ', ([deployer, donador, mozo, camarera, hackerAccount, giverA, giverB, ...accounts ]) => {
  let propinas;
  let atacanteInstance;

  before(async () => {
    propinas = await Propinas.deployed();
  })

  describe('Attack', async () => {
    it('Should be able to steal all Ether', async () => {
      const tip = web3.utils.toWei('1', "ether");
      
      // Fresh start
      await Propinas.new(); // Accounts[0] is default for transactions

      // Initial balances are Zero 
      let initialBalanceMozo = await propinas.balanceOf(mozo);
      assert.equal(initialBalanceMozo, 0);

      let initialBalanceCamarera = await propinas.balanceOf(camarera);
      assert.equal(initialBalanceCamarera, 0);

      let hackerInitialBalance = await propinas.balanceOf(hackerAccount);
      assert.equal(hackerInitialBalance, 0);

      // Give tips to employees
      await propinas.sendTip(mozo, { from: donador, value: tip}); 
      balance = await propinas.balanceOf(mozo);
      assert.equal(balance, tip);

      await propinas.sendTip(camarera, { from: donador, value: tip }); 
      balance = await propinas.balanceOf(camarera);
      assert.equal(balance, tip);

      // Give more tips to employees
      for (let i = 0; i < 72; i++) {
        await propinas.sendTip(i % 2 ? mozo: camarera, 
          { from: i % 3 ? giverA : giverB, value: tip}); 
      };

      // At some point, Hackerman gets ready to strike
      console.log('ETH en Hacker address al iniciar: ', web3.utils.fromWei(await web3.eth.getBalance(hackerAccount)));
      const hackerInitialEther = await web3.eth.getBalance(hackerAccount);
      atacanteInstance = await Atacante.new( Propinas.address ,{ from: hackerAccount });
      console.log('ETH en Hacker address después de deploy: ', web3.utils.fromWei(await web3.eth.getBalance(hackerAccount)));

      // AutoGive a Tip
      await propinas.sendTip(
        atacanteInstance.address, 
        { from: hackerAccount, value: web3.utils.toWei('1', "ether")}
      );
      console.log('ETH en Hacker address después de tip al SC:', web3.utils.fromWei(await web3.eth.getBalance(hackerAccount)));
      console.log('Propinas inicial ETH:', web3.utils.fromWei(await web3.eth.getBalance(propinas.address)));
      console.log('ETH en Propinas asginadas al SC:', web3.utils.fromWei(await propinas.getBalanceOf(atacanteInstance.address)).toString());
      console.log('ETH en Propinas asignadas al Hacker:', web3.utils.fromWei(await propinas.getBalanceOf(hackerAccount)).toString());
      

      await atacanteInstance.collectTips({from: hackerAccount});
      let hackerEther = await web3.eth.getBalance(hackerAccount);
      console.log('Hacker ETH despues del ataque:', web3.utils.fromWei(await web3.eth.getBalance(hackerAccount)));

      await atacanteInstance.withdraw({from: hackerAccount});
      hackerEther = await web3.eth.getBalance(hackerAccount);
      console.log('Hacker ETH despues del withdraw:', web3.utils.fromWei(await web3.eth.getBalance(hackerAccount)));
      assert.equal(hackerEther > hackerInitialEther, true);
    });
  });
});