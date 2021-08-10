export default (sequelize, DataTypes) => {
    return sequelize.define('vacation', {       
        bang : {type:DataTypes.STRING(50)},
        workername : {type:DataTypes.STRING(50)},
        vacation:{type:DataTypes.INTEGER},
        reason : {type:DataTypes.STRING(200)},
        start_date : {type:DataTypes.DATE},
        end_date : {type:DataTypes.DATE}
       
    },{
      timestamps:false
    });
}