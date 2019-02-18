const http = require('http');
const childProcess = require('child_process');
const process = require('process');
const logger = require('./logs');

const testInterval = 10000 
const statusPort = process.env.PORT || 3333
let status = '{"passed":0,"failed":0,"msgs":[]}';   //default status
 
//start doing stuff
logger.verbose('Automatic test running...');
logger.verbose(`Status will be reported on port ${statusPort}`);

runTest();

setInterval( () => {
    runTest();
}, testInterval);


function runTest() {
    childProcess.exec('npm test', (err, stout) => {
        if (err)
        {
            logger.error(err);
            return;
        }
        status = stout;
        logger.info(`${status.trim()}`);

    });
}

http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type': 'text/json'});
    response.end(status);
}).listen(statusPort);