// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductRegistry {
    struct Product {
        address owner;
        string name;
        uint256 price;
        string location;
        uint256 quantity;
        uint256 temperature; // Added temperature field
    }

    mapping(uint256 => Product) public products;
    uint256 public productCount;

    function registerProduct(string memory _name, uint256 _price, string memory _location, uint256 _quantity, uint256 _temperature) external {
        productCount++;
        products[productCount] = Product(msg.sender, _name, _price, _location, _quantity, _temperature); // Updated to include temperature
    }
}