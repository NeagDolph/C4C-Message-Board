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

    let listenerEntries = Object.entries(_listeners);

    listenerEntries.forEach(([userId, emit], index) => {

        let emitData = {
            message: message,
            userId: userId,
            sender: requestData.userId
        }
        try {
            emit(JSON.stringify(emitData));
        } catch (error) {
            if (error.code === 'ERR_INVALID_STATE') {
                // Remove the emit function from the _listeners array
                delete _listeners[userId]
            } else {
                throw error;
            }
        }
    });


    return json({ message: message, count: posts.size().value() })
}



