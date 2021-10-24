import { CommandInteraction } from "discord.js";
import { Event } from "../Interfaces";
import { canRunCommand } from "../functions/canRunCommand";

export const event: Event = {
    name: "interactionCreate",
    run: async ( client, i: CommandInteraction ) => {

        // command handler
        if( i.isCommand() ) {
            try {
                const command = client.commands.get( i.commandName );
                if ( !command ) return;

                if( canRunCommand(i, command, client) )
                    await command.run({ client, message: i });
                    
            } catch (e) { 
                console.error(`Error while executing ${i.commandName}`, e);
            }
        }
    }   
}