namespace App {
    // Project State Management
    type Listener<T> = (items: T[]) => void;

    class State<T> {
        protected listeners: Listener<T>[] = []; // List of listeners waiting for data changes

        // Method to add a listener that will be notified on project changes
        addListener(listenerFunction: Listener<T>) {
            this.listeners.push(listenerFunction);
        }
    }

    export class ProjectState extends State<Project> {
        private projects: Project[] = []; // Array to store projects
        private static instance: ProjectState; // Singleton instance for project state

        private constructor() {
            super();
        }

        // Singleton pattern to ensure only one instance of ProjectState
        static getInstance() {
            if (this.instance) return this.instance;
            this.instance = new ProjectState();
            return this.instance;
        }

        // Method to add a new project and notify all listeners
        addProject(title: string, description: string, numOfPeople: number) {
            const newProject = new Project(
                Math.random().toString(),
                title,
                description,
                numOfPeople,
                ProjectStatus.Active
            );
            this.projects.push(newProject);
            this.updateListeners();
        }

        moveProject(projectId: string, newStatus: ProjectStatus) {
            const project = this.projects.find(prj => prj.id === projectId);
            if (project && project.status !== newStatus) {
                project.status = newStatus;
            }
            this.updateListeners();
        }

        private updateListeners() {
            // Notify all listeners with the updated project list
            for (const listenerFunction of this.listeners) {
                listenerFunction(this.projects.slice());
            }
        }
    }

    // Get the singleton instance of ProjectState
    export const projectState = ProjectState.getInstance();
}