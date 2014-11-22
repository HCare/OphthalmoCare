FROM dockerfile/nodejs

MAINTAINER Matthias Luebken, matthias@catalyst-zero.com

WORKDIR /GitHub/OphthalmoCare

# Install Mean.JS Prerequisites
RUN npm install -g grunt-cli
RUN npm install -g bower

# Install Mean.JS packages
ADD package.json /GitHub/OphthalmoCare/package.json
RUN npm install

# Manually trigger bower. Why doesnt this work via npm install?
ADD .bowerrc /GitHub/OphthalmoCare/.bowerrc
ADD bower.json /GitHub/OphthalmoCare/bower.json
RUN bower install --config.interactive=false --allow-root

# Make everything available for start
ADD . /GitHub/OphthalmoCare

# currently only works for development
ENV NODE_ENV development

# Port 3000 for server
# Port 35729 for livereload
EXPOSE 3000 35729
CMD ["grunt"]