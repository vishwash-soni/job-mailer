import { useState } from "react";
import { extractJob, buildTemplate, sendEmail } from "./api";
import Header from "./components/Header.jsx";
import JobForm from "./components/JobForm.jsx";
import ReviewForm from "./components/ReviewForm.jsx";
import Alert from "./components/Alert.jsx";

export default function App() {
  const [loading, setLoading] = useState(""); // "", "extract", "template", "send"
  const [alert, setAlert] = useState(null); // { type, text }
  const [draft, setDraft] = useState(null); // details + subject + body

  const showError = (err) => setAlert({ type: "error", text: err.message });

  async function handleExtract(jobText, jobLink) {
    setLoading("extract");
    setAlert(null);
    try {
      const { details, subject, body } = await extractJob(jobText, jobLink);
      setDraft({ ...details, subject, body });
    } catch (err) {
      showError(err);
    } finally {
      setLoading("");
    }
  }

  async function handleRegenerate() {
    setLoading("template");
    setAlert(null);
    try {
      const { subject, body } = await buildTemplate(draft);
      setDraft((d) => ({ ...d, subject, body }));
      setAlert({ type: "success", text: "Email regenerated from the latest details." });
    } catch (err) {
      showError(err);
    } finally {
      setLoading("");
    }
  }

  async function handleSend() {
    if (!window.confirm(`Send this email to ${draft.recruiterEmail}?`)) return;
    setLoading("send");
    setAlert(null);
    try {
      const { message } = await sendEmail(draft.recruiterEmail, draft.subject, draft.body);
      setAlert({ type: "success", text: message });
    } catch (err) {
      showError(err);
    } finally {
      setLoading("");
    }
  }

  function handleReset() {
    setDraft(null);
    setAlert(null);
  }

  return (
    <div className="app">
      <Header />

      <main className="container">
        <JobForm onExtract={handleExtract} loading={loading === "extract"} />

        {alert && <Alert type={alert.type} onClose={() => setAlert(null)}>{alert.text}</Alert>}

        {draft && (
          <ReviewForm
            draft={draft}
            setDraft={setDraft}
            loading={loading}
            onRegenerate={handleRegenerate}
            onSend={handleSend}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}
