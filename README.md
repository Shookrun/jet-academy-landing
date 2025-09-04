# JET School website build steps


## Build steps for frontend

1. Install dependencies
```bash
npm install
```
2. Build the project
```bash
npm run build
```
3. Run the project
```bash
npm run start
```
4. BE SURE TO NOT COMMIT THE DIST FOLDER, AND IF YOU WILL HAVE A TYPESCRIPT ERROR, YOUR APP WILL NOT RUN
5. If you want to run the project in production mode, run the following command

```bash
npm run start
```


## Build steps for backend NESTJS

1. Install dependencies
```bash
npm install
```
2. Generate the Prisma client
```bash
npx prisma generate
```
3. Run the project
```bash
npm run start:dev
```

## Deploy steps

1. Build the frontend
2. Connect to the server via SSH
3. Navigate to the project directory
4. copy .next folder to the server

# JetSchool PM2 İdarəetmə Əmrləri

## Tətbiqləri Başlatma Əmrləri

### Backend Tətbiqini Başlatmaq Üçün

```bash
cd /www/jet-school-landing/api
pm2 start npm --name "jetschool-back" -- run start:prod
```

### Frontend Tətbiqini Başlatmaq Üçün

```bash
cd /www/jet-school-landing/client
pm2 start npm --name "jetschool-front" -- run start -- --port 3001
```

## PM2 İdarəetmə Əmrləri

### Tətbiqləri Dayandırmaq

```bash
# Backend tətbiqini dayandırmaq
pm2 stop jetschool-back

# Frontend tətbiqini dayandırmaq
pm2 stop jetschool-front

# Bütün PM2 proseslərini dayandırmaq
pm2 stop all
```

### Tətbiqləri Yenidən Başlatmaq

```bash
# Backend tətbiqini yenidən başlatmaq
pm2 restart jetschool-back

# Frontend tətbiqini yenidən başlatmaq
pm2 restart jetschool-front

# Bütün PM2 proseslərini yenidən başlatmaq
pm2 restart all
```

### Tətbiqləri Silmək

```bash
# Backend tətbiqini silmək
pm2 delete jetschool-back

# Frontend tətbiqini silmək
pm2 delete jetschool-front

# Bütün PM2 proseslərini silmək
pm2 delete all
```

### Log Fayllarını İzləmək

```bash
# Backend loglarını izləmək
pm2 logs jetschool-back

# Frontend loglarını izləmək
pm2 logs jetschool-front

# Bütün logları izləmək
pm2 logs
```

### Status Yoxlamaq

```bash
# Bütün proseslərin statusunu göstərmək
pm2 list
```

### PM2 İdarəedicisini Monitorda İzləmək

```bash
pm2 monit
```

### Server Yenidən Başladıqdan Sonra Avtomatik Başlatma

```bash
# Cari prosesləri yadda saxlamaq
pm2 save

# PM2 avtomatik başlatmanı quraşdırmaq
pm2 startup
```

## Tətbiqləri Yenidən Qurduqdan Sonra İşə Salmaq

Əgər serverə yeni kod göndərildiyi halda və ya tətbiqləri sildikdən sonra yenidən qurmaq lazımdırsa:

1. Köhnə PM2 proseslərini silin:
```bash
pm2 delete all
```

2. Əvvəlcə backend tətbiqini işə salın:
```bash
cd /var/www/jetschool_az_usr/data/www/jet-school-landing/server
pm2 start npm --name "jetschool-back" -- run start:prod
```

3. Sonra frontend tətbiqini işə salın:
```bash
cd /var/www/jetschool_az_usr/data/www/jet-school-landing/client
pm2 start npm --name "jetschool-front" -- run start -- --port 3001
```

4. Cari konfiqurasiyanı yadda saxlayın:
```bash
pm2 save