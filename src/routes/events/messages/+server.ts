import { event } from 'sveltekit-sse'

export let _listeners = []

/**
 * @param {number} milliseconds
 * @returns
 */
function delay(milliseconds) {
  return new Promise(function run(res, rej) {
    setTimeout(res, milliseconds)
  })
}



export function GET() {
  console.log("GET");
  return event(async function run(emit) {
    // while (true) {
    //   console.log("EMITTING")
    //   emit(`helloooooo`)
    //   await delay(2000)
    // }
    _listeners.push(emit)
  }).toResponse()
}