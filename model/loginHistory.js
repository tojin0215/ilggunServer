export default (sequelize, DataTypes) => {
  return sequelize.define('loginHistory', {
    bang: { type: DataTypes.STRING(50) },
    login_time: { type: DataTypes.STRING(100) },
    numberofworkers: { type: DataTypes.INTEGER }

  }, {
    timestamps: false
  });
}