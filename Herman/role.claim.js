var rolePath = {

    /** @param {Creep} creep **/
    run: function (creep) {
        console.log(creep.room.name);
        console.log(creep.memory.sourceRoom);
        //Game.spawns['Spawn1'].createCreep([MOVE], undefined, { role: 'path2' });
        if (creep.room.name != creep.memory.sourceRoom) {
            var exitDir = Game.map.findExit(creep.room.name, creep.memory.sourceRoom);
            var Exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(Exit);
        }
        else if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);

        }
    }
};

module.exports = rolePath;