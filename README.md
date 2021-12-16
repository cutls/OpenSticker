# OpenSticker
バックエンド

Denoで書いた。

デプロイ先: https://s.0px.io

API

* `/json`: json形式そのまま
* `/mastodon`: Mastodon対応CSS
* `/mastodon/peers?domain=domain.tld`: domain.tldの連合先だけにフィルタしたCSS(Mastodon用)

# データを追加しよう

PRでデータを追加・編集します。

フォークします。

あなたのインスタンスがdomain.tldなら…

`resources/d/domain.tld/data.json5`  
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
    //fontColorは指定しない(nullまたは省略)と白(#fff)
    fontColor: '#000',
    //must https://
    favicon: null
    //指定しない(nullまたは省略)とインスタンスのfaviconを取得します
}
```

と書いてPRを送ってください。 PRはcreateするとテンプレートが現れるのでそれに従って送信してください。  

頭文字(sub.domain.tldならs)のフォルダに入れます。
日本語ドメインならx(punycode)に、数字の場合は0につっこんでください。

JSON5はJSONのスーパーセットなのでJSONを書いて拡張子だけ.json5にしてもらってもOKです。

faviconを指定するときはCDNが通った外部URLを指定してください。用意できない場合はGitHubのdomain.tld内においてGitHub CDN等のURLを指定してください。

`misskeylegacy`はv11やめいすきー(v10)等用に指定します。

# ビルド

`deno run --unstable --allow-read --allow-write --allow-net builderCli.ts`

初回はすべてのfaviconをチェックする都合上、かなり時間がかかります。2回目以降はoutput/cache.jsonにキャッシュされます。

公式キャッシュ(?)として、最新masterに準じたキャッシュを公開しています。 https://s.0px.io/workflow/cache.json

`wget -P ./output https://s.0px.io/workflow/cache.json && deno run --unstable --allow-read --allow-write --allow-net builderCli.ts`  
で公式キャッシュを使ってビルドできます。