const { SlashCommandBuilder } = require('discord.js');

async function gri(max) {
  return Math.floor(Math.random() * max);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dice')
		.setDescription('Rolls a dice ie 3 d6')
    .addIntegerOption(option=>option.setName("number_of_dice").setDescription("Enter number of dice to roll").setRequired(true))
    .addIntegerOption(option=>option.setName("sides").setDescription("Enter number of sides for the dice").setRequired(true)),
	async execute(interaction) {
    let di = interaction.options.getInteger('number_of_dice')
    let sides = interaction.options.getInteger('sides')
    let x = 0
    if(sides == 0){
      interaction.reply("Please retry with a valid number of sides ie 3, 4, 5 etc")
      x+=1
    }
    if(di == 0){
      interaction.reply("Please retry with a valid number of dice to roll ie 1, 2, 3 etc")
      x+=1
    }
    if(x == 0){
      let a = 0
      let output = []
      while(a < di){
        let num = await gri(sides)
        num +=1
        output.push(num)
        a+=1
      }
      output = output.join(", ")
      interaction.reply(`Results for ${di}d${sides}\n${output}`)
    }

    
	},
};