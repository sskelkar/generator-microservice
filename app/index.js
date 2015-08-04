'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');


/**
 * Maxxton Microservice generator
 * ==============================
 * Version: 1.0
 * Author: R. Sonke (r.sonke@maxxton.com)
 * 
 * ==============================
 * 
 * TODO:
 * - application flavors
 * - subgenerators
 */


var createAppName = function(str)
{
  str = str.replace('-', ' ');
  str = str.replace('_', ' ');
  
  var partsOfStr = str.split(' ');
  var result = '';
  partsOfStr.forEach(function(word) {
    result += word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
  });
  
  return result;
}


module.exports = yeoman.generators.Base.extend({

  prompting: function () {
    var done = this.async();

    // greet the user
    this.log(
      chalk.red('Maxxton Microservice generator\n\n') +
      yosay() + '\n\n' +
      '==============================\n' +
      'Version: 1.0\n' +
      'Author: R. Sonke (r.sonke@maxxton.com)\n\n' +
      '==============================\n\n' +
      'Lets get started with some questions!\n\n' 
    );

    var prompts = [{
      type: 'string',
      name: 'baseName',
      message: '(1/5) What is the base name of this microservice?',
      default: 'awesome-service'
    },
    {
      type: 'string',
      name: 'packageName',
      message: '(2/5) What is your default package?',
      default: 'com.maxxton.awesome'
    },
    {
      type: 'string',
      name: 'userName',
      message: '(3/5) What is your name?',
      default: 'M. Axxton',
      store: true
    },
    {
      type: 'string',
      name: 'userEmail',
      message: '(4/5) What is your email?',
      default: 'm.axxton@maxxton.com',
      store: true
    },
    {
      type: 'list',
      name: 'serviceType',
      message: '(5/5) Select the kind of service you need.',
      choices: [
        {
          name: 'Basic (empty application which uses only default options)',
          value: 'basic'
        },
        {
          name: 'High level service (A business logic service with a rest interface)',
          value: 'high'
        },
        {
          name: 'Low level service (A backend service talking to datasources and never gets called by a user directly)',
          value: 'low'
        }
      ]
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      
      // composed ones
      this.props.author = this.props.userName + ' (' + this.props.userEmail + ')';
      this.props.currentYear = (new Date()).getFullYear();
      this.props.mainClassName = createAppName(this.props.baseName);

      done();
    }.bind(this));
  },
  writing: {
    app: function () {

      var packageFolder = this.props.packageName.replace(/\./g, '/');
      var srcDir = 'src/main/java/' + packageFolder;

      var variables = {
        author: this.props.author,
        currentYear: this.props.currentYear,
        serviceType: this.props.serviceType,
        mainClassName: this.props.mainClassName,
        userEmail: this.props.userEmail,
        userName: this.props.userName,
        packageName: this.props.packageName,
        baseName: this.props.baseName
      };

      // write all files now, with or without template functionality
      this.fs.copyTpl(
        this.templatePath('build.gradle'),
        this.destinationPath('build.gradle'),
        variables
      );

      this.fs.copyTpl(
        this.templatePath('MaxxtonApplication.java'),
        this.destinationPath(srcDir + '/'+ this.props.mainClassName +'.java'),
        variables
      );

      this.fs.copyTpl(
        this.templatePath('MaxxtonApplicationTest.java'),
        this.destinationPath(srcDir + '/'+ this.props.mainClassName +'Test.java'),
        variables
      );

    },
    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
    }
  },
  install: function () {
    
  },
  end: function () {
    this.log('All done, happy coding!');
  }
});




