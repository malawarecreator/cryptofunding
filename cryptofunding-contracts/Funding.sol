// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
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

    Fundraiser[] private fundraisers;

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
        address donator,
        string memory donatorFullName,
        uint32 indexOfFundraiser
    ) external payable {
        require(msg.value >= 0.001 ether, "Donation too small");
        require(indexOfFundraiser < fundraisers.length, "Index out of range");
        Fundraiser storage fundraiser = fundraisers[indexOfFundraiser];

        bool found = false;
        uint index = 0;
        for (uint i = 0; i < fundraiser.donators.length; i++) {
            if (fundraiser.donators[i].donator == donator) {
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
                    donator: donator,
                    donatorFullName: donatorFullName,
                    amountGiven: msg.value
                })
            );
        }
        fundraiser.totalDonated += msg.value;
        if (fundraiser.totalDonated >= fundraiser.goal) {
            fundraiser.fulfilled = true;
        }
    }

    function withdraw(uint256 indexOfFundraiser) public {
        require(indexOfFundraiser < fundraisers.length, "Index out of range");
        Fundraiser storage fundraiser = fundraisers[indexOfFundraiser];
        require(msg.sender == fundraiser.creator, "Only creator can withdraw");
        require(fundraiser.fulfilled, "Goal not reached");
        require(fundraiser.totalDonated > 0, "No funds to withdraw");

        uint256 amount = fundraiser.totalDonated;
        fundraiser.totalDonated = 0;
        (bool sent, ) = fundraiser.creator.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

}
