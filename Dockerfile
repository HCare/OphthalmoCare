FROM dockerfile/nodejs-bower-grunt

MAINTAINER yass, yassmokh@ophthalmo.care

# Install MongoDB.
RUN \
  apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10 && \
  echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' > /etc/apt/sources.list.d/mongodb.list && \
  apt-get update && \
  apt-get install -y mongodb-org && \
  rm -rf /var/lib/apt/lists/*
  
#RUN mkdir /data
RUN mkdir /data/db
RUN sudo service mongod start  

CMD ["mongod"]

# Install Java.
RUN \
  apt-get update && \
  apt-get install -y openjdk-7-jdk && \
  rm -rf /var/lib/apt/lists/*
  
ENV JAVA_HOME /usr/lib/jvm/java-7-openjdk-amd64

CMD ["bash"]

## install neo4j according to http://www.neo4j.org/download/linux
run wget -O - http://debian.neo4j.org/neotechnology.gpg.key | apt-key add - && \
    echo 'deb http://debian.neo4j.org/repo stable/' > /etc/apt/sources.list.d/neo4j.list && \
    apt-get update ; apt-get install neo4j -y

add launch.sh /
run chmod +x /launch.sh && \
    apt-get clean && \
    sed -i "s|#node_auto_indexing|node_auto_indexing|g" /var/lib/neo4j/conf/neo4j.properties && \
    sed -i "s|#node_keys_indexable|node_keys_indexable|g" /var/lib/neo4j/conf/neo4j.properties && \ 
    echo "remote_shell_host=0.0.0.0" >> /var/lib/neo4j/conf/neo4j.properties
    
    
cmd ["/bin/bash", "-c", "/launch.sh"]

# Install Mean.JS packages
ONBUILD ADD package.json /GitHub/ophthalmocare/
ONBUILD RUN npm install

# Manually trigger bower. Why doesnt this work via npm install?
ONBUILD ADD .bowerrc /GitHub/ophthalmocare/
ONBUILD ADD bower.json /GitHub/ophthalmocare/
ONBUILD RUN bower install --allow-root
ONBUILD ADD . /GitHub/ophthalmocare
ONBUILD RUN grunt build

WORKDIR /GitHub/ophthalmocare

# currently only works for development
ENV NODE_ENV development

CMD ["npm", "grunt", "start"]

# Port 3000 for server
# Port 35729 for livereload
EXPOSE 3000 35729
