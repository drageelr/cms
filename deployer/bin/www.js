#!/usr/bin/env node
'use strict'

/*
  ------------------ DEPENDENCIES --------------------
*/

// Modules:
var debug = require('debug')('server:server');
var http = require('http');

// Others:
var app = require('../app');

/*
  ------------------ CODE BODY --------------------
*/

/*
  <BLOCK EXPLAINATION>
  Creates server object, based on the port specified in the config file
  and listens for request and errors on this server.
*/

// Variables:
let port, server;

// Get port from config and normalize it
port = normalizePort(3231);

// Add port to app
app.set('port', port)

// Create HTTP server
server = http.createServer(app)

// Listen on port on all provided network interfaces
server.listen(port);

// Add event listener to server
server.on('error', onError);
server.on('listening', onListening);

/*
  <<<<< HELPER FUNCTIONS >>>>>
*/

/**
* Normalizes port value to number, string or false.
* @param val - Port value to be normalized.
*/
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
* Event listener for HTTP server "error" event.
* @param error - Object containing details about the error.
*/
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
* Event listener for HTTP server "listening" event.
*/
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}