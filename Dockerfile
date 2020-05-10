FROM golang:1.14.2-alpine AS build
WORKDIR /go/src/admin
ADD . .

# RUN ls -lah static/

RUN apk add --no-cache build-base ca-certificates

RUN go get -d -v && \
go test -cover -v && \
CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o ./admin .

FROM busybox:1.31.1-uclibc

LABEL "maintainer"="XTRadio Ops <contact@xtradio.org"
LABEL "version"="0.1"
LABEL "description"="XTRadio Admin"

WORKDIR /opt/admin

COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

COPY --from=build /go/src/admin/admin .
COPY --from=build /go/src/admin/static/ static/

EXPOSE 10000

CMD ["/opt/admin/admin"]
