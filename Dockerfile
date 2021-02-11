FROM node:14 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN ["npm", "ci", "--only=production"]
COPY src/ ./

FROM gcr.io/distroless/nodejs:14
WORKDIR /app
COPY --from=build /usr/src/app ./
EXPOSE 3000
CMD ["app.js"]
