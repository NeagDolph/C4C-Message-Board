import db from '$lib/db';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    const message = {
        id: Date.now().toString(),
        content: await request.json(),
        timestamp: Date.now()
    };

    db.data.posts.push(message);

    db.write();

    return json({ message: message })
}



