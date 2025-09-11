import type { Task } from "../models/Task";



export class TaskService {
    private tasks: Task[] = [];

    add(title: string, description: string, status: "todo" | "done"): Task {
        const newTask: Task = { title, description, status }
        const stored = localStorage.getItem("tasks");
        const currentTasks: Task[] = stored ? JSON.parse(stored) : [];
        currentTasks.push(newTask)
        localStorage.setItem("tasks", JSON.stringify(currentTasks));
        return newTask;
    }

    getAllTasks(): Task[] {
        const tasksInStorage = localStorage.getItem("tasks");
        if (tasksInStorage) {
            try {
                const parsedTasks: Task[] = JSON.parse(tasksInStorage);
                return parsedTasks;
            } catch (error) {
                console.error("Erreur de parsing JSON:", error);
                return [];
            }
        }

        return [];
    }

    delete(index: number): void {
        const tasksInStorage = localStorage.getItem("tasks");
        if (!tasksInStorage) return;
        const currentTasks: Task[] = JSON.parse(tasksInStorage);
        currentTasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(currentTasks));
    }

    update(index: number, updates: Partial<Task>): void {
        const tasksInStorage = localStorage.getItem("tasks");
        if (!tasksInStorage) return;

        const tasks: Task[] = JSON.parse(tasksInStorage);
        if (index < 0 || index >= tasks.length) return;

        tasks[index] = { ...tasks[index], ...updates };
        localStorage.setItem("tasks", JSON.stringify(tasks));

    }

}