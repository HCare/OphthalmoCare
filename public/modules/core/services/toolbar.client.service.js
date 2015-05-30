'use strict';

//Toolbar service used for managing  toolbar
angular.module('core').service('Toolbar',
    function () {
        this.commands = [];

        // Add toolbar item
        this.addToolbarCommand = function (commandName, commandAction, CommandTitle, commandIcon, position, redirectUrl, confirmMessage) {
            // Push new menu item
            this.commands.push({
                command:commandName,
                action: commandAction,
                title: CommandTitle,
                icon: commandIcon,
                position: position || 0,
                redirect:redirectUrl||null,
                confirmMsg:confirmMessage||null
            });
            return this.commands;
        };

        // Remove existing toolbar item
        this.removeToolbarCommand = function (commandName) {
            // Search for toolbar item to remove
            for (var itemIndex in this.commands) {
                if (this.commands[itemIndex].command === commandName) {
                    this.commands.splice(itemIndex, 1);
                }
            }


            return this.commands;
        };

        this.clearToolbarCommands=function(){
            this.commands=[];
            return this.commands;
        }

        this.getToolbarCommands = function () {
            return this.commands;
        };

    });