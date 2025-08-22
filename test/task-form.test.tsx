import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TaskForm } from "@/components/tasks/task-form"
import { TaskProvider } from "@/contexts/task-context"
import { FolderProvider } from "@/contexts/folder-context"
import type { Task } from "@/types/task"
import type { ReactNode } from "react"

const mockCreateTask = jest.fn()
const mockUpdateTask = jest.fn()

jest.mock("@/contexts/task-context", () => ({
  ...jest.requireActual("@/contexts/task-context"),
  useTask: () => ({
    createTask: mockCreateTask,
    updateTask: mockUpdateTask,
    loading: false,
  }),
}))

const mockFolders = [
  { id: "1", name: "Work", color: "#ff0000", taskCount: 0, createdAt: new Date(), updatedAt: new Date() },
  { id: "2", name: "Personal", color: "#00ff00", taskCount: 0, createdAt: new Date(), updatedAt: new Date() },
]

jest.mock("@/contexts/folder-context", () => ({
  ...jest.requireActual("@/contexts/folder-context"),
  useFolder: () => ({
    folders: mockFolders,
  }),
}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <TaskProvider>
    <FolderProvider>{children}</FolderProvider>
  </TaskProvider>
)

const sampleTask: Task = {
  id: "task-1",
  title: "Existing Task",
  description: "This is a task",
  status: "todo",
  priority: "medium",
  folderId: "1",
  tags: ["testing"],
  createdAt: new Date(),
  updatedAt: new Date(),
  pinned: false,
}

describe("TaskForm", () => {
  beforeEach(() => {
    mockCreateTask.mockClear()
    mockUpdateTask.mockClear()
  })

  it("should render the form in create mode", () => {
    render(<TaskForm isOpen={true} onClose={() => {}} />, { wrapper })
    expect(screen.getByText("Create New Task")).toBeInTheDocument()
    expect(screen.getByLabelText("Title *")).toHaveValue("")
  })

  it("should render the form in edit mode with pre-filled data", () => {
    render(<TaskForm isOpen={true} onClose={() => {}} task={sampleTask} />, { wrapper })
    expect(screen.getByText("Edit Task")).toBeInTheDocument()
    expect(screen.getByLabelText("Title *")).toHaveValue("Existing Task")
  })

  it("should show validation errors for empty title and folder", async () => {
    render(<TaskForm isOpen={true} onClose={() => {}} />, { wrapper })
    fireEvent.click(screen.getByText("Create Task"))

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument()
      expect(screen.getByText("Folder selection is required")).toBeInTheDocument()
    })
  })

  it("should call createTask on submit with valid data", async () => {
    const onClose = jest.fn()
    render(<TaskForm isOpen={true} onClose={onClose} />, { wrapper })

    fireEvent.change(screen.getByLabelText("Title *"), { target: { value: "New Test Task" } })
    
    fireEvent.mouseDown(screen.getByText('Select a folder').closest('button'))
    await waitFor(() => screen.getByText('Work'))
    fireEvent.click(screen.getByText("Work"))

    fireEvent.click(screen.getByText("Create Task"))

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith({
        title: "New Test Task",
        description: "",
        status: "todo",
        priority: "medium",
        tags: [],
        folderId: "1",
      })
      expect(onClose).toHaveBeenCalled()
    })
  })

  it("should call updateTask on submit in edit mode", async () => {
    const onClose = jest.fn()
    render(<TaskForm isOpen={true} onClose={onClose} task={sampleTask} />, { wrapper })

    fireEvent.change(screen.getByLabelText("Title *"), { target: { value: "Updated Task Title" } })
    fireEvent.click(screen.getByText("Update Task"))

    await waitFor(() => {
      expect(mockUpdateTask).toHaveBeenCalledWith("task-1", {
        title: "Updated Task Title",
        description: "This is a task",
        status: "todo",
        priority: "medium",
        folderId: "1",
        tags: ["testing"],
      })
      expect(onClose).toHaveBeenCalled()
    })
  })

  it("should add and remove tags", async () => {
    render(<TaskForm isOpen={true} onClose={() => {}} />, { wrapper })
    const tagInput = screen.getByPlaceholderText("Add a tag")

    fireEvent.change(tagInput, { target: { value: "new-tag" } })
    fireEvent.keyPress(tagInput, { key: "Enter", code: "Enter", charCode: 13 })

    const badge = await screen.findByText("new-tag")
    expect(badge).toBeInTheDocument()

    const removeButton = badge.nextSibling
    if (removeButton) {
      fireEvent.click(removeButton)
    }
    
    expect(screen.queryByText("new-tag")).not.toBeInTheDocument()
  })

  it("should call onClose when the cancel button is clicked", () => {
    const onClose = jest.fn()
    render(<TaskForm isOpen={true} onClose={onClose} />, { wrapper })

    fireEvent.click(screen.getByText("Cancel"))
    expect(onClose).toHaveBeenCalled()
  })

  it("should handle pinning a task", async () => {
    const onClose = jest.fn()
    render(<TaskForm isOpen={true} onClose={onClose} />, { wrapper })

    fireEvent.change(screen.getByLabelText("Title *"), { target: { value: "Pinned Task" } })
    
    fireEvent.mouseDown(screen.getByText('Select a folder').closest('button'))
    await waitFor(() => screen.getByText('Work'))
    fireEvent.click(screen.getByText("Work"))

    fireEvent.click(screen.getByLabelText("Pin this task"))

    fireEvent.click(screen.getByText("Create Task"))

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith(expect.objectContaining({
        title: "Pinned Task",
        pinned: true,
      }))
    })
  })
})
