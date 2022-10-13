'use strict'
module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable('users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                // unique: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            avator: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            role: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
        })
    },
    down: async (queryInterface, DataTypes) => {
        await queryInterface.dropTable('users')
    },
}