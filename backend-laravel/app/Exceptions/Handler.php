<?php

namespace App\Exceptions;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;
use InvalidArgumentException;


class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [
        InvalidArgumentException::class,
        InvalidRoleException::class,
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        // Invalid role to perform action
        $this->renderable(function (InvalidRoleException $e, $request): JsonResponse {
            return response()->json([
                'error' => true,
                'message' => $e->getMessage(),
            ], 400);
        });


        // Invalid argument
        $this->renderable(function (\InvalidArgumentException $e, $request): JsonResponse {
            return response()->json([
                'error' => true,
                'message' => $e->getMessage(),
            ], 400);
        });

        // Unauthenticated (no token or invalid session)
        $this->renderable(function (AuthenticationException $e, $request): JsonResponse {
            return response()->json([
                'error' => true,
                'message' => 'Unauthenticated.',
            ], 401);
        });

        // Authorization issues (policy/gate rejections)
        $this->renderable(function (AuthorizationException $e, $request): JsonResponse {
            return response()->json([
                'error' => true,
                'message' => 'You are not authorized to perform this action.',
            ], 403);
        });

        // Route not found or invalid endpoint
        $this->renderable(function (NotFoundHttpException $e, $request): JsonResponse {
            return response()->json([
                'error' => true,
                'message' => 'Resource not found.',
            ], 404);
        });

        // Fallback for unhandled exceptions
        $this->renderable(function (Throwable $e, $request): JsonResponse {
            return response()->json([
                'error' => true,
                'message' => config('app.debug')
                    ? $e->getMessage()
                    : 'An unexpected error occurred.',
            ], 500);
        });
    }
}
