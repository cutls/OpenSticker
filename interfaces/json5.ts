export interface ISticker {
    type: 'mastodon'|'pleroma'|'misskey'|'pixelfed'
    name: string,
    bgColor: string[],
    fontColor: string,
    favicon: string|null
}