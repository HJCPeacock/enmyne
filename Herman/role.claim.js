var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

var rolePath = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.room.name != 'E51N2') {
            var exitDir = Game.map.findExit(creep.room.name, 'E51N2');
            var Exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(Exit);
        }
        else {
            if (creep.memory.upgrading != undefined) {
                roleUpgrader.run(creep);
            }
            if (creep.memory.building != undefined) {
                roleBuilder.run(creep);
            }
            if (creep.room.controller) {
                if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
    }
};

module.exports = rolePath;