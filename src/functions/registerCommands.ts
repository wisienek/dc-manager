import { Command, CommandList } from "../Interfaces";

import { REST }  from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import botClient from "../Client";

const rest = new REST({version: '9'}).setToken( process.env.TOKEN );


export const registerCommands: (client: botClient, guildIds?: string[]) => void = ( client: botClient, guildIds: string[] ) => {
    const guilds = client.guilds.cache;
    const builtCommands: any[] = client.commands.map( (command: Command) => {
        return { 
            name: command.name, 
            description: command.description, 
            options: command.options, 
            default_permission: true // (command.permission || command.onlyFor) ? false : true,
        };
    });

    for (const gi of guilds) {
        const guild = gi[1];
        
        if( guildIds && guildIds.indexOf( guild.id ) == -1 ) continue;

        rest.put(
            Routes.applicationGuildCommands( client.user.id, gi[0] ), 
            { body: builtCommands } 
        );
    }
}