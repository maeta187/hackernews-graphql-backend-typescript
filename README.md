## node_modules

```bash
$ pnpm i
```

## DB

postgresql を使用しています。

## migrate

### 初回

```bash
$ prisma migrate dev --name init
```

### model の追加

```bash
$ pnpm exec prisma migrate dev --name ""
```
