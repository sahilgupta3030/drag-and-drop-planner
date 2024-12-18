/// <reference path="base-component.ts" />
/// <reference path="../state/project.ts" />
/// <reference path="../models/drag-drop.ts" />
/// <reference path="../models/project.ts" />

namespace App {
    // Class for handling Project List
    export class ProjectList extends Component<HTMLDivElement, HTMLElement>
        implements DragTarget {
        assignedProjects: Project[];

        constructor(private type: 'active' | 'finished') {
            super('project-list', 'app', false, `${type}-projects`);
            this.assignedProjects = [];

            this.configure();
            this.renderContent();
        }

        dragOverHandler(event: DragEvent): void {
            if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
                event.preventDefault();
                const listElement = this.element.querySelector('ul')!;
                listElement.classList.add('droppable'); // Add drop target style
            }
        }

        dropHandler(event: DragEvent): void {
            const projId = event.dataTransfer!.getData('text/plain');
            projectState.moveProject(projId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished)
            // const listElement = this.element.querySelector('ul')!;
            // listElement.classList.remove('droppable'); // Remove drop target style
        }

        dragLeaveHandler(_: DragEvent): void {
            const listElement = this.element.querySelector('ul')!;
            listElement.classList.remove('droppable'); // Remove drop target style
        }


        configure() {
            this.element.addEventListener('dragover', this.dragOverHandler.bind(this));
            this.element.addEventListener('dragleave', this.dragLeaveHandler.bind(this));
            this.element.addEventListener('drop', this.dropHandler.bind(this));

            // Listen for updates from ProjectState and update the assigned projects
            projectState.addListener((projects: Project[]) => {
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
            this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
            this.element.querySelector('ul')!.id = listId;
        }

        // Renders the list of projects in the UI
        private renderProjects() {
            const listElement = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
            // Display each project title in a list item
            listElement.innerHTML = '';
            for (const projectItem of this.assignedProjects) {
                new ProjectItem(this.element.querySelector('ul')!.id, projectItem)
            }
        }
    }
}