<?php
// Turn off all error reporting for production
error_reporting(0);
ini_set('display_errors', 0);

// Include PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Load Composer's autoloader
require_once 'vendor/autoload.php';

// Load configuration
require_once 'config.php';

// Database connection function
function connectToDatabase() {
  try {
      $conn = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASSWORD);
      // Set the PDO error mode to exception
      $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      return $conn;
  } catch(PDOException $e) {
      // Log error but don't display to user
      error_log("Database connection failed: " . $e->getMessage());
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
  // Get form data and sanitize inputs
  $name = htmlspecialchars(trim($_POST["name"] ?? ''));
  $email = filter_var($_POST["email"] ?? '', FILTER_SANITIZE_EMAIL);

  // Check if the email is the company email
  if ($email !== 'edsiljeremias@gmail.com') {
      // Redirect to contact page with an error parameter
      header("Location: contact.html?error=email_not_found");
      exit;
  }

  $phone = htmlspecialchars(trim($_POST["phone"] ?? ''));
  $subject = htmlspecialchars(trim($_POST["subject"] ?? ''));
  $message = htmlspecialchars(trim($_POST["message"] ?? ''));
  $inquiryType = htmlspecialchars(trim($_POST["inquiry-type"] ?? ''));
  
  // Validate required fields
  $errors = [];
  if (empty($name)) $errors[] = "Name is required";
  if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Valid email is required";
  if (empty($subject)) $errors[] = "Subject is required";
  if (empty($message)) $errors[] = "Message is required";
  if (empty($inquiryType)) $errors[] = "Inquiry type is required";
  
  // If there are validation errors, redirect to contact form with error
  if (!empty($errors)) {
      header("Location: contact.html?error=validation");
      exit;
  }
  
  // Save to database if connection is available
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
          
          // Log success
          silent_log("Inquiry saved to database successfully. ID: " . $dbConn->lastInsertId());
      } catch(PDOException $e) {
          // Log error but continue with email sending
          silent_log("Database error: " . $e->getMessage());
      }
  }
  
  // Create email content - Plain text version
  $plainTextContent = "EXPLORE MAPS TRAVEL & TOURS - SORSOGON
";
  $plainTextContent .= "===========================================

";
  $plainTextContent .= "CONTACT DETAILS:
";
  $plainTextContent .= "Name: $name
";
  $plainTextContent .= "Email: $email
";
  $plainTextContent .= "Phone: " . (!empty($phone) ? $phone : "Not provided") . "
";
  $plainTextContent .= "Inquiry Type: $inquiryType

";
  $plainTextContent .= "MESSAGE DETAILS:
";
  $plainTextContent .= "Subject: $subject

";
  $plainTextContent .= "Message:
$message

";
  $plainTextContent .= "===========================================
";
  $plainTextContent .= "This inquiry was submitted on " . date('F j, Y \a\t g:i a') . "
";
  $plainTextContent .= "From IP: " . $_SERVER['REMOTE_ADDR'] . "
";
  
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
              <h2>New Inquiry from Explore Maps Travel & Tours - Sorsogon</h2>
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
  
  // Create a new PHPMailer instance with error suppression
  $mail = @new PHPMailer(true);
  
  try {
      // Server settings - with error suppression
      $mail->isSMTP();
      $mail->Host       = SMTP_HOST;
      $mail->SMTPAuth   = true; 
      $mail->Username   = SMTP_USERNAME;
      $mail->Password   = SMTP_PASSWORD;
      $mail->SMTPSecure = SMTP_ENCRYPTION;
      $mail->Port       = SMTP_PORT;
      
      // Disable SSL verification in all cases for reliability
      $mail->SMTPOptions = array(
          'ssl' => array(
              'verify_peer' => false,
              'verify_peer_name' => false,
              'allow_self_signed' => true
          )
      );
      
      // Recipients
      $mail->setFrom(EMAIL_FROM, $name); // Use client's name as the sender name
      $mail->addAddress(EMAIL_TO); // Your email address defined in config.php
      $mail->addReplyTo(EMAIL_FROM); // Set reply-to as the company email

      // This way, when you reply to the email, it will go to the client automatically
      
      // Content
      $mail->isHTML(true); // Set email format to HTML
      $mail->Subject = "New Inquiry: $name ($inquiryTypeLabel)";
      $mail->Body    = $htmlContent; // HTML version
      $mail->AltBody = $plainTextContent; // Plain text version
      
      // Send email and immediately redirect on success
      if (@$mail->send()) {
          // Save form data to a text file for backup
          $formData = "Name: $name
Email: $email
Phone: $phone
Subject: $subject
Message: $message
Type: $inquiryType
Time: " . date('Y-m-d H:i:s') . "

";
          @file_put_contents('form_submissions.txt', $formData, FILE_APPEND);
          
          // Redirect to thank you page
          header("Location: thank-you.html");
          exit;
      } else {
          // Redirect to error page
          header("Location: contact-error.html");
          exit;
      }
  } catch (Exception $e) {
      // Redirect to error page on any exception
      header("Location: contact-error.html");
      exit;
  }
} else {
  // If not a POST request, redirect to the contact form
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
