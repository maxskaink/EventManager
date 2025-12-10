# Deployment Guide 

This guide explains how to deploy the application from scratch, how to update it, how to handle common errors, and how to correctly serve images and assets in production.

---

## 1. Connecting to the Server

Access the server via SSH using the assigned private key.

```bash
ssh -i <your-key.pem> user@172.96.136.13
```

If SSH fails:
- Ensure the key has permissions 600.
- Confirm the correct username.
- Verify the server’s firewall allows SSH traffic.
- If “Permission denied”, the key is wrong or the user is incorrect.

---

## 2. Backend Deployment (Laravel)

Once inside the server:

```bash
cd /laravel/backend-laravel
git pull
```

If `git pull` fails:
- Check branch: `git branch`
- If conflict: resolve manually.
- If permission denied: fix permissions with `chmod -R 775 /laravel/backend-laravel`.

Make sure `.env` exists and has correct values.  
If `.env` is missing, copy from `.env.example` and configure it.

Run dependencies:

```bash
composer install --no-dev
```

If composer fails:
- Out of memory → increase memory or use `COMPOSER_MEMORY_LIMIT=-1`.
- Missing PHP extensions → install them through hosting panel.

Run migrations if needed:

```bash
php artisan migrate --force
```

---

## 3. Storage Link (Images Not Loading Fix)

Laravel requires a symbolic link so images stored in `storage/app/public` are available publicly.

Run:

```bash
php artisan storage:link
```

If “The operation failed”:
- Hosting might block symlinks.
- Fix by enabling “FollowSymLinks” or contacting hosting.
- As workaround: manually copy `storage/app/public` to `public/storage`.

Ensure permissions:

```bash
chmod -R 775 storage
chmod -R 775 public/storage
```

If 500 errors occur when accessing images, it's usually permissions.

---

## 4. CORS and HTTPS

Ensure `.env` includes:

```
APP_URL=https://api.cdatosunicauca.org
```

If requests fail with CORS errors:
- Confirm allowed origins in middleware or config/cors.php.
- Clear cache:

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

---

## 5. Frontend Deployment (Vite)

On local machine:

```bash
npm install
npm run build
```

Upload the generated `dist/` folder contents to:

```
public_html/
```

Common errors:
- Blank page → missing `.htaccess` for SPA routing.
- Fix by placing this in `public_html/.htaccess`:

```
FallbackResource /index.html
```

---

## 6. Useful Tips & Common Problems

### 6.1 Laravel showing "Index of /"
Means the server is pointing to wrong directory.  
Fix by setting the document root to `backend-laravel/public` or placing frontend in `public_html`.

### 6.2 API returning 404 in production
- Missing `.htaccess` inside `public/`
- Missing rewrite rules
- Wrong document root
- Clear routes: `php artisan route:clear`

### 6.3 Images Upload but 404 on Access
- Symlink missing → run `storage:link`
- Wrong permissions
- Wrong URL generated → check `APP_URL`

### 6.4 You changed the repository and nothing updates
- Cache: `php artisan optimize:clear`
- Queue workers: restart supervisor if used
- Git pulling wrong branch

---

## 7. Basic Deployment From Zero (Full Recap)

1. Server access via SSH  
2. Clone Laravel project into `/laravel/backend-laravel`  
3. Create `.env`  
4. Run `composer install`  
5. Generate key:  
   ```bash
   php artisan key:generate
   ```  
6. Run migrations & seeders  
7. Configure domain to point to `public/`  
8. Run: `php artisan storage:link`  
9. Set permissions  
10. Upload frontend build to `public_html/`  
11. Test API + images + CORS  

---

## 8. Final Verification Checklist

Backend:
- `/storage` works  
- API responds on HTTPS  
- Policies, gates, and routes loaded  
- No CORS errors  

Frontend:
- Loads without blank screen  
- API calls succeed  
- Assets load correctly  

This concludes the full deployment guide.

