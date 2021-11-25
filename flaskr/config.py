from web3 import Web3, HTTPProvider

import json

CHAIN_ID = 1 # 4 for Rinkeby, Ropsten 3, Mainnet 1
GAS_LIMIT = 356608
GAS_PRICE = 80 # allways check network before

nft_json = "./flaskr/abi/erc721.json"

with open(nft_json) as f:
    nft_artifact = json.load(f)
nft_abi = nft_artifact['abi']

nft_address = "0x82cbb7d65383Cb606C5111db4C999aE50c729253"

w3 = Web3(HTTPProvider("https://ropsten.infura.io/v3/1a931b395b02486da32dd50a4cd3bdf9"))
