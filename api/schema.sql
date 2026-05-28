-- Turm20 CMS Database Schema for World4You MySQL
-- Run this in phpMyAdmin or MySQL CLI to create tables

CREATE TABLE IF NOT EXISTS `termine` (
    `id` VARCHAR(50) PRIMARY KEY,
    `day_name` VARCHAR(20) NOT NULL,
    `date_str` VARCHAR(10) NOT NULL,
    `time_str` VARCHAR(20) DEFAULT '',
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
('rotkapp', 'Rotkäppchen', 'Das beliebte Märchen für die ganze Familie', 'rotkaeppchen.html'),
('extras', 'Extras', 'Konzerte, Lesungen & mehr', 'extras.html');

-- Insert correct termine for Sommertheater 2026
INSERT IGNORE INTO `termine` (`id`, `day_name`, `date_str`, `time_str`, `title`, `ticket_url`, `sold_out`) VALUES
('t0',  'Freitag',    '19.06.', '18:30 Uhr', 'Secret Sounds - Turm 20',                   'https://kupfticket.com/events/secret-sounds-turm-20', 0),
('t00', 'Freitag',    '20.06.', '19:30 Uhr', 'Facetas Flamencas',                          'https://www.flamenco-linz.at/auftritte/', 0),
('t1',  'Mittwoch',   '01.07.', '19:30 Uhr', 'Romeo & Julia',                             'https://kupfticket.com/events/romeoundjulia-9365a54ace', 0),
('t2',  'Donnerstag', '02.07.', '19:30 Uhr', 'Romeo & Julia',                             'https://kupfticket.com/events/romeoundjulia-111549850d', 0),
('t3',  'Freitag',    '03.07.', '19:30 Uhr', 'Romeo & Julia',                             'https://kupfticket.com/events/romeoundjulia-cfb9e9b6ca', 0),
('t4',  'Sonntag',    '05.07.', '19:30 Uhr', 'Romeo & Julia',                             'https://kupfticket.com/events/romeoundjulia-ad3a8f4fb5', 0),
('t5',  'Mittwoch',   '08.07.', '19:30 Uhr', 'Romeo & Julia',                             'https://kupfticket.com/events/romeoundjulia-31bb0b0ea3', 0),
('t6',  'Donnerstag', '09.07.', '19:30 Uhr', 'Romeo & Julia',                             'https://kupfticket.com/events/romeoundjulia-25504065c5', 0),
('t7',  'Freitag',    '10.07.', '19:30 Uhr', 'Romeo & Julia',                             'https://kupfticket.com/events/romeoundjulia-12ffd7834f', 0),
('t8',  'Samstag',    '11.07.', '19:30 Uhr', 'Romeo & Julia',                             'https://kupfticket.com/events/romeoundjulia-c8ad7199d9', 0),
('t9',  'Donnerstag', '16.07.', '19:30 Uhr', 'Romeo & Julia',                             'https://kupfticket.com/events/romeoundjulia-9b4c08d34f', 0),
('t10', 'Freitag',    '17.07.', '19:30 Uhr', 'Romeo & Julia',                             'https://kupfticket.com/events/romeoundjulia-4ebf8ded9b', 0),
('t11', 'Samstag',    '18.07.', '19:30 Uhr', 'Romeo & Julia',                             'https://kupfticket.com/events/romeoundjulia-d3049e84c4', 0),
('t12', 'Donnerstag', '23.07.', '16:00 Uhr', 'Rotkäppchen am Turm',                       'https://kupfticket.com/events/junges-obst-turm20-rotkaeppchen-am-turm-57cee13dec', 0),
('t13', 'Donnerstag', '23.07.', '18:00 Uhr', 'Rotkäppchen am Turm',                       'https://kupfticket.com/events/junges-obst-turm20-rotkaeppchen-am-turm-57cee13dec', 0),
('t14', 'Freitag',    '24.07.', '16:00 Uhr', 'Rotkäppchen am Turm',                       'https://kupfticket.com/events/junges-obst-turm20-rotkaeppchen-am-turm-93c4a86893', 0),
('t15', 'Freitag',    '24.07.', '18:00 Uhr', 'Rotkäppchen am Turm',                       'https://kupfticket.com/events/junges-obst-turm20-rotkaeppchen-am-turm-9be0dbb760', 0),
('t16', 'Samstag',    '25.07.', '16:00 Uhr', 'Rotkäppchen am Turm',                       'https://kupfticket.com/events/junges-obst-turm20-rotkaeppchen-am-turm-f100c46606', 0),
('t17', 'Samstag',    '25.07.', '18:00 Uhr', 'Rotkäppchen am Turm',                       'https://kupfticket.com/events/junges-obst-turm20-rotkaeppchen-am-turm-3c7b221d8b', 0),
('t18', 'Sonntag',    '26.07.', '11:00 Uhr', 'Rotkäppchen am Turm',                       'https://kupfticket.com/events/junges-obst-turm20-rotkaeppchen-am-turm-da663f2fc3', 0),
('t19', 'Sonntag',    '26.07.', '16:00 Uhr', 'Rotkäppchen am Turm',                       'https://kupfticket.com/events/junges-obst-turm20-rotkaeppchen-am-turm-cc26db1481', 0);

-- Insert sample hero video (you can change this via admin panel)
-- Note: Replace 'videos/hero-video.mp4' with your actual video path after uploading
INSERT IGNORE INTO `videos` (`id`, `title`, `subtitle`, `url`, `is_hero`, `sort_order`) VALUES
('hero-1', 'Turm 20', 'Theater & Kulturverein · Linz', 'videos/hero-video.mp4', 1, 0);
