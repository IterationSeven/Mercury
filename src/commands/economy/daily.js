import giveCredits from "../../utility/credits.js";
import giveXP from "../../utility/xp.js";
export default {
  name: "daily",
  description: "Get your daily reward",
  execute: async (mod, interaction) => {
    const userData = (await mod.getUser(interaction.user.id)).data();

    let dateObj = new Date();
    let month = dateObj.getUTCMonth() + 1; //months from 1-12
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();

    var currentDate = month + "/" + day + "/" + year;

    var prevDate = userData.daily;
    
    if (!prevDate || new Date(currentDate) > new Date(prevDate)) {
      var credits = await giveCredits(mod, interaction, userData, [20, 100]);
      var xp = await giveXP(mod, interaction, userData, [20, 100]);

      userData.daily = currentDate;

      currentDate = currentDate.split("/");
      
      if(!prevDate) prevDate=new Date();
      else prevDate = new Date(prevDate);

      const diffTime = Math.abs(dateObj - prevDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if(!userData.dailyStreak) userData.dailyStreak=1;
      else if (diffDays==1) {
        userData.dailyStreak++;
      } else {
        userData.dailyStreak = 1;
      }

      await mod.setUser(interaction.user.id, userData);

      var embed = new mod.discord.EmbedBuilder()
        .setTitle("Daily Reward")
        .setDescription(
          `
        You have recieved **${mod.emojis.credit}${credits}** and **${xp}XP**. Claim your next daily reward in 24 hours!
      `
        )
        .setFooter({ text: `Daily Streak ~ ${userData.dailyStreak}` })
        .setTimestamp()
        .setColor("#7e3dff");

      interaction.reply({
        content: "",
        embeds: [embed],
      });
    } else {
      interaction.reply({
        content:
          "You have already recieved your daily reward, try again tomorrow.",
        ephemeral: true,
      });
    }
  },
};
