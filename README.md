# Cypress Automation Testing

This repository contains automated end-to-end (E2E) tests written using **Cypress** and JavaScript.

The project is based on [Automation Testing Playground](https://github.com/rahulkar/automation-testing-playground), an existing web application designed for practicing web automation testing.

I forked the original repository and extended it with Cypress test scripts to practice and demonstrate UI automation testing.

## Tech Stack

- **Automation Framework:** Cypress
- **Programming Language:** JavaScript
- **Testing Type:** End-to-End (E2E) Testing
- **Browser:** Chrome / Electron (through Cypress)

## Project Structure

```text
.
├── css/
├── cypress/
│   ├── downloads/
│   ├── e2e/
│   │   └── elements.cy.js
│   ├── fixtures/
│   └── support/
├── js/
├── pages/
├── cypress.config.js
├── index.html
├── LICENSE
└── README.md
```

## Test Scenarios

The project includes Cypress test scripts for practicing web UI automation.

Current test coverage includes:

- **Web Elements:** Interacting with and validating web elements.

Additional test scenarios will be added as the project evolves.

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/code-with-nazmul/cypress-testing.git
cd cypress-testing
```

Install Cypress (if it is not already installed):

```bash
npm install --save-dev cypress
```

### Running Tests

Open the Cypress Test Runner:

```bash
npx cypress open
```

Run tests in headless mode:

```bash
npx cypress run
```

Make sure the application is running at the `baseUrl` configured in `cypress.config.js` before executing the tests.

## Learning Objectives

- Understanding Cypress and E2E testing.
- Writing automated test cases using JavaScript.
- Locating and interacting with web elements.
- Validating expected application behavior.
- Organizing and maintaining Cypress test scripts.

## Acknowledgements

The web application used in this project was originally developed by [Rahul Kar](https://github.com/rahulkar).

- **Original Repository:** https://github.com/rahulkar/automation-testing-playground
- **My Fork:** https://github.com/code-with-nazmul/cypress-testing

This repository is maintained as a personal learning and testing project.

## License

Please refer to the original project's license and retain the applicable license and attribution notices.
