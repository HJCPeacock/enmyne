var processSpawning = {
    run: function (room, roomCreeps, builderLimit, hervesterlimit, upgraderLimit, attackerLimit, carrierLimit, carrierJnrLimit) {

        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }

        var spawns = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_LINK;
            }
        });

        for (var name in spawns)
        {
            var spawn = spawns[name];
            if (!spawn) return;

            var builders = _.filter(roomCreeps, (creep) => creep.memory.role == 'builder');
            var harvesters = _.filter(roomCreeps, (creep) => creep.memory.role == 'harvester');
            var upgraders = _.filter(roomCreeps, (creep) => creep.memory.role == 'upgrader');
            var attackers = _.filter(roomCreeps, (creep) => creep.memory.role == 'attacker');
            var carrierJnrs = _.filter(roomCreeps, (creep) => creep.memory.role == 'carrierjnr');
            var carriers = _.filter(roomCreeps, (creep) => creep.memory.role == 'carrier');

            //console.log('Builders: ' + builders.length);
            //console.log('Harvesters: ' + harvesters.length)
            //console.log('Upgraders: ' + upgraders.length)
            //console.log('Total: ' + Game.rooms['E51N1'].find(FIND_MY_CREEPS).length)

            //Body Parts
            //time
            //t = ceil(k * W / M)

            //Where:
            //t = time (game ticks)
            //k = terrain factor (1x for plain, 0.5x for road, 5x for swamp)
            //W = creep weight (Number of body parts, excluding MOVE and empty CARRY parts)
            //M = number of MOVE parts

            //Fatigue
            //F = W * K - 2 * M

            //Where:
            //F = initial fatigue value
            //W = creep weight (Number of body parts, excluding MOVE and empty CARRY parts)
            //K = terrain factor (1x for road, 2x for plain, 10x for swamp)
            //M = number of MOVE parts

            var harvesterBody = buildHarvesterBody();
            var carrierJnrBody = [CARRY, MOVE];
            var carrierBody = buildCarrierBody();
            var builderBody = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];//[WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];//950 | 1 * 8 / 8 = 1 | 8 * 2 - 2 * 8 = 0
            var upgraderBody = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];//[WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]; //950 | 0.5 * 10 / 5 = 1  | 10 * 1 - 2 * 5 = 10 - 10 = 0
            var attackerBody = [MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, HEAL];

            if (harvesters.length < hervesterlimit && spawn.canCreateCreep(harvesterBody, undefined) == OK) {
                var newName = spawn.createCreep(harvesterBody, undefined, { role: 'harvester', harvesting: true, source: getSourceCount() == 0 ? 0 : 1 });
                console.log('Spawning new harvester: ' + newName);
            }
            else if (carrierJnrs.length < carrierJnrLimit && spawn.canCreateCreep(carrierJnrBody, undefined) == OK) {
                var newName = spawn.createCreep(carrierJnrBody, undefined, { role: 'carrierjnr' });
                console.log('Spawning new carrierjnr: ' + newName);
            }
            else if (carriers.length < carrierLimit && spawn.canCreateCreep(carrierBody, undefined) == OK) {
                var newName = spawn.createCreep(carrierBody, undefined, { role: 'carrier', harvesting: true });
                console.log('Spawning new carrier: ' + newName);
            }
            else if (builders.length < builderLimit && spawn.canCreateCreep(builderBody, undefined) == OK) {
                var newName = spawn.createCreep(builderBody, undefined, { role: 'builder', building: false });
                console.log('Spawning new builder: ' + newName);
            }
            else if (upgraders.length < upgraderLimit && spawn.canCreateCreep(upgraderBody, undefined) == OK) {
                var newName = spawn.createCreep(upgraderBody, undefined, { role: 'upgrader', upgrading: false });
                console.log('Spawning new upgrader: ' + newName);
            }
            else if (attackers.length < attackerLimit && spawn.canCreateCreep(attackerBody, undefined) == OK) {
                var newName = spawn.createCreep(attackerBody, undefined, { role: 'attacker' });
                console.log('Spawning new attacker: ' + newName);
            }

            function getSourceCount() {
                return _.filter(harvesters, (creep) => creep.memory.source == 0).length;
            }
        }

        function buildHarvesterBody()
        {
            if (room.energyCapacityAvailable <= 300)
                return [WORK, CARRY, CARRY, MOVE, MOVE];//3 - 4 = -1
            if (room.energyCapacityAvailable <= 400)
                return [WORK, WORK, CARRY, CARRY, MOVE, MOVE];//4 - 4 = 0
            if (room.energyCapacityAvailable <= 600)
                return [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];//6 - 6 = 0
            if (room.energyCapacityAvailable <= 800)
                return [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];//8 - 8 = 0
            if (room.energyCapacityAvailable >= 850)
                return [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];//6 - 6 = 0
        }

        function buildCarrierBody()
        {
            if (roomCreeps.length < 4)
                return [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE];
            if (room.energyCapacityAvailable <= 450)
                return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];//6 - 6 = 0
            if (room.energyCapacityAvailable <= 600)
                return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];//8 - 8 = 0
            if (room.energyCapacityAvailable <= 750)
                return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];//10 - 10 = 0
            if (room.energyCapacityAvailable >= 900)
                return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];//12 - 12 = 0
        }
    }
};

module.exports = processSpawning;