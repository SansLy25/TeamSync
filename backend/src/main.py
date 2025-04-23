from app import app

"""
Файл для запуска в dev режиме, в production
запускается через Gunicorn
"""

if __name__ == "__main__":
    app.run()