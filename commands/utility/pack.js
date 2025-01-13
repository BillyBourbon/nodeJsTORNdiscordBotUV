const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require("axios")
// 	Path stuff to get configs
const path = require('path');
const { error } = require('console');
const basePath = path.join(__dirname,"..","..")

//  Configs
const { apikey } = require(path.join(basePath, "config.json"))
const { formatterCurrency, formatterQuantity } = require(path.join(basePath, "helpers.js"))

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pack')
		.setDescription('Replies with Pong!')
        .addStringOption(option=>
            option
                .setName("pack_log")
                .setDescription("The TORN Logs For Your Pack")
                .setRequired(true)
        ),
	async execute(interaction) {
        const packLog = interaction.options.getString("pack_log")

        const embed = new EmbedBuilder()
        embed.setDescription(`Log: ${packLog}`)

        try{
            const [ packOpened, packContentsArray ] = splitPack(packLog)
            embed.setTitle(`${packOpened}`)
            embed.setColor("DarkPurple")

            const tornItems = Object.values(await getTornItems())

            const packOpenedValue = tornItems.find(i=> i.name === packOpened)?.market_value || 0

            packContentsArray.forEach( (element, index) => {
                const market_value = tornItems.find(i=>i.name === element[1])?.market_value || 0
                packContentsArray[index].push(market_value, (market_value*(Number(element[0]))))
            })

            const itemFields = []
            let sumValue = 0
            let sumQuantity = 0

            packContentsArray.sort((a,b) => b[0] - a[0]).forEach(item=>{
                sumValue+=Number(item[3])
                sumQuantity+=item[0]
                const field = {
                    "name" : item[1],
                    "value" : `Quantity: ${formatterQuantity(item[0])}\nMarket Value: ${formatterCurrency(item[2])}\nTotal Value: ${formatterCurrency(item[3])}`,
                    "inline" : true
                }
                itemFields.push(field)
            })
            
            if(itemFields.length < 1) throw new Error("No Item Fields")

            const profit = sumValue-packOpenedValue
            const fieldPackOverview = {
                "name" : `**__Pack Overview__**`,
                "value" : `Items Gained: ${formatterQuantity(sumQuantity)}, Total Item Value: ${formatterCurrency(sumValue)}, Average Value: ${formatterCurrency(sumValue/sumQuantity)}\n\nPack Value: ${formatterCurrency(packOpenedValue)}, ${profit > 0 ?  `Profit: ${formatterCurrency(profit)}` : `Loss: ${formatterCurrency(profit)}`}`,
                "inline" : false
            }

            embed.addFields([fieldPackOverview].concat(itemFields))
        } catch(e){
            console.log(e)
            embed.setTitle("ERROR")
            embed.setColor("Red")
            embed.addFields({"name":"ERROR", "value" :"Bots Failed In Its Duty. He Has Brought Great Dishonour On This Family"})
        }

        await interaction.reply({embeds: [embed]});
	},
};

function splitPack(packLog){
    let packOpened = ""
    let packContentsString = ""
    
    try{
        [ packOpened, packContentsString ] = packLog.split(" opened a ")[1].split(" and gained ")
    } catch(e){
        [ packOpened, packContentsString ] = packLog.split(" exchanged ")[1].split(" and received ")
    }
    
    packContentsArray = packContentsString.split(", ").map(a=>[
        Number(a.split("x ")[0].trim()) , 
        a.substring((a.split("x ")[0]).length+2).trim()
    ])
    
    const output = [ packOpened, packContentsArray ]
    
    return output
}

async function getTornItems(){
    const call = await axios.get(`https://api.torn.com/torn/?selections=items&key=${apikey}`)
    const { data: {items} } = call
    return items
}
