<script lang="ts" setup>

</script>

<template>
    <table>
            <thead>
                <tr>
                    <th colspan="2">個人事業者情報</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>事業主名</th>
                    <td>中村 龍</td>
                </tr>
                <tr>
                    <th>屋号</th>
                    <td>中村システムエンジニアリング事業所</td>
                </tr>
                <tr>
                    <th>業種</th>
                    <td>ITサービス・ソフトウェア開発</td>
                </tr>
                <tr>
                    <th>所在地</th>
                    <td>〒101-0024 東京都千代田区神田和泉町1番地6-16ヤマトビル405</td>
                </tr>
                <tr>
                    <th>開業日</th>
                    <td>2025年3月1日</td>
                </tr>
            </tbody>
        </table>
</template>

<style scoped>
table {
      border-collapse: collapse;
      width: 100%;
    }
    caption {
      font-weight: bold;
      font-size: 1.2em;
      margin-bottom: 10px;
    }
    thead {
      background-color: green;
      color: white;
    }
    tfoot {
      background-color: #f2f2f2;
      font-weight: bold;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    tbody tr:nth-child(even) {
      background-color: #f9f9f9;
    }
</style>