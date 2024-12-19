import { Component } from "./base-component.js";
import { projectState } from "../state/project.js";
import { validate } from "../util/validation.js";
// Class for handling Project Input UI (Form for adding new projects)
export class ProjectInput extends Component {
    constructor() {
        super('project-input', 'app', true, 'user-input');
        // Get references to form input elements
        this.titleInputElement = this.element.querySelector('#title');
        this.descriptionInputElement = this.element.querySelector('#description');
        this.peopleInputElement = this.element.querySelector('#people');
        this.configure();
    }
    // Configures event listeners for the form
    configure() {
        this.element.addEventListener('submit', this.submitHandler.bind(this));
    }
    renderContent() { }
    ;
    // Gathers and validates user input from the form
    gatherUserInput() {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;
        const titleValidatable = {
            value: enteredTitle,
            required: true
        };
        const descriptionValidatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        };
        const peopleValidatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
        };
        // If validation fails, alert the user and return
        if (!validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)) {
            alert('Invalid Input! Please Enter again..');
            return;
        }
        else {
            // Return validated inputs
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }
    // Clears the input fields
    clearInputs() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }
    // Handles the form submission and adds the new project to the state
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.gatherUserInput(); // Gather input
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            projectState.addProject(title, desc, people); // Add new project
            this.clearInputs(); // Clear the form inputs
        }
    }
}
//# sourceMappingURL=project-input.js.map