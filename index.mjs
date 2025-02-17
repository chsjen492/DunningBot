import { Client, GatewayIntentBits } from 'discord.js'
import Task from './src/model/task.js'
import { connectDB } from './src/model/connect.js'
import { DISCORD_TOKEN } from './src/config/index.js'
import { cronJobs } from './src/service/cron.js'
import { initSetting } from './src/service/command.js'
import { getCurrentWeek, getNextWeek } from './src/utils/time.js'

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
})

client.once('ready', async () => {
    await connectDB()
    await initSetting()
    console.log('독촉 준비 완료')
    cronJobs(client)
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return

    try {
        const commandName = interaction.commandName

        if (commandName === '이번주' || commandName === '다음주') {
            const taskName = interaction.options.getString('할일')
            const currentWeek = getCurrentWeek(new Date())
            const week = commandName === '이번주' ? currentWeek : getNextWeek(currentWeek)

            const newTask = new Task({
                taskName,
                week,
            })

            await newTask.save()

            await interaction.reply({
                embeds: [
                    {
                        title: '📝 할 일 등록 완료',
                        fields: [
                            { name: '할 일', value: taskName },
                            { name: '등록된 주차', value: `${commandName}` },
                        ],
                        color: 0x00ff00,
                    },
                ],
            })
        } else if (commandName === '끝') {
            const taskName = interaction.options.getString('할일')
            const currentWeek = getCurrentWeek(new Date())

            const deletedTask = await Task.deleteOne({ taskName, week: currentWeek })

            if (deletedTask) {
                await interaction.reply({
                    embeds: [
                        {
                            title: '✅ 할 일 완료',
                            fields: [{ name: '완료된 작업', value: taskName }],
                            color: 0xff0000,
                        },
                    ],
                })
            } else {
                await interaction.reply({
                    content: '이번 주 할 일 목록에 없습니다.',
                    ephemeral: true,
                })
            }
        }
    } catch (error) {
        console.error('Command execution error:', error)
        await interaction.reply({
            content: '⚠️ 오류가 발생했습니다.',
            ephemeral: true,
        })
    }
})

client.login(DISCORD_TOKEN)
