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
    domain: string
}
export interface usefulObj {
    [key: string]: string
}