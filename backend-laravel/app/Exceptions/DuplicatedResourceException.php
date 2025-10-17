<?php

namespace App\Exceptions;

class DuplicatedResourceException extends \RuntimeException
{
    /**
     * Create a new DuplicatedResourceException instance.
     *
     * @param string $message
     */
    public function __construct(string $message = 'The resource already exists.')
    {
        parent::__construct($message);
    }
}
