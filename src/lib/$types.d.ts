export interface Post {
    id: string;
    content: string;
    timestamp: number;
}

export interface User {
    username: string;
    password: string;
    id: string;
}

export interface Schema {
    posts: Post[];
    users: User[];
}