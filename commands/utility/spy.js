const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require("axios")
// 	Path stuff to get configs
const path = require('path');
const basePath = path.join(__dirname,"..","..")

//  Configs
const { apikey } = require(path.join(basePath, "config.json"))

async function spy(id){
  let call = await axios.get(`https://www.tornstats.com/api/v2/${apikey}/spy/user/${id}`)
  call = call.data.spy
  if(call.status == false){
    let embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Player Stat Spy')
      .addFields({"name":`Unknown Spy`, "value": `[TS-Spy] | ${call.message}`,"inline":true})
      .setFooter('Made By Bilbosaggings [2323763]')
    return embed
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
    let embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('Player Stat Spy')
    .addFields({"name":`${name} [${id}]`, "value": `[TS-Spy]\nSpy Age: ${time},\nLevel: ${level}\nFaction: ${faction}\nStrength: ${str}\nDefense: ${def}\nSpeed: ${spd}\nDexterity: ${dex}\nTotal: ${total}`, "inline":true})
    .setFooter({"text":'Made By Bilbosaggings [2323763]'})
    return embed
    }
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('spy')
		.setDescription('Gets The Stats Spy Of A Player By ID')
		.addIntegerOption(option => option.setName('id').setDescription('Enter A Torn ID').setRequired(true)),
	async execute(interaction) {
    let id = interaction.options.getInteger('id');
    let embed = await spy(id)
    console.log(embed)
    console.log(embed.data.fields)
    await interaction.reply({embeds:[embed]})
	},
};