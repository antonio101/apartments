<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class CheckIsAdultRule implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $birth_date = new \DateTime(date("Y-m-d", strtotime($value)));
        $date_now   = new \DateTime();
        $adult_age  = 18;
        
        return $birth_date < $date_now ? ($birth_date->diff($date_now)->y > $adult_age) : false;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'Applicant must be an adult.';
    }
}
