var processTowers = {
    run: function(tower) {
        if(tower) {
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            
            var closestInjuredCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (injuredCreep) => injuredCreep.hits < injuredCreep.hitsMax
            });
            
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return closestwWallRmpart(structure) ||
                           ((structure.structureType == STRUCTURE_SPAWN  ||
                            structure.structureType == STRUCTURE_TOWER ||
                            structure.structureType == STRUCTURE_ROAD) && structure.hits < structure.hitsMax);
                }
            });
            
            if(closestHostile) {
                tower.attack(closestHostile);
            }
            else if(closestInjuredCreep) {
                tower.heal(closestInjuredCreep);
            }
            else if(closestDamagedStructure && tower.energy >= 500) {
                tower.repair(closestDamagedStructure);
            }

            function closestwWallRmpart(structure) {
                if (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) {
                    if (Memory.repairHP[structure.id]) {
                        if (Memory.repairHP[structure.id].hp < structure.hits) Memory.repairHP[structure.id].hp = structure.hits;
                        else if (structure.hits < 2000 || structure.hits < Memory.repairHP[structure.id].hp - 1000) return true;
                    } else {
                        Memory.repairHP[structure.id] = { hp: structure.hits };
                    }
                }
            }
        }
	}
};

module.exports = processTowers;