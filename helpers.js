import { EmbedBuilder } from 'discord.js'
import { stat } from 'fs'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { dbUri, databaseName, databaseCollectionName } = require("./config.json")
const { MongoClient, ServerApiVersion } = require("mongodb")

const formatterCurrency = (n) =>{
    return Intl.NumberFormat("en-US", {
        minimumFractionDigits:0,
        maximumFractionDigits:0,
        style:"currency",
        currency:"USD"
    }).format(n)
}

const formatterQuantity = (n) => {
    return Intl.NumberFormat("en-US", {
        minimumFractionDigits : 0,
        maximumFractionDigits : 0,
    }).format(n)
}

const defaultEmbed = (title, color="Purple", footer = {text:`Made By Bilbosaggings [2323763]`}) =>{
    const embed = new EmbedBuilder()
    embed.setTitle(title)
        .setFooter(footer)
        .setColor(color)

    return embed
}
const defaultErrorEmbed = (message, feildTitle="Error", title="ERROR", color="Red", footer = {text:`Made By Bilbosaggings [2323763]`}) => {
    const embed = new EmbedBuilder()
    embed.setTitle(title)
        .setFooter(footer)
        .setColor(color)
    embed.addFields(feildTemplate(feildTitle, message))
    return embed
}
const feildTemplate = (fName, value, inline = true) =>{
    return {
        name : fName,
        value : value,
        inline : inline
    }
}
const dbClient = new MongoClient(dbUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const getApiKey = async(guildId) => {
    const status = {
        status : false,
        message : "Unable To Fetch Guild",
        response : null
    }
    const GetGuildStatus = await getGuild(guildId)
    if(!GetGuildStatus.status) return status
    const key = GetGuildStatus.response[0].config.bot.apikey
    if(key == null || key == undefined) {
        status.message = "No Apikey Set"
        return status
    }
    status.status = true
    status.message = "Fetched Apikey"
    status.response = key
    return status
}
const getGuild = async (guildId) => {
    const status = {
        status: false,
        message: `Error Fetching Guild ${guildId}`,
        response: null
    }
    try{
        console.log("Connecting To DB (getGuild)")
        const database = await dbClient.db(databaseName)
        const guild = await database.collection(databaseCollectionName).find({guildId:guildId}).toArray()
        if(guild.length !== 1) return status
        else {
            status.response = guild
            status.status = true
            status.message = "Fetched Guild"
        }
    } catch(e){
        console.log(e)
    }
    // finally{
    //     console.log("DB connection closed (getGuild)")
    // }
    
    // await dbClient.close();
    console.log(`GetGuildStatus: `, status)
    return status
}
const updateGuild = async (guildId, guildObj) => {
    const status = {
        status: false,
        message: `Error Updating Guild ${guildId}`,
    }
    try{
        console.log("Connecting To DB (updateGuild)")
        const database = await dbClient.db(databaseName).collection(databaseCollectionName)
        const update = await database.updateOne({guildId:guildId},{$set:{config:guildObj.config}})
        console.log("update")        
        console.log(update)
        status.status = true
        status.message = "Sucesfully Updated Guild"
    } catch(e){
        console.log(e)
    }
    // finally{
    //     console.log("DB connection closed (updateGuild)")
    //     await dbClient.close()
    // }

    console.log(`UpdateGuildStatus: `, status)
    return status
}
const blankServerConfig = () =>{
    return {
        guildId : "",
        config : {
            guild : {
                factionRoles : [
                ]
            },
            bot : {
                apikey : null
            }
        },
    }
}

export { formatterCurrency, formatterQuantity, defaultEmbed, defaultErrorEmbed, feildTemplate, dbClient, blankServerConfig, getGuild, updateGuild, getApiKey}