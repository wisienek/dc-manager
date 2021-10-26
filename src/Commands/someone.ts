import { Collection, GuildMember, Permissions } from "discord.js";
import { Command } from '../Interfaces';

export const command: Command = {
    name: "someone",
    description: "returns random person in guild",
    permission: Permissions.FLAGS.ADMINISTRATOR,
    run: async({ message }) => {
        const members: Collection<string, GuildMember> = await message.guild.members.list();
        const name: string = members.randomKey();

        const member: GuildMember = members.get(name);

        message.reply(`random person: ${member.displayName}#${member.user.discriminator}`);
        return;
    }
};