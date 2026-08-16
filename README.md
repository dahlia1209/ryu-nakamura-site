# ryu-nakamura-site

## Project Setup

```sh
npm install
```

## ローカル環境起動

```sh
npm run docs:dev
```


## Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
#API起動
cd C:\src\ryu-nakamura-api
func start
#Cypress起動
npm run test:e2e:dev
```

## サイトマップの更新

## デプロイコマンド

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
npx swa build
SWA="ryu-nakamura-swa"
TOKEN=$(az staticwebapp secrets list --name $SWA --query "properties.apiKey" -o tsv)
# swa deploy -d $TOKEN  # プレビュー
npx swa deploy -d $TOKEN --env production  # 商用

```


## Cluade Code
```sh
wsl -d Ubuntu --user root
cd /mnt/c/src/ryu-nakamura-site
claude
```