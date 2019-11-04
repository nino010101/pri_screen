# Pri Screen!

> プリチャン配信っぽいカンジに画面を配信して、それに対していいねを送ることができるWebRTCのアプリです

## Build Setup

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build

# deploy to firebase (need firebase-cli)
$ firebase deploy

```

## 開発環境の構築
- このリポジトリをクローンします
- `yarn install`します
- Skywayとfirebaseに登録してappキーなどを取得します
- 以下のような.envファイルをプロジェクトのrootに作成します
```
SKYWAY_APIKEY="skywayのキー"
FIREBASE_CONFIG="firebase configのJsonString"
```
- `yarn dev`すると立ち上がります
- わからなかったらツイッターとかで(`@_pkpq_`)まで連絡ください
