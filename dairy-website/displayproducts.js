// Function to display products
async function displayProducts() {
    try {
        // Connect to the local Ganache network
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
            return;
        }

        // Get the contract instance
        const networkId = await web3.eth.net.getId();
        const contractAddress = '0x21Cf331Bd2bE30dEA6C84B2dDdF84937c058f7E3'; // Replace with your deployed contract address
        const contractABI = [
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "_name",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_price",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "_location",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_quantity",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_temperature",
                        "type": "uint256"
                    }
                ],
                "name": "registerProduct",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "productCount",
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
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "products",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "location",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "quantity",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "temperature",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ];
        const contract = new web3.eth.Contract(contractABI, contractAddress);

        // Get product count from the contract
        const productCount = await contract.methods.productCount().call();

        // Get product details for each product
        const products = [];
        for (let i = 1; i <= productCount; i++) {
            const product = await contract.methods.products(i).call();
            products.push(product);
        }

        // Get temperature from ThingSpeak
        const temperature = await fetchTemperature();
        const container = document.getElementById("newProductsContainer");
        // Get the container element where products will be displayed
        container.innerHTML = "";

// Loop through the products and create HTML elements to display each product
        let row;
        products.forEach((product, index) => {
            // Create a new row for every three products
            if (index % 3 === 0) {
                row = document.createElement("div");
                row.classList.add("row");
                container.appendChild(row);
            }
            const productDiv = document.createElement("div");
            productDiv.classList.add("product-item");

            // Create a heading element for the product name
            const nameElement = document.createElement("h3");
            nameElement.textContent = "Product Name: " + product.name;

            // Create a paragraph element for the product price
            const priceElement = document.createElement("p");
            priceElement.textContent = "Price: " + product.price + " rs";

            // Create a paragraph element for the product location
            const locationElement = document.createElement("p");
            locationElement.textContent = "Location: " + product.location;

            // Create a paragraph element for the product quantity
            const quantityElement = document.createElement("p");
            quantityElement.textContent = "Quantity: " + product.quantity;

            // Create a paragraph element for the temperature
            const temperatureElement = document.createElement("p");
            temperatureElement.textContent = "Temperature: " + temperature;

            // Append the name, price, location, quantity, and temperature elements to the product div
            productDiv.appendChild(nameElement);
            productDiv.appendChild(priceElement);
            productDiv.appendChild(locationElement);
            productDiv.appendChild(quantityElement);
            productDiv.appendChild(temperatureElement);

            // Append the product div to the container
            row.appendChild(productDiv);
        });
    } catch (error) {
        console.error('Error displaying products:', error);
        alert('Error displaying products. Please check the console for details.');
    }
}

// Function to fetch temperature from ThingSpeak
// Function to fetch temperature from ThingSpeak
// Function to fetch temperature from ThingSpeak
const fetchTemperature = async () => {
    const url = 'https://api.thingspeak.com/channels/2436531/feeds.json?api_key=1LHWFDYPE5QP03ZR';
    console.log('Fetching temperature from:', url);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch temperature');
        }
        const data = await response.json();
        if (!data || !data.feeds || data.feeds.length === 0) {
            throw new Error('Temperature data not available');
        }
        const latestEntry = data.feeds[data.feeds.length - 1];
        if (!latestEntry || !latestEntry.field1) {
            throw new Error('Latest temperature data not available');
        }
        const temperature = latestEntry.field1;
        console.log('Latest Temperature:', temperature);
        return temperature;
    } catch (error) {
        console.error('Error fetching temperature:', error);
        return 'N/A'; // Return a default value or handle the error appropriately
    }
};

