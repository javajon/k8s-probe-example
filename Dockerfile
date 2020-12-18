FROM node:14 AS build
WORKDIR /usr/src/app
COPY src/ ./
COPY package*.json ./
RUN ["npm", "install"]

FROM gcr.io/distroless/nodejs:14
WORKDIR /app
COPY --from=build /usr/src/app ./
EXPOSE 3000
CMD ["start"]
