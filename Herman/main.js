var roleHarvester = require('role.harvester');
var roleCarrierJnr = require('role.carrierjnr');
var roleCarrier = require('role.carrier');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleAttacker = require('role.attack');
var processSpawning = require('process.spawning');
var processTowers = require('process.towers');
var processLinks = require('process.links');
var rolePath = require('role.claim');

module.exports.loop = function () {

    //All Rooms
    //processLinks.run();

    var myRooms = Game.rooms
    for (var name in myRooms )
    {
        var room = myRooms[name];

        //Allerts
        //if (room.find(FIND_MY_CREEPS).length < 4) Game.notify('O balls; screep count in room ' + room.name + ' = ' + room.find(FIND_MY_CREEPS).length);

        //spawning
        //params: builders, harvesters, upgraders, attackers, carriers
        processSpawning.run(2, room.find(FIND_SOURCES).length, calculateUpgraderCount(room), calculateAttackerCount(room), calculateCarrierCount(room));

        var myScreeps = room.find(FIND_MY_CREEPS);
        for (var name in myScreeps) {
            var creep = myScreeps[name];
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
            if (creep.memory.role == 'repairer') {
                roleRepairer.run(creep);
            }
            if (creep.memory.role == 'attacker') {
                roleAttacker.run(creep);
            }
            if (creep.memory.role == 'claim') {
                rolePath.run(creep);
            }
        }

        //towers
        var towers = room.find(FIND_MY_STRUCTURES, { filter: (x) => x.structureType == STRUCTURE_TOWER });
        for (var towerCounter = 0; towerCounter < towers.length; towerCounter++) {
            processTowers.run(towers[towerCounter]);
        }
    }

    function calculateUpgraderCount(room) {
        if (!room.storage) return 2;
        return Math.ceil(room.storage.store[RESOURCE_ENERGY] / 10000);
    }

    function calculateAttackerCount(room) {
        if (room.find(FIND_HOSTILE_CREEPS).length > 1) return 3;
    }

    function calculateCarrierCount(room) {
        if (!room.storage) return 0;
        else if (room.storage.store[RESOURCE_ENERGY] > 1000) return 1;
    }
}