const { SlashCommandBuilder, EmbedBuilder, MessageFlags} = require('discord.js');

const { defaultErrorEmbed, defaultEmbed, feildTemplate, getGuild, updateGuild } = require('../../helpers');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('add_faction_role')
		.setDescription('Adds a Faction Role To The Verifier')
        .addIntegerOption(option=>option.setName("faction_id").setDescription("Faction ID").setRequired(true))
        .addRoleOption(option=>option.setName("selected_role").setDescription("Discord Role To Give Members Of That Faction").setRequired(true)),
	async execute(interaction) {
        const guildId = interaction.guild.id
        const factionId = interaction.options.getInteger("faction_id")
        const selectedRole = interaction.options.getRole("selected_role")

        const status = await insertFactionRole(guildId, factionId, selectedRole)

        if(status.status == false) return interaction.reply({embeds:[defaultErrorEmbed(status.message)]}) 
		
        const embed = defaultEmbed("Add Faction Role")
        embed.addFields([feildTemplate("New Faction Role", `Members of ${factionId} Will Recieve The Role ${selectedRole}`)])
    
        await interaction.reply({embeds:[embed]});
	},
};

const insertFactionRole = async (guildId, factionId, selectedRole) => {
    const status = await getGuild(guildId)
    if(!status.status) return status

    const guildObj = status.response[0]
    const { config: {guild:{factionRoles}} } = guildObj
    
    const roleObj = {
        factionId : factionId,
        roleId : selectedRole.id,
        roleName : selectedRole.name
    }
    
    if(factionRoles.find(role=>role.roleId == roleObj.roleId))  {
        status.message = "Role Already Given Out"
        status.status = false
        return status
    }
    
    factionRoles.push(roleObj)

    const updateStatus = await updateGuild(guildId, guildObj)
    status.status = updateStatus.status
    status.message = updateStatus.message
    return status
}