var processSpawning = require('process.spawning');
var processTowers = require('process.towers');
var processLinks = require('process.links');
var processTerminal = require('process.terminal');
var roleHarvester = require('role.harvester');
var roleCarrierJnr = require('role.carrierjnr');
var roleCarrier = require('role.carrier');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleAttacker = require('role.attack');
var roleClaim = require('role.claim');
var roleMining = require('role.mining');
var roleMover = require('role.mover');
var roleExplorer = require('role.explorer');
var roleExtractor = require('role.extractor');

module.exports.loop = function () {

    //All Rooms

    //Global Time
    if (Memory.Ticks == 0) Memory.Ticks = 50;
    Memory.Ticks--;

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var myScreeps = Game.creeps;
    for (var screepname in myScreeps) {
        var creep = myScreeps[screepname];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'carrierjnr') {
            roleCarrierJnr.run(creep);
        }
        if (creep.memory.role == 'carrier') {
            roleCarrier.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'attacker') {
            roleAttacker.run(creep);
        }
        if (creep.memory.role == 'claim') {
            roleClaim.run(creep);
        }
        if (creep.memory.role == 'miner') {
            roleMining.run(creep);
        }
        if (creep.memory.role == 'mover') {
            roleMover.run(creep);
        }
        if (creep.memory.role == 'explorer') {
            roleExplorer.run(creep);
        }
        if (creep.memory.role == 'extractor') {
            roleExtractor.run(creep);
        }
    }
    
    var myRooms = Game.rooms
    for (var name in myRooms)
    {
        var room = myRooms[name];
        
        //Allerts
        if ((room.name == 'E51N1' || room.name == 'E51N1') && room.find(FIND_MY_CREEPS).length < 2) Game.notify('O balls; screep count in room ' + room.name + ' = ' + room.find(FIND_MY_CREEPS).length);

        //spawning
        //params: Room, builders, harvesters, upgraders, attackers, carriers, carriersjnr, movers
        processSpawning.run(room, calculateBuilderCount(room), 2, calculateUpgraderCount(room), calculateAttackerCount(room), calculateCarrierCount(room), calculateCarrierJnrCount(room), calculateMoverCount(room));

        //Links
        processLinks.run(room);

        //towers
        processTowers.run(room);

        //Terminals
        processTerminal.run(room);
    }

    function calculateUpgraderCount(room) {
        if (!room.storage) return 1;
        var devider = room.storage.store[RESOURCE_ENERGY] - 100000 > 0 ? room.storage.store[RESOURCE_ENERGY] - 100000 : 50000;
        return Math.ceil(devider / 50000);
    }

    function calculateAttackerCount(room) {
        if (room.find(FIND_HOSTILE_CREEPS).length > 0 && room.name != 'E53N3') return 1;
    }

    function calculateCarrierCount(room) {
        if (!room.storage) return 0;
        else return 1;
    }

    function calculateCarrierJnrCount(room) {
        if (!room.storage || room.find(FIND_STRUCTURES, {
            filter: (structure) => {
	                return structure.structureType == STRUCTURE_LINK;
        }
        }).length < 2) return 0;
        return 1;
    }

    function calculateBuilderCount(room) {
        if (room.name == 'E51N1') return 1;
        if (room.name == 'E51N3') return 1;
        if (room.name == 'E53N3') return 3;
        return 0;
    }

    function calculateMoverCount(room) {
        if (room.name == 'E51N1') return 3;
        if (room.name == 'E53N3') return 2;
        return 0;
    }

    //Things to check
    //wallrampart lowest, highest repairlevel
    //controller level
    //cpu
}