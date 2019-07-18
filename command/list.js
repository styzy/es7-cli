'use strict'

const { templates } = require('../templates')

module.exports = () => {
    console.table(templates)
    process.exit()
}