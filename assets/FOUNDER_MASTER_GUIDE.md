# Autonomous Service Advisor — Founder Master Source of Truth

> Keep this document private as an operating handbook. Never add API keys, passwords, authentication tokens, or a database connection string to this file.

## 1. What I built

- Product: a 24/7 AI service advisor and preliminary-estimate system for auto-repair shops.
- Demo shop name: **Northline Auto Care**.
- Voice assistant name: **Ava**.
- Live demo website: `https://autonomous-quoting-agent.onrender.com`
- Source-code repository: `https://github.com/lisa-silva/autonomous-quoting-agent`
- Hosting: Render.
- Database: Neon PostgreSQL.
- Phone and SMS provider: Twilio.
- Speech-to-text provider: Deepgram.
- Conversation understanding: Claude.
- Vehicle identification: NHTSA VIN API.
- Parts provider design: eBay or another supplier, with a clearly labeled demo catalog when a live provider is unavailable.
- Email provider: Resend-compatible HTTP email service.
- Core value: answer calls while shop employees are busy, capture complete leads, prepare preliminary estimates, follow up, and reduce missed opportunities.

## 2. The simple explanation

- A customer calls the shop.
- Ava answers using the shop's name.
- The customer explains the problem naturally.
- Ava remembers details, acknowledges the request, and asks only for missing information.
- Required information:
  - Customer name.
  - Phone number.
  - Email address.
  - VIN, or year/make/model when appropriate.
  - Requested service or repair concern.
- Twilio handles the call and records each response.
- Deepgram turns the recording into text.
- Claude understands the text and produces a natural response.
- Claude does **not** set prices.
- The application decodes the VIN, selects the service, finds parts data, applies labor and pricing rules, and calculates the estimate.
- The customer receives a preliminary estimate by configured channels.
- The lead waits for `ACCEPT` or `NO`.
- An accepted estimate can be sent to the shop's CRM or scheduling system.
- Staff receive notifications for important status changes and errors when their contact channels are configured.

## 3. Why the architecture is safe

- Claude understands language; it is not the financial authority.
- The existing quote engine in `lib/quote.ts` performs the arithmetic.
- Shop-controlled data supplies labor rates, services, taxes, parts, policies, and thresholds.
- Estimates are preliminary and nonbinding until the shop confirms them.
- Quotes above $1,000 are escalated instead of being completed automatically.
- Unsupported, technical, or safety-sensitive questions are escalated.
- Every lead follows a controlled state machine.
- Twilio webhook signatures are checked to reject forged requests.
- Provider calls use stable identifiers to reduce duplicate side effects.

## 4. Lead state machine

- Normal path:
  - `new`
  - `collecting_info`
  - `processing`
  - `quoting`
  - `sent`
  - `awaiting_response`
  - `accepted`
  - `booked`
  - `closed`
- Customer declines:
  - `awaiting_response` → `rejected` → `closed`
- System cannot safely continue:
  - Current state → `failed`
- `failed` should include an error and escalation reason and should notify staff when staff channels are configured.

## 5. Current honest product status

### Working now

- Deployed Render web application.
- Neon database connection and migrations.
- Twilio inbound voice number and webhook.
- Branded Northline Auto Care greeting.
- Conversational intake in which information can be given in different orders.
- Conversation memory and natural read-back.
- “One moment while I update your request” pacing message.
- Deepgram transcription.
- Claude information extraction and follow-up generation.
- NHTSA VIN decoding.
- Existing quote calculation logic.
- Clearly labeled demo catalog estimates.
- Quote email delivery to the verified demonstration inbox.
- Lead and conversation records in the database.
- Application logs in Render and call/message logs in Twilio.

### Demo mode or restricted

- Parts pricing currently uses fallback catalog allowances when a live parts provider is unavailable.
- These emails correctly say **DEMO ESTIMATE — fallback catalog pricing only**.
- `DEMO_EMAIL_TO` sends demo emails to the verified test inbox because a Resend test sender cannot email arbitrary prospects.
- Render's free service may sleep after inactivity, causing the first request or call to be delayed.
- The demonstration phone number belongs to the demo, not to a real shop.

### Not production-ready until configured

