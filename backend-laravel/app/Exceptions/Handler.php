<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Laravel\Sanctum\Exceptions\MissingAbilityException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Illuminate\Support\Facades\Log;
use \Illuminate\Http\JsonResponse;
use \Symfony\Component\HttpFoundation\Response;

use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [];

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
        $this->reportable(function (Throwable $e) {
            //
        });
        
        // Ensure AuthenticationException always returns JSON for API requests
        $this->renderable(function (AuthenticationException $e, $request) {
            Log::debug('Handler::renderable AuthenticationException', [
                'path' => $request->path(),
                'expectsJson' => $request->expectsJson(),
                'is_api' => $request->is('api/*'),
            ]);
            return response()->json([
                'error' => 'Unauthenticated.',
                'message' => 'Invalid or expired token.'
            ], 401);
        });
    }

    /**
     * Convert an authentication exception into a response.
     * This prevents Laravel from trying to redirect to 'login' route
     */

    public function unauthenticated($request, \Illuminate\Auth\AuthenticationException $exception)
    {
        // Log call to unauthenticated so we can trace why login redirect may occur
        Log::debug('Handler::unauthenticated called', [
            'path' => $request->path(),
            'method' => $request->method(),
            'expectsJson' => $request->expectsJson(),
            'is_api' => $request->is('api/*'),
            'headers' => [
                'accept' => $request->header('Accept'),
                'authorization' => $request->header('Authorization'),
            ],
        ]);

        // Always return JSON for unauthenticated requests (API-only)
        return response()->json([
            'error' => 'Unauthenticated.',
            'message' => 'Invalid or expired token.'
        ], 401);
    }

    /**
     * Customize the response for specific exceptions.
     * @throws Throwable
     */
    public function render($request, Throwable $exception): JsonResponse|Response
    {
        // Invalid or expired Sanctum token
        if ($exception instanceof AuthenticationException) {
            return $this->unauthenticated($request, $exception);
        }

        // Handle AccessDeniedHttpException (thrown by Sanctum for invalid tokens)
        if ($exception instanceof AccessDeniedHttpException) {
            return response()->json([
                'error' => 'Invalid or expired token',
            ], 401);
        }

        // Token exists but lacks permissions
        if ($exception instanceof MissingAbilityException) {
            return response()->json([
                'error' => 'You are not authorized to perform this action',
            ], 403);
        }

        // General authorization exceptions
        if ($exception instanceof AuthorizationException) {
            return response()->json([
                'error' => 'Unauthorized action',
            ], 403);
        }

        // Fallback to Laravel default behavior
        return parent::render($request, $exception);
    }
}
