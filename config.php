<?php
// Configuration file for sensitive information
// IMPORTANT: This file should be placed outside your web root if possible
// or protected with .htaccess rules

// Email Configuration
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_USERNAME', 'edsiljeremias@gmail.com'); // Your email for sending
define('SMTP_PASSWORD', 'nqxf brra tzit ckac'); // Your app password
define('SMTP_PORT', 587);
define('SMTP_ENCRYPTION', 'tls');
define('EMAIL_FROM_NAME', 'Explore Maps Travel & Tours - Sorsogon');
define('EMAIL_TO', 'edsiljeremias@gmail.com'); // Where to send inquiries (your email)

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'explore_maps');
define('DB_USER', 'root'); // Replace with your database username
define('DB_PASSWORD', ''); // Replace with your database password

// Debug Mode (set to false in production)
define('DEBUG_MODE', true);
?>
