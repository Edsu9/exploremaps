<<<<<<< HEAD
<?php
// Include PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Load Composer's autoloader
require_once 'vendor/autoload.php';

// Load configuration
require_once 'config.php';

// Enable debugging if in debug mode
$debug = DEBUG_MODE;
if ($debug) {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
}

// Log the request for debugging
error_log("Process form accessed. Method: " . $_SERVER['REQUEST_METHOD']);
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    error_log("POST data received: " . print_r($_POST, true));
}

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data and sanitize inputs
    $name = htmlspecialchars(trim($_POST["name"] ?? ''));
    $email = filter_var($_POST["email"] ?? '', FILTER_SANITIZE_EMAIL);
    $phone = htmlspecialchars(trim($_POST["phone"] ?? ''));
    $subject = htmlspecialchars(trim($_POST["subject"] ?? ''));
    $message = htmlspecialchars(trim($_POST["message"] ?? ''));
    $inquiryType = htmlspecialchars(trim($_POST["inquiry-type"] ?? ''));
    
    // Log the sanitized data
    error_log("Sanitized form data: Name=$name, Email=$email, Subject=$subject");
    
    // Validate required fields
    $errors = [];
    if (empty($name)) $errors[] = "Name is required";
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Valid email is required";
    if (empty($subject)) $errors[] = "Subject is required";
    if (empty($message)) $errors[] = "Message is required";
    if (empty($inquiryType)) $errors[] = "Inquiry type is required";
    
    if (!empty($errors)) {
        // Log validation errors
        error_log("Form validation errors: " . implode(", ", $errors));
        
        if ($debug) {
            // Display errors
            echo "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;'>";
            echo "<h2 style='color: #ff6b6b;'>Form Submission Error</h2>";
            echo "<p>Please correct the following errors:</p>";
            echo "<ul style='color: #ff6b6b;'>";
            foreach ($errors as $error) {
                echo "<li>$error</li>";
            }
            echo "</ul>";
            echo "<p><a href='contact.html' style='display: inline-block; padding: 10px 15px; background-color: #0047ab; color: white; text-decoration: none; border-radius: 4px;'>Back to Contact Form</a></p>";
            echo "</div>";
        } else {
            // Redirect to contact form with error parameter
            header("Location: contact.html?error=validation");
        }
        exit;
    }
    
    // Create email content - Plain text version
    $plainTextContent = "EXPLORE MAPS TRAVEL & TOURS - SORSOGON\n";
    $plainTextContent .= "===========================================\n\n";
    $plainTextContent .= "CONTACT DETAILS:\n";
    $plainTextContent .= "Name: $name\n";
    $plainTextContent .= "Email: $email\n";
    $plainTextContent .= "Phone: " . (!empty($phone) ? $phone : "Not provided") . "\n";
    $plainTextContent .= "Inquiry Type: $inquiryType\n\n";
    $plainTextContent .= "MESSAGE DETAILS:\n";
    $plainTextContent .= "Subject: $subject\n\n";
    $plainTextContent .= "Message:\n$message\n\n";
    $plainTextContent .= "===========================================\n";
    $plainTextContent .= "This inquiry was submitted on " . date('F j, Y \a\t g:i a') . "\n";
    $plainTextContent .= "From IP: " . $_SERVER['REMOTE_ADDR'] . "\n";
    
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
                <h2>New Inquiry from Explore Maps Travel & Tours - Sorsogon</h2>
            </div>
            <div class='content'>
                <div class='section'>
                    <div class='section-title'>Contact Details</div>
                    <div class='field'><span class='label'>Name:</span> $name</div>
                    <div class='field'><span class='label'>Email:</span> <a href='mailto:$email'>$email</a></div>
                    <div class='field'><span class='label'>Phone:</span> " . (!empty($phone) ? $phone : "<em>Not provided</em>") . "</div>
                    <div class='field'><span class='label'>Inquiry Type:</span> $inquiryType</div>
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
    
    // Log that we're about to send email
    error_log("Preparing to send email to " . EMAIL_TO);
    
    // IMPORTANT: Send email first, then save to database
    // Create a new PHPMailer instance
    $mail = new PHPMailer(true);
    
    try {
        // Server settings
        $mail->SMTPDebug = $debug ? 2 : 0; // Enable verbose debug output only in debug mode
        if ($debug) {
            $mail->Debugoutput = function($str, $level) {
                error_log("PHPMailer: $str");
                echo "Debug: $str<br>";
            };
        }
        
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true; 
        $mail->Username   = 'edsiljeremias@gmail.com';
        $mail->Password   = 'nqxf brra tzit ckac';
        $mail->SMTPSecure = 'tls';
        $mail->Port       = 587;
        
        // Only disable SSL verification in development, not in production
        if ($debug) {
            $mail->SMTPOptions = array(
                'ssl' => array(
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                )
            );
        }
        
        // Recipients
        $mail->setFrom(EMAIL_FROM, EMAIL_FROM_NAME);
        $mail->addAddress(EMAIL_TO, 'Explore Maps'); // Where to send the inquiry
        $mail->addReplyTo($email, $name); // Set reply-to as the customer's email
        
        // Content
        $mail->isHTML(true); // Set email format to HTML
        $mail->Subject = "New Inquiry: $subject";
        $mail->Body    = $htmlContent; // HTML version
        $mail->AltBody = $plainTextContent; // Plain text version
        
        // CRITICAL: Send email and check result
        $emailSent = $mail->send();
        error_log("Email sent successfully: " . ($emailSent ? "Yes" : "No"));
        
        if ($debug) echo "Email sent successfully!<br>";
        
        // Now save to database
        $dbSaved = saveToDatabase($name, $email, $phone, $subject, $message, $inquiryType);
        error_log("Database saved successfully: " . ($dbSaved ? "Yes" : "No"));
        
        if ($debug) echo "Database save: " . ($dbSaved ? "Success" : "Failed") . "<br>";
        
        // Only redirect if both operations succeeded
        if ($emailSent && $dbSaved) {
            if ($debug) {
                echo "Redirecting to thank you page...<br>";
                echo "<script>setTimeout(function() { window.location.href = 'thank-you.html'; }, 3000);</script>";
            } else {
                // For production
                header("Location: thank-you.html");
                exit;
            }
        } else {
            if ($debug) {
                echo "There was an issue with the form submission.<br>";
                if (!$emailSent) echo "Email could not be sent.<br>";
                if (!$dbSaved) echo "Database save failed.<br>";
                echo "<a href='contact.html'>Return to contact form</a>";
            } else {
                header("Location: contact-error.html");
                exit;
            }
        }
        
    } catch (Exception $e) {
        error_log("Email error: " . $mail->ErrorInfo);
        
        if ($debug) {
            echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}<br>";
            echo "<a href='contact.html'>Return to contact form</a>";
        } else {
            header("Location: contact-error.html");
            exit;
        }
    }
}

