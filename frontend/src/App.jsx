import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useWallet } from "./hooks/useWallet";
import { useContract } from "./hooks/useContract";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import FileComplaint from "./pages/FileComplaint";
import ComplaintDetail from "./pages/ComplaintDetail";
import MyComplaints from "./pages/MyComplaints";
import Dashboard from "./pages/Dashboard";
import TransparencyDashboard from "./pages/TransparencyDashboard";

function App() {
  const wallet = useWallet();
  const contractHook = useContract(wallet.signer, wallet.provider);

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#111c32",
            color: "#e8eaf6",
            border: "1px solid rgba(255,255,255,0.06)",
          },
        }}
      />

      <Navbar
        account={wallet.account}
        isCorrectNetwork={wallet.isCorrectNetwork}
        onConnect={wallet.connect}
        onSwitchNetwork={wallet.switchNetwork}
        isConnecting={wallet.isConnecting}
      />

      <Routes>
        <Route
          path="/"
          element={<Home contract={contractHook.contract} />}
        />
        <Route
          path="/file"
          element={
            <FileComplaint
              contractHook={contractHook}
              account={wallet.account}
              isCorrectNetwork={wallet.isCorrectNetwork}
            />
          }
        />
        <Route
          path="/complaint/:id"
          element={
            <ComplaintDetail
              contractHook={contractHook}
              account={wallet.account}
            />
          }
        />
        <Route
          path="/my-complaints"
          element={
            <MyComplaints
              contractHook={contractHook}
              account={wallet.account}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <Dashboard
              contractHook={contractHook}
              account={wallet.account}
            />
          }
        />
        <Route
          path="/transparency"
          element={
            <TransparencyDashboard
              contractHook={contractHook}
            />
          }
        />
      </Routes>

      {/* Footer */}
      <footer style={{
        textAlign: "center",
        padding: "24px",
        borderTop: "1px solid var(--border-subtle)",
        color: "var(--text-muted)",
        fontSize: "0.82rem"
      }}>
        <p>GrievanceChain — Tamper-Proof Public Grievance Redressal on Base Sepolia</p>
        <p style={{ marginTop: "4px" }}>Powered by Blockchain • IPFS • Gemini AI</p>
      </footer>
    </Router>
  );
}

export default App;
