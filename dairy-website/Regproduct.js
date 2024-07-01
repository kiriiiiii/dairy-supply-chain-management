document.addEventListener("DOMContentLoaded", async function() {
    // Connect to the local Ganache network
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
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

    // Handle form submission
    const form = document.getElementById('productForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Get form values
        const name = form.elements.name.value;
        const price = form.elements.price.value;
        const quantity = form.elements.quantity.value;
        const location = form.elements.location.value;

        // Fetch temperature from ThingSpeak
        const temperature = await fetchTemperature();

        // Call the smart contract function to register the product
        try {
            const accounts = await web3.eth.getAccounts();
            await contract.methods.registerProduct(name, price, location, quantity, temperature).send({ from: accounts[0] });
            alert('Product registered successfully!');
            form.reset();
        } catch (error) {
            console.error('Error registering product:', error);
            alert('Error registering product. Please check the console for details.');
        }
    });

    // Function to fetch temperature from ThingSpeak
    // Function to fetch temperature from ThingSpeak 
    const fetchTemperature = async () => {
        const url = 'https://api.thingspeak.com/channels/2436531/fields/1.json?api_key=1LHWFDYPE5QP03ZR&results=1';
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
            const latestEntry = data.feeds[0];
            if (!latestEntry || !latestEntry.field1) {
                throw new Error('Latest temperature data not available');
            }
            const temperature = parseFloat(latestEntry.field1);
            console.log('Latest Temperature:', temperature);
            return Math.round(temperature * 100); // Convert temperature to uint256 format
        } catch (error) {
            console.error('Error fetching temperature:', error);
            return 0; // Return a default value or handle the error appropriately
        }
    };
    
});
