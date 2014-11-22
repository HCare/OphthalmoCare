FROM dockerfile/nodejs-bower-grunt

MAINTAINER yass, yassmokh@ophthalmo.care

# Install Mean.JS packages
ONBUILD ADD package.json /GitHub/OphthalmoCare/
ONBUILD RUN npm install

# Manually trigger bower. Why doesnt this work via npm install?
ONBUILD ADD .bowerrc /GitHub/OphthalmoCare/
ONBUILD ADD bower.json /GitHub/OphthalmoCare/
ONBUILD RUN bower install --allow-root
ONBUILD ADD . /GitHub/OphthalmoCare
ONBUILD RUN grunt build

WORKDIR /GitHub/OphthalmoCare

# currently only works for development
ENV NODE_ENV development

CMD ["npm", "grunt", "start"]

# Port 3000 for server
# Port 35729 for livereload
EXPOSE 3000 35729