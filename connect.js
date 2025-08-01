document.getElementById("MetaMask-button").addEventListener("click", async () => {
   const statusDiv = document.getElementById("statusDiv");

   if (!window.ethereum){
        statusDiv.textContent = "MetaMask is not installed!.";
        return;
    }

    try{
        //set up provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        //request access
        await provider.send("eth_requestAccounts", []);

        //get wallet
        const signer = provider.getSigner();
        const address = await signer.getAddress();

        //check network (blockchain)
        const network = await provider.getNetwork();
        if (network.chainId !== 1115) {
            statusDiv.textContent= "Please switch to Core Testnet in MetaMask";
            return;
        }

        //fetch balance
        const balance = await provider.getBalance(address);

        //convert wei to CORE
        const coreBalance = ethers.utils.formatEther(balance);

        //store in chrome.storage
        chrome.storage.local.set({
            address,
            balance: coreBalance
        });

        statusDiv.textContent = `Connected: ${address}\nBalance: ${coreBalance} CORE`;
    
    } catch(err) {
        console.error(err);
        statusDiv.textContent = "Connection failed: "+ err.message;
    }
});
