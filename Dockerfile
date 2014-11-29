FROM dockerfile/nodejs-bower-grunt

MAINTAINER yass, yassmokh@ophthalmo.care

cd /home/vagrant/GitHub/ophthalmocare
# Install Mean.JS packages
#ONBUILD ADD package.json /home/vagrant/GitHub/OphthalmoCare/
RUN npm install

# Manually trigger bower. Why doesnt this work via npm install?


WORKDIR /home/vagrant/GitHub/ophthalmocare

# currently only works for development
ENV NODE_ENV development

CMD ["grunt"]

# Port 3000 for server
# Port 35729 for livereload
EXPOSE 3000 35729
