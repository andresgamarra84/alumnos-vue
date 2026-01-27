# Institutional Management System — Frontend

Frontend of an institutional management system.
This project is part of a real-world platform in continuous use, developed and evolved over several years for a public music conservatory in Argentina.

The main goal of the frontend is to provide a clear, maintainable, and adaptable interface, supporting the system’s evolution without compromising stability.

## Context

The system originated as a desktop application developed using Delphi and Firebase.
As the need for broader access and remote usage emerged, a gradual migration to a web-based platform was initiated.

The migration process prioritized:
- operational continuity
- functional compatibility
- gradual adoption of new technologies

## Frontend Technical Evolution

The frontend architecture evolved in response to real institutional and system needs, avoiding arbitrary technology changes.

- **2017**  
  First web version developed using PHP with server-side rendering, replicating the logic and workflows of the original desktop system.

- **2018 – 2020**  
  Progressive separation between backend and frontend layers.  
  Introduction of JavaScript and jQuery to enhance interactivity without altering the overall system structure.

- **2020 – 2022**  
  Migration to a component-based frontend architecture using Vue 2 and Bootstrap 4.  
  Improved code organization, view reuse, and UI state management.

- **Current**  
  Ongoing refactor towards Vue 3 and Bootstrap 5, focused on:
  - improved structural clarity
  - maintainability
  - adoption of a Git-based versioned workflow

The evolution has been carried out in a controlled manner, avoiding disruptive refactors that could impact system stability in production.

## Design and Development Approach

Frontend design and development decisions follow these core principles:

- incremental refactoring over full rewrites
- respect for existing system constraints
- clear separation between logic and presentation
- emphasis on code readability
- long-term maintainability as a primary goal

## Backend Relationship

Although this repository contains only the frontend layer, development has been carried out in close coordination with the backend, which is undergoing its own refactor process in a separate project.

The backend is implemented in PHP following an MVC architecture, with a MySQL/MariaDB database.
Existing workflows and implicit contracts between frontend and backend are preserved.

This repository represents only the interface layer and does not include sensitive configurations or backend dependencies.

## Technologies

- JavaScript (ES6+)
- Vue 3 (Composition API)
- HTML5
- CSS3
- Bootstrap 5

## Current Project Status

The frontend is currently undergoing a progressive refactor to Vue 3.
Sections of the original system are incorporated incrementally as they are redesigned and tested.

The legacy system remains in production during this process.

The goal is not an immediate migration, but an orderly and sustainable transition.

## Final Notes

Some production-specific configurations, integrations, and resources are intentionally excluded from version control.

The project focuses on structural clarity, controlled evolution, and uninterrupted operational continuity.
