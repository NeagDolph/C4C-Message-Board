import db from '$lib/db';
import { json } from '@sveltejs/kit';

export async function GET({ request }) {
    let posts = db.data.posts ?? []

    return json({ posts })
}



