-- Turm20 CMS Database Schema for World4You MySQL
-- Run this in phpMyAdmin or MySQL CLI to create tables

CREATE TABLE IF NOT EXISTS `termine` (
    `id` VARCHAR(50) PRIMARY KEY,
    `day_name` VARCHAR(20) NOT NULL,
    `date_str` VARCHAR(10) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `ticket_url` VARCHAR(500) NOT NULL,
    `sold_out` TINYINT(1) DEFAULT 0,
    INDEX `date_str` (`date_str`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `programs` (
    `id` VARCHAR(50) PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `subtitle` VARCHAR(255),
    `url` VARCHAR(255) NOT NULL,
    INDEX `title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `videos` (
    `id` VARCHAR(50) PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `subtitle` VARCHAR(255),
    `url` VARCHAR(500) NOT NULL,
    `is_hero` TINYINT(1) DEFAULT 0,
    `sort_order` INT DEFAULT 0,
    INDEX `is_hero` (`is_hero`),
    INDEX `sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default programs (optional - you can manage via admin panel)
INSERT IGNORE INTO `programs` (`id`, `title`, `subtitle`, `url`) VALUES
('romeo', 'Romeo & Julia', 'Shakespeare\'s zeitlose Liebesgeschichte', 'romeo.html'),
('rotkapp', 'Rotkäppchen', 'Das beliebte Märchen für die ganze Familie', 'rotkapp.html'),
('extras', 'Extras', 'Konzerte, Lesungen & mehr', 'extras.html');

-- Insert correct termine for Sommertheater 2026
INSERT IGNORE INTO `termine` (`id`, `day_name`, `date_str`, `title`, `ticket_url`, `sold_out`) VALUES
('t1', 'Mittwoch', '01.07.', 'Romeo & Julia', 'https://kupfticket.com/events/romeoundjulia-9365a54ace', 0),
('t2', 'Donnerstag', '02.07.', 'Romeo & Julia', 'https://kupfticket.com/events/romeoundjulia-111549850d', 0),
('t3', 'Freitag', '03.07.', 'Romeo & Julia', 'https://kupfticket.com/events/romeoundjulia-cfb9e9b6ca', 0),
('t4', 'Sonntag', '05.07.', 'Romeo & Julia', 'https://kupfticket.com/events/romeoundjulia-ad3a8f4fb5', 0),
('t5', 'Mittwoch', '08.07.', 'Romeo & Julia', 'https://kupfticket.com/events/romeoundjulia-31bb0b0ea3', 0),
('t6', 'Donnerstag', '09.07.', 'Romeo & Julia', 'https://kupfticket.com/events/romeoundjulia-25504065c5', 0),
('t7', 'Freitag', '10.07.', 'Romeo & Julia', 'https://kupfticket.com/events/romeoundjulia-12ffd7834f', 0),
('t8', 'Samstag', '11.07.', 'Romeo & Julia', 'https://kupfticket.com/events/romeoundjulia-c8ad7199d9', 0);

-- Insert sample hero video (you can change this via admin panel)
-- Note: Replace 'videos/hero-video.mp4' with your actual video path after uploading
INSERT IGNORE INTO `videos` (`id`, `title`, `subtitle`, `url`, `is_hero`, `sort_order`) VALUES
('hero-1', 'Turm 20', 'Theater & Kulturverein · Linz', 'videos/hero-video.mp4', 1, 0);
