//  Discord
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
//	For API Calls to TORN
const axios = require('axios');
const {
  getApiKey,
  defaultEmbed,
  defaultErrorEmbed,
  formatterQuantity,
  feildTemplate,
} = require('../../helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('not_in_ocs')
    .setDescription(
      'Shows a List of users in a faction who arent in an organised crime'
    ),
  async execute(interaction) {
    const apikeyStatus = await getApiKey(interaction.guild.id);
    if (!apikeyStatus.status)
      return interaction.reply({
        embeds: [defaultErrorEmbed(apikeyStatus.message)],
      });
    const apikey = apikeyStatus.response;

    const call = await axios.get(
      `https://api.torn.com/v2/faction/0/members?key=${apikey}`
    );

    const {
      data: { members },
    } = call;

    const fieldsNoInOcs = [];

    members.forEach(member => {
      const {
        name,
        id,
        last_action: { status, relative },
        is_in_oc,
      } = member;

      if (is_in_oc) return;

      fieldsNoInOcs.push(`${name} [${id}] (${relative})`);
    });
    const embeds = [];
    const embed = defaultEmbed('Members Not In OCs');
    embed.addFields(
      feildTemplate(
        `${fieldsNoInOcs.length} Members Not In OCs`,
        fieldsNoInOcs.join('\n')
      )
    );
    embeds.push(embed);

    await interaction.reply({ embeds: embeds });
  },
};
