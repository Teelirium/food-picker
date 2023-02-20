# Food Picker &trade;

Веб-приложение для автоматизации заказа питания в школах

## Development

### Linting

Перед тем как создать pull request в ветку `main`, необходимо обязательно проверить код на предмет соблюдения правил стиля кода. Также желательно проверять код перед каждым коммитом.

```sh
# Просто проверить соблюдение правил
npm run lint:next
npm run lint:es
npm run lint:css

# Проверить и исправить, если это возможно
npm run lint:next:fix
npm run lint:es:fix
npm run lint:css:fix
```