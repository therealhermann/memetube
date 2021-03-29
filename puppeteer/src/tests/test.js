const {
  start,
  newPage,
  frames,
  captions
} = require('../bin/actions');
const {
  screenshot
} = require('../bin/utils');
const {
  performance
} = require('perf_hooks');

const loopRun = async (ntimes) => {
  try {
    const tobifight = 'https://www.youtube.com/watch?v=Ab6qmo178I0';
    const koroba = 'https://www.youtube.com/watch?v=5goMslKxEWs';
    const brownskingirls = 'https://www.youtube.com/watch?v=vRFS0MYTC1I';
    const wap = 'https://www.youtube.com/watch?v=hsm4poTWjMs';
    var tests = [tobifight];
    var timer = []
    var browser = await start()
    var count = 2
    for (let i = 0; i < tests.length; i++) {
      for (let j = 0; j < ntimes; j++) {
        let t0 = performance.now()
        var page = await newPage(browser);
        console.log(await frames(page, tests[i], count));
        await page.close();
        let t1 = performance.now()
        console.log(`Test ${i+1}, run number ${j + 1} Completed\n`);
        timer.push((t1 - t0))
        setTimeout(() => '', 3000);
      }
    }
    browser.close();

    // Calculate the runtime performance
    console.log({
      timer
    })
    var total = 0
    for (let i = 0; i < timer.length; i++) {
      total += timer[i]
    }
    console.log(`Avgerage Runtime of ${Math.floor(total/(timer.length * 1000))} seconds`)
    console.log(`Total Runtime of ${total} seconds`);
  } catch (e) {
    await screenshot(page, 'exception.png');
    console.log({
      e
    });
    throw e;
  }
};

loopRun(1);



/*
 Timer Results: 

  { timer: [ 52134.4224989973, 17545.26601500064, 17228.931377999485 ] }

*/