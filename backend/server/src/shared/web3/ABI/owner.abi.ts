export const OwnerABI = [
  'function getOwner() external view returns (address)',
  'function changeOwner(address newOwner) public',
  'function checkIsOwner() public view returns (bool)',
  'event OwnerSet(address indexed oldOwner, address indexed newOwner)',
];
