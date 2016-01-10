'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var path = require('path');

module.exports = yeoman.generators.Base.extend({
    prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the ' + chalk.red('leanne1-project') + ' generator!'
        ));

        var prompts = [{
            type: 'input',
            name: 'projectName',
            message: 'What is the name of your project?',
            default: process.cwd().split(path.sep).pop()
        },{
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
        var projectNameKebabCase =  _.chain(this.props.projectName)
                                    .deburr()
                                    .kebabCase()
                                    .value();
        
        // Cache user input values
        var userValues = {
            'projectName': this.props.projectName,
            'projectNameKebabCase': projectNameKebabCase,
            'hasReact': _.indexOf(this.props.tools, 'react') > -1,
            'hasRedux': _.indexOf(this.props.tools, 'redux') > -1,
            'hasRouter': _.indexOf(this.props.tools, 'router') > -1
        };

        // Copy JS / CSS bundles
        this.fs.copy(
            this.templatePath('bundles/**/*'),
            this.destinationPath('./bundles/')
        );
        // Copy gulpfile
        this.fs.copy(
            this.templatePath('_gulpfile.babel.js'),
            this.destinationPath('gulpfile.babel.js')
        );
        // Copy package.json
        this.fs.copyTpl(
            this.templatePath('_package.json'),
            this.destinationPath('package.json'),
            userValues
        );
        // Copy bower.json
        this.fs.copyTpl(
            this.templatePath('_bower.json'),
            this.destinationPath('bower.json'),
            userValues
        );
        // Copy README
        this.fs.copyTpl(
            this.templatePath('_README.md'),
            this.destinationPath('README.md'),
            userValues
        );
        // Add main app dir index.html 
        this.fs.copyTpl(
            this.templatePath('app/_index.html'),
            this.destinationPath('app/index.html'),
            userValues
        );
        // Add main app dir index.js 
        this.fs.copyTpl(
            this.templatePath('app/_index.js'),
            this.destinationPath('app/index.js'),
            userValues
        );
        // Add styles dir 
        this.fs.copy(
            this.templatePath('styles/_index.less'),
            this.destinationPath('styles/index.less')
        );
        // Add test dir 
        this.fs.copyTpl(
            this.templatePath('test/_spec.js'),
            this.destinationPath('test/spec.js'),
            userValues
        );
        // Add components dir, if react was chosen
        if (userValues.hasReact) {
            this.fs.copy(
                this.templatePath('app/components/_index.js'),
                this.destinationPath('app/components/index.js')
            );
            if (userValues.hasRouter && !userValues.hasRedux) {
                this.fs.copy(
                    this.templatePath('app/components/pages/'),
                    this.destinationPath('app/components/pages/')
                );
            }
        }
        // Add App component or container
        if (userValues.hasReact && userValues.hasRedux && !userValues.hasRouter) {
            this.fs.copy(
                this.templatePath('app/containers/_App.js'),
                this.destinationPath('app/containers/App.js')
            );
        } else {
            this.fs.copy(
                this.templatePath('app/components/_App.js'),
                this.destinationPath('app/components/App.js')
            );
        }
        if (userValues.hasReact && userValues.hasRouter) {
            // Add react router dir, if react and router were chosen
            this.fs.copy(
                this.templatePath('app/router/_history.js'),
                this.destinationPath('app/router/history.js')
            );
            this.fs.copy(
                this.templatePath('app/router/_routes.js'),
                this.destinationPath('app/router/routes.js')
            );
        }
        // Add store, reducers and actions, if redux chosen
        if (userValues.hasRedux) {
            //Utils
            this.fs.copy(
                this.templatePath('app/utils/_makeActionCreator.js'),
                this.destinationPath('app/utils/makeActionCreator.js')
            );
            //Store
            this.fs.copyTpl(
                this.templatePath('app/store/_configureStore.js'),
                this.destinationPath('app/store/configureStore.js'),
                userValues
            );  
            //Actions
            this.fs.copyTpl(
                this.templatePath('app/actions/_index.js'),
                this.destinationPath('app/actions/index.js/'),
                userValues
            ); 
            this.fs.copyTpl(
                this.templatePath('app/actions/_actionTypes.js'),
                this.destinationPath('app/actions/actionTypes.js'),
                userValues
            ); 
            this.fs.copy(
                this.templatePath('app/actions/actionCreators/_fooActionCreators.js'),
                this.destinationPath('app/actions/actionCreators/fooActionCreators.js')
            ); 
            this.fs.copy(
                this.templatePath('app/actions/thunks/'),
                this.destinationPath('app/actions/thunks/')
            ); 
            //Reducers
            this.fs.copyTpl(
                this.templatePath('app/reducers/_index.js'),
                this.destinationPath('app/reducers/index.js'),
                userValues
            ); 
            this.fs.copy(
                this.templatePath('app/reducers/reducers/_fooReducers.js'),
                this.destinationPath('app/reducers/reducers/fooReducers.js')
            );   
            if (userValues.hasRouter) {
                this.fs.copy(
                    this.templatePath('app/actions/actionCreators/_pageActionCreators.js'),
                    this.destinationPath('app/actions/actionCreators/pageActionCreators.js')
                );
                this.fs.copy(
                    this.templatePath('app/reducers/reducers/_pageReducers.js'),
                    this.destinationPath('app/reducers/reducers/pageReducers.js')
                );
                this.fs.copy(
                    this.templatePath('app/containers/pages/_FooPage.js'),
                    this.destinationPath('app/containers/pages/FooPage.js')
                );
            }      
        }
    },

    // Npm and bower install
    install: function () {
        this.installDependencies();
    },

    // Copy installed config into project root
    end: function() {

        var configDir = 'bower_components/tools-config/config/';

        this.fs.copy(
            this.destinationPath(configDir + 'git/.gitignore'),
            this.destinationPath('.gitignore')
        );
        this.fs.copy(
            this.destinationPath(configDir + 'editor/.editorconfig'),
            this.destinationPath('.editorconfig')
        );
        this.fs.copy(
            this.destinationPath(configDir + 'autoprefixer/browserslist'),
            this.destinationPath('browserslist')
        );
        this.fs.copy(
            this.destinationPath(configDir + 'lint/css/csslintrc.json'),
            this.destinationPath('csslintrc.json')
        );
        this.fs.copy(
            this.destinationPath(configDir + 'lint/html/htmlhintrc.json'),
            this.destinationPath('htmlhintrc.json')
        );
        this.fs.copy(
            this.destinationPath(configDir + 'lint/js/.eslintrc'),
            this.destinationPath('.eslintrc')
        );
         this.fs.copy(
            this.destinationPath(configDir + 'test/karma.conf.js'),
            this.destinationPath('karma.conf.js')
        );
        this.fs.copy(
            this.destinationPath(configDir + 'transpilers/.babelrc'),
            this.destinationPath('.babelrc')
        );
    }
});
