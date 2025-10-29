<?php

use App\Exceptions\DuplicatedResourceException;
use App\Exceptions\InvalidRoleException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Validation\ValidationException;
use \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);

        $middleware->redirectGuestsTo(fn () => null);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (InvalidRoleException $e, Request $request) {
            return response()->json([
                'error' => class_basename($e),
                'message' => $e->getMessage(),
            ], 403);
        });

        $exceptions->render(function (\InvalidArgumentException $e, Request $request) {
            return response()->json([
                'error' => class_basename($e),
                'message' => $e->getMessage(),
            ], 400);
        });

        $exceptions->render(function (ValidationException $e, Request $request) {
            return response()->json([
                'error' => class_basename($e),
                'message' => $e->getMessage(),
            ], 400);
        });

        $exceptions->render(function (DuplicatedResourceException $e, Request $request) {
            return response()->json([
                'error' => class_basename($e),
                'message' => $e->getMessage(),
            ], 400);
        });

        $exceptions->render(function (AuthenticationException $e, Request $request) {
            return response()->json([
                'error' => class_basename($e),
                'message' => 'You need to be authenticated to access this resource.',
            ], 401);
        });


        $exceptions->render(function (AuthorizationException $e, Request $request) {
            return response()->json([
                'error' => class_basename($e),
                'message' => 'You are not authorized to perform this action.',
            ], 403);
        });

        $exceptions->render(function (AccessDeniedHttpException $e, Request $request) {
            return response()->json([
                'error' => class_basename($e),
                'message' => $e->getMessage(),
            ], 403);
        });

        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            return response()->json([
                'error' => class_basename($e),
                'message' => 'Resource not found.',
            ], 404);
        });

        $exceptions->render(function (Throwable $e, Request $request) {
            return response()->json([
                'error' => class_basename($e),
                'message' => config('app.debug')
                    ? $e->getMessage()
                    : 'An unexpected error occurred.',
            ], 500);
        });
    })->create();
