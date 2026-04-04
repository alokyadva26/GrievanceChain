import { useState, useEffect, useCallback } from "react";
import { BrowserProvider } from "ethers";
import { NETWORK_CONFIG } from "../constants/network";

export function useWallet() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const isCorrectNetwork = chainId === NETWORK_CONFIG.chainIdDecimal;

  // Connect wallet
  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed. Please install MetaMask to continue.");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const browserProvider = new BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send("eth_requestAccounts", []);
      const network = await browserProvider.getNetwork();
      const walletSigner = await browserProvider.getSigner();

      setProvider(browserProvider);
      setSigner(walletSigner);
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));
    } catch (err) {
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Switch to Base Sepolia
  const switchNetwork = useCallback(async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: NETWORK_CONFIG.chainId }],
      });
    } catch (switchError) {
      // Chain not added yet — add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [NETWORK_CONFIG],
          });
        } catch (addError) {
          setError("Failed to add Base Sepolia network");
        }
      } else {
        setError("Failed to switch network");
      }
    }
  }, []);

  // Disconnect
  const disconnect = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
  }, []);

  // Listen for account & chain changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = (newChainId) => {
      setChainId(Number(newChainId));
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [disconnect]);

  // Auto-connect if previously connected
  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      connect();
    }
  }, [connect]);

  return {
    account,
    provider,
    signer,
    chainId,
    isConnecting,
    isCorrectNetwork,
    error,
    connect,
    disconnect,
    switchNetwork,
  };
}
