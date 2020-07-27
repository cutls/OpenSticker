export interface ISticker {
    type: 'mastodon'|'pleroma'|'misskey'|'misskeylegacy'|'pixelfed'
    name: string | null,
    bgColor: string[] | null,
    fontColor: string | null,
    favicon: string | null,
    domain: string
}
export interface IStickerOutPut {
    type: 'mastodon'|'pleroma'|'misskey'|'misskeylegacy'|'pixelfed'
    name: string | null,
    bgColor: string[] | null,
    fontColor: string | null,
    favicon: string,
    domain: string
}