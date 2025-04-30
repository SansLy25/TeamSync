# Введение

Flask это микрофреймворк предназначенный для быстрого создания небольших веб сайтов на основе шаблонизации, не
предоставляющий функционала для разработки API, а существующие расширения не предоставляют полного функционала, для
ускорения разработки, для автоматизации некоторых процессов и для избегания дублирования кода было создано данное
расширение.

Пример простого эндпоинта создания объекта `Game`:

```python

from pydantic import BaseModel
from core.rest_api_extension import rest_api
from app import app
from users.models import User
from games.models import Game
from app import db


class GameSchema(BaseModel):
    id: int
    name: str
    description: str
    user_id: int


@app.route('/api/games', methods=['POST'])
@rest_api(
    description="Создает игру",
    responses=[{201: Game}]
)
def create_game(game: GameSchema, user: User):
    game_object = Game(
        name=game.name,
        description=game.description,
        user_id=user.id
    )
    db.session.add(game_object)
    db.session.commit()
    return GameSchema(id=game_object.id, name=game_object.name, description=game_object.description,
                      user_id=user.id), 201


```

## Элементы

По сути расширение предоставляет набор декораторов функций на основе аннотаций типов и сигнатур функций, с системой
валидации входящих данных на основе Pydantic моделей, а также систему генерации OpenAPI спецификации

Всего декораторов 4

- `@pydantic_validation`: Валидация тела запроса и ответа с помощью Pydantic
- `@jwt_auth`: Аутентификация через JWT токен
- `@swagger_docs`: Генерация OpenAPI спецификации
- `@excpeption_catcher`: Ловля исключений и преобразование их в REST формат

Но поскольку каждый раз писать 4 декоратора для каждой функции представления это не удобно то все эти декораторы
объединены в
один декоратор `rest_api`, который принимает те же параметры что и `swagger_docs`, то есть вот это:

```python
@app.route('/api/users/<int:user_id>', methods=['GET'])
@rest_api(
    description="Получает информацию о пользователе по ID",
    responses=[{200: UserIdSchema}]
)
def get_user(user_id: int):
    user = UserService.get(user_id)
    if user is None:
        raise NotFound("User not found")

    return UserIdSchema(id=user.id, username=user.username), 200
```

Эквивалентно вот этому:

```python
@app.route('/api/users/<int:user_id>', methods=['GET'])
@swagger_docs(
    description="Получает информацию о пользователе по ID",
    responses=[{200: UserIdSchema}]
)
@exception_catcher
@jwt_auth
@pydantic_validation
def get_user(user_id: int):
    user = UserService.get(user_id)
    if user is None:
        raise NotFound("User not found")

    return UserIdSchema(id=user.id, username=user.username), 200
```

## Система типов

Расширение использует систему аннотации типов Python 3.6+, для указания типов аргументов функции представления,
например:

```python
@app.route('/api/user', methods=['POST'])
def get_authed_user(user: User):
```

Здесь user это аргумент который принимает SQLAlchemy модель пользователя, декоратор `@jwt_auth` автоматически находя
аргумент с типом User передаст в него объект пользователя, а если аргумента с таким типом не будет то авторизация для
этого эндпоинта проходить не будет, так можно задавать какие эндпоинты должны быть защищенными, а какие нет, и таким
образом декораторы анализируют аргументы для того чтобы понять что надо делать а что нет

# Погружение в каждую часть

## Pydantic валидация

В API очень важно валидировать данные, например вам нужно точно знать то что в каком то json ключе пользователь передал
строку, а не число, или вообще передал этот параметр, а также валидировать специальные типы, например email или даты,

Поэтому мы используем Pydantic для валидации и сериализации входящих данных (важно не путать с моделями SQLAlchemy,
pydantic схемы отвечают только за валидацию и сериализацию а модели SQLAlchemy за бд, поэтому у одной и той же сущности
будет модель SQLAlchemy и схема pydantic (может быть и несколько схем, например для записи и чтения разные)), а также
для валидации десериализации выходящих данных, то есть данных которые возвращает API,
pydantic использует data классы для создания так называемых схем, которые описывают структуру данных, и предоставляет
мощные инструменты для валидации и сериализации данных, например:

```python

from pydantic import BaseModel, EmailStr
import datetime


class UserSchema(BaseModel):
    id: int
    username: str
    email: EmailStr
    date_of_birth: datetime.date
```

В этом примере мы описали схему пользователя которую хотим ожидать в теле запроса к API, таким образом примером
корректного тела запроса будет

```json
{
  "id": 1,
  "username": "test_user",
  "email": "lyceum1234@yandex.ru",
  "date_of_birth": "2000-01-01"
}
```

Подробнее про pydantic можно почитать в ее документации:
https://docs.pydantic.dev/latest/

### Валидация входящих данных

Для того чтобы валидировать входящие данные в теле запроса, нужно создать pydantic схему, после чего указать ее как
аргумент функции представления, и декоратор `@pydantic_validation` автоматически проверит входящие данные на
соответствие схеме, если данные не соответствуют схеме то будет возвращен ответ с ошибкой 400 (Validation error), а
также будет возвращено сообщение об всех ошибках, например не указано какое то поле или email не соответствует стандарту

