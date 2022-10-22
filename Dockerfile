FROM node:18 AS base

WORKDIR /app

FROM base as workspace
COPY . .
RUN  yarn

FROM workspace AS center-builder
RUN  yarn workspace @remotex/center build

FROM base AS center
COPY --from=center-builder /app/packages/center/lib          /app/lib
COPY --from=center-builder /app/packages/center/public       /app/public
COPY --from=center-builder /app/packages/center/package.json /app/package.json
RUN  yarn --production
CMD  yarn start
