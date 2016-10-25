var processLinks = {
    run: function (room) {

        //room E51N1
        if (room.name == 'E51N1') {
            if (!Game.spawns.Spawn1) return;

            var linkFrom1 = Game.spawns.Spawn1.room.lookForAt('structure', 5, 11)[0];
            var linkTo = Game.spawns.Spawn1.room.lookForAt('structure', 17, 23)[0];
            var linkFrom2 = Game.spawns.Spawn1.room.lookForAt('structure', 36, 16)[0];

            //at source 1
            if (linkFrom1 != undefined && linkTo != undefined)
            {
                if (linkFrom1 && linkFrom1.cooldown == 0 && linkTo.energyCapacity - linkTo.energy >= linkFrom1.energy && linkFrom1.energy >= 200)
                    linkFrom1.transferEnergy(linkTo);
            }

            //at source 2
            if (linkFrom2 != undefined && linkTo != undefined)
            {
                if (linkFrom2 && linkFrom2.cooldown == 0 && linkTo.energyCapacity - linkTo.energy >= linkFrom2.energy && linkFrom2.energy >= 200)
                    linkFrom2.transferEnergy(linkTo);
            }
        }

        //Room E51N3
        if (room.name == 'E51N3') {
            if (!Game.spawns.Spawn2) return;

            var linkFrom1 = Game.spawns.Spawn2.room.lookForAt('structure', 10, 9)[0];
            var linkTo = Game.spawns.Spawn2.room.lookForAt('structure', 26, 37)[0];
            var linkFrom2 = Game.spawns.Spawn2.room.lookForAt('structure', 5, 16)[0];

            //at source 1
            if (linkFrom1 != undefined && linkTo != undefined)
            {
                if (linkFrom1 && linkFrom1.cooldown == 0 && linkTo.energyCapacity - linkTo.energy >= linkFrom1.energy && linkFrom1.energy >= 200)
                    linkFrom1.transferEnergy(linkTo);
            }

            //at source 2
            if (linkFrom2 != undefined && linkTo != undefined)
            {
                if (linkFrom2 && linkFrom2.cooldown == 0 && linkTo.energyCapacity - linkTo.energy >= linkFrom2.energy && linkFrom2.energy >= 200)
                    linkFrom2.transferEnergy(linkTo);
            }
        }
    }
};

module.exports = processLinks;