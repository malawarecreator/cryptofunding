export const contract = {
	address: '0x5cF4a49794Ada480c1Ff93d4bcd31dD671042f9F',
	abi: [
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_treasury",
					"type": "address"
				},
				{
					"internalType": "address",
					"name": "_investor",
					"type": "address"
				}
			],
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "donator",
					"type": "address"
				},
				{
					"indexed": true,
					"internalType": "uint256",
					"name": "fundraiserIndex",
					"type": "uint256"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "amount",
					"type": "uint256"
				}
			],
			"name": "Donated",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "creator",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "creatorFullName",
					"type": "string"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "title",
					"type": "string"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "goal",
					"type": "uint256"
				}
			],
			"name": "FundraiserCreated",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "creator",
					"type": "address"
				},
				{
					"indexed": true,
					"internalType": "uint256",
					"name": "fundraiserIndex",
					"type": "uint256"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "amount",
					"type": "uint256"
				}
			],
			"name": "Withdrawn",
			"type": "event"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "title",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "creatorFullname",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "description",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "goal",
					"type": "uint256"
				}
			],
			"name": "createFundraiser",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "donatorFullName",
					"type": "string"
				},
				{
					"internalType": "uint32",
					"name": "indexOfFundraiser",
					"type": "uint32"
				}
			],
			"name": "donate",
			"outputs": [],
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "fundraisers",
			"outputs": [
				{
					"internalType": "address",
					"name": "creator",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "creatorFullName",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "title",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "description",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "goal",
					"type": "uint256"
				},
				{
					"internalType": "bool",
					"name": "fulfilled",
					"type": "bool"
				},
				{
					"internalType": "uint256",
					"name": "totalDonated",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "fundraiserIndex",
					"type": "uint256"
				}
			],
			"name": "getDonators",
			"outputs": [
				{
					"components": [
						{
							"internalType": "address",
							"name": "donator",
							"type": "address"
						},
						{
							"internalType": "string",
							"name": "donatorFullName",
							"type": "string"
						},
						{
							"internalType": "uint256",
							"name": "amountGiven",
							"type": "uint256"
						}
					],
					"internalType": "struct Funding.Donator[]",
					"name": "",
					"type": "tuple[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "index",
					"type": "uint256"
				}
			],
			"name": "getFundraiser",
			"outputs": [
				{
					"internalType": "address",
					"name": "creator",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "creatorFullName",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "goal",
					"type": "uint256"
				},
				{
					"internalType": "bool",
					"name": "fulfilled",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "getFundraisersLength",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "investor",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_investor",
					"type": "address"
				}
			],
			"name": "setInvestor",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_treasury",
					"type": "address"
				}
			],
			"name": "setTreasury",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "treasury",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "indexOfFundraiser",
					"type": "uint256"
				}
			],
			"name": "withdraw",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"stateMutability": "payable",
			"type": "receive"
		}
	]
}

