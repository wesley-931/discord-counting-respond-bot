const Discord = require('discord.js');
const { cli } = require('winston/lib/winston/config');
const client = new Discord.Client({});

// Static items.
const channelIdForCounting = 'channel id for counting here', // The id for tha channel in here where the counting will be
    clientArray = [
        {
            id: "your user id here", // Number 0 in the array / place your account id here
            name: "client1"
        },
        {
            id: "bot user id here", // Number 1 in the array / place the bot id here
            name: "client2"
        },
    ];
    

// Options
const waitTime = 500, //Time it takes for the bot to respond to the message or count. Time in milliseconds
    previousClientId = clientArray[0].id, // On which bot message he has to wait before sending his count !IMPORTANT this is set to 0 to respond to the user
    extraClientId = null, // Extra user the bot can repond too !IMPORTANT set null if you only want it to respond to one person
    waitTimeBeforeRestart = 20, // Time in seconds !IMPORTANT this is not working so ignore it.
    token = "place the bot toke in here"; //Place the bot token here.
// END of options


//Dont edit anything below you might break the bot
let stop = false,
    channel,
    previousNumber = null,
    nextNumber = null,
    isSendingMessage = false;

// Dont edit anything below unless you know what you are doing
const sendNextNumber = function(msg){
    if(msg.channel.id == channelIdForCounting){
        if(msg.author.id !== client.user.id) {
            if(msg.author.id == previousClientId || msg.author.id == extraClientId) {
                let number = Number(msg.content);

                if(isNaN(number)){
                    return;
                } else {
                    const newNumber = number + 1;

                    if (stop === false) {
                        if (previousNumber !== newNumber || previousNumber === null) {
                            if (nextNumber === newNumber || nextNumber === null) {
                                if (isSendingMessage === false) {
                                    isSendingMessage = true;
                                    setTimeout(() => { 
                                        channel.send(newNumber);
                                        previousNumber = newNumber;
                                        nextNumber = newNumber + clientArray.length;
                                        isSendingMessage = false;
                                    }, waitTime);
                                } else {
                                    console.log(`Tried sending a message when the previous one wasnt even sended!`);
                                }
                            } else {
                                console.log(`Next number was not the same, expected: ${nextNumber} and got ${newNumber}!`);
                            }
                        } else {
                            console.log(`Number was the same as previous number which was: ${previousNumber}!`);
                        }
                    }
                }
            }
        }
    }
},

// Dont edit anything below unless you know what you are doing
checkIfClientHasToRestart = function(lastMessage) {
    if(lastMessage.author.id == previousClientId || lastMessage.author.id == extraClientId) {
        console.log(`${client.user.tag} is gonna restart the count!`);

        for (let index = waitTimeBeforeRestart; index >= 0; index--) {        
            setTimeout(() => { 
                if (index === 0) {
                    console.log("Restarting the count")
                    sendNextNumber(lastMessage);
                } else {
                    console.log(`Restarting the count in ${index}!`);
                }
            }, 1000); 
        }            
    }
}


// Dont edit anything below unless you know what you are doing
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(`Currently waiting on count!`);
    channel = client.channels.find(channel => channel.id === channelIdForCounting)
    previousNumber = null;
    nextNumber = null;
    isSendingMessage = false;

    lastMessage = channel.fetchMessages({ limit: 1 }).then(messages => {
        const lastMessage = messages.first();
        checkIfClientHasToRestart(lastMessage)
    }).catch(err => {
        console.error(err)
    })
});
 
// Dont edit anything below unless you know what you are doing
client.on('message', msg => {
    sendNextNumber(msg);
});

 
client.login(token);
