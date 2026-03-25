# Turm20 - World4You Deployment Guide

Complete migration from GitHub Pages + R2 to World4You hosting with MySQL database.

## Was du hast (World4You Webhosting Go / Grow)
- 25GB oder 100GB Webspace
- MySQL Datenbank(en)
- PHP 8.x
- E-Mail

## Dateien hochladen

### 1. Website-Dateien per FTP (FileZilla / WinSCP)

Verbinde mit deinem World4You FTP:
- **Host**: `ftp.your-domain.at` oder `home.your-domain.at`
- **User/Pass**: Aus deinem World4You Kundenportal

**Ordnerstruktur hochladen:**
```
/
├── index.html
├── romeo.html
├── rotkapp.html
├── extras.html
├── turm20.html
├── spenden.html
├── impressum.html
├── datenschutz.html
├── css/
│   ├── style.css
│   └── responsive.css
├── js/
│   ├── script.js
│   ├── pages/
│   │   └── index.js
│   └── content-loader.js
├── img/
│   └── ... (alle Bilder)
├── api/           ← NEU: PHP Backend
│   ├── api.php
│   ├── content.php
│   └── schema.sql
└── uploads/       ← NEU: für Videos
    └── videos/
```

### 2. MySQL Datenbank einrichten

1. **phpMyAdmin öffnen** (World4You Kundenportal → Datenbanken)
2. **Datenbank auswählen** (z.B. `db1234567`)
3. **SQL Tabellen importieren:**
   - Gehe zu "Import"
   - Wähle `api/schema.sql`
   - Klicke "OK"

### 3. PHP Backend konfigurieren

**`api/api.php`** bearbeiten:
```php
$config = [
    'upload_secret' => 'DEIN_SICHERS_SECRET_HIER',  // Wichtig!
    'upload_dir' => 'uploads/videos/',
    'db_host' => 'localhost',
    'db_name' => 'dein_db_name',      // Aus World4You
    'db_user' => 'dein_db_user',      // Aus World4You
    'db_pass' => 'dein_db_pass'       // Aus World4You
];
```

**`api/content.php`** ebenfalls bearbeiten:
```php
$dbConfig = [
    'host' => 'localhost',
    'name' => 'dein_db_name',
    'user' => 'dein_db_user',
    'pass' => 'dein_db_pass'
];
```

### 4. JavaScript URLs anpassen

**`admin/index.html`** (Zeile 335):
```javascript
const API_BASE = 'https://sommertheaterlinz.at/api';  // DEINE DOMAIN
```

**`js/content-loader.js`** (Zeile 6):
```javascript
const API_BASE = 'https://sommertheaterlinz.at/api';  // DEINE DOMAIN
```

## Admin Panel benutzen

**URL**: `https://sommertheaterlinz.at/admin/`

**Login**: Das Secret aus `api.php` → `upload_secret`

**Funktionen:**
- ✅ Termine verwalten (CRUD)
- ✅ Programme verwalten (CRUD)
- ✅ Videos hochladen (max 500MB)
- ✅ Hero Video + Video Grid
- ✅ Änderungen sofort live

## Videos hochladen

Im Admin Panel:
1. Videos Tab → "+ Neues Video" oder "🎬 Hero Video"
2. "📁 Datei auswählen" klicken
3. Video wählen (max 500MB)
4. Titel eingeben
5. Speichern

Das Video wird in `uploads/videos/` gespeichert und automatisch verlinkt.

## Speicherplatz

| Dateityp | Größe | Hinweis |
|----------|-------|---------|
| Website (HTML/CSS/JS) | ~1-2 MB | Minimal |
| Bilder | ~5-10 MB | Komprimierte JPGs |
| Videos | ~1-2 GB | Hauptverbrauch |
| **Gesamt** | **~2-5 GB** | Passt in 25GB |

## Backup

**Datenbank-Backup** (phpMyAdmin):
1. Datenbank auswählen
2. "Export" → "Schnell" → "SQL"
3. Download speichern

**Dateien-Backup**:
- Per FTP alle Dateien herunterladen
- Oder: World4You Webspace-Backup im Kundenportal

## Troubleshooting

**404 Fehler bei API?**
- `.htaccess` Rewrite prüfen:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/(.*)$ api/$1 [L]
```

**Upload zu groß?**
- `php.ini` oder `.htaccess` anpassen:
```apache
php_value upload_max_filesize 500M
php_value post_max_size 500M
```

**Datenbank-Verbindung fehlgeschlagen?**
- DB-Credentials in `api.php` prüfen
- Host oft `localhost`, manchmal `mysql.your-domain.at`

## Vergleich: Vorher vs. Nachher

| Feature | GitHub+R2 | World4You |
|---------|-----------|-----------|
| Hosting | Kostenlos | 4-12 €/Monat |
| CDN | ✅ Ja (schnell) | ❌ Nein |
| Upload | Via Render API | Direkt PHP |
| Datenbank | JSON-Datei | MySQL |
| Videos | R2 (10GB gratis) | Eigener Space |
| Domain | GitHub.io | Eigene Domain |

## Fertig!

Nach dem Upload ist die Website unter `https://sommertheaterlinz.at` erreichbar (oder deine Domain).
