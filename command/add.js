'use strict'

const co = require('co')
const prompt = require('co-prompt')
const chalk = require('chalk')
const fs = require('fs')

const templateConfig = require('../templates')
const templates = templateConfig.templates

module.exports = () => {
    co(function*() {
        // 判断是否有默认template
        let isDefault = false
        let hasDefault = templates.some(template => template.default)
        if (!hasDefault) {
            // 没有默认template，询问是否设置为默认
            isDefault = (yield prompt('\n Default template?(y/n) ')) === 'y'
            if (isDefault) {
                console.log(chalk.blue(`\n Set Default!`));
            }
        }
        let name = yield prompt('\n Template name: ')
        if (!name) {
            console.log(chalk.red('\n × Template name is necessary!'));
            process.exit()
        }
        // 防止重复
        if (templates.find(template => template.name === name)) {
            console.log(chalk.red(`\n × Template ${name} has already existed!`));
            process.exit()
        }
        console.log(chalk.blue(`\n Template name ${name}`));

        let defaultProjectName = (yield prompt('\n Default project name:(es7_project) ')) || 'es7_project'
        console.log(chalk.blue(`\n Default project name ${defaultProjectName}`));

        let url = yield prompt('\n Git https link: ')
        if (!url) {
            console.log(chalk.red('\n × Template url is necessary!'));
            process.exit()
        }
        console.log(chalk.blue(`\n Template url ${url}`));

        let branch = (yield prompt('\n Branch:(master) ')) || 'master'
        console.log(chalk.blue(`\n Branch ${branch}`));

        // 避免重复添加
        templates.push({
            default: isDefault,
            name: name,
            defaultProjectName: defaultProjectName,
            url: url.replace(/[\u0000-\u0019]/g, ''),
            branch: branch
        })

        // 把模板信息写入templates.json
        fs.writeFile(__dirname + '/../templates.json', JSON.stringify(templateConfig), 'utf-8', (err) => {
            if (err) {
                console.log(err)
            }
            console.log(chalk.green('\n √ New template added!'))
            process.exit()
        })
    })
}