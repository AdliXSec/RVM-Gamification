FROM php:8.3-apache

# 1. Install dependencies yang dibutuhkan Laravel
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    git \
    curl \
    libonig-dev \
    libxml2-dev \
    libzip-dev

# Bersihkan cache apt untuk memperkecil ukuran image
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# 2. Install ekstensi PHP yang dibutuhkan Laravel
RUN docker-php-ext-configure gd --with-freetype --with-jpeg
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# 3. Aktifkan modul rewrite Apache (wajib untuk routing Laravel)
RUN a2enmod rewrite

# 4. Ubah Document Root Apache agar mengarah ke folder /public milik Laravel
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Set working directory
WORKDIR /var/www/html

# 5. Copy Composer dari official image Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 6. Copy seluruh file proyek backend Laravel ke dalam container
COPY . /var/www/html

# 7. Install library PHP (production mode)
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# 8. Set permission folder agar bisa ditulisi oleh Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# 9. Konfigurasi Port dinamis untuk Railway
# Railway akan meng-inject variabel $PORT, jadi kita atur Apache agar mendengarkan port tersebut
RUN sed -i 's/Listen 80/Listen ${PORT}/g' /etc/apache2/ports.conf
RUN sed -i 's/<VirtualHost \*:80>/<VirtualHost \*:${PORT}>/g' /etc/apache2/sites-available/000-default.conf

# Ubah permission file bash start (opsional, jika Anda menggunakan bash script untuk start)
# RUN chmod +x /var/www/html/start.sh

# 10. Jalankan Apache
CMD ["apache2-foreground"]
