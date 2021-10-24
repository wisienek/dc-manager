import { Permissions, TextChannel } from "discord.js";
import { Command, Listener, OptionType } from "../Interfaces";

export const command: Command = {
    name: "roleonreaction",
    description: "role for reaction!",
    permission: Permissions.FLAGS.MANAGE_ROLES,
    options: [
        {
            type: OptionType.CHANNEL,
            name: "channel",
            description: "Where the message lies",
            required: true
        },
        {
            type: OptionType.STRING,
            name: "msg_id",
            description: "ID of the message that the reaction will be on",
            required: true
        },
        {
            type: OptionType.STRING,
            name: "emoji",
            description: "Emoji to get the role",
            required: true
        },
        {
            type: OptionType.ROLE,
            name: "role",
            description: "What role should the member get",
            required: true
        }
    ],
    run: async({ client, message }) => {
        if( message?.options?.data?.length == 4 ) {
            
            const channel = message.options.getChannel("channel");
            const msgLink = message.options.getString("msg_id");
            const emoji = message.options.getString("emoji");
            const role = message.options.getRole("role");

            const fetchedChannel =  client.Channels.get( channel.id ) || await message.guild.channels.fetch( channel.id ) as TextChannel;
            if( !fetchedChannel )
                return message.reply("Couldn't find the channel");
            
            const fetchedMessage = client.Messages.get( msgLink ) || await fetchedChannel.messages.fetch( msgLink );
            if( !fetchedMessage ) 
                return message.reply("Couln't fetch the message!");

            const reacted = await fetchedMessage.react( emoji );
            if( !reacted?.count ) 
                return message.reply("Couldn't react to the message!");
            
            const isadded: Listener | null = await client.db.listener.findFirst({
                where: {
                    guild: message.guild.id,
                    channel: channel.id,
                    emoji,
                    role: role.id
                }
            });

            if( isadded ) 
                return message.reply(`There already is a listner like that. ||id: ${isadded.id}|| !`);

            const item: Listener = await client.db.listener.create({ 
                data: {
                    guild: message.guild.id,
                    channel: channel.id,
                    message: msgLink,
                    emoji,
                    role: role.id
                }
            }); 

            client.reactionListeners.push( item );

            return message.reply(`Saved listener on channel: <#${channel.id}>, emoji: ${emoji} gives role: ${role.name}!`);
        } else {
            return message.reply("Za mało argumentów ;v");
        }
    }
}