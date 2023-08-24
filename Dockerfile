FROM node:18-alpine3.17
WORKDIR /app
COPY package*.json ./
COPY . .

# Install Packages
RUN npm install

CMD [ "npm", "start" ]
