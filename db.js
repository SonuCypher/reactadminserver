const {Pool} = require('pg');


const pool = new Pool({
    host:"localhost",
    user:"postgres",
    password:"postgres",
    port:5432,
    database:"pernadmin"

})

module.exports = pool

 