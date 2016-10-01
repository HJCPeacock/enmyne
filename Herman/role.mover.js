var roleMover = {
    run: function (creep) {
        if (creep.room.name != creep.memory.room) {
            var exitDir = Game.map.findExit(creep.room.name, creep.memory.room);
            var Exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(Exit);
        }
    }
};

module.exports = roleMover;