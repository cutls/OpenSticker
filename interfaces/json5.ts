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
    domain: string,
    isDefault: boolean
}
export interface usefulObj {
    [key: string]: string
}
export interface dataJson {
    updated: string
    data: IStickerOutPut[]
}