import Field from "./Field.jsx";

export default function ReviewForm({ draft, setDraft, loading, onRegenerate, onSend, onReset }) {
  const set = (key) => (e) => setDraft({ ...draft, [key]: e.target.value });
  const canSend = draft.recruiterEmail && draft.subject && draft.body;

  return (
    <section className="card">
      <div className="card__head">
        <span className="step">2</span>
        <h2 className="card__title">Review & send</h2>
      </div>

      <div className="grid">
        <Field label="Recruiter name" value={draft.recruiterName} onChange={set("recruiterName")} placeholder="Sir/Ma'am" />
        <Field label="Recruiter email" type="email" value={draft.recruiterEmail} onChange={set("recruiterEmail")} placeholder="name@company.com" />
        <Field label="Job role" value={draft.jobRole} onChange={set("jobRole")} />
        <Field label="Company" value={draft.companyName} onChange={set("companyName")} />
      </div>

      <Field label="Job link" hint="shown as a hyperlink in the mail" value={draft.jobLink} onChange={set("jobLink")} placeholder="https://..." />

      <div className="divider" />

      <Field label="Subject" value={draft.subject} onChange={set("subject")} />

      <Field
        label="Email body"
        hint="Markdown: [text](link) becomes a hyperlink"
        multiline
        rows={20}
        className="mono"
        value={draft.body}
        onChange={set("body")}
      />

      <div className="actions actions--split">
        <div className="actions__group">
          <button className="btn btn--ghost" onClick={onReset} disabled={!!loading}>Start over</button>
          <button className="btn btn--outline" onClick={onRegenerate} disabled={!!loading}>
            {loading === "template" ? "Regenerating..." : "↻ Regenerate email"}
          </button>
        </div>
        <button className="btn btn--primary" onClick={onSend} disabled={!!loading || !canSend}>
          {loading === "send" ? <><span className="spinner" /> Sending...</> : "Send email →"}
        </button>
      </div>
    </section>
  );
}
