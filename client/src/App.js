import React, { Component } from "react";
import SimpleWallet from "./contracts/SimpleWallet.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    contract: null,
    depositAmount: 0.001,
    selectedAddress: "",
    balance: 0,
    whiteList: "",
    blacklist: "",
    sendAddress: "",
    sendAmount: 0.001,
    accountBalance: 0
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleWallet.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleWallet.abi,
        deployedNetwork.address
      );
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        web3,
        contract: instance,
        selectedAddress: web3.givenProvider.selectedAddress
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
    this.getBalance();
    this.checkAddress(true);
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  checkAddress = async check => {
    if (
      this.state.selectedAddress !==
        this.state.web3.givenProvider.selectedAddress ||
      check
    ) {
      const selectedAddress = this.state.web3.givenProvider.selectedAddress;
      const accountBalance = await this.state.web3.eth.getBalance(
        this.state.web3.givenProvider.selectedAddress
      );
      this.setState({
        selectedAddress,
        accountBalance: this.state.web3.eth.utils.fromWei(
          `${accountBalance}`,
          "ether"
        )
      });
    }
  };

  depositEther = async e => {
    e.preventDefault();

    await this.state.contract.methods.depositEther().send(
      {
        from: this.state.web3.givenProvider.selectedAddress,
        value: this.state.web3.eth.utils.toWei(
          `${this.state.depositAmount}`,
          "ether"
        )
      },
      async () => await setTimeout(() => this.getBalance(), 1000)
    );
  };

  getBalance = async () => {
    const balance = await this.state.web3.eth.getBalance(
      this.state.contract.address
    );
    this.setState({
      balance: this.state.web3.utils.fromWei(`${balance}`, "ether")
    });
  };

  whiteList = async e => {
    e.preventDefault();
    await this.state.contract.methods
      .allowToSend(this.state.whiteList)
      .send({ from: this.state.web3.givenProvider.selectedAddress }, () =>
        this.setState({ whiteList: "" })
      );
  };

  blacklist = async e => {
    e.preventDefault();
    await this.state.contract.methods
      .disallowAddressToSend(this.state.blacklist)
      .send({ from: this.state.web3.givenProvider.selectedAddress }, () =>
        this.setState({ blacklist: "" })
      );
  };

  sendEther = async e => {
    e.preventDefault();
    const { sendAmount, sendAddress } = this.state;
    await this.state.contract.methods
      .sendFunds(
        this.state.web3.utils.toWei(`${sendAmount}`, "ether"),
        sendAddress
      )
      .send(
        { from: this.state.web3.givenProvider.selectedAddress },
        async () => await setTimeout(() => this.getBalance(), 1000)
      );
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>
          {this.state.selectedAddress}
          <button onClick={this.checkAddress}>Refresh</button>
        </h1>
        <h3>Account Balance: {this.state.accountBalance} Ether</h3>
        <h3>Wallet Balance: {this.state.balance} Ether</h3>

        <div>
          <form onSubmit={this.depositEther}>
            <h3>Fill up the Wallet</h3>
            <label htmlFor="depositAmount">Deposit Ether</label>
            <input
              id="depositAmount"
              type="number"
              name="depositAmount"
              min="0.001"
              step="0.001"
              value={this.state.depositAmount}
              onChange={this.handleChange}
            />
            <button type="submit">Deposit Ether</button>
          </form>

          <form onSubmit={this.whiteList}>
            <h3>Account Privileges</h3>
            <label htmlFor="whiteList">Whitelist Account</label>
            <input
              id="whiteList"
              type="text"
              name="whiteList"
              value={this.state.whiteList}
              onChange={this.handleChange}
              placeholder="Add account to whitelist"
            />
            <button type="submit">Whitelist Account</button>
          </form>

          <form onSubmit={this.blacklist}>
            <label htmlFor="blacklist">Blacklist Account</label>
            <input
              id="blacklist"
              type="text"
              name="blacklist"
              value={this.state.blacklist}
              onChange={this.handleChange}
              placeholder="Add account to blacklist"
            />
            <button type="submit">Blacklist Account</button>
          </form>

          <form onSubmit={this.sendEther}>
            <label htmlFor="sendAddress">Receivers Account</label>
            <input
              id="sendAddress"
              type="text"
              name="sendAddress"
              value={this.state.sendAddress}
              onChange={this.handleChange}
              placeholder="Receivers account"
            />
            <label htmlFor="sendAmount">Send Ether</label>
            <input
              id="sendAmount"
              type="number"
              name="sendAmount"
              min="0.001"
              step="0.001"
              value={this.state.sendAmount}
              onChange={this.handleChange}
            />
            <button type="submit">Send Ether</button>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
