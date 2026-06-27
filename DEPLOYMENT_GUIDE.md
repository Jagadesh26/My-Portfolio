# Deployment Guide for Jagadesh Portfolio

## ✅ Configuration Status

Your Django portfolio is now **production-ready** with the following security improvements:

### Security Fixes Applied:
1. ✅ **SECRET_KEY** - Now loaded from environment variable (no longer hardcoded)
2. ✅ **DEBUG** - Set to `False` for production
3. ✅ **ALLOWED_HOSTS** - Configured to only allow your domains
4. ✅ **Security Headers** - Added SSL redirect, HSTS, secure cookies
5. ✅ **Database Migrations** - Applied successfully
6. ✅ **Contact Form** - Database table created and working

## 🚀 Deployment Steps

### 1. Update ALLOWED_HOSTS
In your `.env` file, update the `ALLOWED_HOSTS` to match your actual domain:

```env
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
```

### 2. Build and Deploy with Docker

```bash
# Build the Docker image
docker build -t jagadesh-portfolio .

# Run the container
docker run -d -p 8000:8000 --env-file .env jagadesh-portfolio
```

### 3. Deploy to Captain (CapRover)

Your project already includes a `captain-definition` file, so you can:

1. Push your code to a Git repository
2. In CapRover dashboard, connect your Git repo
3. Deploy - CapRover will automatically use the Dockerfile

### 4. Deploy to Other Platforms

#### Railway.app
1. Connect your GitHub repository
2. Set environment variables from your `.env` file
3. Deploy

#### Heroku
```bash
heroku create your-app-name
heroku config:set SECRET_KEY="your-secret-key"
heroku config:set DATABASE_URL="your-database-url"
heroku config:set DEBUG=False
heroku config:set ALLOWED_HOSTS="your-domain.com,www.your-domain.com"
git push heroku main
heroku run python manage.py migrate
```

#### AWS/Azure/GCP
Use the Dockerfile to deploy to any container service.

## 🔐 Environment Variables Required

Make sure these are set in your deployment environment:

| Variable | Description | Example |
|----------|-------------|---------|
| `SECRET_KEY` | Django secret key | `+ql2prwe2_ee7(&)q3*hl7bdbyhv1^p6#9)15fv79vz7rx1px8` |
| `DEBUG` | Debug mode | `False` |
| `ALLOWED_HOSTS` | Allowed domains | `your-domain.com,www.your-domain.com` |
| `DATABASE_URL` | PostgreSQL connection | `postgresql://user:pass@host:port/db` |
| `EMAIL_HOST_USER` | Gmail address | `your-email@gmail.com` |
| `EMAIL_HOST_PASSWORD` | Gmail app password | `xxxx xxxx xxxx xxxx` |

## 📧 Email Configuration

The contact form uses Gmail SMTP. Make sure to:

1. Use an **App Password** (not your regular password)
2. Generate one at: https://myaccount.google.com/apppasswords
3. Enable 2-factor authentication on your Gmail account

## 🗄️ Database

Your app is configured to use **Neon PostgreSQL**. The connection is already set up in your `.env` file.

### Database Migrations
Migrations are automatically run during Docker build. For manual updates:

```bash
docker exec -it <container-id> python manage.py migrate
```

## 📁 Static Files

WhiteNoise is configured to serve static files in production. No need for a separate web server.

## 🔍 Testing Your Deployment

1. Visit your domain: `https://your-domain.com`
2. Test the contact form
3. Check Django admin: `https://your-domain.com/admin`
4. Verify HTTPS is working (should redirect HTTP → HTTPS)

## 🛠️ Troubleshooting

### Contact Form Not Working?
- Check email credentials in `.env`
- Verify database connection
- Check logs: `docker logs <container-id>`

### Static Files Not Loading?
- Ensure `collectstatic` ran during build
- Check WhiteNoise middleware is loaded

### Database Errors?
- Verify `DATABASE_URL` is correct
- Ensure SSL mode is set to `require`
- Check Neon dashboard for connection issues

## 📝 Important Notes

- **Never commit your `.env` file** - it's in `.gitignore` for a reason
- Use `.env.example` as a template for setting up new environments
- Keep your SECRET_KEY secret - regenerate if it's ever exposed
- Regularly update your dependencies: `pip install --upgrade -r requirements.txt`

## 🎯 Next Steps

1. Set up a custom domain
2. Configure SSL certificate (CapRover does this automatically)
3. Set up monitoring/logging
4. Configure backups for your database
5. Set up CI/CD for automated deployments

---

**Your portfolio is now ready for production deployment! 🚀**