const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label, printf, colorize } = format

const myFormat = printf(info => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`
})

const logger = createLogger({
  level: process.env.LOG_LEVEL,
  format: combine(
    label({ label: process.env.APP_NAME }),
    timestamp(),
    myFormat
  ),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' })
  ]
})

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: combine(
      label({ label: process.env.APP_NAME }),
      colorize({ property: 'label' }), // colorize({ all: true }),
      timestamp(),
      myFormat
    ),
    colorize: true
  }))
}

module.exports = logger
