import { REST, Routes, SlashCommandBuilder } from 'discord.js'
import { DISCORD_APPLICATION_ID, DISCORD_TOKEN } from '../config/index.js'

const commands = [
    new SlashCommandBuilder()
        .setName('이번주')
        .setDescription('이번 주 할 일을 등록합니다.')
        .addStringOption(option => option.setName('할일').setDescription('할 일을 입력하세요').setRequired(true)),
    new SlashCommandBuilder()
        .setName('다음주')
        .setDescription('다음 주 할 일을 등록합니다.')
        .addStringOption(option => option.setName('할일').setDescription('할 일을 입력하세요').setRequired(true)),
    new SlashCommandBuilder()
        .setName('끝')
        .setDescription('이번 주 할 일을 완료합니다.')
        .addStringOption(option => option.setName('할일').setDescription('완료한 작업을 입력하세요').setRequired(true)),
]

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN)

export async function initSetting() {
    try {
        console.log('명령어 등록 중...')
        await rest.put(Routes.applicationCommands(DISCORD_APPLICATION_ID), { body: commands.map(command => command.toJSON()) })
        console.log('명령어 등록 완료!')
    } catch (error) {
        console.error('명령어 등록 중 오류 발생:', error)
    }
}
