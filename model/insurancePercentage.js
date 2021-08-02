export default (sequelize, DataTypes) => {
    return sequelize.define('insurancePercentage', {
        date :{ type: DataTypes.STRING(50), primaryKey: true, defaultValue: '', allowNull: false},
        bang :{ type: DataTypes.STRING(200), primaryKey: true, allowNull: false},

        NationalPensionPercentage: { type: DataTypes.DOUBLE, allowNull: false },
        HealthInsurancePercentage: { type: DataTypes.DOUBLE, allowNull: false },
        RegularCarePercentage: { type: DataTypes.DOUBLE, allowNull: false },
        EmploymentInsurancePercentage: { type: DataTypes.DOUBLE, allowNull: false },
        HourlyWage: { type: DataTypes.DOUBLE, allowNull: false },
    },{
      timestamps:false
    });
}