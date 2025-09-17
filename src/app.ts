import { v4 as uuidV4 } from "uuid";
import type { StatusFilter, Task } from "./models/Task";
import { TaskService } from "./services/TaskService";

const form = document.getElementById("taskForm") as HTMLFormElement;
const taskTitle = document.getElementById("taskTitle") as HTMLInputElement;
const taskDescription = document.getElementById("taskDescription") as HTMLInputElement;
const resultDiv = document.getElementById("result") as HTMLDivElement;
const searchInput = document.getElementById("search-dropdown") as HTMLInputElement;
const dropdownBtn = document.getElementById("dropdown-button") as HTMLButtonElement;
const dropdownMenu = document.getElementById("dropdown") as HTMLDivElement;
const dropdownLabel = document.getElementById("dropdown-label") as HTMLSpanElement;


const taskService = new TaskService();

const filterState = {
    query: "",
    status: "all" as StatusFilter,
};

// fct qui cree une tâche
function createTask(task: Task): HTMLDivElement {
    const div = document.createElement("div");
    // creation du HTML de la tâche avec 
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

    <form class="edit-form px-6 py-6 grid gap-4 hidden ">
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
       <textarea
    required
    rows="4"
    class="w-full resize-y rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-violet-300/60 focus:border-violet-400 transition"
    name="description"
  ></textarea>
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

    // select la checkbox cree dans la carte de la liste des tâches , 
    const checkbox = div.querySelector(".task-checkbox") as HTMLInputElement;
    //au changement , utilisation de la methode updateById avec l'Id , et le status
    checkbox.addEventListener("change", () => {
        taskService.updateById(task.id, { status: checkbox.checked ? "done" : "todo" });
        renderTasks();
    });

    const editBtn = div.querySelector(".edit-button") as HTMLButtonElement;
    const editForm = div.querySelector(".edit-form") as HTMLFormElement;
    const titleInput = editForm.querySelector('input[name="title"]') as HTMLInputElement;
    const descInput = editForm.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
    const cancelBtn = div.querySelector(".cancel-edit") as HTMLButtonElement;

    //au click du bouton le form modif souvre 
    editBtn.addEventListener("click", () => {
        titleInput.value = task.title;
        descInput.value = task.description;
        editForm.classList.toggle("hidden");
    });

    //au click du bouton le form modif se ferme 
    cancelBtn.addEventListener("click", () => {
        editForm.classList.add("hidden");
    });

    //au click du bouton le form submit les modifications   
    editForm.addEventListener("submit", (ev) => {
        ev.preventDefault();

        const newTitle = titleInput.value.trim();
        const newDesc = descInput.value.trim();
        if (!newTitle || !newDesc) return;
        //utilisation de la fonction pour modifier le titre et la description 
        taskService.updateById(task.id, { title: newTitle, description: newDesc });
        renderTasks();
    });

    const deleteBtn = div.querySelector(".delete-button") as HTMLButtonElement;
    deleteBtn.addEventListener("click", () => {
        taskService.deleteById(task.id);
        alert("Votre tâche a été supprimé");
        renderTasks();
    });

    return div;
}

//fonction qui retourne la tache avec un argument tableau de tache optionnel 
function renderTasks(list?: Task[]) {
    resultDiv.innerHTML = "";
    //initiliaser la liste de tache si list existe list sinon recupere la list de toute les taches avec getAllTasks
    let tasks = list ?? taskService.getAllTasks();

    // affichege si pas de taches 
    if (tasks.length === 0) {
        resultDiv.innerHTML = `<div class="p-6 text-center text-slate-500">Aucune tâche pour le moment.</div>`;
        return;
    }

    // trier les taches terminee a la fin de la liste 
    // les taches todo sont les done
    tasks = tasks.sort((a,b)=> {
       if (a.status === b.status) return 0;
        return a.status === "todo" ? -1 : 1;
    });
    //boucle pour afficher les taches dans une div 
    tasks.forEach((task) => {
        resultDiv.appendChild(createTask(task));
    });
}

//creation de la tache au click sur le bouton submit 
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = uuidV4();
    const titleValue = taskTitle.value.trim();
    const descriptionValue = taskDescription.value.trim();
    if (!titleValue || !descriptionValue) return;
    //par defaut mettre le status todo
    taskService.add(id, titleValue, descriptionValue, "todo");

    form.reset();
    renderTasks();
});


function applyFilters() {
    const allTasks = taskService.getAllTasks();
    //teste si il ya quelque chose dans l'input 
    // si il ya quelque chose dans l'input  filtre si cest inclus dans le titre ou la description 
    const textFiltered = filterState.query
        ? allTasks.filter(t =>
            t.title.toLowerCase().includes(filterState.query) ||
            t.description.toLowerCase().includes(filterState.query)
        )
        : allTasks;

    //teste si il status cest all alors on filtre pas plus loin 
    // sinon on filtre encore avec le status 
    const statusFiltered =
        filterState.status === "all"
            ? textFiltered
            : textFiltered.filter(t => t.status === filterState.status);

    renderTasks(statusFiltered);
}

//ecoute si il ya un changement dans l'input 
searchInput.addEventListener("input", () => {
    filterState.query = searchInput.value.trim().toLowerCase();
    applyFilters();
});




///////////////Filtres /////////////
dropdownBtn.addEventListener("click", (e) => {
    //empeche la propagation sur tous le doc
    e.stopPropagation();
    //au click sur le bouton le hidden devient false 
    dropdownMenu.classList.toggle("hidden");

});
// ecoute du click partout sur la page si un clique ferme le menu donc rajouter hidden 
document.addEventListener("click", () => {
    if (!dropdownMenu.classList.contains("hidden")) {
        dropdownMenu.classList.add("hidden");
    }
});

// ecoute du click a linterieur du menu 
dropdownMenu.addEventListener("click", (e) => {
    //recupere l'element sur lequel on a clique 
    const target = e.target as HTMLElement;
    //recupere la valeur associée au bouton via data-value.
    const value = (target.getAttribute("data-value")) as StatusFilter;
    //on met a jour le texte du bouton 
    dropdownLabel.textContent = target.textContent?.trim();
    //on change l'etat du filtre
    filterState.status = value;
    //on applique les filtres
    applyFilters();
    dropdownMenu.classList.add("hidden");
});




//rendre les tâches par defaut 
renderTasks();
