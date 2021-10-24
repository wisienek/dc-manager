import { CategoryChannel, Permissions } from "discord.js";
import { Command, OptionType } from '../Interfaces';

export const command: Command = {
    name: "purgecategory",
    description: "Deletes category allong with all channels",
    permission: Permissions.FLAGS.ADMINISTRATOR,
    options: [
        {
            type: OptionType.CHANNEL,
            name: "cattegory",
            description: "cattegory to delete",
            required: true
        }
    ],
    run: async({ message }) => {
        const category = message.options.getChannel("cattegory");

        const fetchedCat = await message.guild.channels.fetch(category.id);

        if( fetchedCat && fetchedCat instanceof CategoryChannel ) {
            const channels = (await message.guild.channels.fetch()).filter( ch => ch?.parentId === fetchedCat.id );

            const msg = `Bulk delete cattegory by ${message.member.user.username}`;

            channels.forEach( ch => ch.delete(msg) );
            fetchedCat.delete(msg);

            return message.reply(`Deletion successful`);
        } else {
            return message.reply(`Channel <#${category.id}> is not a cattegory!`);
        }
    }
};