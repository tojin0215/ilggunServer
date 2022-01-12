export default (sequelize, DataTypes) => {
  return sequelize.define('loginHistory', {
    bang: { type: DataTypes.STRING(50) },
    login_time: { type: DataTypes.INTEGER },
    numberofworkers: { type: DataTypes.INTEGER }

  }, {
    timestamps: false
  });
}