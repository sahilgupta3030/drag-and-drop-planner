/// <reference path="models/drag-drop.ts"/>
/// <reference path="models/project.ts"/>
/// <reference path="state/project.ts"/>
/// <reference path="util/validation.ts"/>
/// <reference path="components/project-input.ts"/>
/// <reference path="components/project-item.ts"/>


/// <reference path="components/base-component.ts"/>
/// <reference path="components/project-list.ts"/>

namespace App {

    // Create instances of the classes for input and project lists
    const projectInput = new ProjectInput();
    const activeProjects = new ProjectList('active');
    const finishedProjects = new ProjectList('finished');
}
