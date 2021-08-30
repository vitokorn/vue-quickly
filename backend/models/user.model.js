module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        spotyid: {
            type: Sequelize.STRING
        },
        country: {
            type: Sequelize.STRING
        },
        display_name: {
            type: Sequelize.STRING
        },
        access_token: {
            type: Sequelize.STRING
        },
        refresh_token: {
            type: Sequelize.STRING
        },
        lang: {
            type: Sequelize.STRING
        }
    });

    return User;
};