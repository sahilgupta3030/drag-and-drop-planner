/// <reference path="base-component.ts" />
/// <reference path="../models/drag-drop.ts" />
/// <reference path="../models/project.ts" />

namespace App {
    // ProjectItem Class
    export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>
        implements Draggable {
        private project: Project;

        get persons() {
            if (this.project.people === 1)
                return '1 Person';
            return `${this.project.people} Persons`;
        }

        constructor(hostId: string, project: Project) {
            super('single-project', hostId, false, project.id);
            this.project = project;

            this.configure();
            this.renderContent();
        }

        dragStartHandler(event: DragEvent): void {
            event.dataTransfer!.setData('text/plain', this.project.id);
            event.dataTransfer!.effectAllowed = 'move';
        }

        dragEndHandler(_: DragEvent): void {
            console.log("drag end")
        }

        configure() {
            this.element.addEventListener('dragstart', this.dragStartHandler.bind(this))
            this.element.addEventListener('dragend', this.dragEndHandler.bind(this))
        };

        renderContent() {
            this.element.querySelector('h2')!.textContent = this.project.title;
            this.element.querySelector('h3')!.textContent = this.persons + ' assigned.';
            this.element.querySelector('p')!.textContent = this.project.description;
        };
    }
}