export interface ISticker {
    type: 'mastodon' | 'pleroma' | 'misskey' | 'misskeylegacy' | 'pixelfed'
    name?: string | null,
    bgColor?: string[] | null,
    fontColor?: string | null,
    favicon?: string | null
}
export interface IStickerOutPut {
    type: 'mastodon' | 'pleroma' | 'misskey' | 'misskeylegacy' | 'pixelfed'
    name: string | null,
    bgColor?: string[] | null,
    fontColor?: string | null,
    favicon: string,
    withoutCDN: string,
    domain: string,
    isDefault: boolean
}
interface IColor {
    bgColor: string[],
    fontColor: string
}
interface IDefault {
    mastodon: IColor
    pleroma: IColor
    misskey: IColor
    misskeylegacy: IColor
    pixelfed: IColor
}
export interface IDataJson {
    updated: string
    default: IDefault
    data: IStickerOutPut[]
}
export interface IDetector {
    success: boolean
    difference: number
    type: "mastodon" | "pleroma" | "misskey" | "misskeylegacy" | "pixelfed"
    isDefault: boolean
    url: string
}