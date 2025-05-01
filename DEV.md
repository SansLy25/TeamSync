from users.views import users_bp

# Дополнительная информация

Это расширение документации проекта которое содержит информацию для разработчиков данного проекта, а именно

- Структура проекта (бэкенд)
- Взаимодействие с БД
- Фишки


## Структура проекта и регистрация приложений

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
def get_user(user_id: int):
    pass
```