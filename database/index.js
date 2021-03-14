const mongoose = require("mongoose");
const { mongoUri } = require("../utils/horizonUtils");

mongoose
    .connect(mongoUri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
    })
    .then(console.log("[MongoDB] conectado ao mongo"));
