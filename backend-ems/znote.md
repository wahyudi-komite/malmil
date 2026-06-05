===============================
Update Nestjs
===============================
npm install -g @nestjs/cli
nest --version
npm i -g npm-check-updates
ncu -u -f /^@nestjs/
rm package-lock.json
rm -rf node_modules
npm install

===============================
Step Create Apps Backend
===============================

1. npm i --save-dev @swc/cli @swc/core
2. "start:dev": "nest start --builder swc --watch",
3. app.setGlobalPrefix('api-leave/v1/');
4. npm i --save @nestjs/config
5. touch .env
6. npm install --save @nestjs/typeorm typeorm mysql2
7. nest g s common/typeorm --flat
8. "generateOptions": {
   "spec": false
   }
9. Delete App.Controller & App.Services
10. TypeOrmConfigService Configuration
11. npm i --save class-validator class-transformer
12. app.useGlobalPipes(new ValidationPipe());
13. npm i bcrypt
14. npm i -D @types/bcrypt
15. nest g res users
16. nest g s common/abstract --flat --no-spec
17. npm install cookie-parser

- npm i -D @types/cookie-parser

```bash
const port = parseInt(process.env.DATABASE_PORT, 10) || 3001;
app.use(cookieParser());
  app.enableCors({
    origin: process.env.ENV_CORS,
    credentials: true,
  });

```

===============================
Step Create Apps Frontend
===============================

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init

#add to tailwind config.js
"./src/**/*.{html,ts}"

#add to style.scss
@tailwind base;
@tailwind components;
@tailwind utilities;

npm i @material-tailwind/html

import withMT from "@material-tailwind/html/utils/withMT";

module.exports = withMT({
});

# from node_modules
"scripts": ["./node_modules/@material-tailwind/html/scripts/ripple.js"]

# angular.json schematic disable spec
"@schematics/angular:component": {
    "style": "scss",
    "skipTests": true
},
"@schematics/angular:class": {
    "skipTests": true
},
"@schematics/angular:directive": {
    "skipTests": true
},
"@schematics/angular:guard": {
    "skipTests": true
},
"@schematics/angular:interceptor": {
    "skipTests": true
},
"@schematics/angular:pipe": {
    "skipTests": true
},
"@schematics/angular:resolver": {
    "skipTests": true
},
"@schematics/angular:service": {
    "skipTests": true
}

```
