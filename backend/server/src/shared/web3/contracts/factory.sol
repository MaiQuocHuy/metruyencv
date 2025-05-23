// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Factory {
    mapping(string => address) private contractByName;

    function addExistingContract(
        string memory nameContract,
        address contractAddress
    ) public {
        require(contractAddress != address(0), 'Invalid contract address');
        require(
            bytes(nameContract).length > 0,
            'Contract name cannot be empty'
        );

        contractByName[nameContract] = contractAddress;
    }

    function getContractByName(
        string memory nameContract
    ) public view returns (address) {
        return contractByName[nameContract];
    }

    function isContractStored(
        string memory nameContract
    ) public view returns (bool) {
        return contractByName[nameContract] != address(0);
    }
}
