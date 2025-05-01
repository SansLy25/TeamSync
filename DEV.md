from games.schemas import GameSchemaReadfrom games.schemas import GameSchemaReadfrom users.views import users_bp

# Дополнительная информация

Это расширение документации проекта которое содержит информацию для разработчиков данного проекта, а именно

- Структура проекта (бэкенд)
- Взаимодействие с БД
- Фишки


# Структура проекта и регистрация приложений

Проект состоит из так называемых приложений - отдельных модулей отвечающих за конкретную часть API (например приложение users отвечает за логику пользователей), Приложение по сути это просто python пакет внутри `src/`, внутри каждого приложения есть следующие файлы

- `schemas.py` - pydantic схемы для валидации данных
- `models.py` - sqlalchemy модели для работы с БД
- `views.py` - flask вьюхи для обработки запросов
- `services.py` - логика БД для данного приложения

Кроме файлом приложений есть еще файлы не относящиеся к конкретному приложению, а именно
- `main.py` - файл запуска приложения в dev режиме, здесь создается Flask приложение и подключаются все приложения
- `app.py` - файл конфигурации Flask приложения, здесь создается Flask app и подключаются все приложения и расширения
- `wsgi.py` - wsgi файл для Guvicorn (запуск в production mode)

Еще помимо приложений есть следующие пакеты
- `core/` - расширение для rest_api
- `database/` - пакет для работы с БД, здесь создается сессия и миграции alembic

В целом структура выглядит так:
```
src/
├─ core/
├─ users/
│  ├─ schemas.py # схемы
│  ├─ models.py # модели
│  ├─ views.py # фунции представления
│  ├─ services.py # работа с бд
├─ games/
│  ├─ schemas.py
│  ├─ models.py
│  ├─ views.py
│  ├─ services.py
├─ bids/
│  ├─ schemas.py
│  ├─ models.py
│  ├─ views.py
│  ├─ services.py
├─ database/
│  ├─ migrations/ # миграции alembic (про них в разделе про работу с бд)
├─ main.py # запуск
├─ app.py # конфигурация Flask App
├─ wsgi.py # wsgi файл для запуска приложения
```
Приложения здесь просто для демонстрации, в проекте их будет больше и они будут другие

## Создание приложения
Все довольно тривиально, разберем на примере приложения users
1. Создаем python пакет (папка с файлом __init__.py) внутри src/
2. Создаем файлы `schemas.py`, `models.py`, `views.py`, `services.py`
3. Создаем FlaskBlueprint в файле views.py: 
    ```python
    from flask import Blueprint
    users_bp = Blueprint('users', __name__, url_prefix='/api/users')
    ```
   аргумент `url_prefix` это префикс для всех эндпоинтов данного приложения
4. Регистрируем blueprint в файле app.py в функции register_blueprints:
    ```python
    from users.views import users_bp
   
    def register_blueprints(app):
        app.register_blueprint(users_bp)
        """...другие приложения"""
    ```
5. В файле `src/database/migrations/env.py` просто добавляем импорт файла моделей
    ```python
    from users import models
    ```

Все, теперь можно создавать эндпоинты с помощью blueprint:
```python
@users_bp.route('/<int:user_id>', methods=['GET'])
@rest_api()
def get_user(user_id: int):
    pass
```

# Взаимодействие с БД
Для интеграции SQLAlchemy с Flask используется расширение Flask-SQLAlchemy, использование происходит через объект db из app.py:
```python
from app import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
```

И использовать сессии тоже через него
```python
from app import db

db.session.add(user)
db.session.commit()
```
В целом ничем от работы с обычным SQLAlchemy не отличается

## Миграции

### Создание миграций
Дело в том что просто объявить модели в models.py мало, нужно еще создать миграции(изменения таблиц в самой базе данных, можно загуглить если надо) и применить их к БД, для этого используется alembic, который уже интегрирован в проект, для создания миграций нужно выполнить команду
```bash
flask db migrate
```
Находясь в папке src/, после этого создаться соответствующий файл миграции

### Применение миграций
При запуске в production режиме миграции применяются автоматически(прописано в Dockerfile), но в dev режиме нужно применять вручную, для этого нужно выполнить команду
```bash
flask db upgrade
```

Создавать миграции нужно если вы что то изменили в моделях: удалили, изменили, добавили поле или еще одну модель, в общем все что связано с моделями, если вы просто изменили логику работы с БД в services.py или views.py то миграции создавать не нужно

# Фишки
### Схемы из атрибутов

Часто возникает ситуация когда имена полей в схеме pydantic и имена атрибутов в модели SQLAlchemy совпадают (что является хорошей практикой), и в таких случаях приходится писать следующее:
```python
@game_bp.route('/<int:game_id>', methods=['GET'])
@rest_api(
   responses = [{200: GameSchema}]
)
def get_game(game_id: int):
    game = Game.query.get(game_id) # возвращает объект модели SQLAlchemy
    if not game:
        raise NotFound('Game not found')
    return GameSchema(id=game.id, name=game.name, description=game.description)
```
То есть мы просто для переносим атрибуты объекта game в схему, и если их немного то это еще выглядит нормально, но если много это уже выглядит не очень, и в таких случаях можно использовать метод `model_validate` у класса pydantic схемы, который позволяет создавать объект схемы из объекта модели SQLAlchemy на основе атрибутов, то есть можно сделать так:
```python
@game_bp.route('/<int:game_id>', methods=['GET'])
@rest_api(
   responses = [{200: GameSchema}]
)
def get_game(game_id: int):
    game = Game.query.get(game_id) # возвращает объект модели SQLAlchemy
    if not game:
        raise NotFound('Game not found')
    return GameSchema.model_validate(game, from_attributes=True)
```
Важно указать `from_attributes=True`, и чтобы имена атрибутов совпадали с именами полей в схеме

### Обратная ситуация
Может быть тоже самое только наоборот: нужно создать объект модели SQLAlchemy из схемы pydantic с совпадающими именами атрибутов, в этом случаем можно сделать так:

```python
class GameService:
   
    @staticmethod
    def create(obj: GameSchema):
        game = Game(**obj.model_dump())
        db.session.add(game)
        db.session.commit()
        return game
```

`model_dump()` возвращает словарь с атрибутами схемы, и мы просто распаковываем его в объект модели SQLAlchemy как kwargs, и все работает
