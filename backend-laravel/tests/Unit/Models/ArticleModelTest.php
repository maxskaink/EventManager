<?php

namespace Tests\Unit\Models;

use App\Models\Article;
use Tests\TestCase;

class ArticleModelTest extends TestCase
{
    public function test_model_instantiation_without_db()
    {
        $article = new Article([
            'user_id' => 1,
            'title' => 'Test Article',
            'description' => 'Short',
            'authors' => 'A. Author',
            'publication_url' => 'https://example.com',
        ]);
        $this->assertInstanceOf(Article::class, $article);
        $this->assertEquals('Test Article', $article->getAttribute('title'));
    }

    public function test_fillable_property_defined()
    {
        $ref = new \ReflectionClass(Article::class);
        $this->assertTrue($ref->hasProperty('fillable'));
    }

    public function test_user_relationship_and_to_string_exist()
    {
        $this->assertTrue(method_exists(Article::class, 'user'));
        $this->assertTrue(method_exists(Article::class, '__toString'));
        $article = new Article(['title' => 'X']);
        $this->assertStringContainsString('Article #', (string) $article);
    }
}
