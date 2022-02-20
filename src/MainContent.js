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
      <h3>Poke someone</h3>
      <div class="m-8 flex">
        <input
          className="rounded-l-md p-4 border-t mr-0 border-b border-l text-gray-800 text-sm border-gray-200 bg-white"
          placeholder="0x3f17f1962B36e491b30A40b2405849e597Ba5FB5"
          value={addressToPoke}
          onChange={(e) => setAddressToPoke(e.target.value)}
        />
        <button
          className="px-8 rounded-r-lg bg-green-400 text-gray-800 font-bold p-4 uppercase border-green-500 border-t border-b border-r"
          onClick={() => poke(addressToPoke)}
        >
          Poke
        </button>
      </div>
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
