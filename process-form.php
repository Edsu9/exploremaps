<?php
// Turn off all error reporting for production
error_reporting(E_ALL); // Temporarily enable all errors for debugging
ini_set('display_errors', 1); // Temporarily enable error display

// Create a log file for debugging
function debug_log($message) {
    file_put_contents('email_debug.log', date('[Y-m-d H:i:s] ') . $message . PHP_EOL, FILE_APPEND);
}

// Start logging
debug_log("Form processing started");

// Include PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Load Composer's autoloader
require_once 'vendor/autoload.php';

// Try to load configuration, but don't fail if it doesn't exist
$config_loaded = false;
if (file_exists('config.php')) {
    try {
        require_once 'config.php';
        $config_loaded = true;
        debug_log("Configuration loaded successfully");
    } catch (Exception $e) {
        debug_log("Error loading configuration: " . $e->getMessage());
    }
}

// Define default values if config is not loaded
if (!$config_loaded) {
    debug_log("Using default configuration values");
    define('SMTP_HOST', 'smtp.gmail.com');
    define('SMTP_USERNAME', 'edsiljeremias@gmail.com');
    define('SMTP_PASSWORD', 'nqxf brra tzit ckac');
    define('SMTP_PORT', 587);
    define('SMTP_ENCRYPTION', 'tls');
    define('EMAIL_FROM', 'edsiljeremias@gmail.com');
    define('EMAIL_FROM_NAME', 'Explore Maps Travel & Tours - Sorsogon');
    define('EMAIL_TO', 'edsiljeremias@gmail.com');
    define('DEBUG_MODE', true);
}

// Database connection function - now with better error handling
function connectToDatabase() {
    // Check if database constants are defined
    if (!defined('DB_HOST') || !defined('DB_NAME') || !defined('DB_USER') || !defined('DB_PASSWORD')) {
        debug_log("Database constants not defined - skipping database connection");
        return null;
    }
    
    try {
        $conn = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASSWORD);
        // Set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        debug_log("Database connection successful");
        return $conn;
    } catch(PDOException $e) {
        // Log error but don't display to user
        debug_log("Database connection failed: " . $e->getMessage());
        return null;
    }
}

