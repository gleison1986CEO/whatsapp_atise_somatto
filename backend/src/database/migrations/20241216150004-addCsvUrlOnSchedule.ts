import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.addColumn("ScheduleServices", "CsvUrl", {
            type: DataTypes.TEXT,
            allowNull: true
        });
    },

    down: (queryInterface: QueryInterface) => {
        return queryInterface.removeColumn("ScheduleServices", "CsvUrl");
    }
};
