export interface Post {
    id: string;
    content: string;
    timestamp: number;
}

export interface Schema {
    posts: Post[];
}