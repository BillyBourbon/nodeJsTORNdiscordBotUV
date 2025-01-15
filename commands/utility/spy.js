const { SlashCommandBuilder } = require('discord.js');
const axios = require("axios");
const { getApiKey, defaultEmbed, defaultErrorEmbed, feildTemplate } = require('../../helpers');

async function spy(id,apikey){
  let call = await axios.get(`https://www.tornstats.com/api/v2/${apikey}/spy/user/${id}`)
  call = call.data.spy
  
  const embed = defaultEmbed('Player Stat Spy')
  if(call.status == false){
    embed.addFields(feildTemplate(`Unknown Spy`, `[TS-Spy] | ${call.message}`))
  }
  else{
    let name = call.player_name
    let level = call.player_level
    let faction = call.player_faction
    let time = call.difference
    let str = (call.strength).toLocaleString('en')
    let def = (call.defense).toLocaleString('en')
    let spd = (call.speed).toLocaleString('en')
    let dex = (call.dexterity).toLocaleString('en')
    let total = (call.total).toLocaleString('en')
    embed.addFields(feildTemplate(`${name} [${id}]`, `[TS-Spy]\nSpy Age: ${time},\nLevel: ${level}\nFaction: ${faction}\nStrength: ${str}\nDefense: ${def}\nSpeed: ${spd}\nDexterity: ${dex}\nTotal: ${total}`))
  }
  return embed
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('spy')
		.setDescription('Gets The Stats Spy Of A Player By ID')
		.addIntegerOption(option => option.setName('id').setDescription('Enter A Torn ID').setRequired(true)),
	async execute(interaction) {
    const id = interaction.options.getInteger('id');
    const apikeyStatus = await getApiKey(interaction.guild.id)
    if(apikeyStatus.status == false) return interaction.reply({embeds:[defaultErrorEmbed(apikeyStatus.message)]})

    const apikey = apikeyStatus.response
    const embed = await spy(id, apikey)
    await interaction.reply({embeds:[embed]})
	},
};