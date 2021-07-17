export default (sequelize, DataTypes) => {
    return sequelize.define('contractform', {
        type: { type: DataTypes.INTEGER },
        id: { type: DataTypes.INTEGER },
        bang: { type:DataTypes.STRING(50) },

        types1 : {type:DataTypes.STRING(200)},
        types2 : {type:DataTypes.STRING(200)},
        types3 : {type:DataTypes.STRING(200)},
        types4 : {type:DataTypes.STRING(50)},

        value1: { type: DataTypes.INTEGER },
        value1Index: { type: DataTypes.INTEGER },
        value2: { type: DataTypes.INTEGER },
        value2Index: { type: DataTypes.INTEGER },
        value3: { type: DataTypes.INTEGER, allowNull: false },
        value3Index: { type: DataTypes.INTEGER, allowNull: false },
        value4 : {type:DataTypes.STRING(50)},

        Employer : {type:DataTypes.STRING(50)},
        Employee : {type:DataTypes.STRING(50)},

        StartYear : {type:DataTypes.STRING(50)},
        StartMonth : {type:DataTypes.STRING(50)},

        StartDay : {type:DataTypes.STRING(200)},
        EndDay : {type:DataTypes.STRING(200)},

        WorkPlace : {type:DataTypes.STRING(200)},

        StartTimeHour : {type:DataTypes.STRING(200)},
        EndTimeHour : {type:DataTypes.STRING(200)},
        BreakTimeStartHour : {type:DataTypes.STRING(200)},
        BreakTimeEndHour : {type:DataTypes.STRING(200)},
        WorkingDays : {type:DataTypes.STRING(200)},
        
        Bonus : {type:DataTypes.STRING(200)},
        Bonus1 : {type:DataTypes.STRING(200)},
        Bonus2 : {type:DataTypes.STRING(200)},
        Bonus3 : {type:DataTypes.STRING(200)},
        Bonus4 : {type:DataTypes.STRING(200)},
        
        SalaryDay : {type:DataTypes.STRING(200)},
        ContractYear : {type:DataTypes.STRING(200)},
        ContractMonth : {type:DataTypes.STRING(200)},
        ContractDay : {type:DataTypes.STRING(200)},
        
        BusinessName : {type:DataTypes.STRING(200)},
        BusinessAddress : {type:DataTypes.STRING(200)},
        BusinessPhone : {type:DataTypes.STRING(200)},
        BusinessOwner1 : {type:DataTypes.STRING(200)},

        EmployeeAddress : {type:DataTypes.STRING(200)},
        EmployeePhone : {type:DataTypes.STRING(200)},
        EmployeeName : {type:DataTypes.STRING(200)},

        WorkReference : {type:DataTypes.STRING(200)},
        StartTimeHMin : {type:DataTypes.STRING(200)},
        EndTimeHMin : {type:DataTypes.STRING(200)},

        BreakTimeStartMin : {type:DataTypes.STRING(200)},
        BreakTimeEndMin : {type:DataTypes.STRING(200)},
        
        Holiday : {type:DataTypes.STRING(200)},
        EndYear : {type:DataTypes.STRING(200)},
        EndMonth : {type:DataTypes.STRING(200)},

        Salary : {type:DataTypes.STRING(200)},
        SalaryCalculationPeriodStart : {type:DataTypes.STRING(200)},
        BreakTimeEnSalaryCalculationPeriodEnddMin : {type:DataTypes.STRING(200)},
    },{
      timestamps:false
    });
}