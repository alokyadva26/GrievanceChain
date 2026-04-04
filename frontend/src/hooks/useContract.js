import { useState, useEffect, useCallback } from "react";
import { Contract } from "ethers";
import { GRIEVANCE_REGISTRY_ABI } from "../constants/abi";
import { CONTRACT_ADDRESSES } from "../constants/addresses";

export function useContract(signer, provider) {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize contract
  useEffect(() => {
    const addr = CONTRACT_ADDRESSES.GrievanceRegistry;
    if (!addr || addr === "0x0000000000000000000000000000000000000000") {
      return;
    }

    try {
      const signerOrProvider = signer || provider;
      if (signerOrProvider) {
        const instance = new Contract(addr, GRIEVANCE_REGISTRY_ABI, signerOrProvider);
        setContract(instance);
      }
    } catch (err) {
      setError("Failed to connect to smart contract");
      console.error(err);
    }
  }, [signer, provider]);

  // ─── Write functions ───
  const createComplaint = useCallback(
    async (department, title, description, ipfsHash, isAnonymous) => {
      if (!contract || !signer) throw new Error("Wallet not connected");
      setLoading(true);
      try {
        const tx = await contract.createComplaint(department, title, description, ipfsHash, isAnonymous);
        const receipt = await tx.wait();
        return receipt;
      } finally {
        setLoading(false);
      }
    },
    [contract, signer]
  );

  const respondToComplaint = useCallback(
    async (complaintId, responseText) => {
      if (!contract || !signer) throw new Error("Wallet not connected");
      setLoading(true);
      try {
        const tx = await contract.respondToComplaint(complaintId, responseText);
        return await tx.wait();
      } finally {
        setLoading(false);
      }
    },
    [contract, signer]
  );

  const approveResolution = useCallback(
    async (complaintId) => {
      if (!contract || !signer) throw new Error("Wallet not connected");
      setLoading(true);
      try {
        const tx = await contract.approveResolution(complaintId);
        return await tx.wait();
      } finally {
        setLoading(false);
      }
    },
    [contract, signer]
  );

  const rejectResolution = useCallback(
    async (complaintId) => {
      if (!contract || !signer) throw new Error("Wallet not connected");
      setLoading(true);
      try {
        const tx = await contract.rejectResolution(complaintId);
        return await tx.wait();
      } finally {
        setLoading(false);
      }
    },
    [contract, signer]
  );

  const escalateComplaint = useCallback(
    async (complaintId) => {
      if (!contract || !signer) throw new Error("Wallet not connected");
      setLoading(true);
      try {
        const tx = await contract.escalateComplaint(complaintId);
        return await tx.wait();
      } finally {
        setLoading(false);
      }
    },
    [contract, signer]
  );

  // ─── Read functions ───
  const getComplaint = useCallback(
    async (id) => {
      if (!contract) throw new Error("Contract not initialized");
      return await contract.getComplaint(id);
    },
    [contract]
  );

  const getAllComplaints = useCallback(async () => {
    if (!contract) throw new Error("Contract not initialized");
    return await contract.getAllComplaints();
  }, [contract]);

  const getComplaintsByCitizen = useCallback(
    async (address) => {
      if (!contract) throw new Error("Contract not initialized");
      return await contract.getComplaintsByCitizen(address);
    },
    [contract]
  );

  const getDepartmentScore = useCallback(
    async (deptName) => {
      if (!contract) throw new Error("Contract not initialized");
      return await contract.getDepartmentScore(deptName);
    },
    [contract]
  );

  const getDepartmentStats = useCallback(
    async (deptName) => {
      if (!contract) throw new Error("Contract not initialized");
      return await contract.getDepartmentStats(deptName);
    },
    [contract]
  );

  const getAllDepartmentNames = useCallback(async () => {
    if (!contract) throw new Error("Contract not initialized");
    return await contract.getAllDepartmentNames();
  }, [contract]);

  const getComplaintCount = useCallback(async () => {
    if (!contract) throw new Error("Contract not initialized");
    return await contract.complaintCount();
  }, [contract]);

  return {
    contract,
    loading,
    error,
    createComplaint,
    respondToComplaint,
    approveResolution,
    rejectResolution,
    escalateComplaint,
    getComplaint,
    getAllComplaints,
    getComplaintsByCitizen,
    getDepartmentScore,
    getDepartmentStats,
    getAllDepartmentNames,
    getComplaintCount,
  };
}
