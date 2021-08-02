export default (sequelize, DataTypes) => {
    return sequelize.define('contractform2', {
        type: { type: DataTypes.INTEGER },
        id: { type:DataTypes.STRING(50) },
        bang: { type:DataTypes.STRING(50) },
 
        AdditionalWageRate : {type:DataTypes.STRING(50)},
        BusinessAddress : {type:DataTypes.STRING(50)},
        BusinessName : {type:DataTypes.STRING(50)},
        BusinessOwner1 : {type:DataTypes.STRING(50)},
        BusinessPhone : {type:DataTypes.STRING(50)},
        
        ContractDay : {type:DataTypes.STRING(50)},
        ContractMonth : {type:DataTypes.STRING(50)},
        ContractYear : {type:DataTypes.STRING(50)},

        Employer : {type:DataTypes.STRING(50)},
        Employee : {type:DataTypes.STRING(50)},

        End1 : {type:DataTypes.STRING(50)},
        End2 : {type:DataTypes.STRING(50)},
        End3 : {type:DataTypes.STRING(50)},
        End4 : {type:DataTypes.STRING(50)},
        End5 : {type:DataTypes.STRING(50)},
        End6 : {type:DataTypes.STRING(50)},
        End7 : {type:DataTypes.STRING(50)},

        EndDay : {type:DataTypes.STRING(50)},
        EndMonth : {type:DataTypes.STRING(50)},
        EndYear : {type:DataTypes.STRING(50)},

        Salary : {type:DataTypes.STRING(50)},
        SalaryDay : {type:DataTypes.STRING(50)},

        Start1 : {type:DataTypes.STRING(50)},
        Start2 : {type:DataTypes.STRING(50)},
        Start3 : {type:DataTypes.STRING(50)},
        Start4 : {type:DataTypes.STRING(50)},
        Start5 : {type:DataTypes.STRING(50)},
        Start6 : {type:DataTypes.STRING(50)},
        Start7 : {type:DataTypes.STRING(50)},
        
        StartDay : {type:DataTypes.STRING(50)},
        StartMonth : {type:DataTypes.STRING(50)},
        StartYear : {type:DataTypes.STRING(50)},

        WorkPlace : {type:DataTypes.STRING(50)},
        WorkReference : {type:DataTypes.STRING(50)},

        types1 : {type:DataTypes.STRING(200)},
        types2 : {type:DataTypes.STRING(200)},
        types3 : {type:DataTypes.STRING(200)},

        value1: { type: DataTypes.INTEGER },
        value2: { type: DataTypes.INTEGER },
        value3: { type: DataTypes.INTEGER },
        value1Index: { type: DataTypes.INTEGER },
        value2Index: { type: DataTypes.INTEGER },
        value3Index: { type: DataTypes.INTEGER },

        time1 : {type:DataTypes.STRING(50)},
        time2 : {type:DataTypes.STRING(50)},
        time3 : {type:DataTypes.STRING(50)},
        time4 : {type:DataTypes.STRING(50)},
        time5 : {type:DataTypes.STRING(50)},
        time6 : {type:DataTypes.STRING(50)},
        time7 : {type:DataTypes.STRING(50)},

        Bonus : {type:DataTypes.STRING(50)},
        Bonus1 : {type:DataTypes.STRING(50)},
        Bonus2 : {type:DataTypes.STRING(50)},
        Bonus3 : {type:DataTypes.STRING(50)},
        Bonus4 : {type:DataTypes.STRING(50)},

        value4 : {type:DataTypes.STRING(50)},

        EmployeeAddress : {type:DataTypes.STRING(200)},
        EmployeePhone : {type:DataTypes.STRING(50)},
        EmployeeName : {type:DataTypes.STRING(50)},
        SalaryCalculationPeriodEnd : {type:DataTypes.STRING(50)},
        SalaryCalculationPeriodStart : {type:DataTypes.STRING(50)},
    },{
      timestamps:false
    });
}