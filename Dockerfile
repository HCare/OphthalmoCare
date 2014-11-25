FROM dockerfile/nodejs

MAINTAINER Matthias Luebken, matthias@catalyst-zero.com

WORKDIR /GitHub/ophthalmocare

# Install Mean.JS Prerequisites
RUN npm install -g grunt-cli
RUN npm install -g bower

# Install Mean.JS packages
ADD package.json /GitHub/ophthalmocare/package.json
RUN npm install

# Manually trigger bower. Why doesnt this work via npm install?
ADD .bowerrc /GitHub/ophthalmocare/.bowerrc
ADD bower.json /GitHub/ophthalmocare/bower.json
RUN bower install --allow-root

# Make everything available for start
ADD . /GitHub/ophthalmocare

# currently only works for development
ENV NODE_ENV development

# Port 3000 for server
# Port 35729 for livereload
EXPOSE 3000 35729
CMD ["grunt"]
