var processTowers = {
    run: function(tower) {
        if(tower) {
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            
            var closestInjuredCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (injuredCreep) => injuredCreep.hits < injuredCreep.hitsMax
            });
            
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (closestwWallRmpart(structure) || (structure.structureType == STRUCTURE_SPAWN && structure.hits < structure.hitsMax) ||
                                (structure.structureType == STRUCTURE_TOWER && structure.hits < structure.hitsMax) ||
                                (structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax)
                                );
                }
            });
            
            if(closestHostile) {
                tower.attack(closestHostile);
            }
            else if(closestInjuredCreep) {
                tower.heal(closestInjuredCreep);
            }
            else if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }

            function closestwWallRmpart(structure) {
                if (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) {
                    if (Memory.repairHP[structure.id]) {
                        if (Memory.repairHP[structure.id].hp < structure.hits) Memory.repairHP[structure.id].hp = structure.hits;
                        else if (structure.hits < 2000 || structure.hits < Memory.repairHP[structure.id].hp) return true;
                    } else {
                        Memory.repairHP[structure.id] = { hp: structure.hits };
                    }
                }
            }

            //Add objects to memory
            //var walls = Game.rooms['W59S26'].find(FIND_STRUCTURES, {
            //    filter: (structure) => {
            //        return structure.structureType == STRUCTURE_RAMPART;
            //    }
            //});
            //for (var obj in walls) {
            //    var wall = walls[obj];
            //    //Memory.repairRamparts[wall.id] = {hp: wall.hits};
            //}
        }
	}
};

module.exports = processTowers;