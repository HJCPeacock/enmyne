var processSpawning = {
    run: function (room, builderLimit, hervesterlimit, upgraderLimit, attackerLimit, carrierLimit, carrierJnrLimit) {

        var spawns = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_SPAWN;
            }
        });

        var hasLinks = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_LINK;
            }
        }) > 2;

        var hasStorage = !(room.storage == undefined);

        var roomCreeps = room.find(FIND_MY_CREEPS);

        var builders = _.filter(roomCreeps, (creep) => creep.memory.role == 'builder');
        var harvesters = _.filter(roomCreeps, (creep) => creep.memory.role == 'harvester');
        var upgraders = _.filter(roomCreeps, (creep) => creep.memory.role == 'upgrader');
        var attackers = _.filter(roomCreeps, (creep) => creep.memory.role == 'attacker');
        var carrierJnrs = _.filter(roomCreeps, (creep) => creep.memory.role == 'carrierjnr');
        var carriers = _.filter(roomCreeps, (creep) => creep.memory.role == 'carrier');

        var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
        var movers = _.filter(Game.creeps, (creep) => creep.memory.role == 'mover');
        var claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claim');

        //console.log('Builders: ' + builders.length);
        //console.log('Harvesters: ' + harvesters.length)
        //console.log('Upgraders: ' + upgraders.length)
        //console.log('Total: ' + Game.rooms['E51N1'].find(FIND_MY_CREEPS).length)

        var harvesterBody = buildHarvesterBody();
        var carrierJnrBody = [CARRY, MOVE];
        var carrierBody = buildCarrierBody();
        var builderBody = buildBuilderBody();
        var upgraderBody = buildUpgraderBody();
        var attackerBody = buildAttackerBody();
        var claimerBody = [MOVE, CLAIM, CLAIM, MOVE];
        var minerBody = [WORK, WORK, WORK, CARRY, MOVE, MOVE];
        var moverBody = [WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];

        for (var name in spawns)
        {
            var spawn = spawns[name];
            if (!spawn) return;

            if (harvesters.length < hervesterlimit) {
                if (spawn.canCreateCreep(harvesterBody, undefined) == OK) {
                    var newName = spawn.createCreep(harvesterBody, undefined, { role: 'harvester', harvesting: true, source: getSourceCount() == 0 ? 0 : 1 });
                    console.log('Spawning new harvester: ' + newName);
                }
                return;
            }
            else if (upgraders.length < upgraderLimit) {
                if (spawn.canCreateCreep(upgraderBody, undefined) == OK) {
                    var newName = spawn.createCreep(upgraderBody, undefined, { role: 'upgrader', upgrading: false });
                    console.log('Spawning new upgrader: ' + newName);
                }
                return;
            }
            else if (carrierJnrs.length < carrierJnrLimit) {
                if (spawn.canCreateCreep(carrierJnrBody, undefined) == OK) {
                    var newName = spawn.createCreep(carrierJnrBody, undefined, { role: 'carrierjnr' });
                    console.log('Spawning new carrierjnr: ' + newName);
                }
                 return;
            }
            else if (carriers.length < carrierLimit) {
                if (spawn.canCreateCreep(carrierBody, undefined) == OK) {
                    var newName = spawn.createCreep(carrierBody, undefined, { role: 'carrier', harvesting: true });
                    console.log('Spawning new carrier: ' + newName);
                }
                return;
            }
            else if (builders.length < builderLimit) {
                if (spawn.canCreateCreep(builderBody, undefined) == OK)
                {
                    var newName = spawn.createCreep(builderBody, undefined, { role: 'builder', building: false });
                    console.log('Spawning new builder: ' + newName);
                }
                return;
            }
            else if (attackers.length < attackerLimit) {
                if (spawn.canCreateCreep(attackerBody, undefined) == OK)
                {
                    var newName = spawn.createCreep(attackerBody, undefined, { role: 'attacker' });
                    console.log('Spawning new attacker: ' + newName);
                }
                return;
            }
            else if (miners.length < 1 && room.name == 'E51N1') {
                if (spawn.canCreateCreep(minerBody, undefined) == OK) {
                    var newName = spawn.createCreep(minerBody, undefined, { role: 'miner', room: setMinerRoom(), mining: false });
                    console.log('Spawning new miner: ' + newName);
                }
                return;
            }
            else if (movers.length < 1 && room.name == 'E51N1') {
                if (spawn.canCreateCreep(moverBody, undefined) == OK) {
                    var newName = spawn.createCreep(moverBody, undefined, { role: 'mover', room: setMoverRoom() });
                    console.log('Spawning new mover: ' + newName);
                }
                return;
            }
            else if (claimers.length < 1 && room.name == 'E51N1') {
                if (spawn.canCreateCreep(claimerBody, undefined) == OK) {
                    var newName = spawn.createCreep(claimerBody, undefined, { role: 'claim', room: setClaimRoom() });
                    console.log('Spawning new claimer: ' + newName);
                }
                return;
            }
        }

        function setMinerRoom() {
            if (_.filter(miners, (creep) => creep.memory.room == 'E51N2').length == 0) return 'E51N2';
        }

        function setMoverRoom() {
            if (_.filter(movers, (creep) => creep.memory.room == 'E51N2').length == 0) return 'E51N2';
        }

        function setClaimRoom() {
            if (_.filter(claimers, (creep) => creep.memory.room == 'E51N2').length == 0) return 'E51N2';
        }

        function getSourceCount() {
            return _.filter(harvesters, (creep) => creep.memory.source == 0).length;
        }

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

        function buildHarvesterBody()
        {
            //based on roads
            if (room.energyCapacityAvailable >= 850 && hasLinks && hasStorage)
                return roomCreeps.length < 3 ? [WORK, CARRY, CARRY, MOVE, MOVE] : [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];//6 - 6 = 0
            if (room.energyCapacityAvailable >= 950 && (!hasLinks || !hasStorage))
                return roomCreeps.length < 3 ? [WORK, CARRY, CARRY, MOVE, MOVE] : [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];//10 - 10 = 0
            if (room.energyCapacityAvailable >= 800 && (!hasLinks || !hasStorage))
                return roomCreeps.length < 3 ? [WORK, CARRY, CARRY, MOVE, MOVE] : [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];//8 - 8 = 0
            if (room.energyCapacityAvailable >= 600)
                return [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];//6 - 6 = 0
            if (room.energyCapacityAvailable >= 400)
                return [WORK, WORK, CARRY, CARRY, MOVE, MOVE];//4 - 4 = 0
            if (room.energyCapacityAvailable >= 300)
                return [WORK, CARRY, CARRY, MOVE, MOVE];//3 - 4 = -1
        }

        function buildCarrierBody()
        {
            //based on roads
            if (roomCreeps.length < 4)
                return [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE];
            if (room.energyCapacityAvailable >= 900)
                return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];//12 - 12 = 0
            if (room.energyCapacityAvailable >= 750)
                return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];//10 - 10 = 0
            if (room.energyCapacityAvailable >= 600)
                return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];//8 - 8 = 0
            if (room.energyCapacityAvailable >= 450)
                return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];//6 - 6 = 0
        }

        function buildBuilderBody()
        {
            //based on plain terain
            if (room.energyCapacityAvailable >= 1250)
                return [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];//20 - 20 = 0
            if (room.energyCapacityAvailable >= 1000)
                return [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];//16 - 16 = 0
            if (room.energyCapacityAvailable >= 900)
                return [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];//14 - 14 = 0
            if (room.energyCapacityAvailable >= 650)
                return [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];//10 - 10 = 0
            if (room.energyCapacityAvailable >= 500)
                return [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];//8 - 8 = 0
            if (room.energyCapacityAvailable >= 300)
                return [WORK, CARRY, MOVE, MOVE];//4 - 4 = 0
        }

        function buildUpgraderBody()
        {
            //based on roads
            if (room.energyCapacityAvailable >= 1350 && hasLinks && hasStorage)
                return [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];//10 - 10 = 0
            if (room.energyCapacityAvailable >= 1100 && hasLinks && hasStorage)
                return [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];//8 - 8 = 0
            if (room.energyCapacityAvailable >= 850 && hasLinks && hasStorage)
                return [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];//6 - 6 = 0
            if (room.energyCapacityAvailable >= 800 && (!hasLinks || !hasStorage))
                return [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];//8 - 8 = 0
            if (room.energyCapacityAvailable >= 600)
                return [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];//6 - 6 = 0
            if (room.energyCapacityAvailable >= 400)
                return [WORK, WORK, CARRY, CARRY, MOVE, MOVE];//4 - 4 = 0
            if (room.energyCapacityAvailable >= 300)
                return [WORK, CARRY, CARRY, MOVE, MOVE];//3 - 4 = -1
        }

        function buildAttackerBody()
        {
            //based on plain terain
            if (room.energyCapacityAvailable >= 1200)
                return [MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL];//10 - 10 = 0
            if (room.energyCapacityAvailable >= 900)
                return [MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL];//8 - 8 = 0
            if (room.energyCapacityAvailable >= 700)
                return [MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, HEAL];//6 - 6 = 0
            if (room.energyCapacityAvailable >= 400)
                return [MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK];//4 - 4 = 0
            if (room.energyCapacityAvailable >= 300)
                return [MOVE, RANGED_ATTACK];//2 - 2 = 0
        }
    }
};

module.exports = processSpawning;