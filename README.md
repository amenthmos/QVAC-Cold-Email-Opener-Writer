# QVAC Cold Email Opener Writer

Enter who you're emailing and why, get a short, personalized opening line for a legitimate professional outreach email — generated on-device. No cloud call, no API key.

## Run

```bash
npm install
npm start
```

Then open http://localhost:32023

## QVAC SDK version

`@qvac/sdk` ^0.19.0 (see `package.json`).

## How it works

Built on [Tether's QVAC SDK](https://www.npmjs.com/package/@qvac/sdk) — all inference runs on-device, no cloud call, no API key. The app loads `LLAMA_3_2_1B_INST_Q4_0` locally with `loadModel()`, generates with `completion()` (streamed via `tokenStream`), and releases the model with `unloadModel()` on shutdown.

## Example

**Input:** recipient `CTO at a healthcare startup`, reason `I saw they just raised a Series A and are hiring for platform engineering, and I run a devtools company focused on deployment reliability`

**Output:**
```
The recent Series A raise of your company caught my attention, and I'm reaching out because I've built a platform that helps deployment reliability across multiple tech stacks, and I'm interested in exploring potential opportunities to collaborate.
```

## License

MIT
