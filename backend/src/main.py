from app import create_app

"""
Файл для запуска в dev режиме, в production
запускается через Gunicorn
"""

if __name__ == "__main__":
    app = create_app()
    app.run()