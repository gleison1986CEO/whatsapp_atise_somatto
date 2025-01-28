import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.addColumn("TicketScheduleServices", "CsvUrl", {
            type: DataTypes.TEXT,
            allowNull: true
        });
    },

    down: (queryInterface: QueryInterface) => {
        return queryInterface.removeColumn("TicketScheduleServices", "CsvUrl");
    }
};
