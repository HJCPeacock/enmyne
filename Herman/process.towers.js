var processTowers = {
    run: function (room) {
        var hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

        var closestInjuredCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: (injuredCreep) => injuredCreep.hits < injuredCreep.hitsMax
        });

        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return closestwWallRmpart(structure) ||
                       ((structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER ||
                        structure.structureType == STRUCTURE_ROAD) && structure.hits < structure.hitsMax - 800);
            }
        });

        var towers = room.find(FIND_MY_STRUCTURES, { filter: (x) => x.structureType == STRUCTURE_TOWER });
        for (var towername in towers) {
            var tower = towers[towername];

            //Attack
            if ((Memory.Ticks == 10 || Memory.Ticks == 20 || Memory.Ticks == 30 || Memory.Ticks == 40) && hostile) {
                tower.attack(hostile);
            }

            if (!hostile && Memory.TowerAttackDamage[room.name] && Memory.TowerAttackDamage[room.name].hp) Memory.TowerAttackDamage[room.name] = {}

            if (hostile) {
                if (!Memory.TowerAttackDamage[room.name]) Memory.TowerAttackDamage[room.name] = {};
                if (!Memory.TowerAttackDamage[room.name].hp) Memory.TowerAttackDamage[room.name] = { hp: hostile.hits };
                if (hostile.hits < Memory.TowerAttackDamage[room.name].hp) tower.attack(hostile);
                if (hostile.hits < Memory.TowerAttackDamage[room.name].hp) Memory.TowerAttackDamage[room.name] = { hp: hostile.hits };
            }

            //Heal
            if(closestInjuredCreep) 
                tower.heal(closestInjuredCreep);

            //Repair
            if(closestDamagedStructure && tower.energy >= 500)
                tower.repair(closestDamagedStructure);
        }

        function closestwWallRmpart(structure) {
            if (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) {
                if (Memory.repairHP[tower.room.name]) {
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
};

module.exports = processTowers;