// Enum: Active or Finished
export enum ProjectStatus {
    Active,
    Finished,
}

// Project class to define the project structure
export class Project {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: ProjectStatus,
    ) { }
}
