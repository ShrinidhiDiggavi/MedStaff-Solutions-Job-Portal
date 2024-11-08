module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 100],
                is: /^[a-zA-Z\s]+$/i // Optional: Only letters and spaces
            }
        },
        experience: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [0, 50],
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                len: [5, 255],
            }
        },
        contactNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /^\d{10}$/, 
            }
        },
        specialization: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        otherSpecialization: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        resume: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        timestamps: true,
        tableName: 'users'
    });
    
    return User;
  };
  