// Silent logging function that won't display errors
function silent_log($message) {
  // Only log if debug mode is enabled in config
  if (defined('DEBUG_MODE') && DEBUG_MODE) {
      error_log($message);
  }
}

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    debug_log("Form submitted via POST");
    
    // Get form data and sanitize inputs
    $name = htmlspecialchars(trim($_POST["name"] ?? ''));
    $email = filter_var($_POST["email"] ?? '', FILTER_SANITIZE_EMAIL);
    $phone = htmlspecialchars(trim($_POST["phone"] ?? ''));
    $subject = htmlspecialchars(trim($_POST["subject"] ?? ''));
    $message = htmlspecialchars(trim($_POST["message"] ?? ''));
    $inquiryType = htmlspecialchars(trim($_POST["inquiry-type"] ?? ''));
    
    debug_log("Form data received - Name: $name, Email: $email, Subject: $subject");
    
    // Validate required fields
    $errors = [];
    if (empty($name)) $errors[] = "Name is required";
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Valid email is required";
    if (empty($subject)) $errors[] = "Subject is required";
    if (empty($message)) $errors[] = "Message is required";
    if (empty($inquiryType)) $errors[] = "Inquiry type is required";
    
    // If there are validation errors, redirect to contact form with error
    if (!empty($errors)) {
        debug_log("Validation errors: " . implode(", ", $errors));
        header("Location: contact.html?error=validation");
        exit;
    }
    
    debug_log("Form validation passed");
    
    // Try to save to database if connection is available, but don't fail if it doesn't work
    try {
        $dbConn = connectToDatabase();
        if ($dbConn) {
            try {
                // Prepare SQL statement
                $stmt = $dbConn->prepare("INSERT INTO inquiries (name, email, phone, subject, message, inquiry_type, submission_date, ip_address) 
                                         VALUES (:name, :email, :phone, :subject, :message, :inquiry_type, NOW(), :ip_address)");
                
                // Bind parameters
                $stmt->bindParam(':name', $name);
                $stmt->bindParam(':email', $email);
                $stmt->bindParam(':phone', $phone);
                $stmt->bindParam(':subject', $subject);
                $stmt->bindParam(':message', $message);
                $stmt->bindParam(':inquiry_type', $inquiryType);
                $stmt->bindParam(':ip_address', $_SERVER['REMOTE_ADDR']);
                
                // Execute the statement
                $stmt->execute();
                
                debug_log("Inquiry saved to database successfully. ID: " . $dbConn->lastInsertId());
            } catch(PDOException $e) {
                // Log error but continue with email sending
                debug_log("Database error: " . $e->getMessage());
            }
        } else {
            debug_log("Database connection not available - skipping database save");
        }
    } catch (Exception $e) {
        debug_log("Exception during database operation: " . $e->getMessage());
        // Continue with email sending
    }
    
    // Get a human-readable inquiry type label
    $inquiryTypeLabel = getInquiryTypeLabel($inquiryType);
    
    // Create email content - HTML version
    $htmlContent = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0047ab; color: white; padding: 15px; text-align: center; }
            .content { padding: 20px; border: 1px solid #ddd; }
            .section { margin-bottom: 20px; }
            .section-title { background-color: #f5f5f5; padding: 8px; font-weight: bold; }
            .field { margin-bottom: 10px; }
            .label { font-weight: bold; width: 120px; display: inline-block; }
            .footer { font-size: 12px; color: #777; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>New Inquiry from $name</h2>
            </div>
            <div class='content'>
                <div class='section'>
                    <div class='section-title'>Contact Details</div>
                    <div class='field'><span class='label'>Name:</span> $name</div>
                    <div class='field'><span class='label'>Email:</span> <a href='mailto:$email'>$email</a></div>
                    <div class='field'><span class='label'>Phone:</span> " . (!empty($phone) ? $phone : "<em>Not provided</em>") . "</div>
                    <div class='field'><span class='label'>Inquiry Type:</span> $inquiryTypeLabel</div>
                </div>
                
                <div class='section'>
                    <div class='section-title'>Message Details</div>
                    <div class='field'><span class='label'>Subject:</span> $subject</div>
                    <div class='field'><span class='label'>Message:</span></div>
                    <div style='background-color: #f9f9f9; padding: 10px; border-left: 3px solid #0047ab;'>
                        " . nl2br(htmlspecialchars($message)) . "
                    </div>
                </div>
                
                <div class='footer'>
                    This inquiry was submitted on " . date('F j, Y \a\t g:i a') . "<br>
                    From IP: " . $_SERVER['REMOTE_ADDR'] . "
                </div>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Create plain text version
    $plainTextContent = "NEW INQUIRY FROM $name\n";
    $plainTextContent .= "===========================================\n\n";
    $plainTextContent .= "CONTACT DETAILS:\n";
    $plainTextContent .= "Name: $name\n";
    $plainTextContent .= "Email: $email\n";
    $plainTextContent .= "Phone: " . (!empty($phone) ? $phone : "Not provided") . "\n";
    $plainTextContent .= "Inquiry Type: $inquiryTypeLabel\n\n";
    $plainTextContent .= "MESSAGE DETAILS:\n";
    $plainTextContent .= "Subject: $subject\n\n";
    $plainTextContent .= "Message:\n$message\n\n";
    $plainTextContent .= "===========================================\n";
    $plainTextContent .= "This inquiry was submitted on " . date('F j, Y \a\t g:i a') . "\n";
    $plainTextContent .= "From IP: " . $_SERVER['REMOTE_ADDR'] . "\n";
    
    // Create a new PHPMailer instance
    $mail = new PHPMailer(true);
    
    try {
        debug_log("Setting up PHPMailer");
        
        // Server settings
        $mail->SMTPDebug = 0;                      // Enable verbose debug output
        $mail->isSMTP();                           // Send using SMTP
        $mail->Host       = SMTP_HOST;             // Set the SMTP server to send through
        $mail->SMTPAuth   = true;                  // Enable SMTP authentication
        $mail->Username   = SMTP_USERNAME;         // SMTP username
        $mail->Password   = SMTP_PASSWORD;         // SMTP password
        $mail->SMTPSecure = SMTP_ENCRYPTION;       // Enable TLS encryption
        $mail->Port       = SMTP_PORT;             // TCP port to connect to
        
        // Disable SSL verification for reliability
        $mail->SMTPOptions = array(
            'ssl' => array(
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            )
        );
        
        debug_log("SMTP settings configured");
        
        // STANDARD APPROACH: Use your own email as the sender
        $mail->setFrom(SMTP_USERNAME, "$name");
        
        // Set the recipient (your company email)
        $mail->addAddress(EMAIL_TO, 'Explore Maps Travel & Tours - Sorsogon');
        
        // Add Reply-To header with the client's actual email
        $mail->addReplyTo($email, $name);
        
        debug_log("Email recipients configured");
        
        // Content
        $mail->isHTML(true);                       // Set email format to HTML
        $mail->Subject = "New Inquiry from $name: $subject";
        $mail->Body    = $htmlContent;
        $mail->AltBody = $plainTextContent;
        
        debug_log("Email content prepared, attempting to send");
        
        // Send the email
        if ($mail->send()) {
            debug_log("Email sent successfully");
            
            // Save form data to a text file for backup
            $formData = "Name: $name\nEmail: $email\nPhone: $phone\nSubject: $subject\nMessage: $message\nType: $inquiryType\nTime: " . date('Y-m-d H:i:s') . "\n\n";
            file_put_contents('form_submissions.txt', $formData, FILE_APPEND);
            
            // Redirect to thank you page
            header("Location: thank-you.html");
            exit;
        } else {
            debug_log("Email could not be sent: " . $mail->ErrorInfo);
            header("Location: contact-error.html");
            exit;
        }
    } catch (Exception $e) {
        debug_log("Exception occurred: " . $e->getMessage());
        header("Location: contact-error.html");
        exit;
    }
} else {
    debug_log("Form not submitted via POST");
    header("Location: contact.html");
    exit;
}

// Function to get a human-readable label for inquiry types
function getInquiryTypeLabel($inquiryType) {
    $labels = [
        'flight-bookings' => 'Flight Bookings',
        'accommodation' => 'Accommodation (Airbnb & Hotel)',
        'custom-itinerary' => 'Custom Itinerary Requests',
        'tour-packages' => 'Tour Packages',
        'visa-processing' => 'Visa Processing',
        'travel-insurance' => 'Travel Insurance',
        'pricing' => 'Pricing Information',
        'general' => 'General Inquiry',
        'feedback' => 'Feedback',
        'tour-booking' => 'Tour Booking' // For backward compatibility
    ];
    
    return isset($labels[$inquiryType]) ? $labels[$inquiryType] : $inquiryType;
}
?>
