<?php
// Newsletter unsubscribe handler
require_once 'database.php';
require_once 'config.php';

$email = $_GET['email'] ?? '';
$message = '';
$success = false;

if ($email && filter_var($email, FILTER_VALIDATE_EMAIL)) {
    try {
        $db = new Database();
        $pdo = $db->getConnection();
        
        $stmt = $pdo->prepare("UPDATE newsletter_subscribers SET status = 'unsubscribed' WHERE email = ?");
        $result = $stmt->execute([$email]);
        
        if ($result && $stmt->rowCount() > 0) {
            $message = 'You have been successfully unsubscribed from our newsletter.';
            $success = true;
        } else {
            $message = 'Email address not found in our newsletter list.';
        }
    } catch (Exception $e) {
        $message = 'An error occurred. Please try again later.';
        error_log("Unsubscribe error: " . $e->getMessage());
    }
} else {
    $message = 'Invalid email address.';
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unsubscribe - ZenTouch Newsletter</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background: linear-gradient(135deg, #e91e63, #f06292); min-height: 100vh; }
        .card { border-radius: 20px; box-shadow: 0 20px 60px rgba(233, 30, 99, 0.2); }
    </style>
</head>
<body class="d-flex align-items-center">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body text-center p-5">
                        <div class="mb-4">
                            <i class="fas fa-spa fa-3x text-primary"></i>
                            <h2 class="mt-3">ZenTouch Newsletter</h2>
                        </div>
                        
                        <div class="alert alert-<?php echo $success ? 'success' : 'warning'; ?>">
                            <?php echo htmlspecialchars($message); ?>
                        </div>
                        
                        <?php if ($success): ?>
                            <p>We're sorry to see you go! If you change your mind, you can always resubscribe on our website.</p>
                        <?php endif; ?>
                        
                        <a href="../index.html" class="btn btn-primary mt-3">
                            <i class="fas fa-home me-2"></i>Back to Website
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"></script>
</body>
</html>
