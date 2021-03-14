const mvpModel = require("./models/mvp");
const { mvp } = require('./mvps');

require('./database');

async function saveMvp(name) {
    const req = await mvpModel.findOne({ name: name });

    if (!req) {
        const newMvp = new mvpModel({
            name: name,
            alive: true,
            player: null,
            respawnTime: {
                hour: 0,
                minutes: 0,
            },
            nextRespawn: Date.now(),
            spot: 0,
        });

        await newMvp.save();
        console.log(name, 'salvo no database');
    }

    return;
}

mvp.forEach(mvp => {
    saveMvp(mvp);
})
