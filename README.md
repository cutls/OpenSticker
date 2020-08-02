# OpenSticker
バックエンド

Denoで書いた。

デプロイ先: https://s.0px.io

API

* `/json`: json形式そのまま
* `/mastodon`: Mastodon対応CSS
* `/mastodon/peers?domain=domain.tld`: domain.tldの連合先だけにフィルタしたCSS(Mastodon用)

```
{
    //'mastodon'|'pleroma'|'misskey'|'misskeylegacy'|'pixelfed'
    type: 'mastodon',
    //指定しない(nullまたは省略)とドメイン名がそのまま使われます
    name: 'Cutls',
    //bgColorは指定しない(nullまたは省略)と上記`type`に合わせて設定されます
    bgColor: [
        //Array of background-color from left to right
        '#fff'
    ],
    //fontColorはnullだ指定しない(nullまたは省略)と白(#fff)
    fontColor: '#000',
    //must https://
    favicon: null
    //指定しない(nullまたは省略)とインスタンスのfaviconを取得します
}
```
を、resources/頭文字(数字なら0, Punycodeならx)/domain.tld(cutls.comなど)のdata.json5につっこんでPRを出してください。 
JSON5はJSONのスーパーセットなのでJSONを書いて拡張子だけ.json5にしてもらってもOKです。  
faviconを指定するときはCDNが通った外部URLを指定してください。用意できない場合はGitHubのdomain.tld内においてGitHub CDN等のURLを指定してください。  
`misskeylegacy`はv11やめいすきー(v10)等用に指定します。