- SMS delivery: Twilio error `30034` showed that the number needs US A2P 10DLC registration.
- Live parts pricing: the eBay developer registration was rejected; use another supplier or appeal the rejection.
- Appointment booking: requires the shop's CRM/calendar URL, credentials, and booking behavior.
- Human transfer: requires a real shop escalation number and approved transfer rules.
- Staff notifications: require the client's real staff phone and email.
- Email to arbitrary customers: requires a verified sending domain in the email provider.
- One-minute recovery worker: must be scheduled in production using `WORKFLOW_SECRET`.
- Real shop policies, rates, hours, services, and disclaimers must be loaded during onboarding.
- Compliance review is needed for recording disclosure, privacy, SMS consent, and local laws.

## 6. What this product is — and is not

- Say: **24/7 AI service advisor**, **AI receptionist**, **lead capture**, and **preliminary estimate automation**.
- Say: it can be configured to work with the shop's existing suppliers and systems when integrations are available.
- Do not say: it diagnoses vehicles.
- Do not say: every quote is a guaranteed final price.
- Do not say: it already connects to every parts supplier, CRM, or calendar.
- Do not say: it replaces every employee.
- Do not say: it operates without human exception handling.
- Best promise: it handles repetitive intake and follow-up so staff can work on vehicles and focus on customers who need human judgment.

## 7. What I need from an auto shop

### Business information

- Legal business name and customer-facing shop name.
- Address, service area, phone number, email, and website.
- Business hours, holiday hours, and after-hours policy.
- Preferred assistant name, greeting, voice, and tone.
- Whether calls are handled always, after hours, or only when staff do not answer.

### Services and pricing

- Services offered and services not offered.
- Labor rate or labor-rate categories.
- Typical labor hours or the labor guide/system they use.
- Diagnostic fee, inspection fee, shop supplies, taxes, disposal fees, and other charges.
- Parts markup rules.
- Minimum and maximum estimate rules.
- Dollar amount that requires human review.
- Exact estimate disclaimer approved by the shop.
- Warranties and policies Ava may explain.

### Parts and software

- Parts suppliers used by the shop.
- Whether those suppliers offer an API or integrate through the shop's management software.
- Current shop-management system, CRM, or POS.
- Scheduling/calendar system.
- Existing website form and phone setup.
- Integration credentials supplied securely, never by ordinary email or inside notes.

### Operations and escalation

- Staff notification phone and email.
- Live transfer number.
- Who receives urgent, failed, high-value, or complaint-related leads.
- Appointment length and available windows for each service.
- Emergency and safety scripts.
- Towing, drop-off, loaner, payment, cancellation, and no-show policies.
- Languages required.
- Customer-data retention period and deletion process.

### Legal and consent

- Approval of the call greeting and AI disclosure.
- Call-recording notice appropriate for the jurisdictions involved.
- SMS opt-in language and consent records.
- Privacy policy and customer-data handling requirements.
- Written approval of what Ava may quote, explain, schedule, and escalate.

## 8. Recommended first pilot

- Offer a **30-day pilot**, not only one week.
- Start with a dedicated trial number, overflow calls, or after-hours forwarding.
- Do not immediately replace the shop's main phone workflow.
- Start with narrow authority:
  - Answer calls.
  - Capture customer and vehicle information.
  - Summarize the problem.
  - Send preliminary estimate requests or approved estimates.
  - Notify staff.
- Add autonomous scheduling only after the calendar integration is tested.
- Meet with the owner weekly during the pilot.
- Review misunderstood calls, missing data, escalations, and saved opportunities.

## 9. Pilot success measurements

- Total calls answered.
- Calls answered after hours or while staff were unavailable.
- Complete leads captured.
- Preliminary estimates sent.
- Customer response rate.
- Appointments requested and booked.
- Calls requiring staff help.
- Errors and abandoned calls.
- Average time from call to estimate.
- Revenue opportunities recovered from calls that might have been missed.
- Hours of staff phone time saved.
- Customer and employee feedback.

## 10. What I say when approaching a shop

### Short opener

- “Hi, I built an AI service advisor that answers calls 24/7, collects the customer's vehicle and service information, prepares preliminary estimates, and follows up automatically, so you don't lose customers while everyone is busy. It can be configured around the suppliers and systems your shop already uses. Would you like to see a two-minute demo?”

### Pilot offer

