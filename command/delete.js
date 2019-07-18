'use strict'

const co = require('co')
const prompt = require('co-prompt')
const chalk = require('chalk')
const fs = require('fs')

const templateConfig = require('../templates')

module.exports = () => {
    co(function*() {
        // 接收用户输入的参数
        let targetName = yield prompt('\n Template name: ')

        // 获取目标templateIndex
        let targetIndex = null
        templateConfig.templates.some((template, index) => {
            if (template.name === targetName) {
                targetIndex = index
                return true
            } else {
                return false
            }
        })

        if (targetIndex === null) {
            console.log(chalk.red(`\n Template ${targetName} does not exist!`))
            process.exit()
        } else {
            // 删除对应的模板
            templateConfig.templates.splice(targetIndex, 1)
        }

        // 写入template.json
        fs.writeFile(__dirname + '/../templates.json', JSON.stringify(templateConfig), 'utf-8', (err) => {
            if (err) {
                console.log(err)
            }
            console.log(chalk.green(`\n Template ${targetName} deleted!`))
            process.exit()
        })
    })
}