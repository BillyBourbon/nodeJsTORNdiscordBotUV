const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { getGuild, defaultEmbed, defaultErrorEmbed, feildTemplate, updateGuild } = require('../../helpers');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('change_server_apikey')
		.setDescription('Change the apikey that the server uses')
        .addStringOption(option=>option.setName("apikey").setDescription("Apikey to use for commands in this server").setRequired(true)),
	async execute(interaction) {
        const guildId = interaction.guild.id
        const statusGetGuild = await getGuild(guildId)
        
        const { status, message, response } = statusGetGuild
        
        if(status == false) return await interaction.reply({embeds:[defaultErrorEmbed(message)], flags: MessageFlags.Ephemeral})

        const apikey = interaction.options.getString("apikey")

        response[0].config.bot.apikey = apikey

        const updateStatus = await updateGuild(guildId, response[0])

        if(updateStatus.status == false) return await interaction.reply({embeds:[defaultErrorEmbed(updateStatus.message)], flags:MessageFlags.Ephemeral})

        
		await interaction.reply({content:"Changed APIKEY", flags: MessageFlags.Ephemeral});
	},
};