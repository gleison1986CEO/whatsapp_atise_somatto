import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return Promise.all([
      queryInterface.addColumn("ScheduleServices", "perDay", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("ScheduleServices", "periodStart", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("ScheduleServices", "periodEnd", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("ScheduleServices", "sendAtStart", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("ScheduleServices", "sendAtEnd", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("ScheduleServices", "qtdHours", {
        type: DataTypes.STRING,
        allowNull: true
      }),
    ]);
  },

  down: (queryInterface: QueryInterface) => {
    return Promise.all([
      queryInterface.removeColumn("ScheduleServices", "perDay"),
      queryInterface.removeColumn("ScheduleServices", "periodStart"),
      queryInterface.removeColumn("ScheduleServices", "periodEnd"),
      queryInterface.removeColumn("ScheduleServices", "sendAtStart"),
      queryInterface.removeColumn("ScheduleServices", "sendAtEnd"),
      queryInterface.removeColumn("ScheduleServices", "qtdHours")
    ]);
  }
};
