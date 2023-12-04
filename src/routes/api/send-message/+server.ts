import { posts, db } from '$lib/db';
import { json } from '@sveltejs/kit';
import filter from 'leo-profanity';
import { _listeners } from '../../events/messages/+server.js';
// import type { } from "sveltekit-sse"

export async function POST({ request }) {
    const requestData = await request.json();

    const censored = filter.clean(requestData.message)

    const message = {
        id: Date.now().toString(),
        content: censored,
        timestamp: Date.now()
    };

    db.data.posts.push(message);

    db.write();

    _listeners.forEach((emit, index) => {
        try {
            emit(JSON.stringify(message));
        } catch (error) {
            if (error.code === 'ERR_INVALID_STATE') {
                // Remove the emit function from the _listeners array
                _listeners.splice(index, 1);
            } else {
                throw error;
            }
        }
    });


    return json({ message: message, count: posts.size().value() })
}



