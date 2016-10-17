var processTowers = {
    run: function(tower) {
        if (tower, hostile) {
            
            
            var closestInjuredCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (injuredCreep) => injuredCreep.hits < injuredCreep.hitsMax
            });
            
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return closestwWallRmpart(structure) ||
                           ((structure.structureType == STRUCTURE_SPAWN  ||
                            structure.structureType == STRUCTURE_TOWER ||
                            structure.structureType == STRUCTURE_ROAD) && structure.hits < structure.hitsMax - 800);
                }
            });

            if ((Memory.Ticks == 10 || Memory.Ticks == 20 || Memory.Ticks == 30 || Memory.Ticks == 40) && hostile)
            {
                tower.attack(hostile);
            }

            if (!hostile && Memory.TowerAttackDamage[tower.room.name] && Memory.TowerAttackDamage[tower.room.name].hp) Memory.TowerAttackDamage[tower.room.name] = {}
            
            if (hostile) {
                if (!Memory.TowerAttackDamage[tower.room.name]) Memory.TowerAttackDamage[tower.room.name] = {};
                if (!Memory.TowerAttackDamage[tower.room.name].hp) Memory.TowerAttackDamage[tower.room.name] = { hp: hostile.hits };
                if (hostile.hits < Memory.TowerAttackDamage[tower.room.name].hp) tower.attack(hostile);
                if (hostile.hits < Memory.TowerAttackDamage[tower.room.name].hp) Memory.TowerAttackDamage[tower.room.name] = { hp: hostile.hits };
            }
            else if(closestInjuredCreep) {
                tower.heal(closestInjuredCreep);
            }
            else if(closestDamagedStructure && tower.energy >= 500) {
                tower.repair(closestDamagedStructure);
            }

            function closestwWallRmpart(structure) {
                if (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) {
                    if (Memory.repairHP[tower.room.name])
                    {
                        if (Memory.repairHP[tower.room.name][structure.id]) {
                            if (Memory.repairHP[tower.room.name][structure.id].hp < structure.hits) Memory.repairHP[tower.room.name][structure.id].hp = structure.hits;
                            else if (structure.hits < 2000 || structure.hits < Memory.repairHP[tower.room.name][structure.id].hp - 1000) return true;
                        } else {
                            Memory.repairHP[tower.room.name][structure.id] = { hp: structure.hits };
                        }
                    } else {
                        Memory.repairHP[tower.room.name] = {};
                    }
                }
            }
        }
	}
};

module.exports = processTowers;