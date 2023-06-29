# fedi-favicon-api

`/get/:domain`  
ex: https://{host}/get/mstdn.jp  
Supported: Mastodon/Pleroma/Misskey(v12~/~v11)/PixelFed  
JSON returned:
```
{ success: true|false, difference: number(0-1), type: 'mastodon' | 'pleroma' | 'misskey' | 'misskeylegacy' | 'pixelfed', isDefault: true|false, url: string(https://~) }
```

`misskey` means Misskey above v12.