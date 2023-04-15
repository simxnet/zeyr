import { Message, TextChannel } from 'discord.js';

export async function getLastMedia(channel: TextChannel, limit = 30) {
	const messages = await channel.messages.fetch({ limit });

	const lastMessage = messages.find(
		(message: Message) => message.attachments.size > 0
	);

	if (!lastMessage) return undefined
	
	const attachment = lastMessage.attachments.first()

	return attachment;
}
