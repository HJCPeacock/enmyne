var roleCarrier = {
    run: function (creep) {
        if (!creep.memory.harvesting && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
        }
        if (creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
        }

        if (creep.memory.harvesting) {
            var targets = creep.pos.findInRange(FIND_DROPPED_ENERGY, 3, { filter: (x) => x.resourceType == RESOURCE_ENERGY });
            if (targets.length > 0) {
                if (creep.pickup(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            else {
                var source = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] > 0;
                    }
                });
                if (source) {
                    if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(source);
                }
            }
        }
        else {
            var lowesttower = getTowerVolumes();
            if (lowesttower < 500) {
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_TOWER && structure.energy == lowesttower;
                    }
                });
                if (target) {
                    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
            }
            else {
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                    structure.structureType == STRUCTURE_SPAWN ||
                                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
                });
                if (target) {
                    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                else creep.memory.harvesting = true;
            }
        }

        function getTowerVolumes() {
            var lowest = 1000;
            var towers = Game.rooms['E51N1'].find(FIND_MY_STRUCTURES, { filter: (x) => x.structureType == STRUCTURE_TOWER });
            for (var towername in towers) {
                var tower = towers[towername];
                if (tower.energy <= lowest) lowest = tower.energy;
            }
            return lowest;
        }
    }
};

module.exports = roleCarrier;