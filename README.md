# Coursology Todo App

![Coursology Logo](public/placeholder-logo.svg)

A powerful and intuitive todo application designed to help you stay organized and productive.

## 🚀 Introduction

The Coursology Todo App is a feature-rich task management solution built with Next.js, TypeScript, and Tailwind CSS. It provides a seamless and visually appealing experience for managing your tasks, organizing them into folders, and visualizing your schedule with a built-in calendar.

## 💻 Codebase Overview

This project is built with a focus on modularity, scalability, and developer experience. We use a combination of modern technologies to create a robust and maintainable codebase. For a deeper dive into our architecture, components, and state management, check out our detailed code documentation.

[Read the Code Documentation](./docs/CODE_DOCUMENTATION.md)

## 🚀 Live Demo

You can try out the live application here:

[https://coursology-todo-appp.vercel.app/](https://coursology-todo-appp.vercel.app/)

## 📸 Screenshots

Here are some screenshots of the application. We also have a dark mode - try the app to see it!

| Home Page                                       | Folders (Tree View)                               | Tasks                                           |
| ----------------------------------------------- | ------------------------------------------------- | ----------------------------------------------- |
| ![Home Page](screenshots/screenshot-1.png) | ![Folders (Tree View)](screenshots/screenshot-2.png) | ![Tasks](screenshots/screenshot-3.png) |

| Folders (Grid View)                               | Calendar (Month View)                                   | Calendar (Week View)                                  |
| ------------------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------- |
| ![Folders (Grid View)](screenshots/screenshot-4.png) | ![Calendar (Month View)](screenshots/screenshot-5.png) | ![Calendar (Week View)](screenshots/screenshot-6.png) |

| Blog                                          |
| --------------------------------------------- |
| ![Blog](screenshots/screenshot-7.png) |

## ✨ Features

*   **Task Management:** Create, edit, delete, and track your tasks with ease.
*   **Folder Organization:** Group your tasks into folders for better organization.
*   **Calendar View:** Visualize your tasks in a weekly or monthly calendar view.
*   **Blog:** A dedicated section for articles and updates.
*   **Notifications:** Stay informed with in-app notifications.
*   **Responsive Design:** A beautiful and responsive UI that works on all devices.
*   **Themeable:** Light and dark mode support.

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18 or later)
*   pnpm

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/ayaemx/to-do-app-.git
    ```
2.  Install NPM packages
    ```sh
    pnpm install
    ```
3.  Run the development server
    ```sh
    pnpm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🌊 Workflow Diagram

```mermaid
graph TD
    A[User] -->|Opens App| B(Home Page)
    B --> C{Selects a feature}
    C -->|Tasks| D[Task Management]
    C -->|Folders| E[Folder Organization]
    C -->|Calendar| F[Calendar View]
    C -->|Blog| G[Blog Section]
    D -->|Create/Edit/Delete| D
    E -->|Create/Edit/Delete| E
