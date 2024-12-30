import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.addColumn("TicketScheduleServices", "hinovaContactName", {
            type: DataTypes.STRING,
            allowNull: true
        });
    },

    down: (queryInterface: QueryInterface) => {
        return queryInterface.removeColumn("TicketScheduleServices", "hinovaContactName");
    }
};
