const { Schema, model } = require("mongoose");

const Mvp = new Schema({
    name: String,
    alive: Boolean,
    player: String,
    respawnTime: {
        hour: Number,
        minutes: Number,
    },
    nextRespawn: Date,
    spot: Number,
});

module.exports = model("Mvp", Mvp);
