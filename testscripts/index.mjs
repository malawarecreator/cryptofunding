import { createWalletClient, createPublicClient, parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'
import { http } from 'viem'
import 'dotenv/config'


const privatekey = process.env.PRIVATE_KEY;

const account = privateKeyToAccount(privatekey)

const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(),
})


const client = createPublicClient({
  chain: sepolia,
  transport: http(),
})


const contract = {
    address: '0x3Fc0386290Ac6f0f92Ada07628f117f3ea55A000',
    abi: [
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


const fundraisers = await client.readContract({
  address: contract.address,
  abi: contract.abi,
  functionName: "fundraisers",
  args: [0]
});
console.log(fundraisers);

const donators = await client.readContract({
  address: contract.address,
  abi: contract.abi,
  functionName: "getDonators",
  args: [0]
});

console.log(donators);