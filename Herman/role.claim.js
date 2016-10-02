var rolePath = {
    run: function (creep) {
        if (creep.room.name != creep.memory.room) {
            var exitDir = Game.map.findExit(creep.room.name, creep.memory.room);
            var Exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(Exit);
        }
        else {
                if (creep.room.controller)
                {
                    if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
    }
};

module.exports = rolePath;