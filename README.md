# Food Picker &trade;

Веб-приложение для автоматизации заказа питания в школах

## Deployment

Для работы приложения необходимы следущие переменные окружения

```c
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL //url приложения, по умолчанию - localhost
QSTASH_CURRENT_SIGNING_KEY
QSTASH_NEXT_SIGNING_KEY //для работы qstash
MAX_DAYS //количество учебных дней в неделе, по умолчанию - 5
```

## Linting

Перед тем как создать pull request в ветку `main`, необходимо обязательно проверить код на предмет соблюдения правил стиля кода. Также желательно проверять код перед каждым коммитом.

```sh
# Просто проверить соблюдение правил
npm run lint
npm run lint:next
npm run lint:es
npm run lint:css

# Проверить и исправить, если это возможно
npm run lint:next:fix
npm run lint:es:fix
npm run lint:css:fix
```
