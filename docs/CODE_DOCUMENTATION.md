# Code Documentation

Welcome to the code documentation for the Coursology Todo App. This document provides a developer-focused look into the architecture, components, and state management of the application.

## 🚀 Philosophy

The Coursology Todo App is built with a focus on modularity, scalability, and developer experience. We use a combination of modern technologies like Next.js, TypeScript, and Tailwind CSS to create a robust and maintainable codebase. Our goal is to make it easy for developers to understand, contribute to, and extend the application.

## 📂 Project Structure

The project is organized into the following main directories:

```
.
├── app
├── components
├── contexts
├── hooks
├── lib
├── public
├── styles
├── test
└── types
```

*   **`app`**: This is where the routes of our application are defined. Each folder inside `app` corresponds to a route. For example, `app/tasks` corresponds to the `/tasks` route.
*   **`components`**: This directory contains all our React components. We have a `ui` subdirectory for generic, reusable components like buttons and inputs, and feature-specific subdirectories for more complex components like `tasks` and `folders`.
*   **`contexts`**: Here we define our React contexts for global state management. This is the heart of our application's state management.
*   **`hooks`**: This directory contains our custom React hooks, which encapsulate reusable logic.
*   **`lib`**: This is a place for utility functions that can be used throughout the application.
*   **`public`**: This directory contains static assets like images and fonts.
*   **`styles`**: This is where our global CSS styles and Tailwind CSS configuration reside.
*   **`test`**: This directory contains all our test files. We use Jest and React Testing Library for testing.
*   **`types`**: This directory contains all our TypeScript type definitions.

## 🧩 Component Deep Dive: `TaskForm`

Let's take a closer look at the `TaskForm` component, which is responsible for creating and editing tasks.

### `components/tasks/task-form.tsx`

This component is a great example of how we build forms in our application. It uses a combination of local state for form data and the `TaskContext` to perform CRUD operations.

**Key Features:**

*   **Controlled Components:** The form inputs are controlled components, with their values managed by the `formData` state.
*   **Validation:** The `validateForm` function ensures that the form data is valid before submission.
*   **Context Integration:** The form uses the `createTask` and `updateTask` functions from the `TaskContext` to save the task data.
*   **Dynamic UI:** The form's title and submit button text change depending on whether it's being used to create a new task or edit an existing one.

**Code Snippet:**

```tsx
// components/tasks/task-form.tsx

export function TaskForm({ isOpen, onClose, task }: TaskFormProps) {
  const { createTask, updateTask, loading } = useTask()
  const { folders } = useFolder()
  const [formData, setFormData] = useState<TaskFormData>({
    // ... initial form data
  })

  // ...

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      if (task) {
        await updateTask(task.id, formData)
      } else {
        await createTask(formData)
      }
      onClose()
    } catch (error) {
      console.error("Failed to save task:", error)
    }
  }

  // ...
}
```

## 🌐 Context in Action: `TaskContext`

The `TaskContext` is a great example of how we manage state in our application. It uses the `useReducer` hook to manage the task state and provides a set of actions to modify it.

### `contexts/task-context.tsx`

**State Management:**

The `taskReducer` function is a pure function that takes the current state and an action, and returns the new state. This makes the state transitions predictable and easy to test.

**Local Storage Persistence:**

The `TaskProvider` uses the `useEffect` hook to load and save the tasks to the browser's local storage. This ensures that the user's tasks are persisted between sessions.

**Code Snippet:**

```tsx
// contexts/task-context.tsx

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload], loading: false, error: null }
    // ... other cases
    default:
      return state
  }
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, initialState)

  useEffect(() => {
    const savedTasks = loadTasksFromStorage()
    if (savedTasks.length > 0) {
      dispatch({ type: "SET_TASKS", payload: savedTasks })
    }
  }, [])

  useEffect(() => {
    if (state.tasks.length > 0) {
      saveTasksToStorage(state.tasks)
    }
  }, [state.tasks])

  // ...
}
```

## 🧪 Real-World Testing Scenarios

We believe that testing is a crucial part of the development process. Here's an example of a real-world test for the `TaskForm` component.

### `test/task-form.test.tsx`

This test verifies that the `TaskForm` component correctly adds a new task when the form is submitted.

**Key Features:**

*   **Mocking:** We use a mock `TaskProvider` to isolate the component and control the test environment.
*   **User Interactions:** We use `fireEvent` to simulate user interactions like typing in an input field and clicking a button.
*   **Assertions:** We use `screen` to query the DOM and make assertions about the component's output.

**Code Snippet:**

```tsx
// test/task-form.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import TaskForm from '@/components/tasks/task-form';
import { TaskProvider } from '@/contexts/task-context';

describe('TaskForm', () => {
  it('should add a new task when the form is submitted', () => {
    render(
      <TaskProvider>
        <TaskForm />
      </TaskProvider>
    );

    const input = screen.getByLabelText('Task title');
    const button = screen.getByRole('button', { name: 'Add Task' });

    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.click(button);

    // Here you would typically assert that the `createTask` function
    // from the context was called with the correct data.
  });
});
