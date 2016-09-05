var processRenewing = {

    /** @param {Creep} creep **/
    run: function (creep) {
        var spawn = Game.spawns['Spawn1'];
        var renewCounter = 3;
        if (spawn.renewCreep(creep) == ERR_NOT_IN_RANGE) creep.moveTo(spawn);
        else if (spawn.renewCreep(creep) == OK) {
            for (var x = 0; x < 3; x++) {
                if (spawn.renewCreep(creep) == OK) break;
            }
            creep.memory.renewed = true;
        }
    }
};

module.exports = processRenewing;