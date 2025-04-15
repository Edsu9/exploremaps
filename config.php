<?php
// Configuration file for sensitive information
// IMPORTANT: This file should be placed outside your web root if possible
// or protected with .htaccess rules

// Email Configuration
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_USERNAME', 'edsiljeremias@gmail.com'); // Replace with your email
define('SMTP_PASSWORD', 'nqxf brra tzit ckac'); // Replace with your app password
define('SMTP_PORT', 587);
define('SMTP_ENCRYPTION', 'tls');
define('EMAIL_FROM', 'edsiljeremias@gmail.com');
define('EMAIL_FROM_NAME', 'Explore Maps Travel & Tours - Sorsogon');
define('EMAIL_TO', 'edsiljeremias@gmail.com'); // Where to send inquiries

// Database Configuration
define('DB_HOST', 'fdb1027.runhosting.com'); // Often different on shared hosting
define('DB_USERNAME', '4617544_exploremaps'); 
define('DB_PASSWORD', '2fzPOA}}8VffeS{b');
define('DB_NAME', '4617544_exploremaps');

// Debug Mode (set to false in production)
define('DEBUG_MODE', true);
?>