- “I'd like to let your shop test it free for 30 days. We can begin with a separate number or overflow and after-hours calls, so it does not disrupt your current system. I'll configure it around your services, rates, policies, and staff contacts, monitor it, and make adjustments during the trial.”

### Discovery questions

- “What happens when nobody can answer the phone?”
- “How many calls do you think you miss during busy periods or after hours?”
- “What do you use for estimates, parts, scheduling, and customer management?”
- “Which questions does your staff answer repeatedly?”
- “Which services can be estimated from known information, and which always require inspection?”
- “Who should receive urgent or unusual requests?”
- “Would you prefer it to answer every call, after-hours calls, or overflow only?”

### Honest answer about integrations

- “The system is designed to connect to the tools you already use, but first I need to verify which APIs or supported integrations those tools provide. I won't promise an integration until I confirm it.”

### Honest answer about pricing accuracy

- “The system creates a preliminary estimate using your approved labor, parts, tax, and markup rules. Final pricing remains subject to inspection and shop confirmation.”

## 11. Demonstration script

### Before the demo

- Open Render and confirm the latest deployment is **Live**.
- Open the demo website once to wake the free Render service.
- Confirm the Twilio balance is sufficient.
- Confirm Claude, Deepgram, Neon, and email credentials are active.
- Use a real email that can receive the demonstration message.
- Remember that SMS will not deliver until A2P registration is approved.
- Keep Render Logs open in another tab.

### What I tell the prospect

- “I'll call as a customer. Notice that I can explain the problem naturally instead of following a rigid menu. Then I'll show you the lead and preliminary estimate created behind the scenes.”

### Example caller opening

- “Hi, my brakes are squeaking and I'd like an estimate. I have a 2003 Honda Accord.”

### Sample VIN

- `1HGCM82633A004352`
- Say it slowly in groups: “1 H G C M, 8 2 6 3 3, A 0 0 4 3 5 2.”

### What the demo proves

- The call is answered.
- The shop is identified.
- The customer's natural language is understood.
- Missing information is collected.
- The VIN is decoded.
- A lead is stored.
- A preliminary estimate is calculated.
- An email is sent.
- Staff can review the activity in the dashboard/database.

### What I disclose

- “This demonstration uses fallback catalog allowances because a live shop supplier is not connected. A real installation uses the shop's approved pricing sources and policies.”

## 12. How to customize Ava for a real shop

- Do not paste all business knowledge directly into Claude's website.
- Do not expect Ava to learn permanent policies by herself.
- Store approved business facts in the application's database and configuration.
- Claude receives only the relevant approved facts during a conversation.
- Staff should approve permanent changes through the dashboard or onboarding process.
- Customize:
  - Shop name and greeting.
  - Assistant name and voice.
  - Hours and address.
  - Services and exclusions.
  - Labor rates and labor hours.
  - Parts sources and markups.
  - Taxes and fees.
  - Policies and disclaimers.
  - Appointment rules.
  - Escalation contacts.
  - Languages and conversational style.

## 13. Environment-variable checklist

- Add variables in **Render → autonomous-quoting-agent → Environment**.
- Enter the variable name without an equals sign.
- Enter only the value in the value field.
- Phone numbers must use E.164 format, such as `+14085550123`.
- Never show secret values during a demo or in a screenshot.
- Required or important variables:
  - `DATABASE_URL` — Neon PostgreSQL connection.
  - `PUBLIC_BASE_URL` — deployed HTTPS URL.
  - `DEFAULT_BUSINESS_SLUG` — active shop tenant.
  - `SHOP_NAME` — fallback shop name.
  - `SHOP_TAX_RATE` — decimal tax rate, such as `0.0825`.
  - `TWILIO_ACCOUNT_SID` — Twilio account identifier.
  - `TWILIO_AUTH_TOKEN` — Twilio secret.
  - `TWILIO_PHONE_NUMBER` — Twilio number with `+1`.
  - `DEEPGRAM_API_KEY` — transcription key.
  - `CLAUDE_API_KEY` — Anthropic key.
  - `EMAIL_API_URL` — email provider endpoint.
  - `EMAIL_API_KEY` — email provider key.
  - `EMAIL_FROM` — verified sender.
  - `STAFF_PHONE` — real escalation phone for the client.
  - `STAFF_EMAIL` — real escalation email for the client.
  - `CRM_BASE_URL` and `CRM_API_KEY` — scheduling/CRM connection.
  - `EBAY_API_KEY` — optional eBay token if eBay is approved and used.
  - `EBAY_MARKETPLACE_ID` — normally `EBAY_US`.
  - `WORKFLOW_SECRET` — long random secret for the scheduled recovery job.
  - `HUMAN_REVIEW_VALUE_THRESHOLD` — review threshold; current workflow also explicitly escalates totals over $1,000.
  - `DEMO_MODE` — `true` only for the fallback demonstration.
  - `DEMO_EMAIL_TO` — verified demo recipient while demo mode is enabled.
  - `ALLOW_LOCAL_INTERNAL` — `true` only for local development; use `false` in production.
  - `INTERNAL_API_KEY` — protected server-side access when required by the host.

