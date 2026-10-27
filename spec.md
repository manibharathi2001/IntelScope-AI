# IntelScope — Spec Sheet

**Project Type:** AI-Powered Mystery Investigation Platform  
**Development Approach:** Spec-Driven Development (SDD)  
**Technology Stack:** MERN (MongoDB, Express.js, React.js, Node.js)  
**AI Integration:** Google Gemini API

## 1. Project Overview

IntelScope is an AI-powered mystery investigation platform where users create their own fictional mystery cases by providing a scenario, story, or incident description. Based on the submitted scenario, Google Gemini generates an interactive mystery investigation containing a fictional crime or incident, suspects, clues, and supporting evidence.

The evidence may include AI-generated WhatsApp-style conversations, images, CCTV-style recordings or video clips, witness statements, and investigation documents. Users investigate the case by examining evidence, questioning the AI, connecting clues, identifying contradictions, and reconstructing the sequence of events to determine the culprit.

The platform concludes with an investigation report summarizing the findings and supporting evidence.

## 2. Project Objectives

- Allow users to create mystery cases from their own story or scenario.
- Generate fictional investigations, suspects, clues, and evidence using Google Gemini.
- Provide an interactive workspace for examining and organizing evidence.
- Help users identify relationships and contradictions between evidence items.
- Enable AI-assisted investigation through natural-language questions.
- Allow users to submit their conclusions about the culprit.
- Generate a final investigation report based on the case evidence and the user's deductions.

## 3. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Styling | CSS / Tailwind CSS |
| Backend | Node.js |
| API Framework | Express.js |
| Database | MongoDB |
| AI Model | Google Gemini API |
| Authentication | JWT-based authentication |
| API Communication | REST API |
| Version Control | Git and GitHub |

## 4. Functional Requirements

### FR-01: Case Creation

Users can submit a scenario or story describing the mystery they want to investigate.

- Provide a form for the case title, scenario description, and optional difficulty level.
- Validate the submitted information.
- Send the scenario to the backend for AI processing.
- Generate a fictional investigation containing a case summary, incident details, suspects, clues, and evidence.
- Save the generated case to MongoDB.

### FR-02: AI Mystery Generation

Google Gemini generates a structured investigation based on the user's scenario.

- Create a fictional incident with a defined underlying solution.
- Generate multiple suspects with motives, backgrounds, and alibis.
- Generate clues and evidence connected to the incident.
- Include misleading clues where appropriate without making the case unsolvable.
- Maintain consistency between the actual solution and the evidence.
- Store the solution separately from information revealed to the investigator.

### FR-03: Suspect Management

Users can inspect the suspects associated with a case.

- Display suspect profiles and relevant background information.
- Show motives, relationships, and alibis.
- Allow users to review evidence associated with individual suspects.
- Distinguish confirmed facts from unverified allegations.

### FR-04: Evidence Management

The system generates and organizes fictional evidence for each investigation.

Supported evidence categories:

- WhatsApp-style chat conversations and messages.
- Images and photographs.
- CCTV-style footage or video clips, where supported.
- Witness statements and interview transcripts.
- Documents, notes, and incident records.
- Timestamps, locations, and other relevant metadata.

Each evidence item must have a unique identifier, evidence type, title, content or media reference, timestamp where applicable, and case association.

Generated evidence must be clearly identified as fictional and must not be presented as authentic recordings or real communications.

### FR-05: Investigation Workspace

Provide a centralized interface where users can explore a case.

- Display case information, suspects, and evidence.
- Allow users to filter evidence by category.
- Open evidence items in a detailed view.
- Mark evidence as important.
- Record personal investigation notes.
- Track the user's progress through the investigation.

### FR-06: AI Investigation Assistant

Integrate Google Gemini to answer questions about the active case.

- Accept natural-language questions from the user.
- Provide answers based on the case information and evidence available to the AI.
- Reference relevant evidence IDs or evidence titles in its responses.
- Explain how evidence supports or contradicts a theory.
- Identify information gaps and inconsistencies.
- Avoid inventing evidence that does not exist in the case.
- Preserve the distinction between evidence, assumptions, and hypotheses.
- Keep the hidden solution confidential until the user explicitly requests the reveal or submits a final accusation.

### FR-07: Clue Connections and Contradiction Detection

Help users understand relationships between evidence items.

