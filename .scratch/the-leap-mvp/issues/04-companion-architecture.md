Type: grilling
Status: resolved

## Question

What should the Leap Companion's V1 architecture and provider be? White paper §25 sets firm behavioral constraints (identify as AI, no claimed spiritual authority, escalate on serious risk, humility on secondary doctrine, minimize data retention) but not an implementation. Given the rest of this build already runs on Claude/Anthropic tooling, using the Claude API is the obvious starting presumption — but the real decision here is scope for V1: is the Companion a single guided chat surface (Scripture Q&A, navigation, next-step help, resource discovery) or does it also drive the "I'm Stuck" pathway (§26)? And how are the required guardrails (risk escalation, no-divine-authority framing) actually enforced — system prompt only, or also a lightweight classifier/keyword layer for risk detection before a response goes out?
