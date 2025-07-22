"use client";

import { useState } from "react";
import { ethers } from "ethers";
import abi from "./abi.json";

const contractAddress = "0x171d037a62E83628Dcc0DF7EAB462eea0Ac290d2";

export default function Home() {
  const [text, setText] = useState("");
  const [fetchedMessage, setFetchedMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  function showStyledAlert(message: string) {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  }

  async function requestAccount() {
    await (window as any).ethereum.request({ method: "eth_requestAccounts" });
  }

  const handleSet = async () => {
    try {
      if (!text) {
        showStyledAlert("Please enter a message before setting.");
        return;
      }

      if ((window as any).ethereum && (window as any).ethereum.isMetaMask) {
        await requestAccount();
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await contract.setMessage(text);
        await tx.wait();

        showStyledAlert("Message successfully set!");
        setText("");
      } else {
        showStyledAlert("Only MetaMask is supported. Please install MetaMask.");
      }
    } catch (error) {
      console.error("Error:", error);
      showStyledAlert("Set message failed.");
    }
  };

  const handleGet = async () => {
    try {
      if ((window as any).ethereum && (window as any).ethereum.isMetaMask) {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);

        const message = await contract.getMessage();
        setFetchedMessage(message);
        showStyledAlert("Message fetched successfully!");
      } else {
        showStyledAlert("Only MetaMask is supported. Please install MetaMask.");
      }
    } catch (error) {
      console.error("Error getting message:", error);
      showStyledAlert("Failed to fetch message from the contract.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        color: "#b30000",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        position: "relative",
      }}
    >
      {/* Alert Box */}
      {showAlert && (
        <div
          style={{
            backgroundColor: "#ffe5e5",
            color: "#b30000",
            padding: "1rem 2rem",
            border: "1px solid #b30000",
            borderRadius: "8px",
            position: "absolute",
            top: "1rem",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            zIndex: 999,
          }}
        >
          {alertMessage}
        </div>
      )}

      <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>
        Interact with Smart Contract
      </h1>

      <input
        type="text"
        placeholder="Enter your message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          padding: "0.75rem 1rem",
          width: "300px",
          fontSize: "1rem",
          border: "2px solid #b30000",
          borderRadius: "8px",
          marginBottom: "1rem",
          outline: "none",
        }}
      />

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <button
          onClick={handleSet}
          style={buttonStyle}
          onMouseOver={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#800000")
          }
          onMouseOut={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#b30000")
          }
        >
          Set Message
        </button>

        <button
          onClick={handleGet}
          style={buttonStyle}
          onMouseOver={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#800000")
          }
          onMouseOut={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#b30000")
          }
        >
          Get Message
        </button>
      </div>

      {fetchedMessage && (
        <p
          style={{
            fontSize: "1.2rem",
            color: "#b30000",
            border: "1px solid #b30000",
            padding: "1rem",
            borderRadius: "8px",
            backgroundColor: "#fff5f5",
            maxWidth: "400px",
            textAlign: "center",
          }}
        >
          Message from Contract: <br />
          <strong>{fetchedMessage}</strong>
        </p>
      )}
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#b30000",
  color: "#fff",
  border: "none",
  padding: "0.75rem 1.5rem",
  fontSize: "1rem",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "0.3s ease",
};
