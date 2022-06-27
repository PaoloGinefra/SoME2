const Automaton =  [
    [7, 11],
    [5, 3],
    [1, 3],
    [6, 0],
    [5, 1],
    [7, 6],
    [0, 7],
    [8, 11],
    [9, 5],
    [5, 4],
    [9, 8],
    [10, 8],
]

function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

function Delta(Automaton, state, move){
    return Automaton[state][move]
}

function DeltaPrime(Automaton, states, move){
    var outSet = new Set();
    states.forEach(state => {
        outSet.add(Delta(Automaton, state, move))
    });
    var outArray = Array.from(outSet);
    return outArray.sort((a, b) => a - b);
}

function Neighbors(Automaton, States, k){
    var neighbors = [];
    for(var i = 0; i < k; i++){
        neighbors.push(DeltaPrime(Automaton, States, i));
    }
    return neighbors;
}

function scoreArgMin(Open, scores){
    var argMin = Open[0];
    var minScore = scores[argMin];
    const arr = Open.slice(1)
    arr.forEach(el => {
        var score = scores[el];
        if(score < minScore){
            minScore = score;
            argMin = el;
        }
    });
    return argMin;
}

function BuildPath(CameFrom, node){
    if (node in CameFrom)
        return BuildPath(CameFrom, CameFrom[node][1]) + CameFrom[node][0].toString();
    else
        return "";
}

function H_Dis(state){
    return state.length
}

function G_dis(state1, state2){
    return 1;
}

function ShortestWord(Automaton){
    const k = Automaton[0].length; //the number of letters
    const nStates = Automaton.length
    const initialState = Array.from(Array(nStates).keys());

    var steps = 0;

    var Open = [initialState];
    var Closed = [];

    var GScores = {}; GScores[initialState] = 0;
    var HScores = {}; HScores[initialState] = H_Dis(initialState);
    var FScores = {}; FScores[initialState] = HScores[initialState];

    var cameFrom = {}
    
    while(Open.length != 0){
        var current = scoreArgMin(Open, FScores);

        if(current.length === 1)
            return [BuildPath(cameFrom, current), current[0], steps];

        Open = Open.filter(e => e != current);
        Closed.push(current);

        const Neighs = Neighbors(Automaton, current, k);

        Neighs.forEach((n, i) => {
            if (!Closed.some(el => arrayEquals(el, n))){
                var tentativeScore = GScores[current] + G_dis(current, n);

                if (!Open.some(el => arrayEquals(el, n))){
                    Open.push(n);
                    var betterTentative = true;
                }
                else if(tentativeScore < GScores[n]){
                    var betterTentative = true;
                }
                else {
                    var betterTentative = false;
                }

                if(betterTentative){
                    cameFrom[n] = [i, current];

                    GScores[n] = tentativeScore;
                    HScores[n] = H_Dis(n);
                    FScores[n] = GScores[n] + HScores[n];
                }
                
            }
        });
        steps++;
    }
    return "Failure"
}