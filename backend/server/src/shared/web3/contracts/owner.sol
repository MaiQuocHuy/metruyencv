// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import 'hardhat/console.sol';
import 'contracts/metruyen/factory.sol';

/**
 * @title Owner
 * @dev Set & change owner
 */
contract Owner {
    address private owner;

    // event for EVM logging
    event OwnerSet(address indexed oldOwner, address indexed newOwner);

    // modifier to check if caller is owner
    modifier isOwner() {
        require(msg.sender == owner, 'Caller is not owner');
        _;
    }

    /**
     * @dev Set contract deployer as owner
     */
    constructor(address _factoryContract) {
        require(
            _factoryContract != address(0),
            'Invalid Factory contract address'
        );
        Factory factoryContract = Factory(_factoryContract);
        factoryContract.addExistingContract('Owner', address(this));

        console.log('Owner contract deployed by:', msg.sender);
        owner = msg.sender; // 'msg.sender' is sender of current call, contract deployer for a constructor
        emit OwnerSet(address(0), owner);
    }

    /**
     * @dev Change owner
     * @param newOwner address of new owner
     */
    function changeOwner(address newOwner) public isOwner {
        require(
            newOwner != address(0),
            'New owner should not be the zero address'
        );
        emit OwnerSet(owner, newOwner);
        owner = newOwner;
    }

    /**
     * @dev Return owner address
     * @return address of owner
     */
    function getOwner() external view returns (address) {
        return owner;
    }

    /**
     * @dev Return boolean
     * @return true if you are owner of this contract
     */
    function checkIsOwner() public view isOwner returns (bool) {
        return true;
    }
}
