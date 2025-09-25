<?php
// Configuration file for ZenTouch website
// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'zentouch_db');
define('DB_USER', 'your_username'); // Change this
define('DB_PASS', 'your_password'); // Change this

// Email configuration
define('SMTP_HOST', 'smtp.gmail.com'); // Change to your SMTP server
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'your-email@gmail.com'); // Change this
define('SMTP_PASSWORD', 'your-app-password'); // Change this
define('FROM_EMAIL', 'noreply@zentouch.com');
define('FROM_NAME', 'ZenTouch Massage');
define('ADMIN_EMAIL', 'info@zentouch.com');

// Business information
define('BUSINESS_NAME', 'ZenTouch Massage Services');
define('BUSINESS_PHONE', '(555) 123-4567');
define('BUSINESS_ADDRESS', '123 Wellness Street, Spa City, SC 12345');
define('BUSINESS_HOURS', 'Mon-Sun: 9AM - 8PM');

// Payment information
define('VENMO_USERNAME', '@ZenTouchMassage');
define('CASHAPP_USERNAME', '$ZenTouchMassage');
define('ZELLE_EMAIL', 'info@zentouch.com');

// Site settings
define('SITE_URL', 'https://yourwebsite.com'); // Change this
define('TIMEZONE', 'America/New_York'); // Change to your timezone

// Security settings
define('SESSION_TIMEOUT', 3600); // 1 hour
define('MAX_LOGIN_ATTEMPTS', 5);
define('LOCKOUT_TIME', 900); // 15 minutes

// File upload settings
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB
define('ALLOWED_FILE_TYPES', ['jpg', 'jpeg', 'png', 'gif', 'pdf']);

// Set timezone
date_default_timezone_set(TIMEZONE);

// Error reporting (set to 0 in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error.log');
?>
