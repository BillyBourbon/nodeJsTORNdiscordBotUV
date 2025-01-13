const {SlashCommandBuilder, EmbedBuilder} = require("discord.js")
const axios = require("axios")
// 	Path stuff to get configs
const path = require('path');
const { error } = require('console');
const basePath = path.join(__dirname,"..","..")

//  Configs
const { apikey } = require(path.join(basePath, "config.json"))

module.exports = {
	data: new SlashCommandBuilder()
		.setName('inactives')
		.setDescription('Lists The Inactives In Faction')
        .addIntegerOption(option=>
            option.setName("faction_id").setDescription("Faction ID To Search For").setRequired(true)
        )
        .addIntegerOption(option=>
            option.setName("days").setDescription("Number Of Days To Class As Inactive")
        ),
	async execute(interaction) {
        const days = interaction.options.getInteger("days") || 3
        const factionId = interaction.options.getInteger("faction_id") 
        let minimum_ts = ((new Date())/1000)-(60*60*24*days)
        let call = await axios.get(`https://api.torn.com/faction/${factionId}?selections=basic&key=${apikey}`)
        let data = call.data.members
        let embed = new EmbedBuilder()
            .setColor("Purple")
            .setTitle(`Inactives In ${call.data.name}`)
            .setDescription(`Inactive Threshold: ${days} Days`)
            .setFooter({"text":`Made By Bilbosaggings[2323763]`})
            
        const feilds = []
        Object.keys(data).forEach(id=>{
            let {name,days_in_faction,last_action,position} = data[id]
            let {timestamp,relative} = last_action
            if(timestamp > minimum_ts) return
            const feild = {'name':`${name} [${id}]`,"value": `Days In Faction: ${days_in_faction}\nPosition In Faction: ${position}\nLast Action: ${relative}`,"inline":true}
            feilds.push(feild)
        })
        embed.addFields(feilds)
        interaction.reply({embeds:[embed]})
    },  
};