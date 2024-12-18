/// <reference path="base-component.ts" />
/// <reference path="../util/validation.ts" />
/// <reference path="../state/project.ts" />

namespace App {
    // Class for handling Project Input UI (Form for adding new projects)
    export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
        titleInputElement: HTMLInputElement;
        descriptionInputElement: HTMLInputElement;
        peopleInputElement: HTMLInputElement;

        constructor() {
            super('project-input', 'app', true, 'user-input');

            // Get references to form input elements
            this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
            this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
            this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

            this.configure();
        }

        // Configures event listeners for the form
        configure() {
            this.element.addEventListener('submit', this.submitHandler.bind(this));
        }

        renderContent() { };

        // Gathers and validates user input from the form
        private gatherUserInput(): [string, string, number] | void {
            const enteredTitle = this.titleInputElement.value;
            const enteredDescription = this.descriptionInputElement.value;
            const enteredPeople = this.peopleInputElement.value;

            const titleValidatable: Validatable = {
                value: enteredTitle,
                required: true
            };
            const descriptionValidatable: Validatable = {
                value: enteredDescription,
                required: true,
                minLength: 5
            };
            const peopleValidatable: Validatable = {
                value: +enteredPeople,
                required: true,
                min: 1,
                max: 5
            };

            // If validation fails, alert the user and return
            if (
                !validate(titleValidatable) ||
                !validate(descriptionValidatable) ||
                !validate(peopleValidatable)
            ) {
                alert('Invalid Input! Please Enter again..');
                return;
            } else {
                // Return validated inputs
                return [enteredTitle, enteredDescription, +enteredPeople];
            }
        }

        // Clears the input fields
        private clearInputs() {
            this.titleInputElement.value = '';
            this.descriptionInputElement.value = '';
            this.peopleInputElement.value = '';
        }

        // Handles the form submission and adds the new project to the state
        private submitHandler(event: Event) {
            event.preventDefault();
            const userInput = this.gatherUserInput(); // Gather input
            if (Array.isArray(userInput)) {
                const [title, desc, people] = userInput;
                projectState.addProject(title, desc, people); // Add new project
                this.clearInputs(); // Clear the form inputs
            }
        }
    }
}