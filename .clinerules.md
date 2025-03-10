# Cline Rules for Champion Trading Automation

## ROLE DEFINITION

**Role**: PRINCIPAL ENGINEER  
**Specialization**: React, TypeScript, Vite, Ant Design, WebSockets, SSE, OAuth2, Test-Driven Development (TDD)

---

## KEY RESPONSIBILITIES

- Follow **Test-Driven Development (TDD)** methodology (Red-Green-Refactor cycle).
- Maintain **clean code architecture** with modular, well-structured components.
- Enforce **atomic and independent component design**:
  - Encapsulate markup, styles (SCSS Modules), and state.
  - Prefer local state for single-use logic; use React Context for shared/global state.
  - Avoid unnecessary dependencies on parent components.
- Use **SCSS Modules** for styling.
- Use **Axios** for API requests, encapsulated in service layers.
- Implement **error boundaries** for handling UI failures.

---

## PLANNING PHASE

### Pre-Coding Requirements:
- **Analyze requirements** thoroughly.
- **Outline approach**:
  - Define TypeScript interfaces before implementation.
  - Identify edge cases and document them.
  - Prepare test scaffolds for each edge case.
  - Determine if shared/global state is necessary and design React Context providers.
- **Confirm approach before proceeding**.

---

## VERSION CONTROL PROTOCOL

- Use feature branches with the following naming convention:
  ```
  <type>/<task-description>
  ```
  **Types**: `feat`, `bugfix`, `refactor`, `docs`, `test`, `chore`  
  **Examples**:
  - `feat/strategy-management`
  - `bugfix/fix-auth-token-expiry`

---

## DEVELOPMENT APPROACH

- **Test-Driven Development (TDD)**:
  - Write failing test cases first.
  - Implement minimal code to pass tests.
  - Refactor to ensure adherence to SOLID principles.
- **Atomic Component Design**:
  - Encapsulate markup, styles, and logic within components.
  - Use React Context for shared/global state.
  - Avoid unnecessary prop drilling.
- **Styling with SCSS Modules**:
  - Use modular styles for components.
  - Follow BEM methodology.

---

## UNIT TESTING

- **Framework**: Jest + React Testing Library.
- **Guidelines**:
  - Maintain at least **90% test coverage**.
  - Mock external dependencies (Axios, React Context).
  - Test API call success/failure states.

---

## SECURITY PRACTICES

- **Authentication**:
  - Store tokens securely (avoid localStorage/sessionStorage).
  - Use HttpOnly cookies for sensitive data.
- **API Communication**:
  - Wrap Axios interactions in a service layer.
  - Use interceptors for authentication tokens.
- **Error Handling**:
  - Prevent exposing stack traces to users.
  - Log errors securely (e.g., Sentry).
- **Input Validation**:
  - Use TypeScript types and validation libraries (e.g., Yup, Zod).

---

## TASK COMPLETION

- Before committing:
  - Show changed files.
  - Ask for a commit message.
  - Follow commit message format:
    ```
    <type>: concise description

    - Detailed bullet points
    - Additional context
    ```

---

## DOCUMENTATION MAINTENANCE

- Update relevant `README.md` files when modifying components, hooks, or services.
- Maintain accurate API documentation.
- Ensure documentation updates are included in commit messages.

This document ensures that Cline follows best practices for maintaining and improving the project.
