var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var counter = 0;
        var begingcounter = false;
         if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('harvesting');
	    }
	    
         if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
             counter = 0;
	        creep.memory.upgrading = true;
	        creep.say('upgrading');
	    }
        
	    if(!creep.memory.upgrading) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
	    }
	    if (begingcounter) counter++;
	    if (creep.name == 'Grayson') creep.say(counter);
	}
};

module.exports = roleUpgrader;