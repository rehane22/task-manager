import type { Task } from "../models/Task";

export class TaskService {
    // ajouter une tache dans le local Storage 
    add(id : string, title: string, description: string, status: "todo" | "done"): Task {
        const newTask: Task = { id ,title, description, status }
        //recuperer les taches deja dans le localStorage 
        const stored = localStorage.getItem("tasks");
        //verfie si il deja dans le local storage si oui le parse sinon tableau vide
        const currentTasks: Task[] = stored ? JSON.parse(stored) : [];
        //on rajoute la nouvelle tâche
        currentTasks.push(newTask)
        // on rajoute le nouveau tableau dans le localStorage
        localStorage.setItem("tasks", JSON.stringify(currentTasks));
        return newTask;
    }

    getAllTasks(): Task[] {
         //recuperer les taches deja dans le localStorage 
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
//supprimer une tache 
    delete(index: number): void {
        const tasksInStorage = localStorage.getItem("tasks");
        if (!tasksInStorage) return;
        const currentTasks: Task[] = JSON.parse(tasksInStorage);
        currentTasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(currentTasks));
    }
//modifier une tâche
    update(index: number, updates: Partial<Task>): void {
        const tasksInStorage = localStorage.getItem("tasks");
        if (!tasksInStorage) return;

        const tasks: Task[] = JSON.parse(tasksInStorage);
        if (index < 0 || index >= tasks.length) return;

        //fusionne l'ancienne tache et les champs qui ont été mis à jour
        tasks[index] = { ...tasks[index], ...updates };
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

//supprimer une tache par l'id 
    deleteById(id: string): void {
        //recupere toutes les tâches et garde uniquement les tâches qui ne correspond a la tache qu'on veut supp
        const tasks = this.getAllTasks().filter(task => task.id !== id);

        //on rajoute le nouveau tableau dans le local storage 
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    updateById(id: string, updates: Partial<Task>): void {
        //recupere toutes les tâches et parcourt le tableau , 
        // si l'id correspond 
        // on crée un nouvel objet en copiant la tâche 
        // puis en écrasant les champs avec updates grâce 
        // sinon on renvoie la tache 
        const tasks = this.getAllTasks().map(task => task.id === id ? { ...task, ...updates } : task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
}
