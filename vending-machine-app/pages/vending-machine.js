import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/vendingMachine.module.css";
import "bulma/css/bulma.css";
import Web3 from "web3";
import vendingMachineContract from "../blockchain/vending";

const VendingMachine = () => {
  const [error, setError] = useState("");
  const [walletConnectStatus, setWalletConnectStatus] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [inventory, setInventory] = useState("");
  const [myDonutCount, setMyDonutCount] = useState("");
  const [buyCount, setBuyCount] = useState("");
  const [web3, setweb3] = useState(null);
  const [address, setAddress] = useState(null);
  const [vmContract, setVmContract] = useState(null);

  useEffect(() => {
    if(vmContract) getInventoryHandler();
    if(vmContract && address) getMyDonutCountHandler();
  },[vmContract,address]);

  const getInventoryHandler = async () => {
    const inventory = await vmContract.methods
      .getVendingMachineBalance()
      .call();
    setInventory(inventory);
  };
  const getMyDonutCountHandler = async () => {
    const count = await vmContract.methods.donutBalances(address).call();
    setMyDonutCount(count);
  };

  const updateDonutQty = (event) => {
    setBuyCount(event.target.value);
  }
  const buyDonutsHandler = async () => {
    try {
      await vmContract.methods.purchase(buyCount).send({
        from:address,
        value:web3.utils.toWei('0.01','ether') * buyCount
      })
      setSuccessMessage(`${buyCount} Donuts Purchased!!`);
      if(vmContract) getInventoryHandler();
      if(vmContract && address) getMyDonutCountHandler();
    } catch (error) {
      setError(error.message)
    }
   
  }

  const connectWalletHandler = async () => {
    // check if wallet is connected
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      try {
        // request wallet connect
        await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletConnectStatus(true);
        // set web3 instance
        web3 = new Web3(window.ethereum);
        setweb3(web3);

        // get list of all the accounts
        const accounts = await web3.eth.getAccounts();
        setAddress(accounts[0]);

        // create local contract copy
        const vm = vendingMachineContract(web3);
        setVmContract(vm);
      } catch (err) {
        setError(err.message);
      }
    } else {
      console.log("Please Install Metamask");
    }
  };

  return (
    <div className={styles.main}>
      <Head>
        <title>VendingMachine App</title>
        <meta
          name="description"
          content="A blockchain vending machine app by Kshitize"
        />
      </Head>

      <nav className="navbar mt-4 mb-4">
        <div className="container">
          <div className="navbar-brand">
            <h1>Vending Machine</h1>
          </div>
          <div className="navbar-end">
            <button disabled={walletConnectStatus}
              onClick={connectWalletHandler}
              className="button is-primary"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </nav>

      <section>
        <div className="container">
          <h2>Vending Machine Inventory:{inventory}</h2>
        </div>
      </section>

      <section>
        <div className="container">
          <h2>My Donuts:{myDonutCount}</h2>
        </div>
      </section>

      <section className="mt-4">
        <div className="container">
          <div className="field"></div>
          <label className="label">Buy Donuts</label>
          <div className="control"></div>
          <input onChange={updateDonutQty} className="input" type="type" placeholder="Enter Amount" />
        </div>
        <button onClick={buyDonutsHandler} className="button is-primary mt-4 ml-6">Buy</button>
      </section>

      <section>
        <div className="container has-text-danger">
          <p>{error}</p>
        </div>
      </section>

      <section>
        <div className="container has-text-success">
          <p>{successMessage}</p>
        </div>
      </section>
    </div>
  );
};

export default VendingMachine;
