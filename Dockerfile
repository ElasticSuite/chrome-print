# multi-stage build new in Docker 17.05 (https://docs.docker.com/engine/userguide/eng-image/multistage-build/)
FROM yukinying/chrome-headless
FROM node:6

# chrome dependencies
RUN apt-get update -y && apt-get install -y -q libnss3 libfontconfig && rm -rf /var/lib/apt/lists/*

COPY --from=0 /chrome /chrome

ADD . /server
WORKDIR /server

RUN npm i

EXPOSE 8888

ENTRYPOINT ["./start.sh"]
CMD ["/chrome/headless_shell", "--no-sandbox", "--hide-scrollbars", "--remote-debugging-address=0.0.0.0", "--remote-debugging-port=9222"]
