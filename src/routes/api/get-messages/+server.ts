import { posts } from '$lib/db';
import { json } from '@sveltejs/kit';
import _ from 'lodash';

export async function GET({ url }) {
    const offset = Number(url.searchParams.get("offset"));
    const limit = Number(url.searchParams.get("limit"));

    let sortedAndSliced = posts
        .orderBy(['timestamp'], ['desc'])
        .slice(offset)
        .take(limit)
        .value();

    return json({ posts: sortedAndSliced, count: posts.size().value() });
}