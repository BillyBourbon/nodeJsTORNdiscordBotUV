const axios = require("axios")
const { SlashCommandBuilder } = require('discord.js');
const { defaultEmbed, feildTemplate, formatterCurrency, formatterQuantity, defaultErrorEmbed } = require("../../helpers");

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
        let embed = defaultEmbed(`Items Abroad ${country}`)
        try{

            const countryId = getCountryId(country)
            console.log(countryId, country)
            const data = (await call())[countryId]

            const { update, stocks } = data
            const updateDate =  (new Date(update*1000)).toUTCString()

            const feilds = []
            const outOfStock = []

            embed.setDescription(`Last Updated At: ${updateDate}`)

            stocks.forEach(item=>{
                const { id, name, quantity, cost } = item
                if(quantity == 0) outOfStock.push(`${name} [${id}]`)
                else {
                    feilds.push(feildTemplate(`${name} [${id}]`,`Quantity: ${formatterQuantity(quantity)} | Price: ${formatterCurrency(cost)}`))
                }
            })

            if(outOfStock.length > 0) {
                feilds.push(feildTemplate(`Out Of Stock Items`,`${outOfStock.join(", ")}`))
            }

            embed.addFields(feilds)

        } catch(e){
            embed = defaultErrorEmbed("Unable To Fetch Foreign Items")
        }
        interaction.reply({embeds: [embed]})
	},
};

function getCountryId(country){
    let id = ""
    if(country.length == 3) return country.toLowerCase()
    if(country.split(" ").length == 3){
        country.split(" ").forEach(w=>id+=w[0].toLowerCase())
    }else{
        id = country.substring(0,3)
    }
    id = id.toString().toLowerCase()
    return id
}