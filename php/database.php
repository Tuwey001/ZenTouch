<?php
// Database configuration and connection
class Database {
    private $host = 'localhost';
    private $dbname = 'zentouch_db';
    private $username = 'your_username'; // Change this
    private $password = 'your_password'; // Change this
    private $pdo;
    
    public function __construct() {
        $this->connect();
    }
    
    private function connect() {
        try {
            $dsn = "mysql:host={$this->host};dbname={$this->dbname};charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            
            $this->pdo = new PDO($dsn, $this->username, $this->password, $options);
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            throw new Exception("Database connection failed");
        }
    }
    
    public function getConnection() {
        return $this->pdo;
    }
    
    // Create tables if they don't exist
    public function createTables() {
        $sql = "
        CREATE TABLE IF NOT EXISTS contacts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            subject VARCHAR(100) NOT NULL,
            preferred_service VARCHAR(100),
            message TEXT NOT NULL,
            newsletter BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status ENUM('new', 'read', 'replied') DEFAULT 'new'
        );
        
        CREATE TABLE IF NOT EXISTS bookings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            service VARCHAR(100) NOT NULL,
            therapist VARCHAR(100),
            appointment_date DATE NOT NULL,
            appointment_time TIME NOT NULL,
            duration INT NOT NULL,
            special_requests TEXT,
            payment_method VARCHAR(50),
            total_amount DECIMAL(10,2),
            status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            first_name VARCHAR(100),
            last_name VARCHAR(100),
            subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status ENUM('active', 'unsubscribed') DEFAULT 'active'
        );
        ";
        
        try {
            $this->pdo->exec($sql);
            return true;
        } catch (PDOException $e) {
            error_log("Table creation failed: " . $e->getMessage());
            return false;
        }
    }
    
    // Insert contact form submission
    public function insertContact($data) {
        $sql = "INSERT INTO contacts (first_name, last_name, email, phone, subject, preferred_service, message, newsletter) 
                VALUES (:first_name, :last_name, :email, :phone, :subject, :preferred_service, :message, :newsletter)";
        
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                ':first_name' => $data['firstName'],
                ':last_name' => $data['lastName'],
                ':email' => $data['email'],
                ':phone' => $data['phone'],
                ':subject' => $data['subject'],
                ':preferred_service' => $data['preferredService'],
                ':message' => $data['message'],
                ':newsletter' => $data['newsletter'] ? 1 : 0
            ]);
            
            return $this->pdo->lastInsertId();
        } catch (PDOException $e) {
            error_log("Contact insertion failed: " . $e->getMessage());
            throw new Exception("Failed to save contact information");
        }
    }
    
    // Insert booking
    public function insertBooking($data) {
        $sql = "INSERT INTO bookings (first_name, last_name, email, phone, service, therapist, appointment_date, appointment_time, duration, special_requests, payment_method, total_amount) 
                VALUES (:first_name, :last_name, :email, :phone, :service, :therapist, :appointment_date, :appointment_time, :duration, :special_requests, :payment_method, :total_amount)";
        
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                ':first_name' => $data['firstName'],
                ':last_name' => $data['lastName'],
                ':email' => $data['email'],
                ':phone' => $data['phone'],
                ':service' => $data['service'],
                ':therapist' => $data['therapist'],
                ':appointment_date' => $data['appointmentDate'],
                ':appointment_time' => $data['appointmentTime'],
                ':duration' => $data['duration'],
                ':special_requests' => $data['specialRequests'],
                ':payment_method' => $data['paymentMethod'],
                ':total_amount' => $data['totalAmount']
            ]);
            
            return $this->pdo->lastInsertId();
        } catch (PDOException $e) {
            error_log("Booking insertion failed: " . $e->getMessage());
            throw new Exception("Failed to save booking information");
        }
    }
    
    // Subscribe to newsletter
    public function subscribeNewsletter($email, $firstName = '', $lastName = '') {
        $sql = "INSERT INTO newsletter_subscribers (email, first_name, last_name) 
                VALUES (:email, :first_name, :last_name) 
                ON DUPLICATE KEY UPDATE 
                first_name = VALUES(first_name), 
                last_name = VALUES(last_name), 
                status = 'active'";
        
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                ':email' => $email,
                ':first_name' => $firstName,
                ':last_name' => $lastName
            ]);
            
            return true;
        } catch (PDOException $e) {
            error_log("Newsletter subscription failed: " . $e->getMessage());
            return false;
        }
    }
}
?>
