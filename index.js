const Eris = require("eris");
var steem = require("steem");
var bot = new Eris("MzYxNDE5NDgwNDc3MzM1NTUy.DNWyyA.oAbz0uzK9ILWt6PNs1ebu9jxXX"); // Your bot token here
var regex=/(\$vp)+(\ )/;

bot.on("ready", () => {console.log('VP-CHECK START!');}); //when it is ready
bot.on("messageCreate", (msg) => {
    console.log(msg.content);
if(msg.content.match(regex)){
var user = msg.content.replace(msg.content.match(regex)[0],'');

    steem.api.getAccounts([user], function(err, result) {
                if(result){
                    var userData=result[0];
                    var voting_power = userData.voting_power;
                    var last_vote_time = userData.last_vote_time;
                    var lastVoteTime = new Date(last_vote_time).getTime(); // get lastVoteTime
                    var now = new Date(); // get local time
                    var offset = now.getTimezoneOffset(); // define offset
                    var nowUtcTime = now.getTime() + (offset * 60000); // get UTC time
                    var powerNow = (Math.floor((nowUtcTime - lastVoteTime)) / 43200) + voting_power; 
                    if (powerNow > 10000) powerNow = 10000; // maximum 100%
                    powerNow = (powerNow / 100).toFixed(2); //  rounding to exactly four decimals
        setTimeout(function(){bot.createMessage(msg.channel.id,'Voting Power `@'+user+ '`= ' +powerNow+'%');},1000);

                }
				if(err){
					setTimeout(function(){bot.createMessage(msg.channel.id,'can not connect to `https://steemd.steemit.com`');},1000);
				}
				
            });


}

});

bot.connect();
