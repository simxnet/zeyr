import { Message, TextChannel } from 'discord.js';

export async function getLastMedia(channel: TextChannel) {
	const messages = await channel.messages.fetch({ limit: 100 });

	const lastAttachment = messages.find(
		(message: Message) => message.attachments.size > 0
	);
	const attachment = lastAttachment?.attachments.first();

	if (lastAttachment && attachment) {
		return attachment;
	}

	return undefined;
}
