define("components/base-component", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Component = void 0;
    // Component Base Class
    class Component {
        constructor(templateId, hostElementId, insertAtStart, newElementId) {
            this.templateElement = document.getElementById(templateId);
            this.hostElement = document.getElementById(hostElementId);
            const importedNode = document.importNode(this.templateElement.content, true);
            this.element = importedNode.firstElementChild;
            if (newElementId) {
                this.element.id = newElementId;
            }
            this.attach(insertAtStart); // Attach element to the DOM
        }
        attach(insertAtBeginning) {
            this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.element);
        }
    }
    exports.Component = Component;
});
define("models/project", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Project = exports.ProjectStatus = void 0;
    // Enum: Active or Finished
    var ProjectStatus;
    (function (ProjectStatus) {
        ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
        ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
    })(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
    // Project class to define the project structure
    class Project {
        constructor(id, title, description, people, status) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.people = people;
            this.status = status;
        }
    }
    exports.Project = Project;
});
define("state/project", ["require", "exports", "models/project", "models/project"], function (require, exports, project_js_1, project_js_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.projectState = exports.ProjectState = void 0;
    class State {
        constructor() {
            this.listeners = []; // List of listeners waiting for data changes
        }
        // Method to add a listener that will be notified on project changes
        addListener(listenerFunction) {
            this.listeners.push(listenerFunction);
        }
    }
    class ProjectState extends State {
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
            const newProject = new project_js_1.Project(Math.random().toString(), title, description, numOfPeople, project_js_2.ProjectStatus.Active);
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
    exports.ProjectState = ProjectState;
    // Get the singleton instance of ProjectState
    exports.projectState = ProjectState.getInstance();
});
define("util/validation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validate = validate;
    // Validation function for inputs
    function validate(validatableInput) {
        let isValid = true;
        if (validatableInput.required) {
            isValid = isValid && validatableInput.value.toString().trim().length !== 0;
        }
        if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
            isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
        }
        if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
            isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
        }
        if (validatableInput.min != null && typeof validatableInput.value === 'number') {
            isValid = isValid && validatableInput.value >= validatableInput.min;
        }
        if (validatableInput.max != null && typeof validatableInput.value === 'number') {
            isValid = isValid && validatableInput.value <= validatableInput.max;
        }
        return isValid;
    }
});
define("components/project-input", ["require", "exports", "components/base-component", "state/project", "util/validation"], function (require, exports, base_component_js_1, project_js_3, validation_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectInput = void 0;
    // Class for handling Project Input UI (Form for adding new projects)
    class ProjectInput extends base_component_js_1.Component {
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
            if (!(0, validation_js_1.validate)(titleValidatable) ||
                !(0, validation_js_1.validate)(descriptionValidatable) ||
                !(0, validation_js_1.validate)(peopleValidatable)) {
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
                project_js_3.projectState.addProject(title, desc, people); // Add new project
                this.clearInputs(); // Clear the form inputs
            }
        }
    }
    exports.ProjectInput = ProjectInput;
});
define("models/drag-drop", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("components/project-item", ["require", "exports", "components/base-component"], function (require, exports, base_component_js_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectItem = void 0;
    // ProjectItem Class
    class ProjectItem extends base_component_js_2.Component {
        get persons() {
            if (this.project.people === 1)
                return '1 Person';
            return `${this.project.people} Persons`;
        }
        constructor(hostId, project) {
            super('single-project', hostId, false, project.id);
            this.project = project;
            this.configure();
            this.renderContent();
        }
        dragStartHandler(event) {
            event.dataTransfer.setData('text/plain', this.project.id);
            event.dataTransfer.effectAllowed = 'move';
        }
        dragEndHandler(_) {
            console.log("drag end");
        }
        configure() {
            this.element.addEventListener('dragstart', this.dragStartHandler.bind(this));
            this.element.addEventListener('dragend', this.dragEndHandler.bind(this));
        }
        ;
        renderContent() {
            this.element.querySelector('h2').textContent = this.project.title;
            this.element.querySelector('h3').textContent = this.persons + ' assigned.';
            this.element.querySelector('p').textContent = this.project.description;
        }
        ;
    }
    exports.ProjectItem = ProjectItem;
});
define("components/project-list", ["require", "exports", "components/base-component", "models/project", "state/project", "components/project-item"], function (require, exports, base_component_js_3, project_js_4, project_js_5, project_item_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectList = void 0;
    // Class for handling Project List
    class ProjectList extends base_component_js_3.Component {
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
            project_js_5.projectState.moveProject(projId, this.type === 'active' ? project_js_4.ProjectStatus.Active : project_js_4.ProjectStatus.Finished);
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
            project_js_5.projectState.addListener((projects) => {
                const relevantProjects = projects.filter(prj => {
                    if (this.type === 'active') {
                        return prj.status === project_js_4.ProjectStatus.Active;
                    }
                    return prj.status === project_js_4.ProjectStatus.Finished;
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
                new project_item_js_1.ProjectItem(this.element.querySelector('ul').id, projectItem);
            }
        }
    }
    exports.ProjectList = ProjectList;
});
define("app", ["require", "exports", "components/project-input", "components/project-list"], function (require, exports, project_input_js_1, project_list_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Create instances of the classes for input and project lists
    const projectInput = new project_input_js_1.ProjectInput();
    const activeProjects = new project_list_js_1.ProjectList('active');
    const finishedProjects = new project_list_js_1.ProjectList('finished');
});
//# sourceMappingURL=bundle.js.map