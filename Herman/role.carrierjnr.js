var roleCarrierJnr = {
    run: function (creep) {
        if (!creep.memory.harvesting && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
        }
        if (creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
        }

        if (creep.memory.harvesting) {
            var targets = creep.pos.findInRange(FIND_DROPPED_ENERGY, 3);
            if (targets.length > 0) {
                if (creep.pickup(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            else {
                var source = Game.spawns.Spawn1.room.lookForAt('structure', 36, 24)[0];
                if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(source);
            }
        }
        else {
            var target = Game.spawns.Spawn1.room.lookForAt('structure', 34, 24)[0];
            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else creep.memory.harvesting = true;
        }
    }
};

module.exports = roleCarrierJnr;