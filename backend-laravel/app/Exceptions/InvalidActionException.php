<?php

namespace App\Exceptions;

use LogicException;

class InvalidActionException extends LogicException
{
    /**
     * Create a new InvalidRoleException instance.
     *
     * @param string $message
     */
    public function __construct(string $message = 'Invalid action was performed.')
    {
        parent::__construct($message);
    }
}
