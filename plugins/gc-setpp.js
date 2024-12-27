import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import { writeFileSync, unlinkSync } from 'fs';

let handler = async (m, { conn }) => {

  let q = m.quoted ? m.quoted : m;
  if (!q.message || !q.message.imageMessage) {
    return m.reply('「✦」 Por favor, responde a una imagen válida.');
  }

  let mime = q.message.imageMessage.mimetype || '';
  if (!/image/.test(mime)) {
    return m.reply('「✦」 Por favor, proporciona una imagen válida.');
  }

  try {
    const stream = await downloadContentFromMessage(q.message.imageMessage, 'image');
    let buffer = Buffer.from([]);

    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    const filePath = 'temp-image.jpg';
    writeFileSync(filePath, buffer);

    await conn.updateProfilePicture(m.chat, { url: filePath });
    unlinkSync(filePath); // Eliminar el archivo después que Hutao haga los momos.
    return m.reply('「✦」 La foto de perfil del grupo se ha cambiado exitosamente.');
  } catch (e) {
    return m.reply(`「✦」 Hubo un error al actualizar la imagen: ${e.message}`);
  }
};

handler.command = ['setppgroup'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;