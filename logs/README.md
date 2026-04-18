# logs/ ディレクトリについて

このフォルダはセットアップ・開発作業のログを保存します。
`.gitignore` により `*.log` ファイルはコミットされません。

## ファイル構成

```
logs/
  setup_YYYYMMDD_HHMMSS.log  # セットアップ作業ログ
  errors/                    # エラー発生時の詳細ログ
    error_YYYYMMDD_HHMMSS.log
```

## エラー対応フロー

1. エラー発生 → 即停止
2. `logs/errors/error_YYYYMMDD_HHMMSS.log` に記録
3. エラー内容・発生箇所・関連ファイルを表示
4. 推定原因を3つ提示
5. 各原因への対応案を提示
6. ユーザーが対応を選択して再実行
