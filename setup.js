const Enmap = require('enmap');
const fs = require('fs');
const prompt = require('prompt-sync')({ sigint: true });

let baseConfig = fs.readFileSync('./config.js.example', 'utf8');

const defaultSettings = {
    prefix: '!',
    modLogChannel: 'mod-log',
    modRole: 'Moderator',
    adminRole: 'Administrator',
    systemNotice: 'true',
    embedColor: '#ff0000',
    welcomeChannel: 'welcome',
    welcomeMessage:
        'Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D',
    welcomeEnabled: 'false',
    reddit: 'false',
};

const settings = new Enmap({
    name: 'settings',
    cloneLevel: 'deep',
    ensureProps: true,
});

(async function () {
    if (fs.existsSync('./config.js')) {
        console.log('Already been set up!');
        process.exit(0);
    }
    console.log('Setting Up Configuration...');
    await settings.defer;

    console.log(
        'First Start! Inserting default guild settings in the database...'
    );
    await settings.set('default', defaultSettings);

    const TOKEN = prompt('Enter your discord API token: ');

    baseConfig = baseConfig.replace('TOKEN', `${TOKEN}`);

    fs.writeFileSync('./config.js', baseConfig);
    console.log('REMEMBER TO NEVER SHARE YOUR TOKEN WITH ANYONE!');
    console.log('Configuration has been written, enjoy!');
    await settings.close();
})();
