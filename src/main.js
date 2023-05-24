import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
// import { code } from 'telegraf/format'
import config from 'config'
import process from "nodemon";
import { ogg } from './ogg.js'

const bot = new Telegraf(config.get('TELEGRAM_BOT'))

bot.on(message('voice'), async (ctx) => {
    try {
        // await ctx.reply(code('Сообщение принял. Жду ответ от сервера...'))
        const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
        const userId = String(ctx.message.from.id)
        const oggPath = await ogg.create(link.href, userId)
        const mp3Path = await ogg.toMp3(oggPath, userId)


        await ctx.reply(mp3Path)
    } catch (e) {
        console.log(`Error while voice message`, e.message)
    }
})
bot.launch()
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop( 'SIGTERM'))