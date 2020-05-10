FROM golang:1.14.2-alpine AS build
WORKDIR /src
COPY . .

RUN apk update && apk add git ca-certificates build-base

RUN go get -d -v

RUN go test -cover -v

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o bin/admin .

FROM scratch

LABEL "maintainer"="XTRadio Ops <contact@xtradio.org"
LABEL "version"="0.1"
LABEL "description"="XTRadio Admin"

COPY --from=build /src/bin/admin /bin/admin

# ADD ./bin/admin /admin

# #ADD ./bin/admin /admin
EXPOSE 10000

CMD ["/bin/admin"]
