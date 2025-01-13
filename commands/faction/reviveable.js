//  Discord
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

//	For API Calls to TORN 
const axios = require('axios')

// 	Path stuff to get configs
const path = require('path')
const basePath = path.join(__dirname,"..","..")

//  Configs
const guildConfigs = require(path.join(basePath, "guildConfigs.json"))
const { apikey } = require(path.join(basePath, "config.json"))

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reviveable')
		.setDescription('Shows a List of users in a faction who can be revived')
        .addIntegerOption(option=>
            option
                .setName("faction_id")
                .setDescription("Faction ID To Search For")
                .setRequired(true)
        ),
	async execute(interaction) {
        const factionId = interaction.options.getInteger("faction_id")
        const call = await axios.get(`https://api.torn.com/v2/faction/${factionId}/members?key=${apikey}`)
        
        const { data: {members}} = call
        
        const fieldsRevivable = []
        members.forEach(member=>{
            const { name, id, last_action :{ status, relative }, revive_setting, is_revivable } = member
            
            if(!is_revivable) return

            const field = {
                "name" : `${name} [${id}] (${status} | ${relative})`,
                "value" : `Revive Setting: ${revive_setting}`
            }
            fieldsRevivable.push(field)
        })
        const embeds = []
        while(fieldsRevivable.length > 0){    
            const embed = new EmbedBuilder()
            embed.setTitle("Faction Revivables")
            embed.addFields(fieldsRevivable.splice(0,25))
            embeds.push(embed)
        }

		await interaction.reply({embeds : embeds});
	},
};