- Identify evidence that supports the same theory.
- Highlight conflicting statements, alibis, and timestamps.
- Allow users to create relationships between clues and suspects.
- Display connected clues in a simple relationship view.
- Explain the reasoning behind AI-suggested connections.
- Allow users to accept or reject suggested connections.

### FR-08: Investigation Timeline

Create a chronological view of relevant events.

- Display events with available timestamps.
- Connect events to their supporting evidence.
- Highlight timeline conflicts.
- Mark unknown or uncertain event times.
- Allow users to inspect the evidence behind each event.

### FR-09: Culprit Submission

Allow users to submit their final investigation conclusion.

- Select a suspected culprit.
- Provide an explanation or theory.
- Select supporting evidence.
- Submit the conclusion for evaluation.
- Compare the user's reasoning with the predefined case solution.
- Provide feedback on supported conclusions, overlooked evidence, and incorrect assumptions.

The solution must be generated and stored before the user begins investigating so that the evaluation remains consistent.

### FR-10: Investigation Report

Generate a final report when the investigation is completed or the user requests one.

The report should include:

- Case overview.
- Incident summary.
- Suspects investigated.
- Key evidence and findings.
- Timeline of events.
- Contradictions and connections discovered.
- User's final theory and selected culprit.
- AI evaluation of the theory.
- Evidence references supporting the conclusion.
- Unresolved questions and limitations.

The report must distinguish AI-generated analysis from established facts within the fictional case.

## 5. Non-Functional Requirements

- **Security:** Protect API keys using server-side environment variables.
- **Authentication:** Restrict private cases and investigation data to authorized users.
- **Data integrity:** Maintain consistent relationships between cases, suspects, and evidence.
- **Reliability:** Handle AI API errors, invalid responses, and rate limits gracefully.
- **Performance:** Display loading states during AI generation and avoid unnecessary repeated requests.
- **Validation:** Validate user inputs and AI-generated structured responses.
- **Maintainability:** Separate frontend components, backend routes, controllers, models, and AI service logic.
- **Privacy:** Do not send unrelated user data to the AI provider.

## 6. Core MongoDB Entities

- **User:** Account details and authentication information.
- **Case:** Scenario, case metadata, status, generated solution, and owner.
- **Suspect:** Profile, motive, alibi, and case association.
- **Evidence:** Type, content, media reference, timestamp, and case association.
- **ClueConnection:** Relationships between evidence items, suspects, and theories.
- **InvestigationNote:** User-created notes and observations.
- **InvestigationSession:** Questions, deductions, progress, and submitted conclusions.
- **InvestigationReport:** Final findings and evidence references.

## 7. High-Level Application Workflow

1. User creates an account and starts a new mystery case.
2. User enters a scenario and submits it for generation.
3. The backend calls Google Gemini to generate the case and structured evidence.
4. The backend validates and stores the generated case in MongoDB.
5. User enters the investigation workspace.
6. User examines suspects, messages, images, documents, and other clues.
7. User questions the AI and explores evidence connections and contradictions.
8. User builds a timeline and develops a theory.
9. User submits a suspected culprit and supporting evidence.
10. The application evaluates the conclusion and generates the final investigation report.

## 8. Suggested Development Phases

**Phase 1 — Foundation:** MERN setup, authentication, database models, and case creation.

**Phase 2 — AI Generation:** Gemini integration, structured case generation, suspect creation, and evidence generation.

**Phase 3 — Investigation Workspace:** Evidence viewer, suspect profiles, filtering, and investigation notes.

**Phase 4 — AI Analysis:** Evidence-grounded chat, clue relationships, contradiction detection, and timeline generation.

**Phase 5 — Conclusion and Reporting:** Culprit submission, solution evaluation, and final report generation.

**Phase 6 — Testing and Deployment:** Validation, error handling, security checks, responsive design, and deployment.

## 9. Definition of Done

The initial version is considered complete when a user can create a mystery from a custom scenario, receive a coherent AI-generated investigation, examine its suspects and evidence, ask questions about the case, connect clues, identify contradictions, construct a timeline, submit a culprit, and generate a report supported by references to the generated evidence.

**Important implementation constraint:** Google Gemini should generate a structured case with a predefined solution, not invent a new solution on every question. Investigation responses and final reports must use the stored case data to preserve consistency throughout the experience.