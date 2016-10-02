var roleMover = {
    run: function (creep) {

        if (creep.carry.energy == 0) {
            if (creep.room.name != creep.memory.room) {
                var exitDir = Game.map.findExit(creep.room.name, creep.memory.room);
                var Exit = creep.pos.findClosestByRange(exitDir);
                creep.moveTo(Exit);
            } else {
                var source = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_STORAGE;
                    }
                });
                if (source) {
                    if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    }
                }
            }
        }
        if (creep.carry.energy > 0) {
            if (creep.room.name != 'E51N1') {
                var exitDir = Game.map.findExit(creep.room.name, 'E51N1');
                var Exit = creep.pos.findClosestByRange(exitDir);
                creep.moveTo(Exit);

                var found = creep.room.lookForAt(LOOK_STRUCTURES, creep.pos);
                if (found.length == 0) {
                    creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
                }

                var building = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                if (building) {
                    if (creep.build(building) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(building);
                    }
                }

                var repairUnit = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax;
                    }
                });
                if (repairUnit)
                {
                    if (creep.repair(repairUnit) == ERR_NOT_IN_RANGE);
                    creep.moveTo(repairUnit);
                }
            } else {
                var storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_STORAGE;
                    }
                });
                if (storage) {
                    if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage);
                    }
                }
            }
        }
    }
};

module.exports = roleMover;