import giveCredits from "../../utility/credits.js";
export default {
  name: "give-credits",
  description: "Give someone some of your credits.",
  options: [
    {
      name: "user",
      description: "User to give credits to.",
      type: 6,
      required: true,
    },
    {
      name: "amount",
      description: "Amount of credits to give.",
      type: 10,
      required: true,
    },
    {
      name: "reason",
      description: "Reason your gifting credits.",
      type: 3,
    },
  ],
  execute: async (mod, interaction) => {
    const user = interaction.user;
    const user2 = (
      await interaction.guild.members.fetch(
        interaction.options.get("user").value
      )
    ).user;
    const amount = interaction.options.get("amount").value;

    var reason = interaction.options.get("reason");
    if (!reason) reason = "";
    else reason = reason.value;

    var userData = (await mod.getUser(user.id)).data();
    var userData2 = (await mod.getUser(user2.id)).data();

    if (user2.bot) {
      return interaction.reply({
        content: "You cant give credits to a bot. Dumbass.",
        ephemeral: true,
      });
    }
    if (await giveCredits(mod, interaction, userData, -amount)) {
      interaction.author = user2;
      await giveCredits(mod, interaction, userData2, amount);
    } else {
      return interaction.reply({
        content: "Not enouph credits.",
        ephemeral: true,
      });
    }

    await mod.setUser(user.id, userData);
    await mod.setUser(user2.id, userData2);

    interaction.reply({
      content: `
      <@${user.id}> has given ${mod.emojis.credit}${amount} to <@${user2.id}> ${reason}
      `,
    });
  },
};
