const mvpModel = require("../models/mvp");
const { avatar } = require("../utils/horizonUtils");
const { MessageEmbed } = require("discord.js");

const cancelMsg = new MessageEmbed()
    .setTitle("MVP Timer")
    .setDescription("Operação cancelada")
    .setTimestamp(Date.now())
    .setFooter("by Bravan", avatar);

async function getMVPnumber(message, mvps, msg) {
    try {
        function filter(msg) {
            const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/g;
            return pattern.test(msg.content);
        }

        message.channel.activeCollector = true;
        const response = await message.channel.awaitMessages(filter, {
            max: 1,
            time: 60000,
            errors: ["time"],
        });

        message.channel.activeCollector = false;
        response.first().delete().catch(console.error);

        const choice = parseInt(response.first());
        if (choice < 1 || choice > mvps.length) {
            const unknownMvp = new MessageEmbed()
                .setTitle("MVP Timer")
                .setDescription("Número digitado inválido! Tente novamente.")
                .setTimestamp(Date.now())
                .setFooter("by Bravan", avatar);
            msg.edit(unknownMvp);
            return;
        } else {
            mvpCheck(message, mvps[choice - 1], msg);
        }
    } catch (error) {
        message.channel.activeCollector = false;
    }
}

async function mvpCheck(message, mvp, msg) {
    const mvpCheck = new MessageEmbed()
        .setTitle(mvp.name)
        .addField(
            "Deseja atualizar o timer do MVP?",
            "responda com `sim` ou `nao`"
        )
        .setTimestamp(Date.now())
        .setFooter("by Bravan", avatar);

    msg.edit(mvpCheck);

    try {
        function filter(msg) {
            return msg.content === "sim" || msg.content === "nao";
        }

        message.channel.activeCollector = true;
        const response = await message.channel.awaitMessages(filter, {
            max: 1,
            time: 60000,
            errors: ["time"],
        });

        message.channel.activeCollector = false;
        response.first().delete().catch(console.error);

        let content;
        response.map((msg) => {
            content = msg.content;
        });

        if (content === "sim") {
            getHour(message, mvp, msg);
        } else if (content === "nao") {
            msg.edit(cancelMsg);
        }
    } catch (error) {
        message.channel.activeCollector = false;
    }
}

async function getHour(message, mvp, msg) {
    const hourMsg = new MessageEmbed()
        .setTitle(mvp.name)
        .addField("Digite a hora que o MVP morreu", "Número de `0` a `23`")
        .setTimestamp(Date.now())
        .setFooter("by Bravan", avatar);

    msg.edit(hourMsg);

    try {
        function filter(msg) {
            const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/g;
            return pattern.test(msg.content);
        }

        message.channel.activeCollector = true;
        const hourResponse = await message.channel.awaitMessages(filter, {
            max: 1,
            time: 60000,
            errors: ["time"],
        });

        message.channel.activeCollector = false;
        hourResponse.first().delete().catch(console.error);

        const hour = parseInt(hourResponse.first());

        if (hour < 0 || hour > 23) {
            invalidTime
                .setTitle("Hora inválida")
                .setDescription("Operação cancelada");
            msg.edit(invalidTime);
            return;
        }

        getMinutes(message, mvp, msg, hour);
    } catch (error) {
        message.channel.activeCollector = false;
        msg.edit(cancelMsg);
    }
}

async function getMinutes(message, mvp, msg, hour) {
    const minutesMsg = new MessageEmbed()
        .setTitle(mvp.name)
        .addField("Agora digite os minutos", "Número de `0` a `59`")
        .setTimestamp(Date.now())
        .setFooter("by Bravan", avatar);

    msg.edit(minutesMsg);

    try {
        function filter(msg) {
            const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/g;
            return pattern.test(msg.content);
        }

        message.channel.activeCollector = true;
        const minutesResponse = await message.channel.awaitMessages(filter, {
            max: 1,
            time: 60000,
            errors: ["time"],
        });

        message.channel.activeCollector = false;
        minutesResponse.first().delete().catch(console.error);

        const minutes = parseInt(minutesResponse.first());

        if (minutes < 0 || minutes > 59) {
            invalidTime
                .setTitle("Minutos inválidos")
                .setDescription("Operação cancelada");
            msg.edit(invalidTime);
            return;
        }

        getSpot(message, mvp, msg, hour, minutes);
    } catch (error) {
        message.channel.activeCollector = false;
        msg.edit(cancelMsg);
    }
}

