import { Project } from "../models/project.js";
import { ProjectStatus } from "../models/project.js";
class State {
    constructor() {
        this.listeners = []; // List of listeners waiting for data changes
    }
    // Method to add a listener that will be notified on project changes
    addListener(listenerFunction) {
        this.listeners.push(listenerFunction);
    }
}
export class ProjectState extends State {
    constructor() {
        super();
        this.projects = []; // Array to store projects
    }
    // Singleton pattern to ensure only one instance of ProjectState
    static getInstance() {
        if (this.instance)
            return this.instance;
        this.instance = new ProjectState();
        return this.instance;
    }
    // Method to add a new project and notify all listeners
    addProject(title, description, numOfPeople) {
        const newProject = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.Active);
        this.projects.push(newProject);
        this.updateListeners();
    }
    moveProject(projectId, newStatus) {
        const project = this.projects.find(prj => prj.id === projectId);
        if (project && project.status !== newStatus) {
            project.status = newStatus;
        }
        this.updateListeners();
    }
    updateListeners() {
        // Notify all listeners with the updated project list
        for (const listenerFunction of this.listeners) {
            listenerFunction(this.projects.slice());
        }
    }
}
// Get the singleton instance of ProjectState
export const projectState = ProjectState.getInstance();
//# sourceMappingURL=project.js.map