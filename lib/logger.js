// https://github.com/vuejs/vue-cli/blob/master/lib/logger.js

var chalk = require('chalk')
var format = require('util').format

/**
 * Prefix.
 */

var prefix = '   vswagger-cli    '
var sep = chalk.gray('·')

/**
 * Log a `message` to the console.
 *
 * @param {String} message
 */

exports.log = function () {
  var msg = format.apply(format, arguments)
  console.log(chalk.red(prefix), sep, msg)
}

/**
 * Log an error `message` to the console and exit.
 *
 * @param {String} message
 */

exports.fatal = function (message) {
  if (message instanceof Error) message = message.message.trim()
  var msg = format.apply(format, arguments)
  console.error(chalk.red(prefix), sep, msg)
  process.exit(1)
}

/**
 * Log a success `message` to the console and exit.
 *
 * @param {String} message
 */

exports.success = function () {
  var msg = format.apply(format, arguments)
  console.log(chalk.green(prefix), sep, msg)
}
