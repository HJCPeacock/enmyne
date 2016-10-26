var processTowers = {
    run: function (room) {
        var towers = room.find(FIND_MY_STRUCTURES, { filter: (x) => x.structureType == STRUCTURE_TOWER });
        if (towers.length == 0) return;

        var hostiles = room.find(FIND_HOSTILE_CREEPS);

        var closestInjuredCreep = room.find(FIND_MY_CREEPS, {
            filter: (injuredCreep) => injuredCreep.hits < injuredCreep.hitsMax
        });

        var closestDamagedStructure = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return closestwWallRmpart(structure) ||
                       ((structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER ||
                        structure.structureType == STRUCTURE_STORAGE ||
                        structure.structureType == STRUCTURE_LINK ||
                        structure.structureType == STRUCTURE_TERMINAL ||
                        structure.structureType == STRUCTURE_ROAD) && structure.hits < structure.hitsMax - 400);
            }
        });

        var hostile = hostiles.length > 0 ? towers[0].pos.findClosestByRange(hostiles) : null;

        if ((Memory.Ticks == 10 || Memory.Ticks == 20 || Memory.Ticks == 30 || Memory.Ticks == 40) && hostile) {
            towers.forEach(tower => tower.attack(hostile));
        }

        if (!hostile && Memory.TowerAttackDamage[room.name] && Memory.TowerAttackDamage[room.name].hp) Memory.TowerAttackDamage[room.name] = {}

        if (hostile) {
            if (!Memory.TowerAttackDamage[room.name]) Memory.TowerAttackDamage[room.name] = {};
            if (hostile.hits < Memory.TowerAttackDamage[room.name].hp) towers.forEach(tower => tower.attack(hostile));
            Memory.TowerAttackDamage[room.name] = { hp: hostile.hits };
        }

        if (closestInjuredCreep.length > 0) {
            towers.forEach(tower => tower.heal(closestInjuredCreep[0]));
        }
        else if (closestDamagedStructure.length > 0) {
            towers.forEach(tower => tower.energy >= 500 && tower.repair(closestDamagedStructure[0]));
        }

        function closestwWallRmpart(structure) {
            if (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) {
                if (Memory.repairHP[room.name]) {
                    if (Memory.repairHP[room.name][structure.id]) {
                        if (Memory.repairHP[room.name][structure.id].hp < structure.hits) Memory.repairHP[room.name][structure.id].hp = structure.hits;
                        else if (structure.hits < 2000 || structure.hits <= Memory.repairHP[room.name][structure.id].hp - 4800) return true;
                    } else {
                        Memory.repairHP[room.name][structure.id] = { hp: structure.hits };
                    }
                } else {
                    Memory.repairHP[room.name] = {};
                }
            }
        }
	}
};

module.exports = processTowers;