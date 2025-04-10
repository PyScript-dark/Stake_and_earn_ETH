# Stake_and_earn_ETH (Ethereum Staking Script)

This project includes a simple script (`stake.js`) that interacts with the Ethereum blockchain using the `ethers.js` library. The script runs using a technique that aims to collect ETH rewards to the user's staked balance. A full validator should have at least 32 ETH, or the script will automatically attempt to join a staking pool if balance is less than 32 ETH. The higher the staked amount, the higher the earnings.

---

# Prerequisites

To run this project, you need to have `Node.js` and `npm` installed.

### Check if `Node.js` is installed:

```
node -v
npm -v
```

If not installed:

### Windows/macOS: 
Download and install from https://nodejs.org

### Linux (Debian/Ubuntu):

```
sudo apt update
sudo apt install nodejs npm
```

---

# Setup Instructions

Follow the steps below to set up the project and install required dependencies:

**1. Initialize npm**

This will create a `package.json` file:
```
npm init -y
```
**2. Install Required Dependency**

Install `ethers.js`, the library used to interact with Ethereum:
```
npm install ethers
```
This creates a `node_modules` folder and updates `package.json`.


---

# Running the Script

Once setup is complete, run the `stake.js` script using `Node.js`:
```
node stake.js
```
Make sure `stake.js` is in the root of your project folder, or adjust the path accordingly.


---

# Important Notes

**Free to use:** This project is free to use for all who access it.

**Full Validator:** A full validator should have at least 32 ETH, or the script will automatically attempt to join a staking pool if balance is less than 32 ETH. 

**Rewards:** The higher the staked amount, the higher the earnings.

**Modify with caution:** Avoid making changes to the script logic carelessly, as it could affect its functionality.

**RPC Link:** Consider changing the RPC link to use your own Infura API key or any other Ethereum RPC provider of your choice.



---

# Troubleshooting

If you see a "command not found" error, make sure `Node.js` and `npm` are properly installed and added to your system's PATH.

Try restarting your terminal after installing `Node.js`.



---

# License

This project is free to use, but avoid making changes carelessly to the script logic.


---

# Author

DarkWebHacker — https://keybase.io/darkwebhacker
