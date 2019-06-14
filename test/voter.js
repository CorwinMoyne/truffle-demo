let Voter = artifacts.require('./Voter.sol');

contract('Voter', (accounts) => {

    let voter;
    let firstAccount;

    beforeEach(async () => {
        firstAccount = accounts[0];
        voter = await Voter.new();
        await setOptions(firstAccount, ['coffee', 'tea']);
    });

    it('has no votes by default', async () => {
        let votes = await voter.getVotes.call();
        expect(toNumbers(votes)).to.deep.equal([0, 0]);
    });

    it('can vote with a string option', async () => {
        await voter.vote(
            'coffee',
            { from: firstAccount }
        );
        let votes = await voter.getVotes.call();
        expect(toNumbers(votes)).to.deep.equal([1, 0]);
    });

    it.only('can vote with a number option', async () => {
        await voter.vote['uint256'](
            0,
            { from: firstAccount }
        );
        let votes = await voter.getVotes.call();
        expect(toNumbers(votes)).to.deep.equal([1, 0]);
    });

    async function setOptions(account, options) {
        for (pos in options) {
            await voter.addOption(options[pos], { from: account });
        }
        await voter.startVoting({ from: account, gas: 600000 });
    }

    function toNumbers(bigNumbers) {
        return bigNumbers.map(bigNumber => bigNumber.toNumber());
    }
});