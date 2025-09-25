-- Database setup script for ZenTouch Massage Services
-- Run this script to create the database and tables

CREATE DATABASE IF NOT EXISTS zentouch_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE zentouch_db;

-- Contacts table for contact form submissions
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
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    INDEX idx_email (email),
    INDEX idx_created_at (created_at),
    INDEX idx_status (status)
);

-- Bookings table for appointment bookings
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_appointment_date (appointment_date),
    INDEX idx_status (status),
    INDEX idx_therapist (therapist)
);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'unsubscribed') DEFAULT 'active',
    INDEX idx_email (email),
    INDEX idx_status (status)
);

-- Services table for managing available services
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    duration INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50),
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_category (category),
    INDEX idx_is_active (is_active)
);

-- Therapists table
CREATE TABLE IF NOT EXISTS therapists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    bio TEXT,
    specialties TEXT,
    experience_years INT,
    certifications TEXT,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_is_available (is_available)
);

-- Insert sample services
INSERT INTO services (name, slug, description, duration, price, category, is_active) VALUES
('Swedish Massage', 'swedish', 'A gentle, relaxing massage using long strokes and kneading techniques', 60, 89.00, 'relaxation', TRUE),
('Deep Tissue Massage', 'deep-tissue', 'Intense massage targeting deep muscle layers and chronic tension', 60, 109.00, 'therapeutic', TRUE),
('Aromatherapy Massage', 'aromatherapy', 'Relaxing massage enhanced with essential oils for mind and body wellness', 75, 119.00, 'relaxation', TRUE),
('Hot Stone Massage', 'hot-stone', 'Therapeutic massage using heated stones to melt away tension', 90, 139.00, 'therapeutic', TRUE),
('Couples Massage', 'couples', 'Side-by-side massage experience for two people', 60, 199.00, 'couples', TRUE),
('Prenatal Massage', 'prenatal', 'Specialized massage for expecting mothers', 60, 99.00, 'specialized', TRUE),
('Sports Massage', 'sports', 'Targeted massage for athletes and active individuals', 60, 119.00, 'therapeutic', TRUE),
('Reflexology', 'reflexology', 'Pressure point massage focusing on feet, hands, and ears', 45, 79.00, 'specialized', TRUE);

-- Insert sample therapists
INSERT INTO therapists (name, slug, bio, specialties, experience_years, certifications, is_available) VALUES
('Sarah Johnson', 'sarah-johnson', 'Licensed massage therapist specializing in Swedish and deep tissue massage', 'Swedish, Deep Tissue, Aromatherapy', 8, 'LMT, Certified Aromatherapist', TRUE),
('Michael Chen', 'michael-chen', 'Sports massage specialist with extensive experience working with athletes', 'Sports Massage, Deep Tissue, Trigger Point', 12, 'LMT, Sports Massage Certified', TRUE),
('Emily Rodriguez', 'emily-rodriguez', 'Prenatal and wellness massage expert', 'Prenatal, Swedish, Hot Stone', 6, 'LMT, Prenatal Massage Certified', TRUE),
('David Thompson', 'david-thompson', 'Therapeutic massage therapist focusing on pain relief and rehabilitation', 'Deep Tissue, Sports, Reflexology', 10, 'LMT, Therapeutic Massage Specialist', TRUE);
