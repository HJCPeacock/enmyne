var roleRepair = {
    run: function (creep) {
        var room = creep.room.name;
        if (!Memory.RoomsWallRampart[room]) Memory.RoomsWallRampart[room] = { wallRampartHP: 100000 };
        var room_wallRampartHP = Memory.RoomsWallRampart[room].wallRampartHP;

        if (Memory.Ticks == 1)
        {
            var highestHP = {id : 'id', hp: 0};
            var wallRamparts = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_RAMPART || structure.structureType == STRUCTURE_WALL;
                }
            });
            if (wallRamparts.length > 0)
            {
                for (var structurename in wallRamparts) {
                    var structure = wallRamparts[structurename];

                    if (structure.hits >= highestHP.hp)
                    {
                        highestHP.hp = structure.hits;
                        highestHP.id = structure.id;
                    }
                }

                if (highestHP.hp >= Memory.repairHP[highestHP.id].hp) Memory.RoomsWallRampart[room].wallRampartHP = highestHP.hp + 10000;
            }

            //Clearing Memory
            for (var objname in Memory.repairHP)
            {

            }
        }
        
        var rampart = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_RAMPART && structure.hits < room_wallRampartHP);
            }
        });
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_SPAWN && structure.hits < structure.hitsMax) ||
                            (structure.structureType == STRUCTURE_TOWER && structure.hits < structure.hitsMax) ||
                            (structure.structureType == STRUCTURE_STORAGE && structure.hits < structure.hitsMax) ||
                            (structure.structureType == STRUCTURE_WALL && structure.hits < room_wallRampartHP) ||
                            (structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax)
                            );
                }
	    });
	    if (rampart)
	    {
	        if (creep.repair(rampart) == ERR_NOT_IN_RANGE) {
	            creep.moveTo(rampart);
	        }
	    }
        else if(target) {
            if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
	}
};

module.exports = roleRepair;