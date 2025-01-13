const { SlashCommandBuilder } = require('discord.js');

//	For API Calls to TORN 
const axios = require('axios')

// 	Path stuff to get configs
const path = require('path')
const basePath = path.join(__dirname,"..","..")
const guildConfigs = require(path.join(basePath, "guildConfigs.json"))
const { apikey } = require(path.join(basePath, "config.json"))

module.exports = {
	data: new SlashCommandBuilder()
		.setName('verify')
		.setDescription('verifys yourself or another person'),
	async execute(interaction,client) {
		const { member } = interaction;
        const userId =  member.user.id;
		const memberRoles = member.roles
        
		const guildId = interaction.guildId
		const guild = await client.guilds.fetch(guildId)
		const { roles } = guild

		const guildRoles = await roles.fetch()
		const guildRolesArray = []
		guildRoles.forEach(role=>{
			guildRolesArray.push( [ role.name, role.id ] )
		})

		const call = await axios.get(`https://api.torn.com/user/${userId}?selections=profile&key=${apikey}`)
		const {data} = call
		const {name, faction : {faction_name}} = data
		console.log(faction_name)
		const roleToGive = guildRolesArray.find(a=>a[0].trim() === faction_name)

		console.log(roleToGive)
		if(!memberRoles.includes(roleToGive[1]))		

		await interaction.reply('Pong!');
	},
};