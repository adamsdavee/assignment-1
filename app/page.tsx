import Image from "next/image";
import abi from "./abi.json";
import { ethers } from "ethers";
import { useState } from "react";

const contractAddress = "0x9D1eb059977D71E1A21BdebD1F700d4A39744A70";

export default function Home() {

  const [text, setText] = useState("");

  async function requestAccount() {
    await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
  }

  const handleSet = async () => {
    try {
      if (!text) {
        alert("Please enter a message before setting.");
        return;
      }

      if ((window as any).ethereum) {
        await requestAccount();
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await contract.setMessage(text); 
        const txReceipt = await tx.wait();
        console.log("Transaction successful:", txReceipt);
      } else {
        console.error("MetaMask not found. Please install MetaMask to use this application.");
      }
    } catch (error) {
      console.error("Error setting message:", error);
      alert(error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Set Message on Smart Contract</h1>
      <input
        type="text"
        placeholder="Set message"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleSet}>Set Message</button>
    </div>
  );
}
