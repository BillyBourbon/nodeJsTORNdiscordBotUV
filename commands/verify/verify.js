const { SlashCommandBuilder } = require('discord.js');

//	For API Calls to TORN 
const axios = require('axios')

const { getGuild, getApiKey,defaultEmbed, defaultErrorEmbed} = require('../../helpers');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('verify')
		.setDescription('verifys yourself or another person')
        .addUserOption(option=>option.setName("user").setDescription("User To Verify")),
	async execute(interaction,client) {
        const user = interaction.options.getUser("user") || interaction.member.user
        const { username } = user
        const userId = user.id
		const guildId = interaction.guild.id
        const status = await getGuild(guildId)

        const embed = defaultEmbed("Verify User")
        const feilds = []

        if(status.status==false) return interaction.reply({embeds:[defaultErrorEmbed(status.message)]})

        const {config: {guild:{factionRoles}}} = status.response[0]
        const apikeyStatus = await getApiKey(guildId)
        if(apikeyStatus.status == false) return interaction.reply({embeds:[defaultErrorEmbed(apikeyStatus.message)]})

        const apikey = apikeyStatus.response
        const call = await axios.get(`https://api.torn.com/user/${userId}?selections=profile&key=${apikey}`)
        const {data} = call
        const {name, faction: {faction_id, faction_name}} = data
        let roleToGive = null

        factionRoles.forEach(role=>{
            if(role.factionId == faction_id) roleToGive = role.roleId
        })

        if(roleToGive == null) return interaction.reply({embeds:[defaultErrorEmbed(`No Role To Give For Faction ${faction_name} [${faction_id}]`)]})
        else{
            const role = await interaction.guild.roles.cache.find(role=>role.id===roleToGive)
            if(!role) return interaction.reply({embeds:[defaultErrorEmbed(`Role Doesnt Exist For Faction ${faction_name} [${faction_id}]`)]})
            else {
                const members = await interaction.guild.members.fetch()
                const selectedMember = members.find(m=>m.id===userId)
                try{
                    await selectedMember.roles.add(role)
                    feilds.push({
                        "name": `Verifed User ${name}`,
                        "value" : `Member Of: ${faction_name} [${faction_id}]\nGiven Role ${role.name} `
                    })
                } catch(e){
                    console.log(e)
                    return interaction.reply({embeds:[defaultErrorEmbed(`Member Of: ${faction_name} [${faction_id}]\nRole To Give${role.name}\n${e}`,`Error Verifying User ${name}`)]})
                }
            }
        }

        embed.addFields(feilds)
		await interaction.reply({embeds:[embed]});
	},
};