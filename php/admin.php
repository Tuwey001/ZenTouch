<?php
// Simple admin dashboard for viewing bookings and contacts
require_once 'database.php';
require_once 'config.php';

// Simple authentication (in production, use proper session management)
session_start();

if (!isset($_SESSION['admin_logged_in'])) {
    if (isset($_POST['password']) && $_POST['password'] === 'zentouch2025') { // Change this password
        $_SESSION['admin_logged_in'] = true;
    } else {
        showLoginForm();
        exit;
    }
}

function showLoginForm() {
    echo '
    <!DOCTYPE html>
    <html>
    <head>
        <title>ZenTouch Admin</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="bg-light">
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title text-center">Admin Login</h5>
                            <form method="post">
                                <div class="mb-3">
                                    <label class="form-label">Password</label>
                                    <input type="password" class="form-control" name="password" required>
                                </div>
                                <button type="submit" class="btn btn-primary w-100">Login</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>';
}

try {
    $db = new Database();
    $pdo = $db->getConnection();
} catch (Exception $e) {
    die('Database connection failed');
}

// Handle actions
$action = $_GET['action'] ?? 'dashboard';

switch ($action) {
    case 'bookings':
        showBookings($pdo);
        break;
    case 'contacts':
        showContacts($pdo);
        break;
    case 'newsletter':
        showNewsletter($pdo);
        break;
    case 'logout':
        session_destroy();
        header('Location: admin.php');
        break;
    default:
        showDashboard($pdo);
}

function showDashboard($pdo) {
    // Get statistics
    $bookingsToday = $pdo->query("SELECT COUNT(*) FROM bookings WHERE DATE(appointment_date) = CURDATE()")->fetchColumn();
    $totalBookings = $pdo->query("SELECT COUNT(*) FROM bookings")->fetchColumn();
    $totalContacts = $pdo->query("SELECT COUNT(*) FROM contacts")->fetchColumn();
    $newsletterSubs = $pdo->query("SELECT COUNT(*) FROM newsletter_subscribers WHERE status = 'active'")->fetchColumn();
    
    echo '
    <!DOCTYPE html>
    <html>
    <head>
        <title>ZenTouch Admin Dashboard</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    </head>
    <body>
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <div class="container">
                <a class="navbar-brand" href="admin.php">ZenTouch Admin</a>
                <div class="navbar-nav ms-auto">
                    <a class="nav-link" href="admin.php?action=logout">Logout</a>
                </div>
            </div>
        </nav>
        
        <div class="container mt-4">
            <div class="row">
                <div class="col-md-3 mb-4">
                    <div class="card text-white bg-primary">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h4>' . $bookingsToday . '</h4>
                                    <p>Today\'s Bookings</p>
                                </div>
                                <i class="fas fa-calendar-day fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-3 mb-4">
                    <div class="card text-white bg-success">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h4>' . $totalBookings . '</h4>
                                    <p>Total Bookings</p>
                                </div>
                                <i class="fas fa-spa fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-3 mb-4">
                    <div class="card text-white bg-info">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h4>' . $totalContacts . '</h4>
                                    <p>Contact Messages</p>
                                </div>
                                <i class="fas fa-envelope fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-3 mb-4">
                    <div class="card text-white bg-warning">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h4>' . $newsletterSubs . '</h4>
                                    <p>Newsletter Subscribers</p>
                                </div>
                                <i class="fas fa-users fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-4 mb-3">
                    <a href="admin.php?action=bookings" class="btn btn-primary btn-lg w-100">
                        <i class="fas fa-calendar-alt me-2"></i>View Bookings
                    </a>
                </div>
                <div class="col-md-4 mb-3">
                    <a href="admin.php?action=contacts" class="btn btn-info btn-lg w-100">
                        <i class="fas fa-envelope me-2"></i>View Contacts
                    </a>
                </div>
                <div class="col-md-4 mb-3">
                    <a href="admin.php?action=newsletter" class="btn btn-warning btn-lg w-100">
                        <i class="fas fa-users me-2"></i>Newsletter Subscribers
                    </a>
                </div>
            </div>
        </div>
    </body>
    </html>';
}

