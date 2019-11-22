/**
 * Generate the console output for each step of the sequence
 * @param {Object} seq 
 * @param {Number} len 
 */
function prepareConsoleOutput(seq, len) {
    /**
     * Grab the object keys for each "track".
     * Filter for sanity - see best practices for using Object.keys.
     */
    const track_keys = Object.keys(seq);

    let totalOutput = new Array(len);

    for (let idx=0; idx<len; idx++) {
        // Sequence output for this step goes into the array.
        var output = [];

        // Read the sequence value for this step for each track
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
 * Displays output for a sequence in rhythym.
 * 
 * @param {Object} beat         object containing the beat information and sequence
 * @param {Object} defaults     some default settings
 * @param {Number} iterations   how many times to loop the sequence
 */
function dropTheBeat(beat, defaults, iterations) {
    
    const bpm = beat.bpm;
    const seq = beat.sequence;
    const seqLen = beat.length;
    const subdiv = beat.subdivision;

    /** 
     * Calculate the duration in millis of one sequence step
     * 
     * Divide 60,000 milliseconds per minute across X number of beats per minute.
     * Multiply this value by the fraction of one beat represented by one sequence step.
     * */ 
    const STEP_DURATION = ( 60000 / bpm ) * ( defaults.BEAT_VALUE / subdiv );
    // console.warn('STEP_DURATION:', STEP_DURATION); //debug
    
    // prepare the visual sequence output
    const output = prepareConsoleOutput(seq, seqLen);

    // "metronome" timing variables
    var startTime;
    var expectedTime; // expected time-elapsed
    var actualTime; // actual time-elapsed

    // refers to sequencer step
    var sequenceStep = 0;
    var iterationCount = 0;

    return new Promise((resolve) => {
        /**
         * Outputs current step and advances the sequence.
         * Attempts to account for the time drag between this step and last by adjusting STEP_DURATION.
         */
        function stepSequence() {
            // output the sequence state for current step
            process.stdout.write(output[sequenceStep]);

            // increment the step
            if (sequenceStep === seqLen - 1) {
                // Completed last step. Reset the sequence.
                sequenceStep = 0;
                iterationCount++;
                process.stdout.write('\n');
                if (iterationCount >= iterations) {
                    // end the loop
                    console.log('RESOLVE?');
                    resolve('DONE');
                    return;
                }
            } else {
                sequenceStep++;
            }
            actualTime = new Date().getTime() - startTime;

            // actualTime will always be = if not > than expectedTime, due to the potential lag in `setTimeout` function.
            var diff = actualTime - expectedTime;
            // console.warn("NEXT STEP:", STEP_DURATION - diff); //debug

            // call sequence again using time differential to improve metronome accuracy.
            setTimeout(stepSequence, STEP_DURATION - diff);
            
            // increment expected time
            expectedTime += STEP_DURATION;
        } 

        /**
         * Begin the sequence;
         */
        startTime = new Date().getTime();
        expectedTime = 0;
        stepSequence();
    });
}

module.exports = dropTheBeat;