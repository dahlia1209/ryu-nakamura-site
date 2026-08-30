import { UpdateItem } from '../models/update'
import { data } from './contents.data'

export const updateData: UpdateItem[] = [
  new UpdateItem(
    '2026-08-30',
    'notice',
    'note記事「#18 ストア哲学とマルクスアウレリウス Part1」を公開しました',
    'ローマ皇帝マルクス・アウレリウスが実践したストア哲学の思想背景を、西洋哲学史を辿りながら解説しています。',
    'https://note.com/kenjinishizaki/n/ne8865a1da053',
  ),
  new UpdateItem(
    '2026-08-16',
    'notice',
    '屋号を「RyuTech」に変更しました',
    '運営者の屋号を中村システムエンジニアリング事業所からRyuTechに変更しました。',
    '/about',
  ),
  new UpdateItem(
    '2026-01-24',
    'app',
    'ログイン機能を改修しました',
    '会員登録・ログインまわりの認証フローを改善しました。',
  ),
  new UpdateItem(
    '2025-12-30',
    'app',
    'ブロックチェーン画面を公開しました',
    'オリジナルブロックチェーンの最新ブロック情報を確認できる画面を追加しました。',
    '/blockchain',
  ),
  new UpdateItem(
    '2025-10-13',
    'app',
    'ビットコインマイニングシミュレーターを公開しました',
    'マイニングの仕組みを体験できるシミュレーターアプリを公開しました。',
    '/blockchain_simulator',
  ),
]

export function getMergedUpdates(): UpdateItem[] {
  const articleUpdates = data.contents.map(
    (c) =>
      new UpdateItem(
        c.publish_date,
        'article',
        c.title,
        c.preview_text,
        `/contents/${c.title_no}`,
      ),
  )
  return [...updateData, ...articleUpdates].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}
