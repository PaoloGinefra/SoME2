importScripts('../Scripts/Automata/SynchWordFinder.js');
onmessage = message => {
    postMessage(ShortestWord(message.data)[0])
};