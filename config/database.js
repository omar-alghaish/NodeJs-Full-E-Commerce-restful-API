const mongoose = require("mongoose");

const dbConnection = () => {
    mongoose.set("strictQuery", true);
    mongoose
        .connect(process.env.DB_URI)
        .then((conn) => {
            console.log(`connectted to database: ${conn.connection.name}`);
        })
        // .catch((err) => {
        //     console.error(`Database Erorr: ${err}`);
        // });
};

module.exports = dbConnection;
