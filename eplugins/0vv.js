const { bot, forwardOrBroadCast, parsedJid } = require('../lib')
const fs = require('fs/promises')
const path = require('path')
const crypto = require('crypto')

const ARCHIVE_DIR = '/data/media'

bot(
  {
    pattern: 'vv ?(.*)',
    fromMe: true,
    desc: 'antiViewOnce',
    type: 'whatsapp',
  },
  async (message, match) => {
    const reply = message.reply_message

    if (!reply || (!reply.image && !reply.video && !reply.audio)) {
      return await message.send(
        '*Example\n- reply to a viewOnce image, video or audio*\n- vv jid (optional)'
      )
    }

    const [jid] = parsedJid(match)

    // Archive media explicitly selected with .vv.
    try {
      const media = await reply.downloadMediaMessage()

      if (!Buffer.isBuffer(media) || media.length === 0) {
        throw new Error('Downloaded media is empty or not a Buffer')
      }

      const extension = reply.image
        ? 'jpg'
        : reply.video
          ? 'mp4'
          : 'ogg'

      await fs.mkdir(ARCHIVE_DIR, { recursive: true })

      const filename = `${new Date().toISOString().replace(/[:.]/g, '-')}-${crypto.randomUUID()}.${extension}`

      await fs.writeFile(path.join(ARCHIVE_DIR, filename), media, {
        flag: 'wx',
        mode: 0o600,
      })

      console.log(`[VV ARCHIVE] Saved ${filename} (${media.length} bytes)`)
    } catch (error) {
      console.error('[VV ARCHIVE] Failed to save media:', error)
    }

    // Preserve the original forwarding behavior.
    await forwardOrBroadCast(jid || message.jid, message, {
      viewOnce: false,
    })
  }
)
