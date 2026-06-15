# Product Dashboard

Laravel API backend with a separate frontend app.

## Project Structure

```txt
product-dashboard-backend/     Laravel API
product-dashboard-frontend/    Frontend app
Dockerfile                     Backend Docker image for Render
.github/workflows/             GitHub Actions CI/CD
```

## Backend Local Setup

Go to the Laravel backend:

```bash
cd product-dashboard-backend
```

Install PHP dependencies:

```bash
composer install
```

Create the environment file:

```bash
cp .env.example .env
```

Generate the Laravel app key:

```bash
php artisan key:generate
```

Generate the JWT secret:

```bash
php artisan jwt:secret
```

Run migrations:

```bash
php artisan migrate
```

Start the backend:

```bash
php artisan serve
```

The API will run at:

```txt
http://127.0.0.1:8000
```

## Environment Variables

For local development, configure `product-dashboard-backend/.env`.

Important values:

```env
APP_NAME="Product Dashboard"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=root

JWT_SECRET=
```

If you use SQLite locally, use:

```env
DB_CONNECTION=sqlite
```

Then create the SQLite database file if needed:

```bash
type nul > database/database.sqlite
```

## Tests

Run all backend tests:

```bash
cd product-dashboard-backend
composer test
```

Run only product rating tests:

```bash
php artisan test --filter=ProductRatingTest
```

## API Documentation

Scribe is used to generate API documentation.

Install Scribe:

```bash
composer require --dev knuckleswtf/scribe
```

Publish the config:

```bash
php artisan vendor:publish --tag=scribe-config
```

Generate docs:

```bash
php artisan scribe:generate
```

## Render Deployment

This project deploys the Laravel backend to Render using Docker.

Create a new Render Web Service:

```txt
https://dashboard.render.com/web/new
```

Use these settings:

```txt
Runtime: Docker
Dockerfile path: Dockerfile
Branch: main
```

Recommended: disable Render auto-deploy if GitHub Actions should control deployment.

## Render Environment Variables

Add these variables in the Render Web Service environment settings:

```env
APP_NAME="Product Dashboard"
APP_ENV=production
APP_DEBUG=false
APP_KEY=your_generated_app_key
APP_URL=https://your-render-service.onrender.com

DB_CONNECTION=pgsql
DATABASE_URL=your_render_postgres_internal_database_url

JWT_SECRET=your_generated_jwt_secret
```

Generate values locally:

```bash
php artisan key:generate --show
php artisan jwt:secret --show
```

Use the output values for `APP_KEY` and `JWT_SECRET` in Render.

## GitHub Actions CI/CD

The workflow file is:

```txt
.github/workflows/backend-ci-cd.yml
```

It does this:

- Runs on pull requests that change backend/deployment files
- Runs on pushes to `main`
- Installs backend Composer dependencies
- Creates a temporary `.env`
- Generates an app key
- Runs Laravel tests
- Triggers a Render deploy after tests pass on `main`

## Render Deploy Hook Secret

To let GitHub Actions deploy to Render, create a Render Deploy Hook.

In Render:

1. Open your Web Service.
2. Go to `Settings`.
3. Find `Deploy Hook URL`.
4. Copy the URL.

In GitHub:

1. Open the repository.
2. Go to `Settings`.
3. Go to `Secrets and variables > Actions`.
4. Click `New repository secret`.
5. Add this secret:

```txt
Name: RENDER_DEPLOY_HOOK_URL
Value: your_render_deploy_hook_url
```

After this, every push to `main` will run tests and deploy to Render if tests pass.
