# mimic

A small library which was created to achieve the following things when mocking data for tests: 
- Reduce repetition
- Reduce lines of code written
- Encourage meaningful mock data that is relevant to the test case
- Reduce brittle test suites that rely on a single set of globally defined mocked data

## Installation

`npm i -D @gooseberry-crumble/mimic`

## Usage

Create a "builder" for each of your complex data objects. This is what you will use to provide to your components and to mock your api responses. There are a few basic guidelines to follow when creating builders:
- Create it at a global level
- Initialise it with sensible defaults
- Provide default values for only the required props
- Import and use it in the places where you need to mock that data type