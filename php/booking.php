<?php
// Booking form processing script
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
$service = sanitizeInput($_POST['service'] ?? '');
$therapist = sanitizeInput($_POST['therapist'] ?? '');
$appointmentDate = sanitizeInput($_POST['appointmentDate'] ?? '');
$appointmentTime = sanitizeInput($_POST['appointmentTime'] ?? '');
$duration = intval($_POST['duration'] ?? 0);
$totalAmount = floatval($_POST['totalAmount'] ?? 0);
$specialRequests = sanitizeInput($_POST['specialRequests'] ?? '');
$paymentMethod = sanitizeInput($_POST['paymentMethod'] ?? '');
$newsletter = isset($_POST['newsletter']) ? 'Yes' : 'No';
$terms = isset($_POST['terms']);

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

if (empty($phone)) {
    $errors[] = 'Phone number is required';
}

if (empty($service)) {
    $errors[] = 'Service selection is required';
}

if (empty($appointmentDate)) {
    $errors[] = 'Appointment date is required';
}

if (empty($appointmentTime)) {
    $errors[] = 'Appointment time is required';
}

if (empty($paymentMethod)) {
    $errors[] = 'Payment method is required';
}

if (!$terms) {
    $errors[] = 'You must agree to the terms and conditions';
}

// Validate appointment date is not in the past
if ($appointmentDate) {
    $appointmentDateTime = new DateTime($appointmentDate . ' ' . $appointmentTime);
    $now = new DateTime();
    if ($appointmentDateTime <= $now) {
        $errors[] = 'Appointment must be scheduled for a future date and time';
    }
}

// If there are validation errors, return them
if (!empty($errors)) {
    sendResponse(false, implode(', ', $errors));
}

// Service mapping for display names
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

// Therapist mapping
$therapistMap = [
    'sarah-johnson' => 'Sarah Johnson',
    'michael-chen' => 'Michael Chen',
    'emily-rodriguez' => 'Emily Rodriguez',
    'david-thompson' => 'David Thompson'
];

$serviceName = $serviceMap[$service] ?? $service;
$therapistName = $therapist ? ($therapistMap[$therapist] ?? $therapist) : '';

try {
    $bookingData = [
        'firstName' => $firstName,
        'lastName' => $lastName,
        'email' => $email,
        'phone' => $phone,
        'service' => $service,
        'therapist' => $therapist,
        'appointmentDate' => $appointmentDate,
        'appointmentTime' => $appointmentTime,
        'duration' => $duration,
        'specialRequests' => $specialRequests,
        'paymentMethod' => $paymentMethod,
        'totalAmount' => $totalAmount
    ];
    
    $bookingId = $db->insertBooking($bookingData);
    
    // Subscribe to newsletter if requested
    if ($newsletter === 'Yes') {
        $db->subscribeNewsletter($email, $firstName, $lastName);
    }
    
} catch (Exception $e) {
    error_log("Booking save failed: " . $e->getMessage());
    sendResponse(false, 'Failed to save your booking. Please try again.');
}

// Email configuration
$to = 'info@zentouch.com'; // Change to your email
$fromEmail = 'noreply@zentouch.com'; // Change to your domain
$fromName = 'ZenTouch Booking System';

$emailSubject = 'New Booking Confirmation - ' . $serviceName;

// Format appointment date and time
$appointmentDateTime = new DateTime($appointmentDate . ' ' . $appointmentTime);
$formattedDate = $appointmentDateTime->format('l, F j, Y');
$formattedTime = $appointmentDateTime->format('g:i A');

