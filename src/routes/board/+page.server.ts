import db from '$lib/db';
import { posts } from '$lib/stores/posts';

export async function load() {
    let postsData = db.data.posts ?? [];

    return {
        props: {
            posts: postsData
        }
    };
}