// Function to save inquiry to database
function saveToDatabase($name, $email, $phone, $subject, $message, $inquiryType) {
    try {
        // Database connection details from config
        $servername = 'fdb1027.runhosting.com';
        $username = '4617544_exploremaps';
        $password = '2fzPOA}}8VffeS{b';
        $dbname = '4617544_exploremaps';
        
        // Create connection
        $conn = new mysqli($servername, $username, $password, $dbname);
        
        // Check connection
        if ($conn->connect_error) {
            throw new Exception("Database connection failed: " . $conn->connect_error);
        }
        
        // Check if table exists, if not create it
        $tableCheck = $conn->query("SHOW TABLES LIKE 'inquiries'");
        if ($tableCheck->num_rows == 0) {
            $createTable = "CREATE TABLE inquiries (
                id INT(11) AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                phone VARCHAR(20),
                subject VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                inquiry_type VARCHAR(50),
                submission_date DATETIME DEFAULT CURRENT_TIMESTAMP
            )";
            
            if (!$conn->query($createTable)) {
                throw new Exception("Error creating table: " . $conn->error);
            }
        }
        
        // Prepare and bind
        $stmt = $conn->prepare("INSERT INTO inquiries (name, email, phone, subject, message, inquiry_type, submission_date) VALUES (?, ?, ?, ?, ?, ?, NOW())");
        
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        
        $stmt->bind_param("ssssss", $name, $email, $phone, $subject, $message, $inquiryType);
        
        // Execute the statement
        $result = $stmt->execute();
        
        if (!$result) {
            throw new Exception("Execute failed: " . $stmt->error);
        }
        
        // Close statement and connection
        $stmt->close();
        $conn->close();
        
        return true;
    } catch (Exception $e) {
        error_log("Database error: " . $e->getMessage());
        global $debug;
        if ($debug) echo "Database error: " . $e->getMessage() . "<br>";
        return true;
    }
}

