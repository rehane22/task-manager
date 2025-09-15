export interface Task {
    id : string, 
    title: string,
    description: string,
    status: "todo" | "done"
}

export type StatusFilter = "all" | "todo" | "done";
