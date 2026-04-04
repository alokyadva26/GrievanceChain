import React, { useState } from "react";
import toast from "react-hot-toast";
import { uploadToIPFS } from "../utils/ipfs";

const DEPARTMENTS = [
  "Public Works", "Health", "Education", "Police",
  "Revenue", "Transport", "Water Supply", "Electricity"
];

export default function ComplaintForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    department: "",
    title: "",
    description: "",
    isAnonymous: false,
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.department || !form.title || !form.description) {
      toast.error("Please fill all required fields");
      return;
    }

    let ipfsHash = "";

    // Upload evidence file if provided
    if (file) {
      try {
        setUploading(true);
        const result = await uploadToIPFS(file);
        ipfsHash = result.ipfsHash;
        toast.success("Evidence uploaded to IPFS");
      } catch (err) {
        toast.error("Failed to upload evidence: " + err.message);
        return;
      } finally {
        setUploading(false);
      }
    }

    onSubmit({
      ...form,
      ipfsHash,
    });
  };

  const isSubmitting = loading || uploading;

  return (
    <form onSubmit={handleSubmit} className="complaint-form">
      <div className="form-group">
        <label className="form-label">Department *</label>
        <select
          name="department"
          value={form.department}
          onChange={handleChange}
          className="form-select"
          required
        >
          <option value="">Select a department</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Complaint Title *</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="form-input"
          placeholder="Brief title of your grievance"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Description *</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="form-textarea"
          placeholder="Provide detailed description of your complaint..."
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Evidence (Optional)</label>
        <div className="file-upload-area">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="file-input"
            id="evidence-file"
            accept="image/*,.pdf,.doc,.docx"
          />
          <label htmlFor="evidence-file" className="file-label">
            {file ? (
              <span>📎 {file.name}</span>
            ) : (
              <span>📁 Click to upload evidence (images, PDF, documents)</span>
            )}
          </label>
        </div>
      </div>

      <div className="form-group">
        <label className="anonymous-toggle">
          <input
            type="checkbox"
            name="isAnonymous"
            checked={form.isAnonymous}
            onChange={handleChange}
          />
          <span className="toggle-slider" />
          <span className="toggle-label">File anonymously</span>
        </label>
        <p className="form-hint">
          Anonymous complaints hide your wallet address from public view.
          Your address is still stored on-chain for verification.
        </p>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-lg"
        disabled={isSubmitting}
        style={{ width: "100%" }}
      >
        {uploading ? "Uploading Evidence..." : loading ? "Submitting to Blockchain..." : "🚀 Submit Complaint"}
      </button>

      <style>{`
        .complaint-form {
          max-width: 640px;
        }
        .file-upload-area {
          position: relative;
        }
        .file-input {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
        .file-label {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          border: 2px dashed var(--border-subtle);
          border-radius: var(--radius-md);
          background: var(--bg-secondary);
          color: var(--text-secondary);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s;
        }
        .file-label:hover {
          border-color: var(--accent-saffron);
          background: rgba(255, 107, 53, 0.05);
        }
        .anonymous-toggle {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          user-select: none;
        }
        .anonymous-toggle input { display: none; }
        .toggle-slider {
          width: 44px;
          height: 24px;
          background: var(--bg-card);
          border-radius: 12px;
          position: relative;
          transition: background 0.3s;
          border: 1px solid var(--border-subtle);
        }
        .toggle-slider::after {
          content: "";
          position: absolute;
          top: 3px;
          left: 3px;
          width: 16px;
          height: 16px;
          background: var(--text-secondary);
          border-radius: 50%;
          transition: all 0.3s;
        }
        .anonymous-toggle input:checked + .toggle-slider {
          background: var(--accent-saffron);
          border-color: var(--accent-saffron);
        }
        .anonymous-toggle input:checked + .toggle-slider::after {
          transform: translateX(20px);
          background: white;
        }
        .toggle-label {
          font-weight: 500;
          color: var(--text-primary);
        }
        .form-hint {
          margin-top: 6px;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
      `}</style>
    </form>
  );
}
