const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getGuild, defaultEmbed, defaultErrorEmbed, feildTemplate } = require('../../helpers');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('list_faction_roles')
		.setDescription('List all assigned faction roles'),
	async execute(interaction) {
        const embed = defaultEmbed(`Faction Roles For ${interaction.guild.name}`)
        const feilds = []

        const guildId = interaction.guild.id
        const statusGetGuild = await getGuild(guildId)
        
        const { status, message, response } = statusGetGuild
        
        if(status == false) return interaction.reply({embeds:[defaultErrorEmbed(message)]})

        const {factionRoles} = response[0].config.guild
        factionRoles.forEach(role=>{
            feilds.push(feildTemplate(`Role: ${role.roleName}`,`Faction ID: ${role.factionId} , Role ID: ${role.roleId}`))
        })

        embed.addFields(feilds)
		await interaction.reply({embeds:[embed]});
	},
};