# The Leap

A Christ-centered digital discipleship platform, birthed in Africa and built for a global audience. The product's job is to help a person identify and take their next concrete step with Christ — not to be a content library, a social network, a Bible app, or an AI "pastor."

## Language

**Formation Domain**:
One of the ten named areas of discipleship growth (e.g. "Identity in Christ," "Leadership & Service") that content and practices are organized under. A domain is a category of growth, not a piece of content.
_Avoid_: Topic, category, module (module is reserved for The Real Edge's leadership curriculum)

**Formation Journey**:
A structured, multi-day guided experience inside a Formation Domain (e.g. the 7-day "Faith in Christ" journey). A journey is the thing a user progresses through session by session.
_Avoid_: Course, program, plan

**Session**:
A single day's unit of content inside a Formation Journey, run through the Formation Loop.
_Avoid_: Lesson, day, unit

**The Formation Loop**:
The fixed sequence a Session moves through: Scripture → Message → Explore → Reflect → Pray → Next Step → Engage. Deliberately narrow — one Scripture-and-Message thought per Session — so a person absorbs one thing deeply per day rather than several thoughts at once (see [ADR-0001](docs/adr/0001-narrow-the-formation-loop.md)).
_Avoid_: Devotional flow, lesson structure

**Message**:
The short, plain-language, encouraging passage in a Session's Formation Loop that unpacks its Scripture — the "sermon" moment a person studies before Explore.
_Avoid_: Sermon, teaching, body

**The Four Core Movements**:
The top-level navigation and discipleship posture: CONNECT ("I belong") → COMMIT ("I choose the way of Christ") → EVOLVE ("I am becoming") → ENGAGE ("My life has a purpose beyond myself"), with MULTIPLY ("I can help someone else take their next step") as the mature outcome. These are also the four primary nav tabs plus Home.
_Avoid_: Stages, phases, pillars

**Next Step**:
The single, personalized, recommended action surfaced to a user at a given moment (on Home, after finishing a Session, etc.). Produced by the Next-Step Engine. There is always exactly one primary Next Step shown at a time, not a list.
_Avoid_: Recommendation, suggestion (used loosely for other things), task

**Next-Step Engine**:
The personalization system that turns a user's signals (onboarding answers, progress, reflections, engagement) into their current Next Step.
_Avoid_: Recommendation engine, algorithm

**Leap Companion**:
The in-product AI guide. Explicitly identifies itself as AI, never claims spiritual/pastoral authority, and exists to reduce friction toward discipleship (Scripture questions, navigation, reflection prompts) — never to become the destination itself.
_Avoid_: AI pastor, chatbot, assistant

**Discipleship Maturity Model**:
The six-level internal model (Encounter → Foundation → Formation → Vocation → Engagement → Multiplication) used for personalization and curriculum sequencing. Never shown to users as a public label or status.
_Avoid_: User level, tier (tier is reserved for monetization: Free / Leap+ / Leap Lead)

**The Real Edge**:
The signature leadership-development experience/module set (self-awareness, character, communication, decision-making, emotional maturity, vision, leadership, service, impact) under LEAP LEAD.
_Avoid_: Leadership course

**Commitment**:
A user-authored, self-tracked weekly intention (e.g. "Pray each morning"), shown on Home and My Journey.
_Avoid_: Task, goal, streak (distinct from Practice — see below)

**Practice**:
The optional prompted action attached to a Daily Devotion entry (e.g. "Choose one practical act of obedience"). No longer part of the Formation Loop — Sessions dropped it (see [ADR-0001](docs/adr/0001-narrow-the-formation-loop.md)) — so this term now belongs to Daily Devotion only, not Formation Journeys.
_Avoid_: Commitment, exercise

**Prayer Request**:
A post in the Prayer Room. Always owned by its author, but independently public/private (who can see it) and identified/anonymous (whether the author's name shows) — anonymity is a display choice, not literal system-level anonymity; ownership is always retained for moderation.
_Avoid_: Prayer (ambiguous alone), request

**Post**:
Community-space content, visible to all users. Always a distinct table/concept from a Reflection (private, never shared) and a Prayer Request (its own space, its own visibility rules).
_Avoid_: Reflection, update, share

**Wayfinder map** / **ticket**:
Planning artifacts used by the `wayfinder` engineering skill to chart this project's build-out, stored under `.scratch/`. Not a user-facing concept — see `docs/agents/issue-tracker.md`.
