# IntelScope AI

IntelScope is an AI-powered mystery investigation platform. The project is organized as a React frontend and an Express/MongoDB backend.

## Development

1. Copy `server/.env.example` to `server/.env` and configure MongoDB and `JWT_SECRET`.
2. Run `npm install` from the repository root.
3. Run `npm run dev` to start the API on port 5000 and the client on port 5173.

Phase 1 provides account creation, login, protected case creation, and case listing.

Phase 2 adds `POST /api/cases/:id/generate`. It sends the case scenario to Gemini, validates the structured response, and stores the incident, suspects, clues, evidence, and hidden solution. Normal case reads never select the hidden solution. Configure `GEMINI_API_KEY` and optionally `GEMINI_MODEL` in `server/.env` before using generation.

Phase 3 adds the investigator workspace: account screens, a case archive, case creation, evidence filtering and inspection, suspect profiles, and case-linked field notes.

Phase 4 adds evidence-grounded assistant responses, timestamp-sorted timelines, and persisted clue connections. The assistant receives only public case data and filters its evidence references against the case's real evidence IDs.

Phase 5 adds culprit submission and report generation. The stored solution is used for consistent evaluation, while the actual culprit and explanation remain hidden until the explicit reveal endpoint is called.

Useful endpoints:

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/cases`
- `POST /api/cases`
- `POST /api/cases/:id/generate`
- `GET /api/cases/:id`
- `GET /api/cases/:id/notes`
- `POST /api/cases/:id/notes`
- `GET /api/cases/:id/timeline`
- `GET /api/cases/:id/connections`
- `POST /api/cases/:id/connections`
- `POST /api/cases/:id/assistant`
- `POST /api/cases/:id/conclusion`
- `GET /api/cases/:id/report`
- `POST /api/cases/:id/report/reveal`
