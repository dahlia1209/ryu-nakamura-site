import { UpdateItem } from '../models/update'
import { data } from './contents.data'

export const updateData: UpdateItem[] = [
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
