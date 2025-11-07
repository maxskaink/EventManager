#  Comandos para Ejecutar Pruebas

# Ejecutar todas las pruebas
docker exec backend-laravel-laravel.test-1 php artisan test

# Ejecutar solo pruebas unitarias
docker exec backend-laravel-laravel.test-1 php artisan test --testsuite=Unit

# Ejecutar solo pruebas de características
docker exec backend-laravel-laravel.test-1 php artisan test --testsuite=Feature

# Ejecutar una prueba específica
docker exec backend-laravel-laravel.test-1 php artisan test tests/Unit/UserServiceTest.php


# Ejecutar y detener en el primer fallo
docker exec backend-laravel-laravel.test-1 php artisan test --stop-on-failure
```

