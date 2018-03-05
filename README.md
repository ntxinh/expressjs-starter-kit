[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# STACK

- Node.js / Express.js
- MongoDB / Mongoose
- JWT
- [JavaScript Standard Style Guide](https://standardjs.com/)

---
# HOW TO RUN

- Copy `variables.env.sample` to `variables.env` & custom it

```bash
npm start

// or

npm run watch
```

- Data sample:
```bash
npm run seed

npm run seed:delete

npm run seed:refresh
```

- Lint:
```bash
npm run lint
```

# ROUTES / API
-  Root url:
```bash
curl -X GET \
  http://localhost:3000/
```

- API Authenticate:
```bash
curl -X POST \
  http://localhost:3000/api/authenticate \
  -H 'content-type: application/json' \
  -d '{
	"email": "xinh@mail.com",
	"password": "123456"
}'
```

- API Get users:
```bash
curl -X GET \
  http://localhost:3000/api/users \
  -H 'authorization: Bearer {{YOUR_TOKEN}}'
```

- API Sign up:
```bash
curl -X POST \
  http://localhost:3000/api/sign-up \
  -H 'content-type: application/json' \
  -d '{
	"name": "Mail1",
	"email": "mail1@mail.com",
	"password": "123456"
}'
```

- API Confirm sign up:
```bash
curl -X GET \
  'http://localhost:3000/api/confirm-sign-up?token={{YOUR_TOKEN}}'
```

- API Test axios:
```bash
curl -X GET \
  http://localhost:3000/api/test-axios \
  -H 'authorization: Bearer {{YOUR_TOKEN}}'
```

- API Forgot password:
```bash
curl -X POST \
  http://localhost:3000/api/forgot-password \
  -H 'content-type: application/json' \
  -d '{
	"email": "xinh@mail.com"
}'
```

- API Confirm reset password:
```bash
curl -X GET \
  'http://localhost:3000/api/confirm-resest-password?token={{YOUR_TOKEN}}'
```

- API Get user current:
```bash
curl -X GET \
  http://localhost:3000/api/get-user-current \
  -H 'authorization: Bearer {{YOUR_TOKEN}}'
```

---
# REFERENCES
