# syntax=docker/dockerfile:1

# ---- deps: install exact dependencies from the lockfile ----
FROM node:24.22-alpine3.24 AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .

# ---- verify: typecheck + lint + format + tests; a failing check aborts the build ----
FROM deps AS verify
RUN npm run verify && touch /tmp/verified

# ---- build: produce the static bundle (depends on verify having passed) ----
FROM deps AS build
COPY --from=verify /tmp/verified /tmp/verified
RUN npm run build

# ---- runtime: static files served by unprivileged nginx ----
FROM nginx:1.30.6-alpine3.24 AS runtime
RUN rm -f /etc/nginx/conf.d/default.conf \
    && chown -R nginx:nginx /var/cache/nginx /var/run /var/log/nginx \
    && touch /var/run/nginx.pid && chown nginx:nginx /var/run/nginx.pid
COPY nginx.conf /etc/nginx/conf.d/app.conf
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html
USER nginx
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8080/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
