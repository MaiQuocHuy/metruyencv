// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import 'contracts/metruyen/Owner.sol';
import 'hardhat/console.sol';
import 'contracts/metruyen/factory.sol';

contract CIDStorage {
    event StoryUpdated(
        uint256 indexed storyId,
        string cid,
        uint256 indexed timestamp
    );
    mapping(uint256 => uint256) private storyLocks; // Lưu thời gian mở khóa của storyId

    constructor(address _factoryContract) {
        require(
            _factoryContract != address(0),
            'Invalid Factory contract address'
        );
        Factory factoryContract = Factory(_factoryContract);
        factoryContract.addExistingContract('CIDStorage', address(this));
    }

    function updateStory(
        uint256 storyId,
        string memory newCID,
        address _ownerContract
    ) public {
        Owner ownerContract = Owner(_ownerContract);
        require(ownerContract.getOwner() == msg.sender, 'Caller is not owner');
        emit StoryUpdated(storyId, newCID, block.timestamp);
    }
}
