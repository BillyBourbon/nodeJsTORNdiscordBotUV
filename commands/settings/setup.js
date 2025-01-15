const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { mongodb } = require("mongodb")

const { dbClient, blankServerConfig, defaultErrorEmbed } = require('../../helpers');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setup_bot')
		.setDescription('Creates a config within the DB for your server. needs to be ran before other setting commands')
        .addStringOption(option=>option.setName("apikey").setDescription("Torn API Key To Be Used For Commands. May Need Faction API Access.").setRequired(true)),
	async execute(interaction) {
        const guildId = interaction.guild.id
        const apikey = interaction.options.getString("apikey")
        console.log("Setup Server Config Status")
        const status = await setupServerConfig(guildId , apikey)
        console.log(status)
        if(status.status == false) return interaction.reply({embeds: [defaultErrorEmbed(status.message)], flags: MessageFlags.Ephemeral})
		await interaction.reply({content:status.message, flags: MessageFlags.Ephemeral});
	},
};

async function setupServerConfig(guildId, apikey=null) {
    let status = {
        status : false,
        message : "Failed To Setup Config In DB. See Server Logs"
    }

    try {
        const servers = await dbClient.db("discordbot").collection("servers").find({guildId:guildId}).toArray()
    
        if(servers.length !== 0) {
            status.message = "Server Config Already Setup"
            return status
        }

        const newConfig = blankServerConfig()
        newConfig.guildId = guildId
        newConfig.config.bot.apikey = apikey

        const insert = await dbClient.db("discordbot").collection("servers").insertOne(newConfig)
        status.status = insert.acknowledged
        if(insert.acknowledged) status.message = "Succesfully Created Server Config."

    } catch(e){
        console.log(e)
    }
    return status
}

