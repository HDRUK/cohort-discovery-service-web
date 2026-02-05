FROM node:24.12.0-alpine

RUN mkdir -p /usr/src
WORKDIR /usr/src

COPY package*.json ./

# IMPORTANT: do NOT set production yet
ENV NODE_ENV=development
ENV WATCHPACK_POLLING true
ENV NEXT_WEBPACK_USEPOLLING true

ARG API_BASE_URL
ARG NEXT_PUBLIC_LOGIN_URL
ARG NEXT_PUBLIC_USE_DEBUG_LOGS
ARG NEXT_PUBLIC_TASK_URL
ARG NEXT_PUBLIC_USE_EXAMPLE_QUERY
ARG APPLICATION_MODE

RUN npm install

COPY . /usr/src
# Now switch to production for runtime
ENV NODE_ENV=production

RUN npm run build

EXPOSE 3000
CMD npm run start
