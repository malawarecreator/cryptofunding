// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.30;
pragma experimental ABIEncoderV2;

contract Funding {
    struct Fundraiser {
        address creator;
        string creatorFullName;
        string title;
        string description;
        uint256 goal;
        bool fulfilled;
        Donator[] donators;
        uint256 totalDonated;
    }

    struct Donator {
        address donator;
        string donatorFullName;
        uint256 amountGiven;
    }

    Fundraiser[] public fundraisers;

    address public investor;

    address public treasury;

    event FundraiserCreated(
        address indexed creator,
        string creatorFullName,
        string title,
        uint256 goal
    );
    event Donated(
        address indexed donator,
        uint256 indexed fundraiserIndex,
        uint256 amount
    );
    event Withdrawn(
        address indexed creator,
        uint256 indexed fundraiserIndex,
        uint256 amount
    );

    constructor(address _treasury, address _investor) {
        treasury = _treasury;
        investor = _investor;
    }

    function createFundraiser(
        string memory title,
        string memory creatorFullname,
        string memory description,
        uint256 goal
    ) public {
        fundraisers.push(
            Fundraiser({
                creator: msg.sender,
                creatorFullName: creatorFullname,
                title: title,
                description: description,
                goal: goal,
                fulfilled: false,
                donators: new Donator[](0),
                totalDonated: 0
            })
        );
        emit FundraiserCreated(msg.sender, creatorFullname, title, goal);
    }

    function getFundraiser(
        uint256 index
    )
        public
        view
        returns (
            address creator,
            string memory creatorFullName,
            uint256 goal,
            bool fulfilled
        )
    {
        Fundraiser storage f = fundraisers[index];
        return (f.creator, f.creatorFullName, f.goal, f.fulfilled);
    }

    function donate(
        string memory donatorFullName,
        uint32 indexOfFundraiser
    ) external payable {
        require(msg.value >= 0.001 ether, "Donation too small");
        require(indexOfFundraiser < fundraisers.length, "Index out of range");
        Fundraiser storage fundraiser = fundraisers[indexOfFundraiser];

        bool found = false;
        uint index = 0;
        for (uint i = 0; i < fundraiser.donators.length; i++) {
            if (fundraiser.donators[i].donator == msg.sender) {
                found = true;
                index = i;
                break;
            }
        }

        if (found) {
            fundraiser.donators[index].amountGiven += msg.value;
        } else {
            fundraiser.donators.push(
                Donator({
                    donator: msg.sender,
                    donatorFullName: donatorFullName,
                    amountGiven: msg.value
                })
            );
        }
        fundraiser.totalDonated += msg.value;
        if (fundraiser.totalDonated >= fundraiser.goal) {
            fundraiser.fulfilled = true;
        }
        emit Donated(msg.sender, indexOfFundraiser, msg.value);
    }

    function getDonators(
        uint256 fundraiserIndex
    ) public view returns (Donator[] memory) {
        return fundraisers[fundraiserIndex].donators;
    }

    function getFundraisersLength() public view returns (uint) {
        return fundraisers.length;
    }

    function setInvestor(address _investor) public {
        investor = _investor;
    }

    function setTreasury(address _treasury) public {
        treasury = _treasury;
    }

    bool private locked;

    modifier noReentrant() {
        require(!locked, "ReentrancyGuard: reentrant call");
        locked = true;
        _;
        locked = false;
    }

    function withdraw(uint256 indexOfFundraiser) public noReentrant {
        require(indexOfFundraiser < fundraisers.length, "Index out of range");
        Fundraiser storage fundraiser = fundraisers[indexOfFundraiser];
        require(msg.sender == fundraiser.creator, "Only creator can withdraw");
        require(fundraiser.fulfilled, "Goal not reached");
        require(fundraiser.totalDonated > 0, "No funds to withdraw");

        uint256 amount = fundraiser.totalDonated;
        fundraiser.totalDonated = 0;
        (bool sent, ) = fundraiser.creator.call{value: amount}("");
        require(sent, "Failed to send Ether");
        delete fundraisers[indexOfFundraiser];
        emit Withdrawn(fundraiser.creator, indexOfFundraiser, amount);
    }

    receive() external payable {}
}
