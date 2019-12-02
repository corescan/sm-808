/**
 * drop-the-beat contains the main sequencing logic including
 * timing and the visual (console) output.
 */

const sequenceTimer = require('./sequenceTimers/sequenceTimeout');

/**
 * Generate the console output for each step of the sequence
 * @param {Object} seq
 * @param {Number} len 
 * 
 * @returns {Array<Array<String>>}
 */
function prepareConsoleOutput(seq, len) {
    /**
     * Grab the object keys for each "track".
     * Filter for sanity - see best practices for using Object.keys.
     */
    const track_keys = Object.keys(seq);

    let totalOutput = new Array(len);
    for (let idx=0; idx<len; idx++) {
        // the output for this step.
        let output = [];

        // push each active track name into the output array for this step.
        track_keys.forEach(key => {
            if (!!seq[key][idx]) {
                output.push(key);
            }
        });

        // Stringify the output for this step;
        totalOutput[idx] = JSON.stringify(output)
    }

    return totalOutput;
}

/**
 * Configure sequence environment variables and initiate the sequence timing function.
 * 
 * @param {Object} beat         object containing the beat information and sequence
 * @param {Object} defaults     some default settings
 * @param {Number} iterations   how many times to loop the sequence
 */
function dropTheBeat(beat, defaults, iterations) {
    
    const bpm = beat.bpm;
    const seq = beat.sequence;
    const subdiv = beat.subdivision;
    const millisToNanosFactor = 1000000;

    const SEQUENCE_ENV = {
        seqLen: beat.length,

        /** 
         * Calculate the duration in nanos of one sequence step
         * 
         * Divide 60,000 milliseconds per minute across X number of beats per minute. Convert to nanos for BigInt.
         * Multiply this value by the fraction of one beat represented by one sequence stemillip.
         * */ 
        stepDuration: BigInt( ( 60000 / bpm ) * ( defaults.BEAT_VALUE / subdiv ) * millisToNanosFactor),
    
        // prepare the visual sequence output
        output: prepareConsoleOutput(seq, beat.length),

        // time-tracking variables help schedule accuracy of each sequence step
        startTime: 0,
        expectedTime: 0,                // expected time-elapsed
        actualTime: 0,                  // actual time-elapsed

        // sequence step & iteration counters
        currentStep: 0,                 // the current sequencer step; maximum value === beat.length - 1
        iterationCount: 0,              // iterations completed
        iterationTotal: iterations,     // how many iterations to complete

        // analytics vars
        timeoutHistory: [],             // collect the setTimeout param of each sequence step for analytics.
        stepDurationHistory: [],        // collect the time diff between "this step" and "previous step"
        stepCount: 0,                   // how many steps have been completed across all iterations
        previousStepTime: 0             // the time at which the last step ran
    }

    return sequenceTimer(SEQUENCE_ENV);
}

module.exports = dropTheBeat;