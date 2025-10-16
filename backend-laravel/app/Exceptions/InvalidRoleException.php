<?php

namespace App\Exceptions;

use LogicException;

class InvalidRoleException extends LogicException
{
    /**
     * Create a new InvalidRoleException instance.
     *
     * @param string $message
     */
    public function __construct(string $message = 'Invalid user role.')
    {
        parent::__construct($message);
    }
}
