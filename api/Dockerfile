########################################################################
### Composer

FROM composer:1.10 AS composer

COPY composer.json /app
COPY composer.lock /app

RUN composer install        \
    --ignore-platform-reqs  \
    --no-ansi               \
    --no-autoloader         \
    --no-interaction        \
    --no-scripts

COPY . /app/
RUN composer dump-autoload --optimize --classmap-authoritative

### Composer
########################################################################
### PHP

FROM php:7.4-fpm-alpine3.12

RUN apk update && apk add --no-cache \
    libpng-dev                       \
    freetype-dev                     \
    oniguruma-dev                    \
    libxml2-dev                      \
    sqlite                           \
    composer                         


RUN rm -rf /var/lib/apt/lists/* && rm -rf /var/cache/apk/*
RUN docker-php-ext-configure gd --enable-gd --with-freetype
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

RUN apk --update --no-cache add autoconf g++ make && \
    pecl install -f xdebug && \
    docker-php-ext-enable xdebug && \
    apk del --purge autoconf g++ make

RUN echo xdebug.mode=coverage > /usr/local/etc/php/conf.d/xdebug.ini

COPY . /var/www
COPY --from=composer /app/vendor                /var/www/html/vendor

RUN addgroup -g 1000 -S www && \
    adduser -u 1000 -S www -G www-data

COPY --chown=www:www-data . /var/www

WORKDIR /var/www
RUN composer install


#RUN php artisan migrate

#RUN php artisan queue:work &
#RUN php artisan horizon &
#RUN php artisan serve --host 0.0.0.0

### PHP
########################################################################
### Supervisor

RUN apk update && apk add --no-cache supervisor openssh nginx
COPY supervisord.conf /etc/supervisord.conf
#RUN /usr/bin/supervisord -c /etc/supervisord.conf

### Supervisor
########################################################################
### Wait for MySQL container

ADD run.sh /run.sh
RUN chmod +x /run.sh

# Add docker-compose-wait tool
ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait

### Wait for MySQL container
########################################################################