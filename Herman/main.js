var roleHarvester = require('role.harvester');
var roleCarrierJnr = require('role.carrierjnr');
var roleCarrier = require('role.carrier');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleAttacker = require('role.attack');
var processSpawning = require('process.spawning');
var processTowers = require('process.towers');
var processLinks = require('process.links');
var roleClaim = require('role.claim');
var roleMining = require('role.mining');
var roleMover = require('role.mover');
var roleExplorer = require('role.explorer');

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
    }
    
    var myRooms = Game.rooms
    for (var name in myRooms)
    {
        var room = myRooms[name];
        
        //Allerts
        if ((room.name == 'E51N1' || room.name == 'E51N1') && room.find(FIND_MY_CREEPS).length < 2) Game.notify('O balls; screep count in room ' + room.name + ' = ' + room.find(FIND_MY_CREEPS).length);

        //spawning
        //params: Room, builders, harvesters, upgraders, attackers, carriers, carriersjnr
        processSpawning.run(room, calculateBuilderCount(room), 4, calculateUpgraderCount(room), calculateAttackerCount(room), calculateCarrierCount(room), calculateCarrierJnrCount(room));

        //Links
        processLinks.run(room);

        //towers
        
        processTowers.run(room);
    }

    function calculateUpgraderCount(room) {
        if (!room.storage) return 3;
        return Math.ceil(room.storage.store[RESOURCE_ENERGY] / 50000);
    }

    function calculateAttackerCount(room) {
        if (room.name == 'E51N1' || room.name == 'E51N3') {
            if (room.find(FIND_HOSTILE_CREEPS).length > 1) return 1;
        }
    }

    function calculateCarrierCount(room) {
        if (!room.storage) return 0;
        else if (room.storage.store[RESOURCE_ENERGY] > 1000 && room.find(FIND_STRUCTURES, {
                filter: (structure) => {
	                return structure.structureType == STRUCTURE_LINK;
        }
        }).length > 1) return 1;
        else return 0;
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
        return 0;
    }
}