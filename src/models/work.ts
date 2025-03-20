export class WorkProject {
    constructor(
        public id: number,
        public title: string,
        public description: string,
        public imageUrl: string,
        public techStack: string[],
        public projectUrl?: string,
        public githubUrl?: string,
    ){}
  }