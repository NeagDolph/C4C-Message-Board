import { posts, db } from '$lib/db';
import { json } from '@sveltejs/kit';
import filter from 'leo-profanity';
import { _listeners } from '../../events/+server.js';

export async function POST({ request }) {
    const requestData = await request.json();

    const censored = filter.clean(requestData.message)

    // Return error if message is empty.
    if (censored.length <= 0) {
        return json({
            status: 400,
            message: "The message cannot be empty."
        });
    }

    // Return error if message length is too long.
    if (censored.length > 128) {
        return json({
            status: 400,
            message: "The message cannot be longer than 128 characters."
        });
    }

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

        // Do not send message updates back to user who sent the message
        if (emitData.sender === emitData.userId) return

        try {
            emit(JSON.stringify(emitData));
        } catch (error: any) {
            if (error.code === 'ERR_INVALID_STATE') {
                // Remove the emit function from _listeners if invalid
                delete _listeners[userId]
            } else {
                throw error;
            }
        }
    });


    return json({ message: message, count: posts.size().value() })
}