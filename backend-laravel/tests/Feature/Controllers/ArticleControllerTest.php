<?php

namespace Tests\Feature\Controllers;

use App\Http\Controllers\ArticleController;
use Tests\TestCase;

class ArticleControllerTest extends TestCase
{
    public function test_controller_methods_exist()
    {
        $methods = [
            'addArticle',
            'updateArticle',
            'deleteArticle',
            'listMyArticles',
            'listArticlesByUser',
            'listAllArticles',
            'listArticlesByDateRange',
            'getAllTrustedOrganizations',
        ];
        foreach ($methods as $m) {
            $this->assertTrue(method_exists(ArticleController::class, $m));
        }
    }

    public function test_article_routes_registered()
    {
        $routes = app('router')->getRoutes();
        $needles = [
            '/article',
            '/article/all',
            '/article/my',
            '/article/user/{userId}',
            '/article/date-range',
        ];
        $uris = array_map(fn($r) => '/' . ltrim($r->uri(), '/'), iterator_to_array($routes));
        foreach ($needles as $n) {
            $this->assertTrue(collect($uris)->contains(fn($u) => str_contains($u, $n)), "Route {$n} should exist");
        }
    }
}
