<?php
// Contact form processing script with database integration
require_once 'database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

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
    $db->createTables(); // Ensure tables exist
} catch (Exception $e) {
    error_log("Database initialization failed: " . $e->getMessage());
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

// Get and sanitize form data
$firstName = sanitizeInput($_POST['firstName'] ?? '');
$lastName = sanitizeInput($_POST['lastName'] ?? '');
$email = sanitizeInput($_POST['email'] ?? '');
$phone = sanitizeInput($_POST['phone'] ?? '');
$subject = sanitizeInput($_POST['subject'] ?? '');
$preferredService = sanitizeInput($_POST['preferredService'] ?? '');
$message = sanitizeInput($_POST['message'] ?? '');
$newsletter = isset($_POST['newsletter']) ? 'Yes' : 'No';
$privacy = isset($_POST['privacy']);

// Validation
$errors = [];

if (empty($firstName) || strlen($firstName) < 2) {
    $errors[] = 'First name is required and must be at least 2 characters';
}

if (empty($lastName) || strlen($lastName) < 2) {
    $errors[] = 'Last name is required and must be at least 2 characters';
}

if (empty($email) || !validateEmail($email)) {
    $errors[] = 'Valid email address is required';
}

if (empty($subject)) {
    $errors[] = 'Subject is required';
}

if (empty($message) || strlen($message) < 10) {
    $errors[] = 'Message is required and must be at least 10 characters';
}

if (!$privacy) {
    $errors[] = 'You must agree to the privacy policy';
}

// If there are validation errors, return them
if (!empty($errors)) {
    sendResponse(false, implode(', ', $errors));
}

// Email configuration
$to = 'info@zentouch.com'; // Change to your email
$fromEmail = 'noreply@zentouch.com'; // Change to your domain
$fromName = 'ZenTouch Contact Form';

// Subject mapping
$subjectMap = [
    'booking' => 'Booking Inquiry',
    'services' => 'Service Information Request',
    'pricing' => 'Pricing Questions',
    'availability' => 'Availability Check',
    'feedback' => 'Customer Feedback',
    'other' => 'General Inquiry'
];

$emailSubject = 'New Contact Form Submission: ' . ($subjectMap[$subject] ?? 'General Inquiry');

// Service mapping
$serviceMap = [
    'swedish' => 'Swedish Massage',
    'deep-tissue' => 'Deep Tissue Massage',
    'aromatherapy' => 'Aromatherapy Massage',
    'hot-stone' => 'Hot Stone Massage',
    'couples' => 'Couples Massage',
    'prenatal' => 'Prenatal Massage',
    'sports' => 'Sports Massage',
    'reflexology' => 'Reflexology'
];

$preferredServiceName = $preferredService ? ($serviceMap[$preferredService] ?? $preferredService) : 'Not specified';

try {
    $contactData = [
        'firstName' => $firstName,
        'lastName' => $lastName,
        'email' => $email,
        'phone' => $phone,
        'subject' => $subject,
        'preferredService' => $preferredService,
        'message' => $message,
        'newsletter' => $newsletter === 'Yes'
    ];
    
    $contactId = $db->insertContact($contactData);
    
    // Subscribe to newsletter if requested
    if ($newsletter === 'Yes') {
        $db->subscribeNewsletter($email, $firstName, $lastName);
    }
    
} catch (Exception $e) {
    error_log("Database save failed: " . $e->getMessage());
    sendResponse(false, 'Failed to save your information. Please try again.');
}

// Create email body
$emailBody = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #e91e63, #f06292); color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #e91e63; }
        .value { margin-left: 10px; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>New Contact Form Submission</h2>
            <p>ZenTouch Massage Services</p>
        </div>
        <div class='content'>
            <div class='field'>
                <span class='label'>Contact ID:</span>
                <span class='value'>#$contactId</span>
            </div>
            <div class='field'>
                <span class='label'>Name:</span>
                <span class='value'>{$firstName} {$lastName}</span>
            </div>
            <div class='field'>
                <span class='label'>Email:</span>
                <span class='value'>{$email}</span>
            </div>
            <div class='field'>
                <span class='label'>Phone:</span>
                <span class='value'>" . ($phone ?: 'Not provided') . "</span>
            </div>
            <div class='field'>
                <span class='label'>Subject:</span>
                <span class='value'>" . ($subjectMap[$subject] ?? 'General Inquiry') . "</span>
            </div>
            <div class='field'>
                <span class='label'>Preferred Service:</span>
                <span class='value'>{$preferredServiceName}</span>
            </div>
            <div class='field'>
                <span class='label'>Newsletter Subscription:</span>
                <span class='value'>{$newsletter}</span>
            </div>
            <div class='field'>
                <span class='label'>Message:</span>
                <div style='background: white; padding: 15px; border-left: 4px solid #e91e63; margin-top: 10px;'>
                    " . nl2br($message) . "
                </div>
            </div>
        </div>
        <div class='footer'>
            <p>This message was sent from the ZenTouch contact form on " . date('Y-m-d H:i:s') . "</p>
        </div>
    </div>
</body>
</html>
";

// Email headers
$headers = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    "From: {$fromName} <{$fromEmail}>",
    "Reply-To: {$firstName} {$lastName} <{$email}>",
    'X-Mailer: PHP/' . phpversion()
];

// Send email
$mailSent = mail($to, $emailSubject, $emailBody, implode("\r\n", $headers));

if ($mailSent) {
    // Log the submission with database ID
    $logEntry = date('Y-m-d H:i:s') . " - Contact form submission #$contactId from {$firstName} {$lastName} ({$email})\n";
    file_put_contents('contact_log.txt', $logEntry, FILE_APPEND | LOCK_EX);
    
    // Send auto-reply to customer
    $autoReplySubject = 'Thank you for contacting ZenTouch Massage';
    $autoReplyBody = "
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
                <h2>Thank You for Contacting ZenTouch</h2>
            </div>
            <div class='content'>
                <p>Dear {$firstName},</p>
                <p>Thank you for reaching out to ZenTouch Massage Services. We have received your message (Reference #$contactId) and will respond within 24 hours.</p>
                <p><strong>Your inquiry details:</strong></p>
                <ul>
                    <li>Subject: " . ($subjectMap[$subject] ?? 'General Inquiry') . "</li>
                    <li>Preferred Service: {$preferredServiceName}</li>
                </ul>
                <p>In the meantime, feel free to:</p>
                <ul>
                    <li>Call us at (555) 123-4567 for immediate assistance</li>
                    <li>Visit our website to learn more about our services</li>
                    <li>Book directly online at your convenience</li>
                </ul>
                <p>We look forward to helping you achieve ultimate relaxation!</p>
                <p>Best regards,<br>The ZenTouch Team</p>
            </div>
            <div class='footer'>
                <p>ZenTouch Massage Services | (555) 123-4567 | info@zentouch.com</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $autoReplyHeaders = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        "From: {$fromName} <{$fromEmail}>",
        'X-Mailer: PHP/' . phpversion()
    ];
    
    mail($email, $autoReplySubject, $autoReplyBody, implode("\r\n", $autoReplyHeaders));
    
    sendResponse(true, 'Thank you for your message! We\'ll get back to you within 24 hours. Your reference number is #' . $contactId);
} else {
    sendResponse(false, 'Sorry, there was an error sending your message. Please try again or call us directly at (555) 123-4567.');
}
?>
