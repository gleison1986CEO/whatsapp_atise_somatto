import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.addColumn("TicketScheduleServices", "filterId", {
            type: DataTypes.INTEGER,
            allowNull: true
        });
    },

    down: (queryInterface: QueryInterface) => {
        return queryInterface.removeColumn("TicketScheduleServices", "filterId");
    }
};
