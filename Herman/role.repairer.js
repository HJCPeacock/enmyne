var roleRepair = {
    run: function (creep) {
        var room = creep.room.name;
        if (!Memory.RoomsWallRampart[room]) Memory.RoomsWallRampart[room] = { wallRampartHP: 100000 };
        var room_wallRampartHP = Memory.RoomsWallRampart[room].wallRampartHP;

        if (Memory.Ticks == 1)
        {
            var highestHP = { id: 'id', hp: 0 };
            var lowestHP = { id: 'id', hp: room_wallRampartHP };
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
                    if (structure.hits <= lowestHP.hp) {
                        lowestHP.hp = structure.hits;
                        lowestHP.id = structure.id;
                    }
                }

                if (lowestHP.hp >= highestHP.hp) Memory.RoomsWallRampart[room].wallRampartHP = highestHP.hp + 50000;
            }

            //Clearing Memory
            for (var objname in Memory.repairHP[room])
            {
                if (_.filter(wallRamparts, (x) => x.id == objname).length == 0) delete Memory.repairHP[room][objname];
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
                            (structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax - 400)
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