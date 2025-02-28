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
      queryInterface.addColumn("ScheduleServices", "atendente", {
        type: DataTypes.INTEGER,
        allowNull: true
      }),
      queryInterface.addColumn("ScheduleServices", "fila", {
        type: DataTypes.INTEGER,
        allowNull: true
      }),
      queryInterface.addColumn("ScheduleServices", "para_atendimento", {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
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
      queryInterface.removeColumn("ScheduleServices", "qtdHours"),
      queryInterface.removeColumn("ScheduleServices", "atendente"),
      queryInterface.removeColumn("ScheduleServices", "fila"),
      queryInterface.removeColumn("ScheduleServices", "para_atendimento")
    ]);
  }
};
