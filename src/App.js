import { useState, useEffect, useRef } from "react";
import Jazzicon from "jazzicon";
import detectEthereumProvider from "@metamask/detect-provider";
import MainContent from "./MainContent";
import "./App.css";

const WAGMI_PARAMS = {
  chainId: "0x2B67",
  chainName: "Avalanche WAGMI subnet",
  nativeCurrency: {
    name: "WAGMI",
    symbol: "WGM",
    decimals: 18,
  },
  rpcUrls: ["https://api.trywagmi.xyz/rpc"],
};

export const shortenedAddress = (address) => {
  const begin = address.substring(0, 6);
  const ending = address.substr(-4);
  return `${begin}...${ending}`;
};

export const getUserAddress = () => window?.ethereum?.selectedAddress;

function App() {
  const [chainId, setChainId] = useState("");
  const [wallet, setWallet] = useState(false);
  const [userAddress, setUserAddress] = useState(null);

  const avatarRef = useRef(null);
  const targetChainId = "0x2b67";

  const jsNumberForAddress = (address) => {
    const addr = address.slice(2, 10);
    return parseInt(addr, 16);
  };

  const generateNewIdenticon = (address, diameter = 20) => {
    const numericRepresentation = jsNumberForAddress(address);
    return Jazzicon(diameter, numericRepresentation);
  };

  useEffect(() => {
    async function getWallet() {
      const windowEth = await detectEthereumProvider();
      if (windowEth) setWallet(windowEth);
    }
    getWallet();
  }, []);

  useEffect(() => {
    if (wallet?.selectedAddress) setUserAddress(wallet.selectedAddress);
  }, [wallet]);

  useEffect(() => {
    if (!wallet) return;
    wallet.on("accountsChanged", async function () {
      if (wallet.selectedAddress) setUserAddress(wallet.selectedAddress);
    });
  }, [wallet]);

  useEffect(() => {
    if (wallet?.chainId) setChainId(wallet.chainId);
  }, [wallet]);

  useEffect(() => {
    if (!wallet) return;
    wallet.on("chainChanged", function (networkId) {
      setChainId(networkId);
      if (wallet?.selectedAddress) setUserAddress(wallet.selectedAddress);
    });
  }, [wallet]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (avatarRef?.current?.firstChild)
      avatarRef.current.removeChild(avatarRef.current.firstChild);
    if (userAddress)
      avatarRef?.current?.appendChild(generateNewIdenticon(userAddress));
  }, [userAddress, chainId]); // eslint-disable-line react-hooks/exhaustive-deps

  // couldn't get to work
  // Request for method 'eth_chainId on https://api.trywagmi.xyz/rpc failed
  const switchToAvalanche = () => {
    const networkParams = WAGMI_PARAMS;
    wallet.request({
      method: "wallet_addEthereumChain",
      params: [networkParams],
    });
  };

  async function connectWallet() {
    if (typeof window.ethereum === "undefined") return;
    await requestAccount();
  }

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  const getWalletButtons = () => {
    if (!wallet || !wallet?.selectedAddress) {
      return (
        <>
          {wallet ? (
            <button onClick={connectWallet}>{"Connect Wallet"}</button>
          ) : (
            <p>Please download MetaMask to use Poke</p>
          )}
        </>
      );
    }

    if (wallet && chainId !== targetChainId) {
      return (
        <>
          <button onClick={switchToAvalanche}>
            Switch to Avalanche WAGMI subnet
          </button>
        </>
      );
    }

    return <MainContent wallet={wallet} userAddress={userAddress} />;
  };

  return (
    <div className="App">
      <div class="text-3xl">Poke</div>
      {getWalletButtons()}
    </div>
  );
}

export default App;
