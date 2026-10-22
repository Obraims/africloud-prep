# AfriCloud Prep: Pitch Outline

Use the Canva template from the hackathon pack. Aim for **9 slides, about 5 minutes**, with the live demo as the centre of the pitch.

## How the pitch is scored

| Criterion                  | Weight | Where it is won                          |
| -------------------------- | ------ | ---------------------------------------- |
| Problem Understanding      | 20%    | Slides 2 and 3                           |
| Solution & Product         | 25%    | Slides 4, 5 and the live demo            |
| Target Users               | 15%    | Slide 6                                  |
| Impact & Scalability       | 20%    | Slides 7 and 8                           |
| Clarity, Design & Delivery | 20%    | Whole deck, a confident close on slide 9 |

The product is the biggest slice. Give the demo the most time.

---

## Slide 1: Title (10 seconds)

**AfriCloud Prep: Study smart. Know when you're ready.**
Unofficial AZ-900 exam prep for African learners. Your name, `[team/handle]`, Power Learn Project #1MillionDevs.

Small footer: "Unofficial study tool, not affiliated with Microsoft."

## Slide 2: The pain, from my own journey (35 seconds) · Problem Understanding

Headline: **"I studied for AZ-900 and still didn't know if I was ready."**

Three short pain points, each in your own words:

1. I got questions wrong and didn't understand why.
2. I didn't know what to study next with limited time.
3. Cloud ideas felt abstract and foreign.

`[FILL IN: one real moment from your AZ-900 prep, 1 to 2 sentences. A true, specific story beats any statistic. Do not invent numbers.]`

## Slide 3: Why current tools fall short (25 seconds) · Problem Understanding

Show the gap in one visual: scattered tools (question dumps, videos, notes) versus one learner trying to answer _why, what next, am I ready?_

One line: "Practice questions tell you your score. They don't tell you what to do about it."

## Slide 4: The solution: one connected loop (40 seconds) · Solution & Product

A single diagram, five steps in a circle:
**Diagnostic → Readiness → Plan → Quiz with explanations → Flashcards from mistakes → Study Buddy → back to Readiness**

Line: "Every answer updates your readiness, your plan and your flashcards. Five challenges, one product."

## Slide 5: Live demo (2 minutes 30 seconds) · Solution & Product

Switch to the app and follow `demo-script.md`. Have a 2-minute recorded video ready as a fallback.

Slide content while you switch: a screenshot of the dashboard and the words "Live demo".

## Slide 6: Who it is for (30 seconds) · Target Users

- **Primary:** 1M Devs and Power Learn Project learners preparing for their first Azure certification.
- **Secondary:** campus tech clubs, bootcamps, and employers or SACCO and cooperative training teams upskilling staff.
- **How they use it:** 20 to 40 minutes a day on a phone, following the plan, clearing flashcards, watching the readiness gauge climb.

`[Add one line on who you tested it with, if anyone: even 2 or 3 friends is real evidence.]`

## Slide 7: Under the hood, built to be trusted (35 seconds) · Solution & Product, Impact

Architecture diagram (from the README) plus three proof points:

- **Accurate:** 90 original questions mapped to the official July 2026 skills outline, with per-option explanations.
- **Safe AI:** Gemini key server-side only, outputs validated, retry on failure, AI questions never inflate your readiness score.
- **Modular Edge Function architecture:** three documented serverless endpoints with schema validation, rate limits, and test cases.

## Slide 8: Impact and scale (35 seconds) · Impact & Scalability

- **More learners:** a mobile-first PWA for low-bandwidth users, free to start.
- **More certifications:** the loop is content-agnostic. Swap the question bank and outline to support AZ-104, SC-900, AI-900, AWS and Google Cloud.
- **More languages:** Kiswahili and Sheng today; add more African languages with native-speaker review.
- **More learners at once:** cohort view for bootcamps and campuses to see readiness across a class.

Avoid inventing market-size figures. If you quote any number, cite where it came from.

## Slide 9: Close (20 seconds) · Clarity, Design & Delivery

**"You've studied the cloud. Now know when you're ready."**
Links: live app, GitHub repo, your contact. QR code to the demo if the template allows.

---

## Delivery tips

- Rehearse at least 3 times with a timer. Cut slides before you cut demo time.
- Open with your story, not with the tech.
- Say "unofficial" out loud once. It signals you read the rules.
- Keep each slide to one idea and large text. Use the same flat colours as the app: deep green `#0F6B4F`, amber `#F5A524`, off-white `#FAF8F3`. No gradients, to match the product.
- Record the demo video the day before and test it plays offline.

## Likely judge questions and strong answers

| Question                                      | Answer                                                                                                                                                                                                                          |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "How do you know the questions are accurate?" | They map to the official outline, each has an explanation and a Learn link, and the bank is marked reviewed only after human verification. AI-generated questions are labelled and excluded from readiness.                     |
| "Why not just use ChatGPT?"                   | A general chatbot doesn't track your scores, plan your time, schedule revision or tell you when you're ready. AfriCloud Prep connects those into one loop and keeps a graded, reviewed question bank separate from AI practice. |
| "What stops the AI from making things up?"    | The Buddy has a no-invented-features rule, scope limits, and says "check Microsoft Learn" when unsure. Structured outputs are validated in code.                                                                                |
| "Is it really ready to sit the exam?"         | The rule is strict: 30 or more answers, 80% overall, 70% in every domain with enough data. It shows the exact gap rather than a vague score. It is a study aid, not a guarantee.                                                |
| "How would it scale?"                         | Same engine, new question banks and outlines. Supabase and Vercel scale with usage, and AI endpoints are model-agnostic through the GEMINI_MODEL environment variable.                                                          |
| "What would you build next?"                  | Offline PWA, cohort dashboards, a community-reviewed question bank, more certifications and languages.                                                                                                                          |
| "Are you affiliated with Microsoft?"          | No. It is labelled unofficial everywhere, uses no Microsoft logos and no real exam questions.                                                                                                                                   |

## Checklist before submitting

- [ ] Live URL works on mobile data
- [ ] Demo account loads with seeded history
- [ ] README placeholders filled (URL, video, demo login, story)
- [ ] Repo is public and has no secrets committed
- [ ] Deck exported as PDF as a backup
- [ ] Submitted at least 2 hours before Friday 23 October, 6:00 PM EAT
