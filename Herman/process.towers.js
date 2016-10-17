var processTowers = {
    run: function(tower) {
        if (tower) {
            var hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            var canAttack = Memory.TowerAttackDamage[tower.room.name] && Memory.TowerAttackDamage[tower.room.name].hp ? true : false;
            
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

            if ((Memory.Ticks == 15 || Memory.Ticks == 30 || Memory.Ticks == 45) && hostile)
            {
                if (!Memory.TowerAttackDamage[tower.room.name]) Memory.TowerAttackDamage[tower.room.name] = {};
                canAttack = true;
            }

            if (!hostile && Memory.TowerAttackDamage[tower.room.name] && Memory.TowerAttackDamage[tower.room.name].hp) Memory.TowerAttackDamage[tower.room.name] = {}
            
            if (hostile && canAttack) {
                if (!Memory.TowerAttackDamage[tower.room.name].hp) Memory.TowerAttackDamage[tower.room.name] = { hp: hostile.hits };
                tower.attack(hostile);
                if (hostile.hits >= Memory.TowerAttackDamage[tower.room.name].hp) Memory.TowerAttackDamage[tower.room.name] = {};
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