export interface Technology {
    id: string;
    title: string;
    studied: boolean;
    deadline: Date;
    createdAt: Date;
    userId: string;
  }
  
  export interface User {
    id: string;
    name: string;
    username: string;
    technologies: Technology[];
  }
  