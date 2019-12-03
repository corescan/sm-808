/**
 * An implementation of the sequence timer using time-comparison in a loop.
 */
module.exports = (env) => new Promise((resolve) => {
    
    const totalSteps = env.iterationTotal * env.seqLen;
    let nextStepTime = process.hrtime.bigint();;
    env.startTime = nextStepTime;

    for ( ; env.stepCount <= totalSteps; ) {
        const now = process.hrtime.bigint();

        if (now >= nextStepTime) {
            nextStepTime += env.stepDuration;
            if (env.stepCount >= 1) {
                env.stepDurationHistory[env.stepCount-1] = Number(now - env.previousStepTime);
            }
            env.previousStepTime = now;

            if (env.currentStep === 0) {
                // print a new line at the beginning of each iteration.
                process.stdout.write('\n');
            }

            // Do not print output on the final loop.
            // The final loop runs in order to achieve the expected duration of the final step.
            if (env.stepCount < totalSteps) {
                // output the sequence state for current step
                process.stdout.write(env.output[env.currentStep]);

                // increment the step
                if (env.currentStep === env.seqLen - 1) {
                    // Completed last step. Reset the sequence.
                    env.currentStep = 0;
                    env.iterationCount++;
                } else {
                    env.currentStep++;
                }
            }
            env.previousStepTime = now;
            env.stepCount++;
        }
    }

    env.stepCount--; // decrement the last step count so it is not off by one.
    env.finishingTime = process.hrtime.bigint();
    resolve(env);
});