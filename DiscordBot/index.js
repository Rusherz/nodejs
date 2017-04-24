const Discord = require('discord.js');
const bot = new Discord.Client();

var messages = [];
var messagesToDelete = [];
var maxMessages = 2;

bot.on('message', (message) => {
    if (message.author.bot) {
        return;
    }
    var s;
    checkMessages();
    messages.push(message);
    s = "Current message list: \n";
    for (var i = 0; i < messages.length; i++) {
        s += messages[i] + ' Message ID = ' + messages[i].id + ' ';
    }
    message.reply(s);
});

bot.login('Mjk2NzUyMDM1Njk5ODg0MDMy.C97UIw.4aQ5NeKTdzUOVQQb87vHgvXrbX4');


function checkMessages() {
    console.log('checking messages');
    if (messages.length > maxMessages) {
        for (var i = 0; i < messages.length - maxMessages; i++) {
            messagesToDelete.push(messages[i]);
            messages.splice(i,1);
        }
    }
    if(messagesToDelete.length >= 1){
        console.log('calling delete message');
        deleteMessages();
    }
}

function deleteMessages() {
    console.log('delete messages called');
    for(var i = 0; i < messagesToDelete.length; i++){
        messagesToDelete[i].delete()
        .then(function(){
            messagesToDelete.splice(i,1);
            console.log('delete message');
        })
        .catch(console.error);
    }
}
