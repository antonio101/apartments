#!/bin/sh
composer install
php artisan migrate
/usr/bin/supervisord -c /etc/supervisord.conf
php artisan serve --host 0.0.0.0