function showBookings($pdo) {
    $bookings = $pdo->query("SELECT * FROM bookings ORDER BY appointment_date DESC, appointment_time DESC")->fetchAll();
    
    echo '
    <!DOCTYPE html>
    <html>
    <head>
        <title>Bookings - ZenTouch Admin</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <div class="container">
                <a class="navbar-brand" href="admin.php">ZenTouch Admin</a>
                <div class="navbar-nav ms-auto">
                    <a class="nav-link" href="admin.php">Dashboard</a>
                    <a class="nav-link" href="admin.php?action=logout">Logout</a>
                </div>
            </div>
        </nav>
        
        <div class="container mt-4">
            <h2>Bookings</h2>
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Client</th>
                            <th>Service</th>
                            <th>Date & Time</th>
                            <th>Therapist</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Payment</th>
                        </tr>
                    </thead>
                    <tbody>';
    
    foreach ($bookings as $booking) {
        $statusClass = [
            'pending' => 'warning',
            'confirmed' => 'success',
            'completed' => 'primary',
            'cancelled' => 'danger'
        ][$booking['status']] ?? 'secondary';
        
        echo '<tr>
                <td>BK-' . $booking['id'] . '</td>
                <td>' . htmlspecialchars($booking['first_name'] . ' ' . $booking['last_name']) . '<br>
                    <small>' . htmlspecialchars($booking['email']) . '</small></td>
                <td>' . htmlspecialchars($booking['service']) . '</td>
                <td>' . date('M j, Y', strtotime($booking['appointment_date'])) . '<br>' . 
                    date('g:i A', strtotime($booking['appointment_time'])) . '</td>
                <td>' . htmlspecialchars($booking['therapist'] ?: 'No preference') . '</td>
                <td>$' . number_format($booking['total_amount'], 2) . '</td>
                <td><span class="badge bg-' . $statusClass . '">' . ucfirst($booking['status']) . '</span></td>
                <td>' . ucwords(str_replace('-', ' ', $booking['payment_method'])) . '</td>
              </tr>';
    }
    
    echo '      </tbody>
                </table>
            </div>
        </div>
    </body>
    </html>';
}

function showContacts($pdo) {
    $contacts = $pdo->query("SELECT * FROM contacts ORDER BY created_at DESC")->fetchAll();
    
    echo '
    <!DOCTYPE html>
    <html>
    <head>
        <title>Contacts - ZenTouch Admin</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <div class="container">
                <a class="navbar-brand" href="admin.php">ZenTouch Admin</a>
                <div class="navbar-nav ms-auto">
                    <a class="nav-link" href="admin.php">Dashboard</a>
                    <a class="nav-link" href="admin.php?action=logout">Logout</a>
                </div>
            </div>
        </nav>
        
        <div class="container mt-4">
            <h2>Contact Messages</h2>
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Subject</th>
                            <th>Message</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>';
    
    foreach ($contacts as $contact) {
        $statusClass = [
            'new' => 'warning',
            'read' => 'info',
            'replied' => 'success'
        ][$contact['status']] ?? 'secondary';
        
        echo '<tr>
                <td>' . $contact['id'] . '</td>
                <td>' . htmlspecialchars($contact['first_name'] . ' ' . $contact['last_name']) . '<br>
                    <small>' . htmlspecialchars($contact['email']) . '</small></td>
                <td>' . htmlspecialchars($contact['subject']) . '</td>
                <td>' . htmlspecialchars(substr($contact['message'], 0, 100)) . '...</td>
                <td>' . date('M j, Y g:i A', strtotime($contact['created_at'])) . '</td>
                <td><span class="badge bg-' . $statusClass . '">' . ucfirst($contact['status']) . '</span></td>
              </tr>';
    }
    
    echo '      </tbody>
                </table>
            </div>
        </div>
    </body>
    </html>';
}

function showNewsletter($pdo) {
    $subscribers = $pdo->query("SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC")->fetchAll();
    
    echo '
    <!DOCTYPE html>
    <html>
    <head>
        <title>Newsletter - ZenTouch Admin</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <div class="container">
                <a class="navbar-brand" href="admin.php">ZenTouch Admin</a>
                <div class="navbar-nav ms-auto">
                    <a class="nav-link" href="admin.php">Dashboard</a>
                    <a class="nav-link" href="admin.php?action=logout">Logout</a>
                </div>
            </div>
        </nav>
        
        <div class="container mt-4">
            <h2>Newsletter Subscribers</h2>
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Subscribed</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>';
    
    foreach ($subscribers as $subscriber) {
        $statusClass = $subscriber['status'] === 'active' ? 'success' : 'secondary';
        
        echo '<tr>
                <td>' . $subscriber['id'] . '</td>
                <td>' . htmlspecialchars(($subscriber['first_name'] . ' ' . $subscriber['last_name']) ?: 'N/A') . '</td>
                <td>' . htmlspecialchars($subscriber['email']) . '</td>
                <td>' . date('M j, Y', strtotime($subscriber['subscribed_at'])) . '</td>
                <td><span class="badge bg-' . $statusClass . '">' . ucfirst($subscriber['status']) . '</span></td>
              </tr>';
    }
    
    echo '      </tbody>
                </table>
            </div>
        </div>
    </body>
    </html>';
}
?>
