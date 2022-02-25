# revo-compounder

This repository contains an auto-compounding bot for the Revo platform. Currently, only pre-approved addresses are allowed
to claim rewards and facilitate auto-compounding on Revo farms.

## Usage

This bot performs compounding on all Revo farms on an interval. It does *not* currently check to ensure that calling
compound is profitable.

First, copy `.env.example` to `.env` and fill in your private key. You can also specify furthehr configuration options there; see `/src/config.ts` for the full list.

### Building

```
yarn build
```

### Running

```
yarn start
```
