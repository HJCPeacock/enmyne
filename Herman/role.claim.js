var rolePath = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.room.name != 'E51N3') {
            var exitDir = Game.map.findExit(creep.room.name, creep.memory.sourceRoom);
            var Exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(Exit);
        }
        else {
            var targetlink = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
            if (targetlink) {
                if (creep.dismantle(targetlink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetlink);
                }
            }

        }
    }
};

module.exports = rolePath;