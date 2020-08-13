export interface ISticker {
    type: 'mastodon'|'pleroma'|'misskey'|'misskeylegacy'|'pixelfed'
    name?: string | null,
    bgColor?: string[] | null,
    fontColor?: string | null,
    favicon?: string | null
}
export interface IStickerOutPut {
    type: 'mastodon'|'pleroma'|'misskey'|'misskeylegacy'|'pixelfed'
    name: string | null,
    bgColor?: string[] | null,
    fontColor?: string | null,
    favicon: string,
    withoutCDN: string,
    domain: string,
    isDefault: boolean
}
export interface usefulObj {
    [key: string]: string
}
interface Colors {
    bgColor: string[],
    fontColor: string
}
interface Default {
    mastodon: Colors
    pleroma: Colors
    misskey: Colors
    misskeylegacy: Colors
    pixelfed: Colors
}
export interface dataJson {
    updated: string
    default: Default
    data: IStickerOutPut[]
}