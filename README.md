// @ts-nocheck

# ryu-nakamura-site

This template should help get you started developing with Vue 3 in Vite.


## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
#API起動
cd C:\src\ryu-nakamura-api
func start
#Cypress起動
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### デプロイコマンド

```sh
#リソース作成
$yyyyMMddHHmm=$(az group list --query "[? contains(name,'webmajiang')].tags.yyyyMMddHHmm" -o tsv)
$rg=$(az group list --query "[? contains(name,'webmajiang')].name" -o tsv)
if ([System.String]::IsNullOrEmpty($rg)){
    $yyyyMMddHHmm=$(Get-Date -Format "yyyyMMddHHmm")
    $rg=$(-Join ("webmajiang-", $yyyyMMddHHmm ,"-rg"))
    }
$location="westus2"
$swa=$(-Join ("webmajiang-", $yyyyMMddHHmm ,"-swa"))
az group create --name $rg --location $location --tags "yyyyMMddHHmm=$yyyyMMddHHmm"
az staticwebapp create -n $swa -g $rg --query "defaultHostname"

#コードデプロイ
swa build
$rg="nakamura-rg"
$swa="ryu-nakamura-swa"
$token=az staticwebapp secrets list --name $swa --query "properties.apiKey" -o tsv
#swa deploy -d $token #プレビュー
swa deploy -d $token --env production #商用

```

### コンテンツ公開手順
・検証APIでコンテンツ登録
・検証APIでコンテンツファイル生成
・検証環境確認
・商用APIでコンテンツ登録
・商用デプロイ
