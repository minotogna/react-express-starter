const debug = require('debug')('react-express-starter:server')

// Event listener for HTTP server "error" event.
const onError = (port) => (error) => {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      debug('%s requires elevated privileges', bind)
      process.exit(1)
      break
    case 'EADDRINUSE':
      debug('%s is already in use', bind)
      process.exit(1)
      break
    default:
      throw error
  }
}

// Event listener for HTTP server "listening" event.
const onListening = (server) => () => {
  const addr = server.address()
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
  debug('Listening on %s', bind)
}

// Normalize a port into a number, string, or false.
const normalizePort = (value) => {
  const port = Number.parseInt(value, 10)
  // named pipe
  if (Number.isNaN(port)) return value
  // port number
  if (port >= 0) return port

  return false
}

module.exports = {
  onError,
  onListening,
  normalizePort,
}
