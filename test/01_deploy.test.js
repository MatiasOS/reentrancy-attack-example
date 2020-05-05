const Propinas = artifacts.require('./Propinas.sol');
const Atacante = artifacts.require('./Atacante.sol');

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Propinas', () => {
  let propinas;

  before(async () => {
    propinas = await Propinas.deployed();
  })
  describe('Deployment', async () => {
    it('Deploys successfully', async () => {
      const address = propinas.address;
      assert.notEqual(address, '');
      assert.notEqual(address, 0x0);
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    })
  })
});

contract('Atacante', accounts => {
  let atacante;

  before(async () => {
    atacante = await Atacante.deployed();
  })

  describe('Deployment', async () => {
    it('Deploys successfully', async () => {
      const address = atacante.address;
      assert.notEqual(address, '');
      assert.notEqual(address, 0x0);
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    })
    it('Should have an address to perform the attack', async () => {
      const address = atacante.address;
      assert.notEqual(address, '');
      assert.notEqual(address, 0x0);
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    })
  })
})

