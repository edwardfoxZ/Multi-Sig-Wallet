# Multi-Signature Wallet

This project implements a Multi-Signature Wallet (Multi-Sig) system on the Ethereum blockchain. The Multi-Sig wallet allows multiple parties to manage a single wallet in a secure and collaborative manner. In this implementation, a predefined number of signatures from different addresses are required to authorize transactions, enhancing security and trust.

## Features

- **Multi-Signature Authorization**: Define a wallet that requires multiple private keys to approve transactions.
- **Customizable Signatures**: Specify the number of signatures required for transaction approval (e.g., 2-of-3, 3-of-5).
- **Security**: Mitigates the risk of unauthorized transactions by requiring multiple parties to sign.
- **Ethereum Integration**: Supports the Ethereum blockchain for smart contract deployment and interaction.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Smart Contract Details](#smart-contract-details)
4. [Example](#example)
5. [Contributing](#contributing)
6. [License](#license)

## Installation

To get started with the Multi-Sig Wallet project, clone this repository and install the necessary dependencies.

### Prerequisites

- **Node.js** (v14.0 or higher)
- **npm** (v6.0 or higher)
- **Truffle** (for smart contract deployment)
- **Ganache** or an Ethereum testnet for local development

### Step 1: Clone the repository

```bash
git clone https://github.com/edwardfoxZ/multi-sig-wallet.git
cd multi-sig-wallet
