var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

var rolePath = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.room.name != 'E51N3') {
            var exitDir = Game.map.findExit(creep.room.name, 'E51N3');
            var Exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(Exit);
        }
        else {
           
            if (creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }
            if (creep.memory.role == 'builder') {
                roleBuilder.run(creep);
            }
        }
    }
};

module.exports = rolePath;