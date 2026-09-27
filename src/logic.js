// QVAC Cold Email Opener Writer — core logic.
// Given the recipient's role/company and the sender's reason for reaching
// out, writes a short, specific opening line for a legitimate professional
// outreach email (not spam/manipulation tactics).

import { completion } from "@qvac/sdk";

function looksUnusable(text) {
  if (!text || text.trim().length < 3) return true;
  if (text.length > 400) return true;
  const bad = [
    "i cannot", "i can't", "as an ai", "i'm not able", "i do not have",
    "i'm sorry", "i am sorry", "please provide more", "please try again",
    "i'd be happy to help", "could you provide", "can you provide",
  ];
  const lower = text.toLowerCase();
  return bad.some((phrase) => lower.includes(phrase));
}

function stripWrapping(text) {
  return text
    .trim()
    // The model is told never to include a subject line, but small models
    // sometimes add one anyway — strip a leading "Subject: ..." line before
    // anything else so it never leaks into the opener shown to the user.
    .replace(/^subject:[^\n]*\n+/i, "")
    .replace(/^here'?s[^:\n]*:\s*/i, "")
    .replace(/^opener:\s*/i, "")
    .replace(/^opening line:\s*/i, "")
    .trim()
    .replace(/^["“]|["”]$/g, "")
    .trim();
}

const FALLBACK = (recipient, reason) =>
  `Hi — I've been following ${recipient}'s work and wanted to reach out about ${reason}.`;

export async function generate(modelId, recipient, reason) {
  const run = completion({
    modelId,
    history: [
      {
        role: "system",
        content:
          "You write short, personalized opening lines for legitimate professional outreach emails (cold emails), never spammy or manipulative language. " +
          "Given the recipient's role/company and the sender's genuine reason for reaching out, write ONE opening line (1-2 sentences) that references the specific recipient and reason given — not a generic template. " +
          "Reply with ONLY the opening line, no preamble, no quotation marks, no subject line.",
      },
      { role: "user", content: "Recipient: VP of Engineering at a mid-size fintech\nReason: I built an open-source tool that cuts CI build times in half and saw their repo uses a similar stack" },
      {
        role: "assistant",
        content: "I noticed your team's CI pipeline runs a stack close to one I've been optimizing — I built an open-source tool that cut our build times in half and thought it might save your engineers the same headache.",
      },
      { role: "user", content: `Recipient: ${recipient}\nReason: ${reason}` },
    ],
    stream: true,
    completionOpts: { temperature: 0.7, maxTokens: 150 },
  });

  let text = "";
  for await (const token of run.tokenStream) text += token;
  text = stripWrapping(text);

  const opener = looksUnusable(text) ? FALLBACK(recipient, reason) : text;
  return { opener };
}
