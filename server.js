const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require ("dotenv")
const app = express();



app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();


app.use('/civics/api/users', require('./routes/auth'));
app.use('/civics/api', require('./routes/civics'));
app.use('/civics', require('./routes/event'));



app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});