// Create email body for business
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
            <h2>New Booking Confirmation</h2>
            <p>ZenTouch Massage Services</p>
        </div>
        <div class='content'>
            <div class='field'>
                <span class='label'>Booking ID:</span>
                <span class='value'>#BK-$bookingId</span>
            </div>
            <div class='field'>
                <span class='label'>Client:</span>
                <span class='value'>{$firstName} {$lastName}</span>
            </div>
            <div class='field'>
                <span class='label'>Email:</span>
                <span class='value'>{$email}</span>
            </div>
            <div class='field'>
                <span class='label'>Phone:</span>
                <span class='value'>{$phone}</span>
            </div>
            <div class='field'>
                <span class='label'>Service:</span>
                <span class='value'>{$serviceName}</span>
            </div>
            <div class='field'>
                <span class='label'>Therapist:</span>
                <span class='value'>" . ($therapistName ?: 'No preference') . "</span>
            </div>
            <div class='field'>
                <span class='label'>Date & Time:</span>
                <span class='value'>{$formattedDate} at {$formattedTime}</span>
            </div>
            <div class='field'>
                <span class='label'>Duration:</span>
                <span class='value'>{$duration} minutes</span>
            </div>
            <div class='field'>
                <span class='label'>Payment Method:</span>
                <span class='value'>" . ucwords(str_replace('-', ' ', $paymentMethod)) . "</span>
            </div>
            <div class='field'>
                <span class='label'>Total Amount:</span>
                <span class='value'>$" . number_format($totalAmount, 2) . "</span>
            </div>
            <div class='field'>
                <span class='label'>Special Requests:</span>
                <div style='background: white; padding: 15px; border-left: 4px solid #e91e63; margin-top: 10px;'>
                    " . ($specialRequests ?: 'None') . "
                </div>
            </div>
        </div>
        <div class='footer'>
            <p>This booking was made on " . date('Y-m-d H:i:s') . "</p>
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

// Send email to business
$mailSent = mail($to, $emailSubject, $emailBody, implode("\r\n", $headers));

// Send confirmation email to customer
$customerSubject = 'Booking Confirmation - ZenTouch Massage';
$customerBody = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #e91e63, #f06292); color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .booking-details { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Booking Confirmed!</h2>
            <p>Thank you for choosing ZenTouch</p>
        </div>
        <div class='content'>
            <p>Dear {$firstName},</p>
            <p>Your massage appointment has been successfully booked. Here are your booking details:</p>
            
            <div class='booking-details'>
                <h3 style='color: #e91e63; margin-top: 0;'>Booking Details</h3>
                <p><strong>Booking Reference:</strong> #BK-$bookingId</p>
                <p><strong>Service:</strong> {$serviceName}</p>
                <p><strong>Date:</strong> {$formattedDate}</p>
                <p><strong>Time:</strong> {$formattedTime}</p>
                <p><strong>Duration:</strong> {$duration} minutes</p>
                <p><strong>Therapist:</strong> " . ($therapistName ?: 'No preference - we\'ll assign our best available therapist') . "</p>
                <p><strong>Total Amount:</strong> $" . number_format($totalAmount, 2) . "</p>
            </div>
            
            <h4 style='color: #e91e63;'>What to Expect:</h4>
            <ul>
                <li>Please arrive 15 minutes early for check-in</li>
                <li>Bring a valid ID and any relevant health information</li>
                <li>We'll call you 24 hours before your appointment to confirm</li>
                <li>Comfortable robes and slippers will be provided</li>
            </ul>
            
            <h4 style='color: #e91e63;'>Need to Make Changes?</h4>
            <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance:</p>
            <ul>
                <li>Phone: (555) 123-4567</li>
                <li>Email: info@zentouch.com</li>
            </ul>
            
            <p>We look forward to providing you with an exceptional massage experience!</p>
            <p>Best regards,<br>The ZenTouch Team</p>
        </div>
        <div class='footer'>
            <p>ZenTouch Massage Services | (555) 123-4567 | info@zentouch.com</p>
            <p>123 Wellness Street, Spa City, SC 12345</p>
        </div>
    </div>
</body>
</html>
";

$customerHeaders = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    "From: {$fromName} <{$fromEmail}>",
    'X-Mailer: PHP/' . phpversion()
];

mail($email, $customerSubject, $customerBody, implode("\r\n", $customerHeaders));

// Log the booking
$logEntry = date('Y-m-d H:i:s') . " - New booking #BK-$bookingId: {$firstName} {$lastName} ({$email}) - {$serviceName} on {$formattedDate} at {$formattedTime}\n";
file_put_contents('booking_log.txt', $logEntry, FILE_APPEND | LOCK_EX);

sendResponse(true, 'Booking confirmed successfully!', [
    'bookingId' => 'BK-' . $bookingId,
    'service' => $serviceName,
    'date' => $formattedDate,
    'time' => $formattedTime,
    'therapist' => $therapistName,
    'amount' => $totalAmount
]);
?>
