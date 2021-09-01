module.exports = {
    HOST: "ec2-63-33-239-176.eu-west-1.compute.amazonaws.com:5432",
    USER: "izmiubwvnpexuj",
    PASSWORD: "044e0312952f84eba4f6419e013d3078dce6cacf98b9c1b27c4fbab059b12692",
    DB: "doq6dvncpajml",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};