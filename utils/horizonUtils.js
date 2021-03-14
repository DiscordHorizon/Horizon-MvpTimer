let config;
try {
    config = require("../config.json");
} catch (error) {
    config = null;
}

exports.discord = config ? config.discord : process.env.DISCORD;
exports.mongoUri = config ? config.mongoUri : process.env.MONGO_URI;
exports.guildId = config ? config.guild : process.env.GUILD;
exports.channel = config ? config.channel : process.env.CHANNEL;
exports.avatar = config ? config.avatar : process.env.AVATAR;
exports.audios = {
    tuturu: config ? config.audio.tuturu : process.env.TUTURU,
    mvpAlert: config ? config.audio.mvpAlert : process.env.MVP_ALERT,
};
