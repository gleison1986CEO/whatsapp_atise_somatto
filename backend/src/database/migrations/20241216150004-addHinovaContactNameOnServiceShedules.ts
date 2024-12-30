import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.addColumn("ScheduleServices", "hinovaContactName", {
            type: DataTypes.STRING,
            allowNull: true
        });
    },

    down: (queryInterface: QueryInterface) => {
        return queryInterface.removeColumn("ScheduleServices", "hinovaContactName");
    }
};
