import { Permissions, TextChannel } from "discord.js";
import { Command, Listener, OptionType } from "../Interfaces";

export const command: Command = {
    name: "roleonreaction",
    description: "role for reaction!",
    permission: Permissions.FLAGS.MANAGE_ROLES,
    options: [
        {
            type: OptionType.SUB_COMMAND,
            name: "create",
            description: "Creates a listener",
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
        },
        {
            type: OptionType.SUB_COMMAND,
            name: "delete",
            description: "removes a listener",
            options: [
                {
                    type: OptionType.NUMBER,
                    name: "id",
                    description: "Id of a listener",
                    required: true
                },
            ]
        }
    ],
    run: async({ client, message }) => {
        const cmd = message.options.getSubcommand();
        
        switch( cmd ) {
            case "create": {
                const channel = message.options.getChannel("channel");
                const msgLink = message.options.getString("msg_id");
                const emoji = message.options.getString("emoji");
                const role = message.options.getRole("role");

                const linked = await client.db.listener.count({
                    where: {
                        guild: message.guildId
                    }
                });

                if ( linked > 20 ) 
                    return message.reply(`You already reached max listeners on this server.\nBuy premium to unlock unlimited use.`);

                const fetchedChannel = client.Channels.get( channel.id ) || await message.guild.channels.fetch( channel.id ) as TextChannel;
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

                return message.reply(`Saved listener \nOn channel: <#${channel.id}>\nemoji: ${emoji}\ngives role: <@${role.id}>\nListener id: \`${item.id}\`!`);
            }
            case "delete": {
                const id = message.options.getNumber("id");
                
                if( !id ) return message.reply(`No id provided!`);

                const searchedListener = await client.db.listener.findFirst({ 
                    where: {
                        guild: message.guildId,
                        id
                    }
                });
                if( !searchedListener ) return message.reply(`Couldn't find any listeners in this guild with id: ${id}`);

                const fetchedChannel = await message.guild.channels.fetch( searchedListener.channel ) as TextChannel;
                const fetchedMessage = await fetchedChannel.messages.fetch( searchedListener.message );

                await fetchedMessage.reactions.resolve( searchedListener.emoji ).remove();
                await client.db.listener.delete({ where: { id } });

                return message.reply(`Deleted successfully!`);
            }
            default: return message.reply(`Unknown command!`);
        }
    } 
}