# react_simple_wallet
Solution code for SimpleWallet assignment from https://www.udemy.com/blockchain-developer-bundle/ using React instead of Angular

## Initial Setup
- [ ] Install truffle if you haven't already, run `npm install -g truffle`
- [ ] To initialize the project using React run `truffle unbox react` inside an empty directory.

## Set up the contract
- [ ] Check `truffle-config.js` for correct host and port numbers
- [ ] Replace `SimpleStorage.sol` with your `SimpleWallet.sol` file in the contracts directory
- [ ] Update `2_deploy_contracts.js` in the migrations directory
- [ ] First run `truffle compile`, then run `truffle migrate` to deploy the contracts onto your network of choice (default "development").

## Building and the frontend
- [ ] Run `cd client` followed by `npm install` or `yarn` to install dependencies.
- [ ] Clean up the unused code in App.js and start building!

### At a minimum you will want to
- [ ] Display Wallet balance
- [ ] Deposit Ether
- [ ] Whitelist accounts
- [ ] Blacklist accounts
- [ ] Send Ether

### Notes
- MetaMask does not give a list of accounts. I opted to have the forms submit from the chosen account in MetaMask instead of choosing from a dropdown. 
- It seems like there is no longer a way to listen for a change in accounts from MetaMask.
- You could easily use https://material-ui.com/ to make your wallet look just like the assignment
- https://web3js.readthedocs.io/en/1.0/ and `console.log()` are your friend
