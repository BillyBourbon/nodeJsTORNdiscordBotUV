//  Discord
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

//	For API Calls to TORN 
const axios = require('axios')
const { getApiKey, defaultEmbed, defaultErrorEmbed, formatterQuantity, feildTemplate } = require('../../helpers');


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
        const apikeyStatus = await getApiKey(interaction.guild.id)
        if(!apikeyStatus.status) return interaction.reply({embeds: [defaultErrorEmbed(apikeyStatus.message)]})
        const apikey = apikeyStatus.response

        const factionId = interaction.options.getInteger("faction_id")
        const call = await axios.get(`https://api.torn.com/v2/faction/${factionId}/members?key=${apikey}`)
        
        const { data: {members}} = call
        
        const fieldsRevivable = []
        members.forEach(member=>{
            const { name, id, last_action :{ status, relative }, revive_setting, is_revivable } = member
            
            if(!is_revivable) return

            const field = feildTemplate(`${name} [${id}] (${status} | ${relative})`,`Revive Setting: ${revive_setting}`)
            fieldsRevivable.push(field)
        })
        const embeds = []
        while(fieldsRevivable.length > 0){    
            const embed = defaultEmbed("Faction Revivables")
            embed.addFields(fieldsRevivable.splice(0,25))
            embeds.push(embed)
        }

		await interaction.reply({embeds : embeds});
	},
};