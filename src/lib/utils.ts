import { Attachment, Message, TextChannel } from 'discord.js';
import { decode } from 'imagescript';
import sharp from 'sharp';

export async function getLastMedia(channel: TextChannel, limit = 30) {
	const messages = await channel.messages.fetch({ limit });

	const lastMessage = messages.find(
		(message: Message) =>
			message.attachments.size > 0 || message.embeds[0]?.data.url
	);

	if (!lastMessage) return undefined;

	const attachment =
		lastMessage.attachments.first() ||
		(lastMessage.embeds[0].data as Attachment);

	return attachment;
}

export async function decodeWEBP(input: Buffer) {
	return decode(await sharp(input).png().toBuffer());
}

export function syntaxHighlight(language: string, code: string) {
	return `\`\`\`${language}\n${code}\`\`\``;
}
