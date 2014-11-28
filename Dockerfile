FROM dockerfile/nodejs-bower-grunt

MAINTAINER yass, yassmokh@ophthalmo.care

WORKDIR /GitHub/ophthalmocare

# Install Mean.JS packages
ADD package.json /GitHub/ophthalmocare/package.json
RUN npm install

# Manually trigger bower. Why doesnt this work via npm install?
ADD .bowerrc /GitHub/ophthalmocare/.bowerrc
ADD bower.json /GitHub/ophthalmocare/bower.json
RUN bower install --allow-root
ADD . /GitHub/ophthalmocare
#ONBUILD RUN grunt build



# currently only works for development
ENV NODE_ENV development

CMD ["grunt"]

# Port 3000 for server
# Port 35729 for livereload
EXPOSE 3000 35729
