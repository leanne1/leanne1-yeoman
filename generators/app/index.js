'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
    prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the ' + chalk.red('leanne1-project') + ' generator!'
        ));

        var prompts = [{
            type: 'checkbox',
            message: 'Select the tools your project will use:',
            name: 'tools',
            choices: [{
                name: 'react',
            },{
                name: 'redux'
            },{
                name: 'router'
            }]
        }];

        // Save prompt answers as this.props
        this.prompt(prompts, function (props) {
            this.props = props;
            done();
        }.bind(this));
    },

    writing: function () {
        // Copy bundles
        this.fs.copy(
            this.templatePath('bundles/**/*'),
            this.destinationPath('./bundles/')
        );
        // Copy gulpfile
        this.fs.copy(
            this.templatePath('gulpfile.js'),
            this.destinationPath('gulpfile.js')
        );
    },

    // install: function () {
    //     this.installDependencies();
    // }
});
