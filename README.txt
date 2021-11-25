I] Variable configuration
1. Register an account with infura
2. Create a new project and copy the project ID (free)
3. Past the project ID in flaskr/config.py and flaskr/static/js/shared/wallet.js

II] Deploy the smart contracts
1. Deploy the ERC721.sol contract
2. Put its address in line 463 of marketplace.sol
3. Deploy the marketplace contract
4. Deploy the DutchAuction contract, with ERC721 address as an argument
5. Take all the addresses and past in flaskr/static/js/shared/addresses.js
6. Copy the ERC721 address in flaskr/config.py

III] Install python/flask/web3
1. Install Python 3.x
2. Install python3-pip
3. Install Flask: pip install flask
4. Install Web 3: pip install web3
5. export FLASK_ENV=development
6. export FLASK_APP=flaskr
7. flask run
