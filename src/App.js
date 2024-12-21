import React, { useEffect, useState } from "react";
import Multisig from "./contracts/Multisig.json";
import { getWeb3 } from "./utils.js";

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [currentTransfer, setCurrentTransfer] = useState(undefined);
  const [quorum, setQuorum] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Multisig.networks[networkId];
        const contract = new web3.eth.Contract(
          Multisig.abi,
          deployedNetwork && deployedNetwork.address
        );
        const quorum = await contract.methods.quorum().call();

        setWeb3(web3);
        setAccounts(accounts);
        setContract(contract);
        setQuorum(quorum);
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };
    init();

    // Update account when it changes
    window.ethereum.on("accountsChanged", (accounts) => {
      setAccounts(accounts);
    });
  }, []);

  useEffect(() => {
    if (contract && web3) {
      updateBalance();
      updateCurrentTransfer();
    }
  }, [accounts, contract, web3]);

  async function updateBalance() {
    try {
      const balance = await web3.eth.getBalance(contract.options.address);
      setBalance(web3.utils.fromWei(balance, "ether"));
    } catch (error) {
      console.error("Error updating balance:", error);
    }
  }

  async function createTransfer(e) {
    e.preventDefault();
    try {
      const amount = e.target.elements[0].value;
      const to = e.target.elements[1].value;
      await contract.methods
        .createTransfer(web3.utils.toWei(amount, "ether"), to)
        .send({ from: accounts[0] });
      await updateCurrentTransfer();
    } catch (error) {
      console.error("Error creating transfer:", error);
    }
  }

  async function sendTransfer() {
    try {
      await contract.methods
        .sendTransfer(currentTransfer.id)
        .send({ from: accounts[0] });
      await updateBalance();
      await updateCurrentTransfer();
    } catch (error) {
      console.error("Error sending transfer:", error);
    }
  }

  async function updateCurrentTransfer() {
    try {
      const currentTransferId =
        Number(await contract.methods.nextId().call()) - 1;
      if (currentTransferId >= 0) {
        const currentTransfer = await contract.methods
          .transfers(currentTransferId)
          .call();
        const alreadyApproved = await contract.methods
          .approvals(accounts[0], currentTransferId)
          .call();
        setCurrentTransfer({ ...currentTransfer, alreadyApproved });
      } else {
        setCurrentTransfer(null);
      }
    } catch (error) {
      console.error("Error updating current transfer:", error);
    }
  }

  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Multisig Wallet</h1>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Contract Balance</h5>
          <p className="card-text">
            <b>{balance ? `${balance} ETH` : "Loading..."}</b>
          </p>
        </div>
      </div>

      {!currentTransfer || Number(currentTransfer.approvals) === quorum ? (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Create Transfer</h5>
            <form onSubmit={createTransfer}>
              <div className="form-group">
                <label htmlFor="amount">Amount (ETH)</label>
                <input
                  type="number"
                  className="form-control"
                  id="amount"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="to">Recipient Address</label>
                <input type="text" className="form-control" id="to" required />
              </div>
              <button type="submit" className="btn btn-primary mt-3">
                Submit
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Approve Transfer</h5>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                Transfer ID: {currentTransfer.id}
              </li>
              <li className="list-group-item">
                Amount: {web3.utils.fromWei(currentTransfer.amount, "ether")}{" "}
                ETH
              </li>
              <li className="list-group-item">
                Approvals: {currentTransfer.approvals}
              </li>
            </ul>
            {currentTransfer.alreadyApproved ? (
              <div className="alert alert-success mt-3">Already approved</div>
            ) : (
              <button
                type="button"
                className="btn btn-primary mt-3"
                onClick={sendTransfer}
              >
                Approve Transfer
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
