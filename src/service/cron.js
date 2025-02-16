import cron from 'node-cron'
import { getCurrentWeek, getNextWeek } from '../utils/time.js'
import Task from '../model/task.js'
import { EmbedBuilder } from 'discord.js'
import { CHANNEL_ID } from '../config/index.js'

export const cronJobs = client => {
    // 매일 아침 9시 알림
    cron.schedule(
        '0 9 * * *',
        async () => {
            try {
                const channel = client.channels.cache.get(CHANNEL_ID)
                if (!channel) return

                const currentWeek = getCurrentWeek(new Date())
                const tasks = await Task.find({ week: currentWeek })

                if (tasks.length === 0) {
                    const embed = new EmbedBuilder().setTitle('📅 주간 할 일').setDescription('할 일 없음').setColor(0x00ff00)

                    await channel.send({ embeds: [embed] })
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle('📅 주간 할 일')
                        .setColor(0x00ff00)
                        .addFields(
                            tasks.map(task => ({
                                name: task.taskName,
                                inline: false,
                            })),
                        )

                    await channel.send({
                        content: '@everyone',
                        embeds: [embed],
                    })
                }
            } catch (error) {
                console.error('Daily reminder error:', error)
            }
        },
        {
            timezone: 'Asia/Seoul',
        },
    )

    // 매주 일요일 밤 11시 주간 업데이트
    cron.schedule(
        '0 23 * * 0',
        async () => {
            try {
                const channel = client.channels.cache.get(CHANNEL_ID)
                if (!channel) return

                const currentWeek = getCurrentWeek(new Date())
                const nextWeek = getNextWeek(currentWeek)

                const result = await Task.updateMany({ week: currentWeek }, { $set: { week: nextWeek } })

                if (result.modifiedCount > 0) {
                    const embed = new EmbedBuilder()
                        .setTitle('📅 주간 할 일 업데이트')
                        .setDescription(`미완료된 ${result.modifiedCount}개의 할 일을 미뤄버렸습니다.`)
                        .setColor(0xffff00)

                    await channel.send({ embeds: [embed] })
                }
            } catch (error) {
                console.error('Weekly update error:', error)
            }
        },
        {
            timezone: 'Asia/Seoul',
        },
    )
}
