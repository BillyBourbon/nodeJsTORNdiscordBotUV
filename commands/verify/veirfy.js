const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('verify')
		.setDescription('verifys yourself or another person'),
	async execute(interaction,client) {
		const guildId = interaction.guildId
		const { member } = interaction;
        // const { user: {id}, roles} = member;
        
		const guild = await client.guilds.fetch(guildId)
		const {roles, name, id } = guild
		console.log(id)
		console.log(name)

		const guildRoles = await roles.fetch()
		const guildRolesArray = []
		guildRoles.forEach(role=>{
			// console.log(role.name)
			guildRolesArray.push( [ role.name, role.id ] )
		})
		console.log(guildRolesArray)
		// console.log(`\nUserID: ${id}. Roles: ${roles}`)

		await interaction.reply('Pong!');
	},
};