Если валидации прошла успешно то в аргумент функции представления будет передан созданный объект pydantic схемы, который
можно использовать как обычный объект, например:

```python

from pydantic import BaseModel
from core.rest_api_extension import rest_api
from app import app


class GameSchema(BaseModel):
    id: int
    name: str
    description: str
    user_id: int


@app.route('/api/games', methods=['POST'])
@rest_api(
    description="Получаем информацию о игре",
)
def create_game(game: GameSchema):
    """
    После валидации можно будеть обращаться к данным по атрибутам объекта схемы, например game.name
    """
    return game
```

Таким образом все что вам нужно это задать формат данных в схеме и задать аргумент с типом схемы
Важно подметить что тела запроса может и не быть (например это get запрос), поэтому аргумент для тела запроса можно не
указывать, тогда валидации проходить не будет, поэтому самый базовый пример функции представления выглядит так:

```python
@app.route('/api/categories', methods=['GET'])
@rest_api()
def get_categories():
    return
```

### Валидация и десериализация выходящих данных

Функция представления может возвращать ответ пользователя в нескольких форматах, например:

```python
return UserSchema(id=user.id, username=user.username), 200
```

В этом случае будет создан объект pydantic схемы, который будет сериализован в json и возвращен пользователю, а также
будет установлен статус код 200, в теле ответа будет

```json
{
  "id": 1,
  "username": "test_user"
}
```

и **status = OK 200**

Можно возвращать и просто объект pydantic схемы, код по умолчанию будет установлен 200

```python
return UserSchema(id=user.id, username=user.username)
```

Можно вернуть и только статус код, тогда тело ответа будет пустым

```python
return None, 200
```

В каких то ситуациях, когда pydantic схема не удобна можно вернуть просто python словарь (главное чтобы его можно было
сериализовать в json, то есть только простые типы, без объектов)

```python
return {"id": user.id, "username": user.username}, 200
```

Опять же можно вернуть и просто словарь, тогда статус код будет 200 по умолчанию

Еще бывает нужно вернуть более сложный ответ, например указать заголовки или cookies, тогда можно вернуть обычный объект
Response из Flask

```python
return Response(
    response=json.dumps({"id": 1, "username": "lyceum1234"}),
    status=200,
    content_type='application/json',
    headers={"X-My-Header": "Value"}
)
```

Разберем конкретную функцию представления для обобщения

```python

from pydantic import BaseModel
from core.rest_api_extension import rest_api
from app import app


class BookSchema(BaseModel):
    id: int
    name: str
    description: str
    user_id: int


def db_create_book(book_object: BookSchema):
    """
    Создаем книгу в БД
    """
    book = Book(
        name=book.name,
        description=book.description,
        user_id=book.user_id
    )
    db.session.add(book)
    db.session.commit()


@app.route('/api/books', methods=['POST'])
@rest_api(
    description="Создаем книгу",
)
def create_game(book_object: BookSchema):
    db_create_book(book_object)

    return book_object, 201
```

В этом примере мы возвращаем в ответе тот же объект схемы который мы получили в запросе, то есть при успешном создании
объекта мы вернем тоже самое, это хороший тон, так стоит делать, 201 в http код это код успешного создания объекта

Еще важно отметить что использование параметров url (как в стандартном Flask) тоже поддерживается, например

```python
@app.route('/api/authors/<int:author_id>/books', methods=['POST'])
@rest_api()
def get_book(author_id: int, book: BookSchema):
    """
    author_id примет значение из url, а book примет значение из тела запроса
    """
```

## JWT аутентификация

JWT (JSON Web Token): это стандарт авторизации при котором пользователь получает токен после успешной авторизации (
например с помощью эндпоинта /login в котором указывается пароля и почта), и после просто к каждому запросу, который
требует авторизации указывает токен в заголовке Authorization, например:

```
Authorization: Bearer eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ
```

Этот стандарт авторизации считается самым рекомендованным для использования в API,
по сути данные пользователя (например id) хешируются в токен и подписываются
спeциальной подписью (Signature), после передачи в заголовке токен можно
расхешировать, понять валиден ли он и что за пользователь к нам стучится,
за генерацию токенов в проекте отвечают эндпоинты api/users/login (генерация
токена на основе сущ. пользователя) и api/users/signup (регистрация пользователя
и генерация токена), которые не входят в расширение, а вот сама система
декодирования токена и аутентификации входит и осуществляется так:

Если вы хотите создать защищенный эндпоинт, то нужно указать в аргументах функции представления нужно указать аргумент с
типом модели пользователя, например:

```python
from users.models import User
from users.schemas import UserIdSchema


@users_bp.route("/protected", methods=["POST"])
@rest_api(description="Эндпоинт требующий токен в заголовке")
def protected_endpoint(user: User):
    return UserIdSchema(id=user.id), 200
```

Здесь мы указываем user как аргумент типа модели User, важно что User это именно модель SQLAlchemy, а не
pydantic схема, поэтому в ней сразу будут данные из бд и доступны операции с ней, например user.id, user.username
и тд, а также можно использовать методы модели, например user.get_friends()

