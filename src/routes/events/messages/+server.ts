import { event } from 'sveltekit-sse'
import { v4 as uuidv4 } from 'uuid';

export let _listeners = {}

/**
 * Function to delay the execution of the next line of code
 * @param {number} milliseconds - The number of milliseconds to delay
 * @returns {Promise} - Returns a promise that resolves after the specified delay
 */
function delay(milliseconds: number): Promise<void> {
  return new Promise(function run(res) {
    setTimeout(res, milliseconds)
  })
}


export function GET() {
  // Generating a unique user id
  let userId: string = uuidv4();

  return event(async function run(emit) {
    // Store the emit function in _listeners object with userId as key
    _listeners[userId] = emit;

    // Send userId
    emit(JSON.stringify({ userId }))

    while (true) {
      await delay(2000)
    }
  }).toResponse()
}