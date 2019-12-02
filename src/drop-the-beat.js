const average = require('./array-average');

/**
 * drop-the-beat contains the main sequencing logic including
 * timing and the visual (console) output.
 */

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
    
    // prepare the visual sequence output
    const output = prepareConsoleOutput(seq, seqLen);

    // "metronome" timing variables to help schedule accuracy of each sequence step
    let startTime;
    let expectedTime;       // expected time-elapsed
    let actualTime;         // actual time-elapsed
    let previousStepTime;   // the time at which the last step ran

    // refers to sequencer step
    let sequenceStep = 0;
    let iterationCount = 0;

    // analytics vars
    let timeoutHistory = [];            // collect the setTimeout param of each sequence step for analytics.
    let stepDurationHistory = [];       // collect the time diff between "this step" and "previous step"
    let totalSteps = 0;

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

                // print a new line after each completed sequence.
                process.stdout.write('\n');

            } else {
                sequenceStep++;
            }

            // read the actualTime elapsed.
            let now = new Date().getTime();
            actualTime = now - startTime;

            // actualTime will always be = if not > than expectedTime, due to the lag in `setTimeout` function.
            let diff = actualTime - expectedTime;
            let timeout = STEP_DURATION - diff
            timeoutHistory[totalSteps] = timeout;
            stepDurationHistory[totalSteps++] = now - previousStepTime;

            // iterations completed. end "playback".
            if (iterationCount >= iterations) {
                // resolve the promise after step duration completes
                setTimeout(() => {
                    // return some data about the completed sequence process
                    resolve({
                        totalRunningTime: `${(new Date().getTime() - startTime) / 1000} seconds`,
                        totalNumberOfSteps: totalSteps,
                        calculatedStepDuration: `${STEP_DURATION}ms`,
                        averageActualStepDuration: `${average(stepDurationHistory)}ms`,
                        averageStepTimeout: `${average(timeoutHistory)}ms`
                    });
                }, timeout);
                return;
            }
            
            // call sequence again using time differential to improve metronome accuracy.
            setTimeout(stepSequence, timeout);
            
            // increment expected time
            expectedTime += STEP_DURATION;
            previousStepTime = now;
        } 

        /**
         * Begin the sequence;
         */
        startTime = new Date().getTime();
        expectedTime = 0;
        previousStepTime = new Date().getTime();
        stepSequence();
    });
}

module.exports = dropTheBeat;