Декоратор `@jwt_auth` автоматически поймает токен из заголовка Authorization, проверит его валидность и расшифрует,
после чего передаст в аргумент функции представления объект модели пользователя, а если токен не валиден или его нет
то вернет ошибку 401 (Unauthorized), то есть если вы хотите сделать защищенный эндпоинт то просто укажите аргумент с
типом модели пользователя и все, декоратор сам все сделает
если аргумента с типом User не будет в функции представления то эндпоинт считается не защищенным и доступен и без
авторизации

## Swagger документация и генерация OpenAPI

### Немножко про OpenAPI и Swagger
При разработке API резко встает вопрос документации, даже если вы разрабатываете API только для себя,
то все равно часто забывается что делают те или иные эндпоинты, а если вы разрабатываете API в команде
то без документации не обойтись, поэтому мы используем формат OpenAPI спецификации который описывает API, тк
OpenAPI это просто формат, то читать его довольно проблематично, поэтому существует Swagger UI это интерфейс который
преобразует OpenAPI спецификацию в удобный и красивый вид, а также позволяет выполнять запросы к API прямо в нем,
например для тестирования

Вот так выглядит swagger UI, в нашем проекте он доступен по адресу `**/apidocs**`

![](images/swagger_ui.png)

Можно увидеть какие существуют эндпоинты и какие методы они поддерживают, так же можно ввести токен для авторизации сверху справа, при отправке запросов swagger сам подставит его в заголовок, каждый метод можно открыть и выполнить запрос, а также посмотреть схему запроса и схемы ответов:

![](images/swagger_ui_2.png)
Чтобы выполнить запрос надо нажать на кнопку try it out, если в url есть параметры то их тоже надо задать

### Генерация спецификации
Спецификация для каждого эндоинта генерируется автоматически на основе следующих параметров:
- Схема pydantic которая указана как тип аргумента функции представления (тоже самое что в разделе про валидацию)
- URL указанный в app.route
- Метод http указанный в methods app.route
- Имя функции представления

Но помимо того что определяется автоматически, можно указать и дополнительные параметры в аргументах @rest_api, такие как
- `description`: описание эндпоинта
- `responses`: список возможных ответов в виде словаря в котором ключем является код ответа, а значением схема тела ответа в виде pyndatic схемы, например 200, 201, 400 и тд, в которых можно указать схему ответа
- `query_params`: query параметры запроса, которые будут указаны в url после знака ?, например /api/users?username=lyceum1234, в виде списка строк с названиями

Пример: 
```python
@app.route('/api/users/<int:id>', methods=['GET'])
@rest_api(
    description="Получаем информацию о пользователе по ID",
    responses=[{200: UserIdSchema}, {404: NotFoundSchema}],
    query_params=["username"]
)
def get_user(some_body: SomeBodySchema, id: int):
   pass

```
Исходя из указанных параметров в Swagger добавиться эндпоинт с методом GET,
описанием description,query параметром username, path параметром id, с ожидаемым телом запроса
SomeBodySchema, и с двумя ответами 200: UserIdSchema и 404: NotFoundSchema

Все аргументы для дополнения спецификации (responses, description, query_params) опциональны

_Пользуясь случаем хочется отметить что query параметры в аргументах функции не
указываются, их можно извлечь из запроса с помощью flask.request()_

## API исключения
При обработке ошибок пользователя, например если пользователь просит запросить ресурс которого нет (404) лучше всего возвращать не просто обычный ответ с кодом 404 а кидать исключение
которое будет обрабатывать декоратор `@exception_catcher`, он будет ловить все исключения и преобразовывать их в REST формат,
то есть возвращать ответ с кодом 404 и телом ответа в формате json, исключения берутся из модуля `werkzeug.exceptions`(Flask использует этот же модуль)
Существует множество различных исключений, например:
- `NotFound`: 404 Not Found
- `BadRequest`: 400 Bad Request
- `Unauthorized`: 401 Unauthorized
Все можно посмотреть в `werkzeug.exceptions`

Пример использования:
```python
from werkzeug.exceptions import Unauthorized

@users_bp.route("/login", methods=["POST"])
@rest_api(
    description="Создает токен авторизации на основе пароля и юзернейма",
    responses=[{200: TokenSchema}]
)
def login(user_creds: UserSchemaLogin):
    user = UserService.get_by_pass_username(user_creds.password,
                                            user_creds.username)
    if user is None:
        raise Unauthorized("Username or password incorrect")

    access_token = create_access_token(identity=user.username)
    return TokenSchema(token=access_token), 200
```

Здесь в случае если пользователя с таким паролем и юзернеймом не существует мы кидаем исключение Unauthorized, в которое в качестве
аргумента description передаем сообщение `"Username or password incorrect"`, и на выходе получается следующий ответ

STATUS 401 UNAUTHORIZED
```json
{
  "detail": "Username or password incorrect",
}
```
Такой подход позволяет вызывать исключения в любом месте кода и не заботиться о том что бы обрабатывать их, декоратор сам поймает и обработает их