## 14. Twilio configuration

- Voice webhook:
  - Method: `POST`
  - URL: `https://autonomous-quoting-agent.onrender.com/api/voice/inbound`
- Messaging webhook:
  - Method: `POST`
  - URL: `https://autonomous-quoting-agent.onrender.com/api/sms/inbound`
- The application verifies Twilio signatures.
- If the base URL changes, update `PUBLIC_BASE_URL` and both Twilio webhooks.
- Complete A2P 10DLC registration before relying on US SMS delivery.
- SHAKEN/STIR concerns caller identity and answer rates; A2P 10DLC concerns application-to-person SMS.

## 15. Deployment checklist

- Push code to the `main` branch on GitHub.
- Render automatically deploys the new commit.
- In Render, confirm the newest deployment says **Live**.
- Confirm the displayed commit matches the latest GitHub commit.
- Open the public site and confirm HTTP access works.
- Run database migrations after adding schema changes: `npm run db:migrate`.
- Before pushing code, run:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run build`
  - `npm test`
- Schedule `POST /api/autonomous/jobs` once per minute with `Authorization: Bearer <WORKFLOW_SECRET>` for recovery and timing checks.

## 16. Fast troubleshooting guide

### First rule

- Do not keep calling repeatedly after an application error.
- Make one failed call, note the exact time, and inspect the logs.

### Render: find the application error

- Open Render Dashboard.
- Select **autonomous-quoting-agent**.
- Select **Monitor → Logs**.
- Make sure **Application logs** is selected.
- Search for `error`.
- Read the newest error at the time of the call.
- Copy the first error line and approximately 5–10 lines below it.
- Never copy API keys, tokens, or the database URL.

### Twilio: find the webhook or carrier error

- Open Twilio Console.
- Select **Monitor → Logs → Voice** for calls.
- Open the newest call.
- Read **Errors and Warnings**.
- For texts, select **Monitor → Logs → Messaging** and open the newest message.
- Render usually explains the application failure; Twilio usually explains webhook delivery, timeout, or carrier rejection.

### Common errors already encountered

- `ENOENT ... .env.local`
  - Meaning: the build tried to read a local-only environment file on Render.
  - Fix: use Render Environment variables and make local `.env.local` loading optional.
- `Could not resolve './build/sites-vite-plugin'`
  - Meaning: a required build file/plugin was missing from deployment.
  - Fix: include the hosting plugin/build directory in the repository and redeploy.
- Twilio error `11200` or HTTP `502`
  - Meaning: Twilio could not get a valid webhook response, often due to a sleeping free service, timeout, or server error.
  - Fix: check Render Logs, wake the service before demos, and fix the first server error.
- `column reference "created_at" is ambiguous`
  - Meaning: more than one joined table had a column with that name.
  - Fix: qualify it with the table name.
- `column conversations.created_at does not exist`
  - Meaning: the `conversations` table uses `started_at`, not `created_at`.
  - Fixed in `app/api/voice/process/route.ts` by ordering on `conversations.started_at`.
- Twilio SMS error `30034`
  - Meaning: US carrier blocked an SMS from an unregistered long-code number.
  - Fix: complete A2P 10DLC registration; this is not a quote-code failure.
- `Deepgram transcription failed`
  - Check the key, account balance/limits, recording URL access, and provider status.
- `Claude request failed`
  - Check the key, account credits/limits, model access, and provider status.
- `Unable to download call recording`
  - Check Twilio credentials and recording availability.
- `Forbidden` from a Twilio webhook
  - Check `PUBLIC_BASE_URL`, webhook URL, Auth Token, HTTPS, and whether Twilio signed the exact URL being validated.
- eBay parts failure or missing `EBAY_API_KEY`
  - In demo mode, use the clearly labeled fallback catalog.
  - In production, connect an approved supplier or escalate.
- CRM booking failure
  - Check CRM URL, API key, supported endpoint, appointment payload, and permissions.
- PostgreSQL SSL warning about `prefer`, `require`, or `verify-ca`
  - This is a warning, not usually the cause of a failed call. Find the next actual `ERROR` line.

## 17. Where important code lives

- `app/api/voice/inbound/route.ts` — answers inbound calls, creates the lead, and speaks the branded greeting.
- `app/api/voice/recording/route.ts` — receives the recorded answer and gives the immediate pacing message.
- `app/api/voice/process/route.ts` — transcribes, understands, remembers, saves, asks the next question, and starts the workflow.
- `app/api/voice/outbound/route.ts` — outbound speed-to-lead call flow.
- `app/api/sms/inbound/route.ts` — SMS intake and `ACCEPT`/`NO` handling.
- `app/api/autonomous/leads/route.ts` — web-form lead creation and outbound calling.
- `lib/conversation-ai.ts` — Claude instructions, structured information, and conversational follow-ups.
- `lib/communications.ts` — Twilio calls/SMS, Deepgram, email, staff notifications, and signature verification.
- `lib/workflow.ts` — autonomous sequence, fallback behavior, estimate delivery, acceptance, booking, and failure handling.
- `lib/quote.ts` — authoritative quote arithmetic; do not let AI replace this logic.
- `lib/vin.ts` — NHTSA VIN decoding.
- `lib/parts.ts` — parts search provider.
- `lib/tenant.ts` — loads the correct shop/business configuration.
- `src/platform/state-machine.ts` — allowed lead status transitions.
- `migrations/003_multitenant_autonomy.sql` — core multi-tenant and conversation tables.
- `migrations/004_autonomous_wrapper.sql` — autonomous states, escalation fields, deadlines, and durable jobs.
- `.env.example` — variable names and safe placeholders only.
- `README.md` — technical setup overview.

## 18. Escalation and fallback rules

- VIN fails:
  - Ask for year, make, and model.
- Live parts search fails:
  - In production, ask the customer to call the shop and notify staff.
  - In demo mode, a fallback may be used only with a clear nonbinding demo label.
- Estimate exceeds $1,000:
  - Stop automatic completion and send for staff review.
- Customer asks for diagnosis, a guarantee, a sensitive technical answer, or a person:
  - Record the request, notify staff, and do not invent an answer.
- Provider or workflow fails:
  - Log the failure, store the escalation reason, set the lead to `failed`, and notify configured staff channels.
- Free Render service is asleep:
  - Wake the website before a planned demo; use a paid always-on instance for a real shop.

## 19. Production-readiness checklist

- Complete several successful end-to-end calls with different speaking styles.
- Test corrections, interruptions, silence, background noise, and information in unexpected order.
- Verify every required field is saved accurately.
- Verify the call ends cleanly.
- Complete A2P 10DLC and test inbound/outbound SMS.
- Verify the shop's email domain and test delivery to multiple providers.
- Connect and validate the real parts source.
- Connect and validate the real calendar or CRM.
- Configure a real transfer/escalation number.
- Test quotes above $1,000.
- Test VIN failure and manual vehicle details.
- Test provider outages and staff notifications.
- Review recording-consent and privacy language.
- Add monitoring and alerts.
- Move from Render Free to an always-on production service before handling a client's real calls.
- Back up the Neon database and define data retention/deletion procedures.
- Keep API keys in secret stores and rotate any key that is accidentally exposed.

## 20. Suggested business model

- Start with a free 30-day pilot for one trusted business.
- Charge an onboarding/setup fee after the pilot proves value.
- Charge a monthly subscription for hosting, monitoring, maintenance, and a usage allowance.
- Pass through or clearly include phone, transcription, AI, SMS, email, and integration usage costs.
- Offer tiers based on:
  - Call volume.
  - After-hours versus full-time coverage.
  - SMS and email follow-up.
  - Scheduling integration.
  - Supplier/CRM integrations.
  - Multiple locations.
  - Custom reporting and support.
- Do not choose final prices until actual provider costs, support time, and client value are measured during the pilot.
- Use recovered leads and booked revenue—not “AI”—to justify the monthly price.

## 21. Selling points

- Answers calls 24/7.
- Captures customers who might otherwise call another shop.
- Frees owners and technicians from repetitive phone intake.
- Collects consistent customer and vehicle details.
- Responds naturally instead of forcing callers through a rigid menu.
- Sends fast preliminary estimates and follow-ups.
- Creates a searchable record of leads and conversations.
- Escalates exceptions instead of guessing.
- Can be configured around each shop's rates, rules, hours, and systems.
- Can begin safely with overflow or after-hours calls.
- Produces measurable results: calls answered, leads captured, estimates sent, and appointments booked.

## 22. Objection responses

- **“Will it replace my staff?”**
  - “It handles repetitive intake and follow-up. Your staff keep control of diagnosis, unusual cases, final pricing, and customer relationships.”
- **“What if it gets something wrong?”**
  - “It reads important details back, stores the conversation, asks for corrections, and escalates anything outside its authority.”
- **“Will it give the wrong price?”**
  - “The AI does not calculate prices. Your approved quote engine, rates, parts data, taxes, and rules do. Estimates remain preliminary until confirmed.”
- **“Do I have to replace my number?”**
  - “No. We can begin with a separate number, after-hours forwarding, or overflow forwarding.”
- **“Does it work with my software?”**
  - “I first verify whether your system provides an API or supported integration. If it does, we configure and test it before relying on it.”
- **“What happens in an emergency?”**
  - “Approved safety rules route or escalate the call. The assistant does not diagnose or invent safety advice.”
- **“How do I know it is worth paying for?”**
  - “The pilot measures missed calls recovered, leads captured, appointments booked, staff time saved, and revenue opportunities.”

## 23. Expansion beyond auto repair

- The reusable platform is:
  - Phone answering.
  - Natural-language intake.
  - Lead records.
  - Business knowledge.
  - Notifications.
  - Scheduling.
  - State-machine automation.
  - Human escalation.
- Auto repair is difficult because of VINs, diagnostics, parts variability, labor guides, and safety.
- Plumbing, HVAC, electrical, roofing, and concrete can reuse the platform with industry-specific questions and rules.
- For home services, start by selling **24/7 receptionist, qualification, urgency detection, and scheduling**, not guaranteed unseen-job pricing.
- Pizza/restaurant version would replace VIN/parts/labor with menu/order/tax/payment/POS/kitchen flow.
- Keep each industry as a separate product configuration or repository so the working auto-shop product is not disrupted.

## 24. Founder operating rules

- Be impressive, but always be accurate.
- Never demonstrate with unverified production claims.
- Never allow the AI to invent prices, policies, availability, or technical diagnoses.
- Never expose credentials in notes, screenshots, GitHub, chat, or customer demonstrations.
- Never deploy schema changes without migrations and a backup plan.
- Never send all calls to a new pilot immediately; begin with a controlled route.
- Always test using the client's real rules before going live.
- Always preserve an accessible human fallback.
- Always label demo/fallback pricing clearly.
- Always measure outcomes during a pilot.
- The product is not “finished forever”; each client requires onboarding, integration, testing, monitoring, and refinement.

## 25. Immediate next steps

- Run another complete conversational phone test and inspect the saved lead.
- Finish Twilio A2P 10DLC registration for SMS.
- Verify a custom email-sending domain.
- Choose a live parts integration based on the first shop's actual supplier.
- Build or polish the shop onboarding/configuration dashboard.
- Connect a test scheduling provider.
- Add a real human-transfer path.
- Schedule the one-minute recovery worker.
- Prepare a two-minute demonstration and a 30-day pilot agreement.
- Approach the trusted auto shop with the pilot offer.
- Consider the known plumber as a second, simpler receptionist/scheduling pilot.

## 26. One-sentence founder summary

- “I built a configurable 24/7 AI service advisor that answers calls, understands customers naturally, captures complete leads, prepares preliminary estimates using shop-approved rules, follows up automatically, and escalates anything that needs human judgment.”
