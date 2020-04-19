'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Others:
var router = require('express').Router();
var { exec, execFile } = require('child_process');
var fs = require('fs');
var config = require('../config/config');

/*
  ------------------ CODE BODY --------------------
*/

// API: Start Server
router.post('/start', (req, res, next) => {
  let params = req.body;
  
  if (params.branchName && params.dbName) {
    // Variables:
    let finalData = '';
    let extraCommand1 = 'git checkout --track origin/';
    let extraCommand2 = 'git pull --all\n';

    config.setBranch(params.branchName);
    config.setDB(params.dbName);

    fs.readFile('/root/deployer/resources/dp-script-1', (err, data) => {
      if (err) throw err;
      
      finalData += data + '\n';
      
      if (params.branchName != 'master' && params.branchName) {
        extraCommand1 += params.branchName + '\n';
        finalData += extraCommand1 + extraCommand2;
      }

      fs.readFile('/root/deployer/resources/dp-script-2', (err, data) => {
        if (err) throw err;
        
        finalData += data;

        fs.writeFile('/root/deployer/resources/deploy.sh', finalData, (err) => {
          if (err) throw err;

          console.log("File Content:\n" + finalData);
          
          exec('chmod u+x deploy.sh', { cwd: '/root/deployer/resources' }, (err, stdout1, stderr1) => {
            if (err) throw err;

            execFile('/root/deployer/resources/deploy.sh', { cwd: '/root'}, (err, stdout2, stderr2) => {
              if (err) throw err;

            });
          })
        });

      });
    });

    res.json({
      statusCode: 202,
      statusName: "ACCEPTED",
      message: "The request has been accepted, wait for 30 seconds and refresh the status."
    });
  } else {
    res.json({
      statusCode: 400,
      statusName: "BAD REQUEST",
      message: "Invalid parameters!"
    });
  }
});

// API: Fetch Server Status
router.get('/status', (req, res, next) => {
  // Variables:
  let branchName = "None", dbName = "None", serverStatus = "None";

  branchName = config.instance[branchName];
  dbName = config.instance[dbName];

  exec('pm2 list', { cwd: '/root/'}, (err, stdout, stderr) => {
    if (err) throw err;

    // Send response:
    res.json({
      statusCode: 200,
      statusName: "OK",
      branchName: branchName,
      dbName: dbName,
      serverStatus: stdout
    });
  })
});


// Export router
module.exports = router;