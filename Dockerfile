FROM php:8.4-cli

WORKDIR /app

RUN apt-get update && apt-get install -y \
    git unzip zip curl libzip-dev libpng-dev libpq-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql zip \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY product-dashboard-backend/ .

RUN composer install --no-dev --optimize-autoloader --no-interaction

EXPOSE 8000

CMD ["sh", "-c", "set -e; php artisan config:cache; php artisan migrate --force; php artisan storage:link || true; exec php artisan serve --host=0.0.0.0 --port=${PORT:-8000}"]
