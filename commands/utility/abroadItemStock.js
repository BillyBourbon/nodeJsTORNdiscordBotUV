const axios = require("axios")
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
// 	Path stuff to get configs
const path = require('path');
const { error, count } = require('console');
const basePath = path.join(__dirname,"..","..")

//  Configs
const { apikey } = require(path.join(basePath, "config.json"))
const { formatterCurrency, formatterQuantity } = require(path.join(basePath, "helpers.js"))

async function call() {
  let call = await axios.get("https://yata.yt/api/v1/travel/export/")
  return call.data.stocks
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('stock')
		.setDescription('Shows the latest stock abroad')
    .addStringOption(option=>option.setName("country").setDescription("Enter the country you want stock data on").setRequired(true)),
	async execute(interaction) {
        const country = interaction.options.getString('country')
        const countryId = getCountryId(country)

        const data = (await call())[countryId]

        const { update, stocks } = data
        const updateDate =  (new Date(update*1000)).toUTCString()

        const feilds = []
        const outOfStock = []

        const embed = new EmbedBuilder()
            .setTitle(`Items Abroad ${country}`)
            .setDescription(`Last Updated At: ${updateDate}`)
            .setColor("Purple")

            stocks.forEach(item=>{
            const { id, name, quantity, cost } = item
            if(quantity == 0) outOfStock.push(`${name} [${id}]`)
            else {
                const feild = {
                    "name" : `${name} [${id}]`,
                    "value" : `Quantity: ${formatterQuantity(quantity)} | Price: ${formatterCurrency(cost)}`,
                    "inline" : true
                }
                feilds.push(feild)
            }
        })

        if(outOfStock.length > 0) {
            feilds.push({
                "name" : `Out Of Stock Items`,
                "value" : `${outOfStock.join(", ")}`, 
            })
        }

        embed.addFields(feilds)

        await interaction.reply({embeds: [embed]})
	},
};

function getCountryId(country){
    let id = ""
    console.log(country)
    if(country.length == 3) return country
    if(country.split(" ").length == 3){
        country.split(" ").forEach(w=>id+=w[0])
    }else{
        id = country.substring(0,3)
    }
    return id.toLowerCase()
}