// If accessed directly without form submission, show a test form
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    echo "
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;'>
        <h2 style='color: #0047ab;'>Contact Form Processor</h2>
        <p>This script processes form submissions from the contact page.</p>
        <p>You can use the test form below to verify functionality:</p>
        
        <form method='POST' action='process-form.php?debug=1' style='margin-top: 20px;'>
            <div style='margin-bottom: 15px;'>
                <label style='display: block; margin-bottom: 5px;'>Your Name:</label>
                <input type='text' name='name' required style='width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;'>
            </div>
            
            <div style='margin-bottom: 15px;'>
                <label style='display: block; margin-bottom: 5px;'>Email Address:</label>
                <input type='email' name='email' required style='width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;'>
            </div>
            
            <div style='margin-bottom: 15px;'>
                <label style='display: block; margin-bottom: 5px;'>Phone Number:</label>
                <input type='tel' name='phone' style='width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;'>
            </div>
            
            <div style='margin-bottom: 15px;'>
                <label style='display: block; margin-bottom: 5px;'>Subject:</label>
                <input type='text' name='subject' required style='width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;'>
            </div>
            
            <div style='margin-bottom: 15px;'>
                <label style='display: block; margin-bottom: 5px;'>Message:</label>
                <textarea name='message' required rows='5' style='width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;'></textarea>
            </div>
            
            <div style='margin-bottom: 15px;'>
                <label style='display: block; margin-bottom: 5px;'>Inquiry Type:</label>
                <select name='inquiry-type' required style='width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;'>
                    <option value=''>Select an option</option>
                    <option value='tour-booking'>Tour Booking</option>
                    <option value='custom-itinerary'>Custom Itinerary Request</option>
                    <option value='pricing'>Pricing Information</option>
                    <option value='general'>General Inquiry</option>
                    <option value='feedback'>Feedback</option>
                </select>
            </div>
            
            <button type='submit' style='background-color: #0047ab; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer;'>Send Test Message</button>
        </form>
        
        <p style='margin-top: 20px;'><a href='contact.html' style='color: #0047ab;'>Go to the main contact form</a></p>
    </div>
    ";
}
?>
=======
<?php
// Include PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Load Composer's autoloader
require_once 'vendor/autoload.php';

// Load configuration
require_once 'config.php';

// Enable debugging if in debug mode
$debug = DEBUG_MODE;
if ($debug) {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
}

