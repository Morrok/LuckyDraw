# Decentralized App 

A decentralized lucky draw game based on [Ethereum blockchain](https://ethereum.org/dapps/) technology.

> This code was reference from https://github.com/fintechutcc/Voting.

## System Workflow

A brief explanation on the basic workflow of the application.

- Admin will create a lucky draw instance by launching/deploying the system in a blockchain network (EVM).
- Then the likely players connect to the same blockchain network register to become a player. Once the number of registrations reaches 6 people, their respective details are sent/displayed in the lucky draw page.
- The admin then will spin the wheel to find a winner and when get the winner, the admin will confirm the award send to the winner.

---

## Setting up the development environment

### Requirements

- [Node.js](https://nodejs.org)
- [Truffle](https://www.trufflesuite.com/truffle)
- [Ganache](https://github.com/trufflesuite/ganache)
- [Metamask](https://metamask.io/) (Browser Extension)

#### Getting the requirements

1. Download and install **NodeJS**

   Download and install NodeJS from [here](https://nodejs.org/en/download/ "Go to official NodeJS download page.").

1. Install **truffle** using node packager manager (npm)

   ```shell
   npm install -g truffle
   ```

1. Install **metamask** browser extension

   Download and install metamask from [here](https://metamask.io/download "Go to official metamask download page.").

### Configuring the project for development

1. Clone this repository

   ```shell
   git clone https://github.com/Morrok/LuckyDraw.git
   cd LuckyDraw
   ```

2. Run local Ethereum blockchain, e.g., Ganache.

3. Configure metamask on the browser with the following details

   New RPC URL: `http://127.0.0.1:8545` 

   Chain ID: `1337`

4. Import account(s) using private keys from Ganache to the metamask extension on the browser

5. Deploy smart contract to the (local) blockchain network

   ```shell
   # on the LuckyDraw directory
   truffle migrate
   ```

   > Note: Use `truffle migrate --reset` for re-deployments

6. Launch the development server (frontend)

   ```shell
   cd client
   npm install
   npm start
   ```
