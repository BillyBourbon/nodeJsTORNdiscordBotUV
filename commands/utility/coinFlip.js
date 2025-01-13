const { SlashCommandBuilder } = require('discord.js')

async function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coin_flip')
		.setDescription('Flips a coin'),
	async execute(interaction) {
    let num = await getRandomInt(2)
    console.log(num)
    if(num == 0){
      interaction.reply("Heads!")
    }
    if(num == 1){
      interaction.reply("Tails!")
    }
	},
};