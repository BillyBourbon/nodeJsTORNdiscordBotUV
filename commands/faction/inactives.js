const {SlashCommandBuilder} = require("discord.js")
const axios = require("axios");
const { getApiKey, defaultEmbed, feildTemplate, defaultErrorEmbed } = require("../../helpers");

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
        const apikeyStatus = await getApiKey(interaction.guild.id)
        if(!apikeyStatus.status) return interaction.reply({embeds: [defaultErrorEmbed(apikeyStatus.message)]})
        
        const apikey = apikeyStatus.response
        const factionId = interaction.options.getInteger("faction_id") 
        const days = interaction.options.getInteger("days") || 3

        let minimum_ts = ((new Date())/1000)-(60*60*24*days)
        
        let call = await axios.get(`https://api.torn.com/faction/${factionId}?selections=basic&key=${apikey}`)
        let data = call.data.members

        const embed = defaultEmbed(`Inactives In ${call.data.name}`)
        embed.setDescription(`Inactive Threshold: ${days} Days`)
        const feilds = []

        Object.keys(data).forEach(id=>{
            let {name,days_in_faction,last_action,position} = data[id]
            let {timestamp,relative} = last_action
            if(timestamp > minimum_ts) return
            const feild = feildTemplate(`${name} [${id}]`, `Days In Faction: ${days_in_faction}\nPosition In Faction: ${position}\nLast Action: ${relative}`)
            feilds.push(feild)
        })

        embed.addFields(feilds)
        interaction.reply({embeds:[embed]})
    },  
};