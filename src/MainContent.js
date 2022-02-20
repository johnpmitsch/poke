import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Poke from "./artifacts/contracts/Poke.sol/Poke.json";
import PokeDisplay from "./PokeDisplay";

const contractAddress = "0xFEDa5385022A0Aab6Fce82B49D7558B742dac458";

function MainContent({ wallet, userAddress }) {
  const [pokes, setPokes] = useState([]);
  const [loadingPokes, setLoading] = useState(true);
  const [addressToPoke, setAddressToPoke] = useState("");

  async function getPokes() {
    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, Poke.abi, signer);
    const interactions = await contract.getInteractionsForAddress(userAddress);
    setLoading(false);
    setPokes([...new Set(interactions)]);
  }

  async function poke(addr) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, Poke.abi, signer);
    await contract.poke(addr);
    return true;
  }

  useEffect(() => {
    getPokes();
  }, []);

  return (
    <>
      <h2>Welcome to WAGMI Poke</h2>
      <h3>Poke someone</h3>
      <input
        value={addressToPoke}
        onChange={(e) => setAddressToPoke(e.target.value)}
      />
      <button onClick={() => poke(addressToPoke)}>Poke</button>
      <h3>Your pokes</h3>
      {pokes.length === 0 && !loadingPokes && <p>No one has poked you :(</p>}
      {pokes.map((poker, i) => (
        <PokeDisplay
          key={i}
          address={poker}
          poke={poke}
          userAddress={userAddress}
        />
      ))}
    </>
  );
}

export default MainContent;
