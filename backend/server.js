require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const { marked } = require("marked");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const { buildEmail } = require("./template");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || true }));
app.use(express.json({ limit: "1mb" }));

// ---------- 1. Environment variables ----------
["GROQ_API_KEY", "EMAIL_USER", "EMAIL_PASS"].forEach((key) => {
  if (!process.env[key]) console.warn(`WARNING: ${key} is missing in .env`);
});

// ---------- 2. Groq + Mail setup ----------
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// ---------- 3. HTML sanitization ----------
const DOMPurify = createDOMPurify(new JSDOM("").window);

const sanitizeEmailHtml = (html) =>
  DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "b", "em", "i", "u", "ul", "ol", "li",
      "a", "blockquote", "h1", "h2", "h3", "hr", "code", "pre",
    ],
    ALLOWED_ATTR: ["href", "title"],
    // tel: is allowed so the phone number stays clickable
    ALLOWED_URI_REGEXP: /^(?:(?:https?|tel|mailto):)/i,
  });

const isValidUrl = (value) => {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

// ---------- 4. Routes ----------
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Extract details from pasted job text. The job link comes separately.
app.post("/api/extract", async (req, res) => {
  try {
    const { jobText, jobLink } = req.body;

    if (!jobText || typeof jobText !== "string" || !jobText.trim()) {
      return res.status(400).json({ error: "Please paste the job text." });
    }

    const link = typeof jobLink === "string" ? jobLink.trim() : "";
    if (link && !isValidUrl(link)) {
      return res
        .status(400)
        .json({ error: "Job link must start with http:// or https://" });
    }

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
Extract details from the supplied job post.
Return only a JSON object with exactly these keys:
jobRole, companyName, recruiterName, recruiterEmail.

Use an empty string for missing information.
Never invent details.
recruiterName is the person to address (hiring manager/recruiter), not the company.
          `.trim(),
        },
        { role: "user", content: jobText },
      ],
    });

    const extracted = JSON.parse(completion.choices[0].message.content);

    const details = {
      jobRole: extracted.jobRole || "",
      companyName: extracted.companyName || "",
      recruiterName: extracted.recruiterName || "",
      recruiterEmail: extracted.recruiterEmail || "",
      jobLink: link,
    };

    const { subject, body } = buildEmail(details);
    res.json({ details, subject, body });
  } catch (err) {
    console.error("Extraction error:", err);
    res.status(500).json({ error: "Extraction failed: " + err.message });
  }
});

// Rebuild subject + body from edited details
app.post("/api/template", (req, res) => {
  const { recruiterName, jobRole, companyName, jobLink } = req.body;
  res.json(buildEmail({ recruiterName, jobRole, companyName, jobLink }));
});

// Send the email
app.post("/api/send", async (req, res) => {
  try {
    const { to, subject, body } = req.body;

    if (
      !to || typeof to !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to.trim()) ||
      !subject || typeof subject !== "string" ||
      !body || typeof body !== "string"
    ) {
      return res
        .status(400)
        .json({ error: "A valid recruiter email, subject, and body are required." });
    }

    // Markdown -> HTML (breaks:true keeps single line breaks), then sanitize
    const renderedHtml = await marked.parse(body, {
      breaks: true,
      gfm: true,
    });
    const safeHtml = sanitizeEmailHtml(renderedHtml);

    const html = `<!DOCTYPE html>
    <html>
      <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:#222222;">
        <div style="max-width:700px;">
          ${safeHtml}
        </div>
      </body>
    </html>`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to.trim(),
      subject: subject.trim(),
      text: body,
      html,
    };

    // Attach resume if backend/resume.pdf exists

    const resumePath = path.join(
      __dirname,
      "resume",
      "VishwashSoniResume.pdf"
    );

    if (fs.existsSync(resumePath)) {
      mailOptions.attachments = [
        {
          filename: "VishwashSoniResume.pdf",
          path: resumePath,
          contentType: "application/pdf",
        },
      ];
    } else {
      console.error("Resume PDF not found:", resumePath);
    }


    await transporter.sendMail(mailOptions);
    res.json({ message: `Email sent successfully to ${to.trim()}` });
  } catch (err) {
    console.error("Email sending error:", err);
    res.status(500).json({ error: "Sending failed: " + err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
