import { posts as postsData } from '$lib/db';
import { posts } from '$lib/stores/posts';
import _ from 'lodash';

export async function load() {

    let sortedAndSliced = postsData
        .orderBy(['timestamp'], ['desc'])
        .slice(0)
        .take(10)
        .value();

    posts.set(sortedAndSliced);

    return { count: postsData.size().value() };
}