// Log the request for debugging
error_log("Process form accessed. Method: " . $_SERVER['REQUEST_METHOD']);
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    error_log("POST data received: " . print_r($_POST, true));
}

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data and sanitize inputs
    $name = htmlspecialchars(trim($_POST["name"] ?? ''));
    $email = filter_var($_POST["email"] ?? '', FILTER_SANITIZE_EMAIL);
    $phone = htmlspecialchars(trim($_POST["phone"] ?? ''));
    $subject = htmlspecialchars(trim($_POST["subject"] ?? ''));
    $message = htmlspecialchars(trim($_POST["message"] ?? ''));
    $inquiryType = htmlspecialchars(trim($_POST["inquiry-type"] ?? ''));
    
    // Log the sanitized data
    error_log("Sanitized form data: Name=$name, Email=$email, Subject=$subject");
    
    // Validate required fields
    $errors = [];
    if (empty($name)) $errors[] = "Name is required";
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Valid email is required";
    if (empty($subject)) $errors[] = "Subject is required";
    if (empty($message)) $errors[] = "Message is required";
    if (empty($inquiryType)) $errors[] = "Inquiry type is required";
    
    if (!empty($errors)) {
        // Log validation errors
        error_log("Form validation errors: " . implode(", ", $errors));
        
        if ($debug) {
            // Display errors
            echo "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;'>";
            echo "<h2 style='color: #ff6b6b;'>Form Submission Error</h2>";
            echo "<p>Please correct the following errors:</p>";
            echo "<ul style='color: #ff6b6b;'>";
            foreach ($errors as $error) {
                echo "<li>$error</li>";
            }
            echo "</ul>";
            echo "<p><a href='contact.html' style='display: inline-block; padding: 10px 15px; background-color: #0047ab; color: white; text-decoration: none; border-radius: 4px;'>Back to Contact Form</a></p>";
            echo "</div>";
        } else {
            // Redirect to contact form with error parameter
            header("Location: contact.html?error=validation");
        }
        exit;
    }
    
    // Create email content - Plain text version
    $plainTextContent = "EXPLORE MAPS TRAVEL & TOURS - SORSOGON\n";
    $plainTextContent .= "===========================================\n\n";
    $plainTextContent .= "CONTACT DETAILS:\n";
    $plainTextContent .= "Name: $name\n";
    $plainTextContent .= "Email: $email\n";
    $plainTextContent .= "Phone: " . (!empty($phone) ? $phone : "Not provided") . "\n";
    $plainTextContent .= "Inquiry Type: $inquiryType\n\n";
    $plainTextContent .= "MESSAGE DETAILS:\n";
    $plainTextContent .= "Subject: $subject\n\n";
    $plainTextContent .= "Message:\n$message\n\n";
    $plainTextContent .= "===========================================\n";
    $plainTextContent .= "This inquiry was submitted on " . date('F j, Y \a\t g:i a') . "\n";
    $plainTextContent .= "From IP: " . $_SERVER['REMOTE_ADDR'] . "\n";
    
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
                <h2>New Inquiry from Explore Maps Travel & Tours - Sorsogon</h2>
            </div>
            <div class='content'>
                <div class='section'>
                    <div class='section-title'>Contact Details</div>
                    <div class='field'><span class='label'>Name:</span> $name</div>
                    <div class='field'><span class='label'>Email:</span> <a href='mailto:$email'>$email</a></div>
                    <div class='field'><span class='label'>Phone:</span> " . (!empty($phone) ? $phone : "<em>Not provided</em>") . "</div>
                    <div class='field'><span class='label'>Inquiry Type:</span> $inquiryType</div>
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
    
    // Log that we're about to send email
    error_log("Preparing to send email to " . EMAIL_TO);
    
    // IMPORTANT: Send email first, then save to database
    // Create a new PHPMailer instance
    $mail = new PHPMailer(true);
    
    try {
        // Server settings
        $mail->SMTPDebug = $debug ? 2 : 0; // Enable verbose debug output only in debug mode
        if ($debug) {
            $mail->Debugoutput = function($str, $level) {
                error_log("PHPMailer: $str");
                echo "Debug: $str<br>";
            };
        }
        
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true; 
        $mail->Username   = 'edsiljeremias@gmail.com';
        $mail->Password   = 'nqxf brra tzit ckac';
        $mail->SMTPSecure = 'tls';
        $mail->Port       = 587;
        
        // Only disable SSL verification in development, not in production
        if ($debug) {
            $mail->SMTPOptions = array(
                'ssl' => array(
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                )
            );
        }
        
        // Recipients
        $mail->setFrom(EMAIL_FROM, EMAIL_FROM_NAME);
        $mail->addAddress(EMAIL_TO, 'Explore Maps'); // Where to send the inquiry
        $mail->addReplyTo($email, $name); // Set reply-to as the customer's email
        
        // Content
        $mail->isHTML(true); // Set email format to HTML
        $mail->Subject = "New Inquiry: $subject";
        $mail->Body    = $htmlContent; // HTML version
        $mail->AltBody = $plainTextContent; // Plain text version
        
        // CRITICAL: Send email and check result
        $emailSent = $mail->send();
        error_log("Email sent successfully: " . ($emailSent ? "Yes" : "No"));
        
        if ($debug) echo "Email sent successfully!<br>";
        
        // Now save to database
        $dbSaved = saveToDatabase($name, $email, $phone, $subject, $message, $inquiryType);
        error_log("Database saved successfully: " . ($dbSaved ? "Yes" : "No"));
        
        if ($debug) echo "Database save: " . ($dbSaved ? "Success" : "Failed") . "<br>";
        
        // Only redirect if both operations succeeded
        if ($emailSent && $dbSaved) {
            if ($debug) {
                echo "Redirecting to thank you page...<br>";
                echo "<script>setTimeout(function() { window.location.href = 'thank-you.html'; }, 3000);</script>";
            } else {
                // For production
                header("Location: thank-you.html");
                exit;
            }
        } else {
            if ($debug) {
                echo "There was an issue with the form submission.<br>";
                if (!$emailSent) echo "Email could not be sent.<br>";
                if (!$dbSaved) echo "Database save failed.<br>";
                echo "<a href='contact.html'>Return to contact form</a>";
            } else {
                header("Location: contact-error.html");
                exit;
            }
        }
        
    } catch (Exception $e) {
        error_log("Email error: " . $mail->ErrorInfo);
        
        if ($debug) {
            echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}<br>";
            echo "<a href='contact.html'>Return to contact form</a>";
        } else {
            header("Location: contact-error.html");
            exit;
        }
    }
}

