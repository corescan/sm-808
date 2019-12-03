const inquirer = require('inquirer');
const defaults = require('./defaults');
const createBeat = require('./createBeat');
const beginSequence = require('./sequencer/sequenceController');
const applause = require('./util/applause');
const average = require('./util/array-average');

/**
 * Display the beat configuration for user review.
 * User chooses to play the sequence or return to menu.
 * 
 * @param {Object} beat
 */
function confirmTheBeat(beat) {
    /**
     * Stringify the sequence arrays for display purposes.
     * Make a copy of beat sequence so original beat object is not altered.
     *  */
    let consoleLogSeq = Object.assign({}, beat.sequence);
    let consoleLogBeat = Object.assign({}, beat);
    consoleLogBeat.sequence = consoleLogSeq;

    Object.keys(beat.sequence).forEach(trackName => {
        consoleLogBeat.sequence[trackName] = JSON.stringify(consoleLogBeat.sequence[trackName])
    });

    // Display the beat properties
    console.log(consoleLogBeat);

    return inquirer.prompt({
        name: 'in',
        type: 'confirm',
        default: true,
        message: `Play ${beat.title}?`
    }).then((res) => {
        let defaultLoopCount = 8;
        if (res.in) {
            return inquirer.prompt({
                name: 'iterations',
                message: 'How many loops?',
                type: 'number',
                default: defaultLoopCount,
                filter: input => {
                    if (typeof input === 'number' && input !== NaN && input > 0){
                        return input;
                    }
                    return defaultLoopCount;
                }
            }).then((res) => {
                return beginSequence(beat, defaults, res.iterations)
            }).then((env) => {
                // display some performance analytics
                const millisToNanosFactor = 1000000
                console.table({
                    totalRunningTime: `${Number(env.finishingTime - env.startTime) / (millisToNanosFactor * 1000)} seconds`,
                    totalNumberOfSteps: env.stepCount,
                    calculatedStepDuration: `${Number(env.stepDuration) / millisToNanosFactor}ms`,
                    averageActualStepDuration: `${average(env.stepDurationHistory) / millisToNanosFactor}ms`,
                    // averageStepTimeout: env.timeoutHistory.length ? `${average(env.timeoutHistory)}ms` : 'N/A'
                });
                return applause();
            });
        }

        // else
        return Promise.resolve();
    }).catch((err) => {
        console.error(err);
    })
}

/**
 * User chooses course of action for the program.
 */
function mainMenu() {
    inquirer.prompt({
        type: 'list',
        name: 'main_menu',
        message: "What do you want to do?",
        choices: [
            {
                name:'Make a new beat.',
                value: 'new_beat'
            },
            {
                name:'Demo: "4 on the Floor"',
                value: 'demo1'
            },
            {
                name:'Demo: "Straight Rock (slow)"',
                value: 'demo2'
            },
            new inquirer.Separator("\t")
        ]
    }).then((res) => {
        switch (res.main_menu) {
            case 'demo1':
                return confirmTheBeat(defaults.FOUR_ON_THE_FLOOR, defaults)
            case 'demo2':
                return confirmTheBeat(defaults.STRAIGHT_ROCK_SLOW, defaults)
            case 'new_beat':
                return createBeat(defaults)
                    .then((beat) => confirmTheBeat(beat));
            default:
                return Promise.resolve();
        }
    }).finally(() => {
        // loop back to top of the menu
        mainMenu();
    });
}

module.exports = mainMenu;