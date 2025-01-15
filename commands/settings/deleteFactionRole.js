const { SlashCommandBuilder } = require('discord.js');
const { defaultEmbed, getGuild, updateGuild, feildTemplate, defaultErrorEmbed } = require('../../helpers');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete_faction_role')
		.setDescription('Deletes a Faction Role From The Verifier')
        .addIntegerOption(option=>option.setName("faction_id").setDescription("Faction ID").setRequired(true))
        .addRoleOption(option=>option.setName("selected_role").setDescription("Discord Role To Remove").setRequired(true)),
	async execute(interaction) {
        const guildId = interaction.guild.id
        const factionId = interaction.options.getInteger("faction_id")
        const selectedRole = interaction.options.getRole("selected_role")
        

        const status = await deleteFactionRole(guildId, factionId, selectedRole)

        if(status.status==false) return interaction.reply({embeds:[defaultErrorEmbed(status.message)]})
        
        const embed = defaultEmbed("Delete Faction Verifier Role")        
        embed.addFields([feildTemplate(`Removed Role '${selectedRole.name}' From Verifier`,`Faction ID: ${factionId}, Role ID: ${selectedRole.id}`)])

        await interaction.reply({embeds:[embed]});
	},
};

const deleteFactionRole = async (guildId, factionId, selectedRole) => {
    const status = await getGuild(guildId)
    if(!status.status) return status

    const guildObj = status.response[0]
    const { config: {guild:{factionRoles}} } = guildObj
    
    const roleObj = {
        factionId : factionId,
        roleId : selectedRole.id,
        roleName : selectedRole.name
    }

    let index = -1
    factionRoles.forEach((role, i)=>{
        if(role.factionId === roleObj.factionId && role.roleId === roleObj.roleId) index = i
    })

    if(index === -1) return {status:false,message:"Role Not In Verifer"}

    factionRoles.splice(index,1)

    const updateStatus = await updateGuild(guildId, guildObj)
    status.status = updateStatus
    status.message = "Removed Role From Faction Verifier"

    return status
}