var processTerminal = {
    run: function (room) {

        if (room.name != 'E51N1') return;
        if (Memory.Ticks == 1)
        {
            //room E51N1 Catalyst
            if (!room.terminal) return;

            if (room.terminal.store[RESOURCE_ENERGY] >= 10000)
            {
                var orders = Game.market.getAllOrders({ type: ORDER_BUY, resourceType: RESOURCE_CATALYST });
                var feasibleOrders = _.filter(orders, (x) => Game.market.calcTransactionCost(x.amount, room.name, x.roomName) <= 10000 && x.price >= 0.5);

                if (feasibleOrders.length > 0) feasibleOrders.forEach(feasibleOrder => marketDeal(feasibleOrder));
            }
        }

        function marketDeal(order)
        {
            if (room.terminal.store[RESOURCE_CATALYST] >= order.amount) Game.market.deal(order.id, order.amount, room.name);
        }
    }
};

module.exports = processTerminal;