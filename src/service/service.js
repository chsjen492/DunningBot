import axios from 'axios'

class Service {
    constructor() {
        this.url = 'https://discord.com/api/webhooks/1302428174776401920/9XZlKo90lSoX8de-jHdtlZb_3ABkzqqOMvhwKSsckkcNSA-iqLu7vXc8IMq-vKn1LogN'
    }

    async sendMessage(content, mentionEveryone = false) {
        try {
            const payload = {
                content,
                allowed_mentions: {
                    parse: mentionEveryone ? ['everyone'] : []
                }
            }

            const response = await axios.post(this.url, payload)
            return response.data;
        } catch (error) {
            console.error('Discord API error:', error.response?.data || error.message);
            throw error;
        }
    }

    async sendEmbed(embedData, mentionEveryone = false) {
        try {
            const payload = {
                embeds: [embedData],
                allowed_mentions: {
                    parse: mentionEveryone ? ['everyone'] : []
                }
            }

            if (mentionEveryone) {
                payload.content = '@everyone';
            }

            const response = await axios.post(this.url, payload)
            return response.data;
        } catch (error) {
            console.error('Discord API error:', error.response?.data || error.message);
            throw error;
        }
    }

    async sendQRReminder() {
        const embedData = {
            title: '⚠️ QR 체크 리마인더',
            description: `<@everyone> 아 맞다 QR!`,
            color: 0xff0000,
        }

        return this.sendEmbed(embedData);
    }

    async sendTaskReminder(tasks) {
        const embedData = {
            title: '📅 할 일 리마인더',
            color: 0x00ff00,
            fields: tasks.map(task => ({
                name: task.taskName,
                value: `마감일: ${task.deadline.toLocaleDateString()}\n남은 일수: ${task.daysLeft}일`,
                inline: false
            })),
            timestamp: new Date(),
        }

        return this.sendEmbed(embedData, true);
    }
}

const service = new Service();
export default service;