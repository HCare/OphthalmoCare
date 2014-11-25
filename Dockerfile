FROM dockerfile/nodejs-bower-grunt

MAINTAINER yass, yassmokh@ophthalmo.care

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

CMD ["npm", "start", "grunt"]

# Port 3000 for server
# Port 35729 for livereload
EXPOSE 3000 35729
