FROM hosted-registry.citydi.biz/banking-systems/base-image/node:16.15.0-alpine3.15 AS build
WORKDIR /src
RUN npm config set registry http://10.187.160.86:8081/repository/npm-ptf2/
COPY . .
RUN npm install --force
RUN npm run build

FROM hosted-registry.citydi.biz/banking-systems/base-image/nginx:alpine AS final
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /src/build /usr/share/nginx/html/
COPY --from=build /src/master-nginx.conf  /etc/nginx/conf.d/default.conf
CMD ["nginx","-g","daemon off;"]