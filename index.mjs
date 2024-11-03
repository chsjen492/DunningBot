import { Client, Events, GatewayIntentBits} from 'discord.js'
import { config } from 'dotenv'
import Task, {getTasks} from "./src/model/task.js";
import Service from "./src/service/service.js";
import {connectDB} from "./src/model/connect.js";

config()

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]})
const token = process.env.TOKEN

const isValidDateFormat = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString) && !isNaN(new Date(dateString));
}

const calculateDaysLeft = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export const handler = async (event) => {
    try {
        await connectDB();

        // EventBridge 스케줄 이벤트 처리
        if (event.source === 'aws.events') {
            switch(event['detail-type']) {
                case 'qr-reminder':
                    await Service.sendQRReminder();
                    break;

                case 'task-reminder':
                    const tasks = await getTasks()

                    if (tasks.length === 0) {
                        await Service.sendEmbed({
                            title: '📅 할 일 현황',
                            description: '현재 예정된 할 일이 없습니다!',
                            color: 0x00ff00
                        });
                        return;
                    }

                    const tasksWithDaysLeft = tasks.map(task => ({
                        ...task.toObject(),
                        daysLeft: calculateDaysLeft(task.deadline)
                    }));

                    await Service.sendTaskReminder(tasksWithDaysLeft);
                    break;
            }

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Scheduled task completed' })
            };
        }

        const body = JSON.parse(event.body)
        const { command, options } = body

        switch(command) {
            case '/등록':
                const { taskName, deadline } = options

                if (!isValidDateFormat(deadline)) {
                    await Service.sendMessage('날짜 형식이 올바르지 않습니다. YYYY-MM-DD 형식으로 입력해주세요.');
                    break;
                }

                const newTask = new Task({
                    taskName,
                    deadline: new Date(deadline)
                });
                await newTask.save()

                await Service.sendEmbed({
                    title: '✅ 할 일 등록 완료',
                    fields: [
                        {
                            name: '할 일',
                            value: task
                        },
                        {
                            name: '마감기한',
                            value: deadline
                        }
                    ],
                    color: 0x00ff00
                })
                break
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Command processed successfully' })
        }
    } catch (error) {
        console.error('Error:', error);
        await Service.sendMessage('⚠️ 오류가 발생했습니다.')
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        }
    }
}
