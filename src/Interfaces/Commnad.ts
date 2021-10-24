import Bot from "../Client";
import { PermissionResolvable, CommandInteraction, ApplicationCommandOptionChoice } from "discord.js";
import { OptionType } from './OptionType';
import { ChannelType } from "discord-api-types";

type args = {
    client: Bot;
    message: CommandInteraction;
    args?: string[];
}
type CommandOption = {
    type: OptionType;
    description: string;
    name: string;
    required: boolean;
    choices?: ApplicationCommandOptionChoice[];
    options?: CommandOption[];
    channelTypes?: ChannelType[];
}

type OnlyFor = {
    type: "ROLE" | "MEMBER";
    id: string;
}

interface Run {
    (arg0: args);
}

export interface Command {
    id?: string;
    name: string;
    description: string;
    options?: CommandOption[];
    aliases?: string[];
    permission?: PermissionResolvable
    onlyFor?: OnlyFor[]
    run: Run;
}