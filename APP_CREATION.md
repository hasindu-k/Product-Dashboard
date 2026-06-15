# Laravel App Creation

This project currently has Docker files, but the Laravel application files must be created before running the normal project setup commands.

## Create the Laravel app

Because this folder already contains Docker and project files, create Laravel in a folder :

````bash
docker run --rm -v ${PWD}:/app -w /app composer create-project laravel/laravel product-dashboard-backend
```


```text
Dockerfile
docker-compose.yml
Makefile
README.md
APP_CREATION.md
```

## Start the app

Build and start the containers:

```bash
make build
make up
```

Install dependencies:

```bash
make install
```

Generate the Laravel app key:

```bash
make key
```

Run migrations:

```bash
make migrate
```

Open the app at:

```text
http://localhost:8000
```

````
