const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = function(app) {
    app.get('/', async function(req, res) { 
        try {
            console.log('Pulling from repository');
            await exec(`cd ${process.env.REPOSITORY_FOLDER} && git pull`);
    
            console.log('Installing dependencies');
            await exec(`cd ${process.env.REPOSITORY_FOLDER} && npm install`);
    
            console.log('Getting process list');
            const processList = await exec(`pm2 prettylist`); 
    
            if (processList.stdout && processList.stdout.includes(process.env.APP_NAME)) {
                console.log('Stopping application');
                await exec(`pm2 delete ${process.env.APP_NAME}`);
            }
    
            console.log('Building');
            await exec(`cd ${process.env.REPOSITORY_FOLDER} && npm run build`);
    
            console.log('Starting application');
            await exec(`pm2 start ${process.env.REPOSITORY_FOLDER}/dist/main.js --name ${process.env.APP_NAME} --exp-backoff-restart-delay=100`);

            res.status(200);
            res.json({
                message: 'ok'
            });
        } catch (error) {
            res.status(500);
            res.json({
                message: 'failed',
                error
            });
        }
    });
}
