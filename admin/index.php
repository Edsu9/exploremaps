<?php
// Admin page to view form submissions from the database
// IMPORTANT: Protect this file with proper authentication in production!

// Start session for potential future authentication
session_start();

// Load configuration
require_once '../config.php';

// Simple password protection - CHANGE THIS PASSWORD!
$admin_password = "ExploreMapsSorsogon2025";

// Check if logged in
$is_logged_in = false;

// Process login
if (isset($_POST['password'])) {
    if ($_POST['password'] === $admin_password) {
        $_SESSION['admin_logged_in'] = true;
        $is_logged_in = true;
    } else {
        $login_error = "Incorrect password";
    }
}

// Check session
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    $is_logged_in = true;
}

// Process logout
if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: index.php");
    exit;
}

// Function to get submissions from database
function getSubmissions() {
    $submissions = [];
    
    try {
        // Connect to database
        $conn = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME);
        
        // Check connection
        if ($conn->connect_error) {
            throw new Exception("Connection failed: " . $conn->connect_error);
        }
        
        // Query to get submissions, ordered by newest first
        $sql = "SELECT * FROM inquiries ORDER BY submission_date DESC";
        $result = $conn->query($sql);
        
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $submissions[] = $row;
            }
        }
        
        $conn->close();
    } catch (Exception $e) {
        echo "<div class='alert alert-danger'>Database error: " . $e->getMessage() . "</div>";
    }
    
    return $submissions;
}

// Function to get submissions from text file if database fails
function getSubmissionsFromFile() {
    $submissions = [];
    $file = '../form_submissions.txt';
    
    if (file_exists($file)) {
        $content = file_get_contents($file);
        $entries = explode("=== NEW SUBMISSION", $content);
        
        foreach ($entries as $entry) {
            if (empty(trim($entry))) continue;
            
            $submissions[] = [
                'content' => $entry,
                'date' => preg_match('/$$([^)]+)$$/', $entry, $matches) ? $matches[1] : 'Unknown'
            ];
        }
    }
    
    return $submissions;
}

// Get submissions if logged in
$db_submissions = $is_logged_in ? getSubmissions() : [];
$file_submissions = $is_logged_in ? getSubmissionsFromFile() : [];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Explore Maps Travel and Tours</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css">
    <style>
        body {
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .login-form {
            max-width: 400px;
            margin: 100px auto;
            padding: 20px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .card {
            margin-bottom: 20px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .nav-tabs {
            margin-bottom: 20px;
        }
        .submission-date {
            font-size: 0.8rem;
            color: #6c757d;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        pre {
            white-space: pre-wrap;
            font-family: inherit;
            margin: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <?php if (!$is_logged_in): ?>
            <!-- Login Form -->
            <div class="login-form">
                <h2 class="text-center mb-4">Admin Login</h2>
                
                <?php if (isset($login_error)): ?>
                    <div class="alert alert-danger"><?php echo $login_error; ?></div>
                <?php endif; ?>
                
                <form method="post" action="">
                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" class="form-control" id="password" name="password" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Login</button>
                </form>
                
                <div class="mt-3 text-center">
                    <a href="../index.html" class="text-decoration-none">Back to Website</a>
                </div>
            </div>
        <?php else: ?>
            <!-- Admin Dashboard -->
            <div class="header">
                <h1>Form Submissions</h1>
                <div>
                    <a href="../index.html" class="btn btn-outline-primary me-2">Back to Website</a>
                    <a href="?logout=1" class="btn btn-outline-danger">Logout</a>
                </div>
            </div>
            
            <ul class="nav nav-tabs" id="submissionTabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="database-tab" data-bs-toggle="tab" data-bs-target="#database" type="button" role="tab" aria-controls="database" aria-selected="true">
                        Database Submissions (<?php echo count($db_submissions); ?>)
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="file-tab" data-bs-toggle="tab" data-bs-target="#file" type="button" role="tab" aria-controls="file" aria-selected="false">
                        File Submissions (<?php echo count($file_submissions); ?>)
                    </button>
                </li>
            </ul>
            
            <div class="tab-content" id="submissionTabsContent">
                <!-- Database Submissions -->
                <div class="tab-pane fade show active" id="database" role="tabpanel" aria-labelledby="database-tab">
                    <?php if (empty($db_submissions)): ?>
                        <div class="alert alert-info">No submissions found in the database.</div>
                    <?php else: ?>
                        <?php foreach ($db_submissions as $submission): ?>
                            <div class="card">
                                <div class="card-header d-flex justify-content-between align-items-center">
                                    <h5 class="mb-0"><?php echo htmlspecialchars($submission['subject']); ?></h5>
                                    <span class="submission-date"><?php echo htmlspecialchars($submission['submission_date']); ?></span>
                                </div>
                                <div class="card-body">
                                    <div class="row mb-3">
                                        <div class="col-md-6">
                                            <strong>Name:</strong> <?php echo htmlspecialchars($submission['name']); ?>
                                        </div>
                                        <div class="col-md-6">
                                            <strong>Email:</strong> <a href="mailto:<?php echo htmlspecialchars($submission['email']); ?>"><?php echo htmlspecialchars($submission['email']); ?></a>
                                        </div>
                                    </div>
                                    <div class="row mb-3">
                                        <div class="col-md-6">
                                            <strong>Phone:</strong> <?php echo htmlspecialchars($submission['phone'] ?: 'Not provided'); ?>
                                        </div>
                                        <div class="col-md-6">
                                            <strong>Inquiry Type:</strong> <?php echo htmlspecialchars($submission['inquiry_type']); ?>
                                        </div>
                                    </div>
                                    <div class="mb-0">
                                        <strong>Message:</strong>
                                        <p class="mt-2"><?php echo nl2br(htmlspecialchars($submission['message'])); ?></p>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
                
                <!-- File Submissions -->
                <div class="tab-pane fade" id="file" role="tabpanel" aria-labelledby="file-tab">
                    <?php if (empty($file_submissions)): ?>
                        <div class="alert alert-info">No submissions found in the backup file.</div>
                    <?php else: ?>
                        <?php foreach ($file_submissions as $submission): ?>
                            <div class="card">
                                <div class="card-header">
                                    <span class="submission-date"><?php echo htmlspecialchars($submission['date']); ?></span>
                                </div>
                                <div class="card-body">
                                    <pre><?php echo htmlspecialchars($submission['content']); ?></pre>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
            </div>
        <?php endif; ?>
    </div>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
</body>
</html>
