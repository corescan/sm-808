const inquirer = require('inquirer');

/**
 * A simple method enforcing the predetermined length and numerical content of a pattern
 * @param {String} input 
 * @param {Number} beatLength 
 */
function sanitizePattern(input, beatLength) {
    let cleanPattern = new Array(beatLength);
    if (typeof input !== 'string') {
        input = JSON.stringify(input).split();
    }
    for (let i=0; i<beatLength; i++) {
        // if we read a '1', pattern is 'on' for this step
        // for all other input, pattern is 'off' for this step
        cleanPattern[i] = input[i] === '1' ? 1 : 0;
    }

    console.log(JSON.stringify(cleanPattern));

    return cleanPattern;
}
/**
 * Gather params and sequence from user for a beat.
 * @param {Object} defaults
 */
function promptTheBeat(defaults) {
    // create the default beat object;
    const beat = {
        title: "New Beat on the Block",
        bpm: defaults.BPM,
        subdivision: defaults.SEQ_SUBDIV,
        length: defaults.SEQ_LENGTH
    }

    const seq = {};

    return inquirer.prompt({
        name: 'in',
        default: beat.title,
        message: `title?`
    }).then((res) => {
        beat.title = res.in;
        return inquirer.prompt({
            name: 'in',
            default: beat.bpm,
            message: `bpm?`
        })
    }).then((res) => {
        beat.bpm = res.in;
        return inquirer.prompt({
            name: 'in',
            default: beat.subdivision,
            message: `beat value of 1 sequencer step? For 1/x note, use x:`
        })
    }).then((res) => {
        beat.subdivision = res.in;
        return inquirer.prompt({
            name: 'in',
            default: beat.length,
            message: `number of sequence steps?`
        })
    }).then((res) => {
        beat.length = res.in;
        console.log(beat);
        return inquirer.prompt({
            name: 'in',
            message: `Enter a ${beat.length} step kick pattern (use 1's and 0's):`
        })
    }).then((res) => {
        let pattern = sanitizePattern(res.in, beat.length);
        seq.kick = pattern;
        return inquirer.prompt({
            name: 'in',
            message: `Enter a ${beat.length} step snare pattern (use 1's and 0's):`
        })
    }).then((res) => {
        let pattern = sanitizePattern(res.in, beat.length);
        seq.snare = pattern;
        return inquirer.prompt({
            name: 'in',
            message: `Enter a ${beat.length} step hi-hat pattern (use 1's and 0's):`
        })
    }).then((res) => {
        let pattern = sanitizePattern(res.in, beat.length);
        seq.hat = pattern;
        beat.sequence = seq;
        return beat;
    });
}

module.exports = promptTheBeat;