FROM dockerfile/nodejs-bower-grunt

MAINTAINER yass, yassmokh@ophthalmo.care

RUN sudo git pull https://github.com/HCare/OphthalmoCare.git
RUN mv OpthalmoCare ophthalmocare
RUN cd ophthalmocare


# Install Mean.JS packages
#ADD package.json /GitHub/ophthalmocare/package.json
RUN npm install

# Manually trigger bower. Why doesnt this work via npm install?
#ADD .bowerrc /GitHub/ophthalmocare/.bowerrc
#ADD bower.json /GitHub/ophthalmocare/bower.json
#RUN bower install
#ADD . /GitHub/ophthalmocare
#ONBUILD RUN grunt build



# currently only works for development
ENV NODE_ENV development

WORKDIR /ophthalmocare

# Port 3000 for server
# Port 35729 for livereload
EXPOSE 3000 35729

CMD ["grunt"]


