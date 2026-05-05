FROM php:8.2-fpm

RUN apt-get update && apt-get install -y libxml2-dev \
    && docker-php-ext-install simplexml \
    && apt-get clean

WORKDIR /var/www/html

COPY public/ /var/www/html/