/**
 * defaults.js contains default values for creating a beat
 * as well as a pre-defined beat "4 on the Floor."
 */

/**
 * the rhythmic value of 1 beat in "beats per minute".
 * eg: 128bpm = 128 quarter notes per minute
 *  */
const BEAT_VALUE = 4;

/**
 * Default beats per minute
 * */
const BPM = 120;

/**
 * Default beat subdivision for 1 step of the sequencer.
 * value of 16 implies 16th note
 * value of 8 implies 8th note, etc...
 * */
const SEQ_SUBDIV = 16;

/**
 * The total number of steps in the sequence.
 */
const SEQ_LENGTH = 16;

/**
 * Array representation of the "4 on the floor" rhythm pattern
 * where 1 is "on" and 0 is "off"
 */
const FOUR_ON_THE_FLOOR = {
    title: '4 on the Floor',
    bpm: 128,
    subdivision: 16,
    length: 16,
    sequence: {
        kick:  [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
        snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
        hat:   [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0]
    }
};

/**
 * A simple rock beat sequence.
 */
const STRAIGHT_ROCK_SLOW = {
    title: 'Straight Rock (slow)',
    bpm: '60',
    subdivision: '8',
    length: '8',
    sequence: {
      kick:  [1,0,0,0,1,0,0,0],
      snare: [0,0,1,0,0,0,1,0],
      hat:   [1,1,1,1,1,1,1,1]
    }
}

module.exports = {
    BEAT_VALUE,
    BPM,
    SEQ_LENGTH,
    SEQ_SUBDIV,
    FOUR_ON_THE_FLOOR,
    STRAIGHT_ROCK_SLOW
};