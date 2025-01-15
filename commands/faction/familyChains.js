const { SlashCommandBuilder } = require('discord.js');
const axios = require("axios");
const { getApiKey, defaultEmbed, defaultErrorEmbed, formatterQuantity, feildTemplate } = require('../../helpers');


module.exports = {
    data: new SlashCommandBuilder()
		.setName('family_chains')
		.setDescription('Replies with the ongoing chains of the Unbroken factions'),
	async execute(interaction) {
        const apikeyStatus = await getApiKey(interaction.guild.id)
        if(!apikeyStatus.status) return interaction.reply({embeds: [defaultErrorEmbed(apikeyStatus.message)]})
        const apikey = apikeyStatus.response
        
        const ids = [ 45151, 10913, 14820, 38547, 49069 ]
        const embed = defaultEmbed("Unbroken's current chains")
        const feilds = []
        for(id of ids){
            const data = await call(id, apikey)
            const { name, chain:{ current, bonus, timeout, cooldown } } = data
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
            feilds.push(feildTemplate(`${name} [${id}]`,message))
        }
        embed.addFields(feilds)
        await interaction.reply({embeds:[embed]})
	},
};

async function call(id, apikey) {
  let call = await axios.get(`https://api.torn.com/faction/${id}?selections=chain,basic&key=${apikey}`)
  return call.data
}
