const inquirer = require('inquirer');
const defaults = require('./defaults');
const promptTheBeat = require('./prompt-the-beat');
const dropTheBeat = require('./drop-the-beat');
const applause = require('./applause');

/**
 * Display the beat configuration for user review.
 * User chooses to play the sequence or return to menu.
 * 
 * @param {Object} beat
 */
function readyTheBeat(beat) {
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

    console.log(consoleLogBeat);
    return inquirer.prompt({
        name: 'in',
        type: 'confirm',
        default: true,
        message: `Play ${beat.title}?`
    }).then((res) => {
        if (res.in) {
            return inquirer.prompt({
                name: 'iterations',
                message: 'How many loops?',
                default: '16'
            });
        } else {
            mainMenu();
        }
    }).then((res) => {
        return dropTheBeat(beat, defaults, res.iterations);
    }).then(() => {
        return applause();
    }).then(() => {
        mainMenu();
    });
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
                readyTheBeat(defaults.FOUR_ON_THE_FLOOR, defaults)
                break;
            case 'demo2':
                readyTheBeat(defaults.STRAIGHT_ROCK_SLOW, defaults)
                break;
            case 'new_beat':
                promptTheBeat(defaults)
                    .then((beat) => readyTheBeat(beat));
                break;
            default:
                break;
        }
    });
}

module.exports = mainMenu;