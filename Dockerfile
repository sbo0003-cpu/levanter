FROM quay.io/lyfe00011/md:beta

RUN git clone https://github.com/lyfe00011/levanter.git /root/LyFE/

WORKDIR /root/LyFE/

RUN yarn install

ENTRYPOINT ["/bin/sh", "-c"]

CMD ["if [ ! -f /data/database.db ]; then echo 'ERROR: Persistent SQLite database not restored yet'; exit 1; fi; ln -sfn /data/database.db /root/LyFE/database.db; exec npm start"]
