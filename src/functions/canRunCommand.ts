import { CommandInteraction } from "discord.js";
import botClient from "../Client";
import { Command } from "../Interfaces";

export const canRunCommand: 
    (i: CommandInteraction, c: Command, b: botClient) => Promise<boolean> = 
    async ( interaction: CommandInteraction, command: Command, client: botClient ) => {
    const member = await interaction.guild.members.fetch( interaction.user.id );

    const hasPermission = interaction.memberPermissions.has( command.permission );
    let onlyForCheck = false;

    command.onlyFor && command.onlyFor.forEach( r => {
        if( onlyForCheck === false ) {
            if( r.type === "MEMBER" ) {
                r.id === interaction.user.id && (onlyForCheck = true);
            } else if ( r.type === "ROLE" ){
                member.roles.cache.some( role => r.id === role.id ) && (onlyForCheck = true);
            }

            if( onlyForCheck ) return;
        }
    });


    if( hasPermission || onlyForCheck ) return true;
}