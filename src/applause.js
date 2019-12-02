/**
 * Output a few lines of "applause".
 */
module.exports = function() {
    const applause = "*** APPLAUSE ***"
    const len = applause.length;
    let i = 0;

    console.log('\t');
    for (i; i<5; i++) {
        let pad = Math.random() * 3 + 2;
        setTimeout(() => { 
            console.log(applause.padStart(len + pad));
        }, 200 * i)
    }    
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('\t');
            resolve();
        }, 200 * i);
    })
}