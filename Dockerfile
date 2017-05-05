FROM node:6

# below is all the junk to get a full most-recent release of regular chrome beta running locally

# chrome deps
#RUN apt-get update && apt-get upgrade -y && apt-get install -y -q \
#  gconf-service libasound2 libatk1.0-0 libcups2 libdbus-1-3 libgconf-2-4 libgtk-3-0 \
#  libnspr4 libnss3 libx11-xcb1 libxss1 fonts-liberation libappindicator1 xdg-utils
#
#RUN wget https://dl.google.com/linux/direct/google-chrome-beta_current_amd64.deb && \
#  dpkg -i google-chrome-beta_current_amd64.deb && \
#  rm google-chrome-beta_current_amd64.deb

ADD . /server
WORKDIR /server

RUN npm i

#CMD ["./start.sh"]
ENTRYPOINT ["./start.sh"]
