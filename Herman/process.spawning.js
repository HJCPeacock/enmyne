var processSpawning = {
    run: function (room, builderLimit, hervesterlimit, upgraderLimit, attackerLimit, carrierLimit, carrierJnrLimit, moverLimit) {

        var spawns = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_SPAWN;
            }
        });

        if (spawns.length == 0) return;

        var hasLinks = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_LINK;
            }
        }).length > 1;

        var hasStorage = !(room.storage == undefined);

        var hasContainer = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER;
            }
        }).length > 0;

        var roomCreeps = room.find(FIND_MY_CREEPS);

        var builders = _.filter(roomCreeps, (creep) => creep.memory.role == 'builder');
        var harvesters = _.filter(roomCreeps, (creep) => creep.memory.role == 'harvester' && creep.ticksToLive > 50);
        var upgraders = _.filter(roomCreeps, (creep) => creep.memory.role == 'upgrader');
        var attackers = _.filter(roomCreeps, (creep) => creep.memory.role == 'attacker');
        var carrierJnrs = _.filter(roomCreeps, (creep) => creep.memory.role == 'carrierjnr');
        var carriers = _.filter(roomCreeps, (creep) => creep.memory.role == 'carrier');
        var extactors = _.filter(roomCreeps, (creep) => creep.memory.role == 'extractor');

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
        var minerBody = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
        var extractorBody = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];

        for (var name in spawns)
        {
            var spawn = spawns[name];
            if (!spawn) return;

            if (harvesters.length < hervesterlimit) {
                if (spawn.canCreateCreep(harvesterBody, undefined) == OK) {
                    var newName = spawn.createCreep(harvesterBody, undefined, { role: 'harvester', harvesting: true, source: getSourceCount(true) });
                    console.log('Spawning new harvester: ' + newName);
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
            else if (upgraders.length < upgraderLimit) {
                if (spawn.canCreateCreep(upgraderBody, undefined) == OK) {
                    var newName = spawn.createCreep(upgraderBody, undefined, { role: 'upgrader', upgrading: false });
                    console.log('Spawning new upgrader: ' + newName);
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
                    var newName = spawn.createCreep(attackerBody, undefined, { role: 'attacker', flag: setFlag(room.name) });
                    console.log('Spawning new attacker: ' + newName);
                }
                return;
            }
            else if (miners.length < 2 && room.name == 'E51N1') {
                if (spawn.canCreateCreep(minerBody, undefined) == OK) {
                    var newName = spawn.createCreep(minerBody, undefined, { role: 'miner', room: setMinerRoom(), mining: false });
                    console.log('Spawning new miner: ' + newName);
                }
                return;
            }
            else if (_.filter(movers, (creep) => creep.memory.sourceroom == room.name).length < moverLimit) {
                var desRoom = setMoverRoom();
                var inHouse = setInhouse(desRoom);
                var moverBody = buildMoverBody(inHouse);
                if (spawn.canCreateCreep(moverBody, undefined) == OK) {
                    var newName = spawn.createCreep(moverBody, undefined, { role: 'mover', room: desRoom, inHouse: inHouse, flag: setFlag(desRoom), source: getSourceCount(false), sourceroom: room.name });
                    console.log('Spawning new mover: ' + newName);
                }
                return;
            }
            else if (claimers.length < 2 && room.name == 'E51N1') {
                var claimRoom = setClaimRoom();
                if (claimRoom == 'E51N2' && Game.rooms['E51N2'] && Game.rooms['E51N2'].controller.reservation && Game.rooms['E51N2'].controller.reservation.ticksToEnd > 3000) claimerBody = [CLAIM, MOVE];
                if (claimRoom == 'E52N1' && Game.rooms['E52N1'] && Game.rooms['E52N1'].controller.reservation && Game.rooms['E52N1'].controller.reservation.ticksToEnd > 3000) claimerBody = [CLAIM, MOVE];
                if (spawn.canCreateCreep(claimerBody, undefined) == OK) {
                    var newName = spawn.createCreep(claimerBody, undefined, { role: 'claim', room: claimRoom });
                    console.log('Spawning new claimer: ' + newName);
                }
                return;
            }
            else if (extactors.length < 1 && Memory.Ticks == 1 && room.terminal) {
                var minerals = room.find(FIND_MINERALS);
                if (minerals[0].mineralAmount == 0) return;
                if (spawn.canCreateCreep(extractorBody, undefined) == OK) {
                    var newName = spawn.createCreep(extractorBody, undefined, { role: 'extractor', harvesting: true });
                    console.log('Spawning new extractor: ' + newName);
                }
                return;
            }
        }

        function setMinerRoom() {
            if (_.filter(miners, (creep) => creep.memory.room == 'E51N2').length == 0) return 'E51N2';
            if (_.filter(miners, (creep) => creep.memory.room == 'E52N1').length == 0) return 'E52N1';
        }

        function setMinerSpawn() {

        }

        function setMinerLimit() {

        }

        function setMoverRoom() {
            if (_.filter(movers, (creep) => creep.memory.room == 'E51N2').length < 1) return 'E51N2';
            if (_.filter(movers, (creep) => creep.memory.room == 'E52N1').length < 2) return 'E52N1';
            if (_.filter(movers, (creep) => creep.memory.room == 'E51N3').length < 2 && hasContainer) return 'E51N3';
            if (_.filter(movers, (creep) => creep.memory.room == 'E51N1').length < 2 && hasContainer) return 'E51N1';
            if (_.filter(movers, (creep) => creep.memory.room == 'E53N3').length < 2 && hasContainer) return 'E53N3';
        }

        function setClaimRoom() {
            if (_.filter(claimers, (creep) => creep.memory.room == 'E51N2').length == 0) return 'E51N2';
            if (_.filter(claimers, (creep) => creep.memory.room == 'E52N1').length == 0) return 'E52N1';
        }

        function setInhouse(desRoom) {
            if (desRoom == 'E51N1') return true;
            if (desRoom == 'E51N3') return true;
            if (desRoom == 'E53N3') return true;
            return false;
        }

        function setFlag(desRoom) {
            if (desRoom == 'E51N2') return 'Flag1';
            if (desRoom == 'E52N1') return 'Flag2';
            if (desRoom == 'E51N1') return 'Flag3';
            if (desRoom == 'E51N3') return 'Flag4';
            if (desRoom == 'E53N3') return 'Flag5';
        }

        function getSourceCount(forHarvester) {
            if (forHarvester)
            {
                var res = _.filter(harvesters, (creep) => creep.memory.source == 0).length;
                if (res == 0) return 0;
                else return 1;
            } else {
                var res = _.filter(movers, (creep) => creep.memory.source == 0).length;
                if (res == 0) return 0;
                else return 1;
            }
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
            if (roomCreeps.length <= 2 || carriers.length == 0) return [WORK, CARRY, CARRY, MOVE, MOVE];
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

        function buildCarrierBody()
        {
            //based on roads
            if (roomCreeps.length < 4 || room.energyAvailable < 900)
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
            if (roomCreeps.length <= 2) return [WORK, CARRY, CARRY, MOVE, MOVE];
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
            if (room.energyCapacityAvailable >= 1470)
                return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK];//14 - 14 = 0
            if (room.energyCapacityAvailable >= 1050)
                return [MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK];//10 - 10 = 0
            if (room.energyCapacityAvailable >= 900)
                return [MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL];//8 - 8 = 0
            if (room.energyCapacityAvailable >= 700)
                return [MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, HEAL];//6 - 6 = 0
            if (room.energyCapacityAvailable >= 400)
                return [MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK];//4 - 4 = 0
            if (room.energyCapacityAvailable >= 300)
                return [MOVE, RANGED_ATTACK];//2 - 2 = 0
        }

        function buildMoverBody(inHouse)
        {
            //based on roads
            if (inHouse)
            {
                if (room.energyCapacityAvailable >= 450 && hasContainer)
                    return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];//6 - 6 = 0
               else
                    return [CARRY, CARRY, CARRY, MOVE, MOVE];//3 - 4 = -1
            } else
            {
                if (room.energyCapacityAvailable >= 700)
                    return [WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];//8 - 8 = 0
                if (room.energyCapacityAvailable >= 350)
                    return [WORK, CARRY, CARRY, CARRY, MOVE, MOVE];//4 - 4 = 0
            }
        }
    }
};

module.exports = processSpawning;