/**
 * An implementation of a step sequencer using setTimeout as the core timing function.
 */
const millisToNanosFactor = 1000000;

module.exports = (env) => new Promise((resolve) => {
    /**
     * Outputs current step and advances the sequence.
     * Attempts to account for the time drag between this step and last by adjusting STEP_DURATION.
     */
    function stepSequence() {
        // output the sequence state for current step
        process.stdout.write(env.output[env.currentStep]);

        // increment the step
        if (env.currentStep === env.seqLen - 1) {
            // Completed last step. Reset the sequence.
            env.currentStep = 0;
            env.iterationCount++;

            // print a new line after each completed sequence.
            process.stdout.write('\n');

        } else {
            env.currentStep++;
        }

        // read the actualTime elapsed.
        const now = process.hrtime.bigint();
        env.actualTime = now - env.startTime;

        // actualTime will always be = if not > than expectedTime, due to the lag in `setTimeout` function.
        const diff = env.actualTime - env.expectedTime;

        // convert nanoseconds to milliseconds
        const timeout = Number(env.stepDuration - diff) / millisToNanosFactor;

        // save timing data for this step
        env.timeoutHistory[env.stepCount] = timeout;
        if (env.stepCount > 0) {
            env.timeoutHistory[env.stepCount-1] = timeout;
            env.stepDurationHistory[env.stepCount-1] = Number(now - env.previousStepTime);
        }

        // iterations completed; end "playback".
        if (env.iterationCount >= env.iterationTotal) {
            // resolve the promise after step duration completes
            setTimeout(() => {
                // increment stepCount so it is not off by 1.
                env.stepCount++;
                // return environment data
                env.finishingTime = process.hrtime.bigint();
                resolve(env);
            }, timeout);
            return;
        }
        
        // increment expected time
        env.expectedTime += env.stepDuration;
        env.previousStepTime = now;
        env.stepCount++;
        
        // call sequence again using time differential to improve metronome accuracy.
        setTimeout(() => {
            stepSequence(env);
        }, timeout);
    } 

    /**
     * Begin the sequence;
     */
    env.startTime = process.hrtime.bigint();
    env.expectedTime = BigInt(0);
    env.previousStepTime = process.hrtime.bigint();
    stepSequence(env);
});