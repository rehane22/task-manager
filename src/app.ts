import type { Task } from "./models/Task";
import { TaskService } from "./services/TaskService";

const form = document.getElementById("taskForm") as HTMLFormElement;
const taskTitle = document.getElementById("taskTitle") as HTMLInputElement;
const taskDescription = document.getElementById("taskDescription") as HTMLInputElement;
const resultDiv = document.getElementById("result") as HTMLDivElement;


const taskService = new TaskService();
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const titleValue = taskTitle.value.trim();
    const descriptionValue = taskDescription.value.trim();
    taskService.add(titleValue, descriptionValue, "todo")

    renderTasks();
})

function renderTasks() {
  resultDiv.innerHTML = "";
  const tasks: Task[] = taskService.getAllTasks();

  tasks.forEach((task, index) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <label class="group flex items-start gap-3 p-4 cursor-pointer">
        <input type="checkbox" ${task.status === "done" ? "checked" : ""} 
               class="task-checkbox mt-1 h-5 w-5 rounded border-slate-300 text-violet-600 focus:ring-violet-400" />
        <div class="flex-1">
          <p class="font-medium text-slate-800 group-has-[:checked]:line-through group-has-[:checked]:text-slate-400">
            ${task.title}
          </p>
          <p class="text-sm text-slate-500 group-has-[:checked]:text-slate-400">${task.description}</p>
        </div>
        <div class="flex gap-4">
          <button type="button" class="edit-button">
           <svg class="w-6 h-6 text-gray-800 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
        </svg>

          </button>
          <button type="button" class="delete-button">
            <svg class="w-6 h-6 text-gray-800 dark:text-red-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
            </svg>

          </button>
        </div>
      </label>

      <form class="edit-form px-6 py-6 grid gap-4 hidden">
        <div class="grid gap-2">
          <label class="text-sm font-medium text-slate-700">Titre</label>
          <input
            type="text" required
            class="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-violet-300/60 focus:border-violet-400 transition"
            name="title"
          />
        </div>
        <div class="grid gap-2">
          <label class="text-sm font-medium text-slate-700">Description</label>
          <input
            type="text" required
            class="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-violet-300/60 focus:border-violet-400 transition"
            name="description"
          />
        </div>
        <div class="flex items-center justify-end gap-3 pt-2">
          <button type="button" class="cancel-edit inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold border border-slate-200 hover:bg-slate-50">
            Annuler
          </button>
          <button type="submit"
            class="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-300/60 transition">
            Confirmer
          </button>
        </div>
      </form>
    `;

    const checkbox = div.querySelector(".task-checkbox") as HTMLInputElement;
    checkbox.addEventListener("change", () => {
      taskService.update(index, { status: checkbox.checked ? "done" : "todo" });
      renderTasks();
    });

    const editBtn = div.querySelector(".edit-button") as HTMLButtonElement;
    const editForm = div.querySelector(".edit-form") as HTMLFormElement;
    const titleInput = editForm.querySelector('input[name="title"]') as HTMLInputElement;
    const descInput = editForm.querySelector('input[name="description"]') as HTMLInputElement;

    editBtn.addEventListener("click", () => {
      titleInput.value = task.title;
      descInput.value = task.description;
      editForm.classList.toggle("hidden");
    });

    const cancelBtn = div.querySelector(".cancel-edit") as HTMLButtonElement;
    cancelBtn.addEventListener("click", () => {
      editForm.classList.add("hidden");
    });

    editForm.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const newTitle = titleInput.value.trim();
      const newDesc = descInput.value.trim();
      if (!newTitle || !newDesc) return;

      taskService.update(index, { title: newTitle, description: newDesc });
      renderTasks();
    });

    const deleteBtn = div.querySelector(".delete-button") as HTMLButtonElement;
    deleteBtn.addEventListener("click", () => {
      taskService.delete(index);
      alert("Votre tâche a été supprimé")
      renderTasks();
    });

    resultDiv.appendChild(div);
  });
}

renderTasks();
