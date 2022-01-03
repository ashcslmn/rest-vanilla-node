# rest-vanilla-node

### Preparations
1. Install Dependencies
```bash
npm install
```
2. Configs
```bash
cp env.example .env
cp config/database.example.json config/database.json
```
3. Prepare Databases
```
npx sequelize-cli db:create; NODE_ENV=test npx sequelize-cli db:create 
```
4. add JWT_SECRET for the simple Auth. You can generate JWT_SECRET using node `crypto`
```bash
> require("crypto").randomBytes(20).toString('hex');
```

### Run locally
```
npm run start
```

### Run test
```
npm run test
```
