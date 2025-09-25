<?php
// Newsletter subscription handler
require_once 'database.php';
require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Response function
function sendResponse($success, $message, $data = null) {
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Invalid request method');
}

try {
    $db = new Database();
} catch (Exception $e) {
    error_log("Database connection failed: " . $e->getMessage());
    sendResponse(false, 'Database connection failed. Please try again later.');
}

// Sanitize input function
function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)));
}

// Validate email function
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Get form data
$email = sanitizeInput($_POST['email'] ?? '');
$firstName = sanitizeInput($_POST['firstName'] ?? '');
$lastName = sanitizeInput($_POST['lastName'] ?? '');

// Validation
if (empty($email) || !validateEmail($email)) {
    sendResponse(false, 'Valid email address is required');
}

try {
    $success = $db->subscribeNewsletter($email, $firstName, $lastName);
    
    if ($success) {
        // Send welcome email
        $subject = 'Welcome to ZenTouch Newsletter!';
        $body = "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #e91e63, #f06292); color: white; padding: 20px; text-align: center; }
                .content { background: #f9f9f9; padding: 20px; }
                .footer { background: #333; color: white; padding: 15px; text-align: center; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h2>Welcome to ZenTouch!</h2>
                </div>
                <div class='content'>
                    <p>Dear " . ($firstName ?: 'Valued Customer') . ",</p>
                    <p>Thank you for subscribing to our newsletter! You'll now receive:</p>
                    <ul>
                        <li>Exclusive wellness tips and massage techniques</li>
                        <li>Special offers and discounts</li>
                        <li>Updates on new services and treatments</li>
                        <li>Seasonal wellness advice</li>
                    </ul>
                    <p>We're committed to helping you achieve ultimate relaxation and wellness.</p>
                    <p>Best regards,<br>The ZenTouch Team</p>
                </div>
                <div class='footer'>
                    <p>" . BUSINESS_NAME . " | " . BUSINESS_PHONE . " | " . ADMIN_EMAIL . "</p>
                    <p><a href='" . SITE_URL . "/unsubscribe.php?email=" . urlencode($email) . "' style='color: #ccc;'>Unsubscribe</a></p>
                </div>
            </div>
        </body>
        </html>
        ";
        
        $headers = [
            'MIME-Version: 1.0',
            'Content-type: text/html; charset=UTF-8',
            'From: ' . FROM_NAME . ' <' . FROM_EMAIL . '>',
            'X-Mailer: PHP/' . phpversion()
        ];
        
        mail($email, $subject, $body, implode("\r\n", $headers));
        
        sendResponse(true, 'Successfully subscribed to newsletter!');
    } else {
        sendResponse(false, 'Subscription failed. You may already be subscribed.');
    }
} catch (Exception $e) {
    error_log("Newsletter subscription failed: " . $e->getMessage());
    sendResponse(false, 'Subscription failed. Please try again.');
}
?>
