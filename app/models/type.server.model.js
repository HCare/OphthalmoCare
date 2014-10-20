'use strict';
/**
 * Created by yass on 10/10/2014.
 */

//region custom types


exports.UserAndTime = function (user, time) {
    if (!time) {
        this.time = new Date();
    }
    else {
        this.time = time;
    }
    if(user){
        this._user = user;
    }
};

exports.Note=function(strokes, image, text){
    if(strokes){
        this.strokes=strokes;
    }
    if(image){
        this.image=image;
    }
    if(text){
        this.text=text;
    }
};

//endregion custom types