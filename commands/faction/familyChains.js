const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require("axios")
// 	Path stuff to get configs
const path = require('path');
const { error } = require('console');
const basePath = path.join(__dirname,"..","..")

//  Configs
const { apikey } = require(path.join(basePath, "config.json"))
const { formatterCurrency, formatterQuantity } = require(path.join(basePath, "helpers.js"))

async function call(id) {
  let call = await axios.get(`https://api.torn.com/faction/${id}?selections=chain,basic&key=${apikey}`)
  return call.data
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('chain')
		.setDescription('Replies with the ongoing chains of the Unbroken factions'),
	async execute(interaction) {
        let ids = [45151,10913,14820, 38547, 49069]
        let embed = new EmbedBuilder()
            .setColor('Purple')
            .setTitle("Unbroken's current chains")
        for(i in ids){
            let data = await call(ids[i])
            let name = data.name
            data = data.chain
            let current = data.current
            let bonus = data.max
            let timeout = data.timeout
            let cooldown = data.cooldown
            let message = ""
            let x = 0
            message+=`Current Length: ${formatterQuantity(current)}`
            if(cooldown == 0 && timeout == 0){
                message+="\nNot Active"
                x+=1
            }
            if(timeout == 0 && x==0){
                message+=`\nChain Ended. Cooldown finished in ${Math.floor(cooldown / 60)} Minutes ${ cooldown - (Math.floor(cooldown / 60)) * 60} Seconds`
            }
            if(cooldown == 0 && x==0){
                message+=`\nChain Active. Timeout in ${Math.floor(timeout / 60)} Minutes ${ timeout - (Math.floor(timeout / 60)) * 60}`
            }
            embed.addFields({"name":`${name} [${ids[i]}]`,"value":message})
        }
        interaction.reply({embeds:[embed]})
	},
};