# SM-808 1.0.0
### author C. Orescan

SM-808 1.0.0 by corescan is a simple drum machine which offers a sequencing cli and *visual output only*. It is a solution written in [Node.js](http://nodejs.org) to the challenge presented by https://github.com/splice/sm-808 and primarily a proof of concept for the sequencer logic within. It is not (at least in this iteration) intended to play [audible] music.

This package offers a user the ability to:
1. Play a pre-set demo sequence.
2. Program a custom sequence by supplying the following values (or using the presets):
    1. bpm
    2. sequence length (number of steps)
    3. rhythmic value of 1 sequence step (8th note, 16th note, etc...) 
    4. an "on/off" sequence for 3 tracks: kick, snare, and hat.


## Install
1. `$ cd $WORKING_DIR`
2. `$ npm install`

## Run
1. `$ npm start`
2. Follow the prompts.
3. Have fun.
