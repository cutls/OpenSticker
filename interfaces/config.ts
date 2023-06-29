export interface IConfig {
    secret: string
}
export type IType = null | undefined | 'mastodon' | 'pleroma' | 'misskey' | 'misskeylegacy' | 'pixelfed'