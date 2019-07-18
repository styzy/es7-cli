'use strict'

const exec = require('child_process').exec
const co = require('co')
const prompt = require('co-prompt')
const chalk = require('chalk')

const { templates } = require('../templates')

module.exports = () => {
    co(function*() {
        let projectName, targetTemplate, gitUrl, branch

        // 获取用户输入模板名称
        let templateName = yield prompt('\n Template name:(standard) ')
        if (!templateName) {
            // 使用默认模板
            let defaultTemplate = templates.find(template => template.default)
            if (!defaultTemplate) {
                console.log(chalk.red('\n × Default template does not exit!'))
                process.exit()
            }
            targetTemplate = defaultTemplate
        } else {
            // 获取用户模板
            targetTemplate = templates.find(template => template.name === templateName)
            if (!targetTemplate) {
                console.log(chalk.red(`\n × Template ${templateName} does not exit!`))
                process.exit()
            }
        }
        console.log(chalk.blue(`\n Template name: ${targetTemplate.name}`))

        // 获取用户输入项目名称
        projectName = (yield prompt('\n Project name:(es7_project) ')) || 'es7_project'
        console.log(chalk.blue(`\n Project name: ${projectName}`))

        gitUrl = targetTemplate.url
        branch = targetTemplate.branch

        // git命令，远程拉取项目并自定义项目名
        let cmdStr = `git clone ${gitUrl} ${projectName} && cd ${projectName} && git checkout ${branch} && git remote remove origin`

        console.log(chalk.white('\n Start generating...'))

        exec(cmdStr, (error, stdout, stderr) => {
            if (error) {
                console.log(error)
                process.exit()
            }
            console.log(chalk.green('\n √ Generation completed!'))
            console.log(`\n cd ${projectName} && npm install \n`)
            process.exit()
        })
    })
}