// Email template — follows the exact format required.
// Links are always written as markdown hyperlinks (never raw URLs).

function buildEmail({ recruiterName, jobRole, companyName, jobLink }) {
  const name = (recruiterName || "").trim() || "Sir/Ma'am";
  const role = (jobRole || "").trim() || "Software Engineer";
  const company = (companyName || "").trim() || "your company";
  const link = (jobLink || "").trim();

  const subject = `Application for ${role} role at ${company} | Vishwash Soni`;

  // Job link line is shown only when a link is given
  const jobLinkLine = link ? `\n[Job Link](${link})` : "";

  const body = `Hello ${name},

I hope you are doing well.

I'm Vishwash Soni, a **2026 B.Tech CSE graduate**, writing to express my interest in the **${role}** role at **${company}**.${jobLinkLine}

I bring a combination of **DSA fundamentals and full-stack development** experience. I've solved 950+ problems on LeetCode and completed NeetCode 150, with a solid grounding in DSA, OOPs, and DBMS. On the development side, I work with React.js, JavaScript, Tailwind CSS, Node.js, Express.js, and MongoDB.

A few projects that reflect this experience:

- **AI Portfolio Assistant** ([Live Link](https://my-ai-assistant-silk.vercel.app/)) - A conversational AI assistant that lets recruiters ask questions about my skills, projects, and background. Built with React, Express.js, the Groq SDK, and Tailwind CSS.

- **NexContact** ([Live Link](https://nex-contact.vercel.app/)) - A full-stack MERN contact management app with authentication, email OTP verification, and Cloudinary-based image uploads, deployed with a React frontend on Vercel and an Express API on Render.

- **Portfolio Website** ([Live Link](https://vishwash-portfolio.vercel.app/)) - A responsive React application optimized for performance through lazy loading, achieving a Lighthouse score above 90.

I've attached my resume for your consideration and would welcome the opportunity to discuss my technical skills and experience further.

Thank you for your time.

Best regards,
**Vishwash Soni**
[+91-8299494873](tel:+918299494873)
[vishwashsoni348@gmail.com](mailto:vishwashsoni348@gmail.com)
[Portfolio](https://vishwash-portfolio.vercel.app/) | [LinkedIn](https://www.linkedin.com/in/vishwash-soni-732414263/) | [GitHub](https://github.com/vishwash-soni) | [LeetCode](https://leetcode.com/u/Vishwash_Soni/)`;

  return { subject, body };
}

module.exports = { buildEmail };