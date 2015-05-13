FROM yassmokh/node-mongo-neo

MAINTAINER yass, yassmokh@ophthalmo.care

#WORKDIR /etc/init.d
#RUN sh neo4j-service start
#WORKDIR /
#RUN mkdir -p /data/db && chown -R mongodb:mongodb /data/db
#WORKDIR /data/db
#RUN mongod
#WORKDIR /
#RUN cd /home/vagrant/GitHub/ophthalmocare

# Install Mean.JS packages
#ONBUILD ADD package.json /home/vagrant/GitHub/OphthalmoCare/
#RUN npm install

# Manually trigger bower. Why doesnt this work via npm install?


#WORKDIR /home/vagrant/GitHub/ophthalmocare

# currently only works for development
ENV NODE_ENV development

#CMD ["grunt"]

# Port 3000 for server
# Port 35729 for livereload
EXPOSE 3000 35729
