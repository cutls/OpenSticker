import { IStickerOutPut } from './interfaces/json5.ts'
const decoder = new TextDecoder('utf-8')
const append = decoder.decode(await Deno.readFile(`./template/append.sticker`))
const sticker = decoder.decode(await Deno.readFile(`./template/sticker.sticker`))
const twoLetters = {
    mastodon: 'md',
    pleroma: 'pl',
    misskey: 'mi',
    misskeylegacy: 'ml',
    pixelfed: 'pf'
}

export default function(obj: IStickerOutPut[]) {
    let output = ''
    for(let i = 0; i < obj.length; i++) {
        const target = obj[i]
        let {domain, name, bgColor, fontColor, favicon} = target
        const type = target.type as 'mastodon'|'pleroma'|'misskey'|'misskeylegacy'|'pixelfed'
        if(!name) name = domain
        const tl = twoLetters[type]
        let bgColorCSS = `var(--${tl})`
        let bgColorTCSS = `var(--${tl}t)`
        if(bgColor) {
            bgColorCSS = ''
            bgColorTCSS = ''
            for(let j = 0; j < bgColor.length; j++) {
                const bg = bgColor[j]
                bgColorCSS = bgColorCSS + bg + ','
                bgColorTCSS = bgColorTCSS + bg + ' 84%,'
            }
            bgColorCSS = `linear-gradient(90deg, ${bgColorCSS} transparent)`
            bgColorTCSS = `linear-gradient(90deg, ${bgColorTCSS} transparent)`
        }
        if(!fontColor) fontColor = '#fff'
        const str = sticker.replace(/{{domain}}/g, domain)
                           .replace(/{{bg}}/g, bgColorCSS)
                           .replace(/{{bgt}}/g, bgColorTCSS)
                           .replace(/{{favicon}}/g, favicon)
                           .replace(/{{color}}/g, fontColor)
    output = output + str
    }
    return append + output
}