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
