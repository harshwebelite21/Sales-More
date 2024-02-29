# First Stage : to install and build dependencies
FROM node:21.5.0 as builder

# Set to a non-root built-in user `node`
USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# Bundle app source code
COPY --chown=node package.json ./
COPY --chown=node yarn.lock ./
RUN yarn install --frozen-lockfile
COPY --chown=node . .
RUN yarn build

# Second Stage : Setup command to run your app using lightweight node image
FROM node:21.5.0
USER node
WORKDIR /home/node/app

# Copy the dist folder and required folders only
COPY --from=builder --chown=node /home/node/app/node_modules ./node_modules
COPY --from=builder --chown=node /home/node/app/dist ./dist
COPY --from=builder --chown=node /home/node/app/package.json .
COPY --from=builder --chown=node /home/node/app/tsconfig.json .

# Set environment variables
ENV DATABASE_URL=mongodb+srv://harsh:harsh@demoproject.eij1cj6.mongodb.net/ \
    PORT=3000 \
    SECRETKEY=your_secret_key \
    SERVER_URL=https://example.com/

EXPOSE ${PORT}

# Start app
CMD ["yarn", "run", "start"]