async function getSpot(message, mvp, msg, hour, minutes) {
    const spotMsg = new MessageEmbed()
        .setTitle(mvp.name)
        .addField(
            "Digite o spot onde foi visto o túmulo",
            "Número de `1` a `9`"
        )
        .setTimestamp(Date.now())
        .setFooter("by Bravan", avatar);

    msg.edit(spotMsg);

    try {
        function filter(msg) {
            const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/g;
            return pattern.test(msg.content);
        }

        message.channel.activeCollector = true;
        const spotResponse = await message.channel.awaitMessages(filter, {
            max: 1,
            time: 60000,
            errors: ["time"],
        });

        message.channel.activeCollector = false;
        spotResponse.first().delete().catch(console.error);

        const spot = parseInt(spotResponse.first());

        if (spot < 1 || spot > 9) {
            invalidTime
                .setTitle("Spot inválido")
                .setDescription("Operação cancelada");
            msg.edit(invalidTime);
            return;
        }

        timeCheck(message, mvp, msg, hour, minutes, spot);
    } catch (error) {
        message.channel.activeCollector = false;
        msg.edit(cancelMsg);
    }
}

async function timeCheck(message, mvp, msg, hour, minutes, spot) {
    const timeCheckMsg = new MessageEmbed()
        .setTitle("MVP Timer")
        .addFields(
            {
                name: mvp.name,
                value: `Morto às \`${hour}:${minutes}\` no spot \`${spot}\``,
            },
            {
                name: "Os dados estão correto?",
                value: "responda com `sim` ou `nao`",
            }
        )
        .setTimestamp(Date.now())
        .setFooter("by Bravan", avatar);

    msg.edit(timeCheckMsg);

    try {
        function filter(msg) {
            return msg.content === "sim" || msg.content === "nao";
        }

        message.channel.activeCollector = true;
        const timeCheckResponse = await message.channel.awaitMessages(filter, {
            max: 1,
            time: 60000,
            errors: ["time"],
        });

        message.channel.activeCollector = false;
        timeCheckResponse.first().delete().catch(console.error);

        let content;
        timeCheckResponse.map((msg) => {
            content = msg.content;
        });

        if (content === "sim") {
            mvpUpdate(message, mvp, msg, hour, minutes, spot);
        } else if (content === "nao") {
            msg.edit(cancelMsg);
        }
    } catch (error) {
        message.channel.activeCollector = false;
    }
}

async function mvpUpdate(message, mvp, msg, hour, minutes, spot) {
    const nextRespawn = new Date();
    var nextHour = hour + mvp.respawnTime.hour;
    var nextMinutes = minutes + mvp.respawnTime.minutes;
    let finalHour, finalMinutes;

    if (nextMinutes >= 60) {
        finalMinutes = nextMinutes - 60;
        nextHour++;
    } else {
        finalMinutes = nextMinutes;
    }

    if (nextHour >= 24) {
        finalHour = nextHour - 24;
        // var today = new Date();
        // var dd = String(today.getDate()).padStart(2, "0");
        // dd++;
        // nextRespawn.setDate(dd);
    } else {
        finalHour = nextHour;
    }

    nextRespawn.setHours(finalHour, finalMinutes);

    await mvp.updateOne({
        alive: false,
        player: message.author.id,
        nextRespawn: nextRespawn,
        spot: spot,
    });

    const resMsg = new MessageEmbed()
        .setTitle("MVP Timer")
        .setDescription(`O time do MVP: \`${mvp.name}\` foi atualizado!`)
        .setTimestamp(Date.now())
        .setFooter("by Bravan", avatar);

    msg.edit(resMsg);
}

module.exports = {
    async timer(message) {
        const mvps = await mvpModel.find({});

        const mvpList = new MessageEmbed()
            .setTitle("Lista de MVP's")
            .setDescription("Marcador de Timer de respawn de MVP's")
            .addField("\u200b", "\u200b")
            .setTimestamp(Date.now())
            .setFooter("by Bravan", avatar);

        mvps.forEach((mvp, index) => {
            if (mvp.alive) {
                mvpList.addField(
                    `\`${index + 1} -\` ${mvp.name}`,
                    "Vivo / Sem hora",
                    true
                );
            } else {
                mvpList.addField(
                    `\`${index + 1} -\` ${mvp.name}`,
                    `Renascerá às \`${mvp.nextRespawn}\``,
                    true
                );
            }
        });

        mvpList.addFields(
            {
                name: "\u200b",
                value: "\u200b",
            },
            {
                name: "Deseja marcar a hora de algum MVP?",
                value:
                    "Para adicionar, digite o número do MVP que deseja adicionar",
            }
        );

        const msg = await message.channel.send(mvpList);

        getMVPnumber(message, mvps, msg);
    },
};