// Function to save inquiry to database
function saveToDatabase($name, $email, $phone, $subject, $message, $inquiryType) {
    try {
        // Database connection details from config
        $servername = 'fdb1027.runhosting.com';
        $username = '4617544_exploremaps';
        $password = '2fzPOA}}8VffeS{b';
        $dbname = '4617544_exploremaps';
        
        // Create connection
        $conn = new mysqli($servername, $username, $password, $dbname);
        
        // Check connection
        if ($conn->connect_error) {
            throw new Exception("Database connection failed: " . $conn->connect_error);
        }
        
        // Check if table exists, if not create it
        $tableCheck = $conn->query("SHOW TABLES LIKE 'inquiries'");
        if ($tableCheck->num_rows == 0) {
            $createTable = "CREATE TABLE inquiries (
                id INT(11) AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                phone VARCHAR(20),
                subject VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                inquiry_type VARCHAR(50),
                submission_date DATETIME DEFAULT CURRENT_TIMESTAMP
            )";
            
            if (!$conn->query($createTable)) {
                throw new Exception("Error creating table: " . $conn->error);
            }
        }
        
        // Prepare and bind
        $stmt = $conn->prepare("INSERT INTO inquiries (name, email, phone, subject, message, inquiry_type, submission_date) VALUES (?, ?, ?, ?, ?, ?, NOW())");
        
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        
        $stmt->bind_param("ssssss", $name, $email, $phone, $subject, $message, $inquiryType);
        
        // Execute the statement
        $result = $stmt->execute();
        
        if (!$result) {
            throw new Exception("Execute failed: " . $stmt->error);
        }
        
        // Close statement and connection
        $stmt->close();
        $conn->close();
        
        return true;
    } catch (Exception $e) {
        error_log("Database error: " . $e->getMessage());
        global $debug;
        if ($debug) echo "Database error: " . $e->getMessage() . "<br>";
        return true;
    }
}

// If accessed directly without form submission, show a test form
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    echo "
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;'>
        <h2 style='color: #0047ab;'>Contact Form Processor</h2>
        <p>This script processes form submissions from the contact page.</p>
        <p>You can use the test form below to verify functionality:</p>
        
        <form method='POST' action='process-form.php?debug=1' style='margin-top: 20px;'>
            <div style='margin-bottom: 15px;'>
                <label style='display: block; margin-bottom: 5px;'>Your Name:</label>
                <input type='text' name='name' required style='width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;'>
            </div>
            
            <div style='margin-bottom: 15px;'>
                <label style='display: block; margin-bottom: 5px;'>Email Address:</label>
                <input type='email' name='email' required style='width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;'>
            </div>
            
            <div style='margin-bottom: 15px;'>
                <label style='display: block; margin-bottom: 5px;'>Phone Number:</label>
                <input type='tel' name='phone' style='width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;'>
            </div>
            
            <div style='margin-bottom: 15px;'>
                <label style='display: block; margin-bottom: 5px;'>Subject:</label>
                <input type='text' name='subject' required style='width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;'>
            </div>
            
            <div style='margin-bottom: 15px;'>
                <label style='display: block; margin-bottom: 5px;'>Message:</label>
                <textarea name='message' required rows='5' style='width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;'></textarea>
            </div>
            
            <div style='margin-bottom: 15px;'>
                <label style='display: block; margin-bottom: 5px;'>Inquiry Type:</label>
                <select name='inquiry-type' required style='width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;'>
                    <option value=''>Select an option</option>
                    <option value='tour-booking'>Tour Booking</option>
                    <option value='custom-itinerary'>Custom Itinerary Request</option>
                    <option value='pricing'>Pricing Information</option>
                    <option value='general'>General Inquiry</option>
                    <option value='feedback'>Feedback</option>
                </select>
            </div>
            
            <button type='submit' style='background-color: #0047ab; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer;'>Send Test Message</button>
        </form>
        
        <p style='margin-top: 20px;'><a href='contact.html' style='color: #0047ab;'>Go to the main contact form</a></p>
    </div>
    ";
}
?>
>>>>>>> f2e559ea65eeb33858ead0486337edae2497eaaa
