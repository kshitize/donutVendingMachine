import Web3 from "web3"

const provider = new Web3.providers.HttpProvider(
    "https://goerli.infura.io/v3/734815a4f11040b5bc9f7a3a6f565d8a"
)

const web3 = new Web3(provider);

const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"donutBalances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getVendingMachineBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"purchase","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"restock","outputs":[],"stateMutability":"nonpayable","type":"function"}];

const vendingMachineContract = (web3) => {
    return new web3.eth.Contract(abi,"0xe6A772AE396aEbDE476296331EFd41f6F901A98E");
}

export default vendingMachineContract;