/**
 * Helper to get frame state
*/
export function getFrameState(urlEncodedState: string) {
    return JSON.parse(decodeURIComponent(urlEncodedState))
}