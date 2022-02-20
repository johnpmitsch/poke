import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Poke from "./artifacts/contracts/Poke.sol/Poke.json";
import { check } from "prettier";

const contractAddress = "0xFEDa5385022A0Aab6Fce82B49D7558B742dac458";

function PokeDisplay({ address, poke, userAddress }) {
  const [poked, setPoked] = useState(null);

  useEffect(() => {
    async function checkForPoke() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, Poke.abi, signer);
      const wasPoked = await contract.checkForPoke(address, userAddress);
      setPoked(wasPoked);
    }
    checkForPoke();
  }, []);

  if (poked) {
    return (
      <div>
        <p>{`${address} has poked you!`}</p>
        <button onClick={() => poke(address)}>Poke them back!</button>
      </div>
    );
  } else {
    return <></>;
  }
}

export default PokeDisplay;
