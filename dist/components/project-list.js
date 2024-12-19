import { Component } from "./base-component.js";
import { ProjectStatus } from "../models/project.js";
import { projectState } from "../state/project.js";
import { ProjectItem } from "./project-item.js";
// Class for handling Project List
export class ProjectList extends Component {
    constructor(type) {
        super('project-list', 'app', false, `${type}-projects`);
        this.type = type;
        this.assignedProjects = [];
        this.configure();
        this.renderContent();
    }
    dragOverHandler(event) {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault();
            const listElement = this.element.querySelector('ul');
            listElement.classList.add('droppable'); // Add drop target style
        }
    }
    dropHandler(event) {
        const projId = event.dataTransfer.getData('text/plain');
        projectState.moveProject(projId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
        // const listElement = this.element.querySelector('ul')!;
        // listElement.classList.remove('droppable'); // Remove drop target style
    }
    dragLeaveHandler(_) {
        const listElement = this.element.querySelector('ul');
        listElement.classList.remove('droppable'); // Remove drop target style
    }
    configure() {
        this.element.addEventListener('dragover', this.dragOverHandler.bind(this));
        this.element.addEventListener('dragleave', this.dragLeaveHandler.bind(this));
        this.element.addEventListener('drop', this.dropHandler.bind(this));
        // Listen for updates from ProjectState and update the assigned projects
        projectState.addListener((projects) => {
            const relevantProjects = projects.filter(prj => {
                if (this.type === 'active') {
                    return prj.status === ProjectStatus.Active;
                }
                return prj.status === ProjectStatus.Finished;
            });
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
    }
    // Sets the content (header and list ID) of the project list
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('h2').textContent = this.type.toUpperCase() + ' PROJECTS';
        this.element.querySelector('ul').id = listId;
    }
    // Renders the list of projects in the UI
    renderProjects() {
        const listElement = document.getElementById(`${this.type}-projects-list`);
        // Display each project title in a list item
        listElement.innerHTML = '';
        for (const projectItem of this.assignedProjects) {
            new ProjectItem(this.element.querySelector('ul').id, projectItem);
        }
    }
}
//# sourceMappingURL=project-list.js.map