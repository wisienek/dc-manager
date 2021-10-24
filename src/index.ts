import betterLogging from 'better-logging';
import dotenv from "dotenv";
import Bot from "./Client";

// load config
betterLogging(console);
dotenv.config();

// const token = process.env.TOKEN;
// const manager = new ShardingManager( 
//     path.resolve( __dirname, "Client", "index.ts" ), 
//     { 
//         token,
//         execArgv: ['-r', 'ts-node/register']
//     });

// manager.spawn();
// manager.on('shardCreate', async shard => {
//     console.log(`Launched shard ${shard.id}`);

//     shard.on('error', (error) => {
//         console.error(error);
//     });
// });

const bot = new Bot().init();