FROM quay.io/lyfe00011/md:beta

RUN git clone https://github.com/lyfe00011/levanter.git /root/LyFE/

WORKDIR /root/LyFE/

RUN yarn install

# Install our customized view-once plugin.
COPY eplugins/0vv.js /root/LyFE/eplugins/0vv.js

ENTRYPOINT ["/bin/sh", "-c"]

CMD ["if [ ! -f /data/database.db ]; then if [ \"$ALLOW_FRESH_DATABASE\" = \"true\" ]; then echo 'Initializing fresh SQLite database'; touch /data/database.db; else echo 'ERROR: Persistent SQLite database not restored yet'; exit 1; fi; fi; ln -sfn /data/database.db /root/LyFE/database.db; exec npm start"]
