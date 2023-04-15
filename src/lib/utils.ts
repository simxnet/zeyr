import { Attachment, Message, TextChannel } from 'discord.js';

export async function getLastMedia(channel: TextChannel, limit = 30) {
	const messages = await channel.messages.fetch({ limit });

	const lastMessage = messages.find(
		(message: Message) =>
			message.attachments.size > 0 || message.embeds[0]?.image
	);

	if (!lastMessage) return undefined;

	const attachment =
		lastMessage.attachments.first() ||
		(lastMessage.embeds[0].image as Attachment);

	return attachment;
}
