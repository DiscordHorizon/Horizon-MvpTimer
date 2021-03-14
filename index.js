const Discord = require("discord.js");
const mvpModel = require("./models/mvp");
const { discord, guildId, avatar, channel } = require("./utils/horizonUtils");
const { timer } = require("./commands/timer");

require("./database");

const bot = new Discord.Client();

bot.on("ready", () => {
    console.log("[Bot] Connected");
});

bot.on("message", async (message) => {
    if (message.author.bot) return;
    if (message.channel.id != channel) return;

    if (message.content === "!timer") {
        timer(message);
    }
});

async function mvpAlert(player, name, spot) {
    const guild = bot.guilds.cache.get(guildId);
    const channelId = guild.voiceStates.cache.get(player).channelID;

    if (channelId) {
        const connection = await guild.channels.cache.get(channelId).join();
        connection.play("./assets/tuturu.mp3").on("finish", () => {
            connection.play("./assets/mvpAlert.mp3").on("finish", () => {
                guild.channels.cache.get(channelId).leave();
            });
        });
    }

    const msg = new Discord.MessageEmbed()
        .setTitle("MVP Timer")
        .setDescription(
            `O MVP \`${name}\` irá renascer em 5 minutos no spot \`${spot}\` <@${player}>`
        )
        .setTimestamp(Date.now())
        .setFooter("by Bravan", avatar);

    const textChannel = guild.channels.cache.get(channel);
    textChannel.send(msg);
}

setInterval(async () => {
    const mvps = await mvpModel.find({});
    mvps.forEach(async(mvp) => {
        if (!mvp.alive) {
            var now = Date.now();
            const time = mvp.nextRespawn - now;
            if (time < 0) {
                await mvp.updateOne({ alive: true });
                mvpAlert(mvp.player, mvp.name, mvp.spot);
            }
        }
    });
}, 5000);

bot.login(discord);
