import { config } from 'dotenv'

config()

export const { DB_URL, CHANNEL_ID, DISCORD_APPLICATION_ID, DISCORD_TOKEN } = process.env
