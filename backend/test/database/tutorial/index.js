const { Sequelize, DataTypes } = require('sequelize');

const { startBasicOperation } = require('./1_basicOperation');
const { startRelationOperation } = require('./3_relationOperation');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});



async function start() {
    console.log("start backend\test\database\tutorial\index.js")

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    const db = {};
    db.Sequelize = Sequelize
    db.sequelize = sequelize

    db.users = require('./models/userModel')(sequelize, DataTypes)
    console.log("db.users", db.users)

    db.posts = require('./models/postModel')(sequelize, DataTypes)
    console.log("db.posts", db.posts)

    db.tags = require('./models/tagModel')(sequelize, DataTypes)
    console.log("db.posts", db.tags)

    db.postTags = require('./models/post_tagModel')(sequelize, DataTypes)
    console.log("db.posts", db.postTags)

    // One To One
    // db.users.hasOne(db.posts, { foreignKey: 'user_id' })

    // One To Many
    db.users.hasMany(db.posts, { foreignKey: 'user_id' })
    db.posts.belongsTo(db.users, { foreignKey: 'user_id' })

    // Many To Many
    db.posts.belongsToMany(db.tags, { through: 'post_tag' })
    db.tags.belongsToMany(db.posts, { through: 'post_tag' })



    // db.sequelize.sync({ force: true }).then(() => {
    //     console.log('re synced')
    // })

    // startBasicOperation(db.users)
    startRelationOperation(db)
}

start()