importScripts('./SynchWordFinder.js');

/**
 * Message is the automaton matrix
 */
onmessage = message => {
    postMessage(ShortestWord(message.data))
};