import { useState } from "react";
import Field from "./Field.jsx";

export default function JobForm({ onExtract, loading }) {
  const [jobText, setJobText] = useState("");
  const [jobLink, setJobLink] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onExtract(jobText.trim(), jobLink.trim());
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="card__head">
        <span className="step">1</span>
        <h2 className="card__title">Job details</h2>
      </div>

      <Field
        label="Job post text"
        multiline
        rows={9}
        placeholder="Paste the full job post or recruiter message here..."
        value={jobText}
        onChange={(e) => setJobText(e.target.value)}
        required
      />

      <Field
        label="Job link"
        hint="optional"
        type="url"
        placeholder="https://company.com/careers/job-id"
        value={jobLink}
        onChange={(e) => setJobLink(e.target.value)}
      />

      <div className="actions">
        <button className="btn btn--primary" disabled={loading || !jobText.trim()}>
          {loading ? <><span className="spinner" /> Extracting...</> : "Extract details"}
        </button>
      </div>
    </form>
  );
}
