'use strict';

/**
 * Module dependencies.
 */

exports.transformSearchQuery=function(query){
    var newQuery = {}; // the new query
    var queue = [];
    var queueValues = [];
    var result = "";
    var obj = null;
    if(typeof query == 'string'){
        try{
            obj = JSON.parse(query);
        }
        catch(e){
            result += " - " + query;
        }
    }
    else{
        obj = query;
    }
    if(obj != null && obj != undefined){
        for(var key in obj){
            queue.push(key);
            queueValues.push(obj[key]);
        }
        while (queue.length > 0){
            try{
                var propKey = queue[0];
                try{ // Object && Array
                    var propValue = JSON.parse(queueValues[0]);
                    if(Array.isArray(propValue) && propValue.length > 0){  // Array
                        newQuery[propKey] = {$all: propValue};
                    }
                    else if(typeof propValue == 'object'){  // Object
                        if(propValue.hasOwnProperty('__range'))
                        {
                            var range = propValue["__range"];
                            var arr= range.split(":");
                            var part1=  arr[0];
                            var part2=  arr[1];
                            if(part1 != null && part1.length >0 && part2 != null && part2.length >0)
                            {
                                newQuery[propKey] = { $gte: part1, $lte: part2 };
                            }
                            else if(part1 != null && part1.length > 0 && part2 != null && part2.length == 0)
                            {
                                newQuery[propKey] = { $gte: part1};
                            }
                            else if(part1 != null && part1.length == 0 && part2 != null && part2.length > 0)
                            {
                                newQuery[propKey] = {$lte: part2 };
                            }
                        }
                        else{
                            for(var k in propValue){
                                queue.push(propKey + "." + k);
                                queueValues.push(propValue[k]);
                            }
                        }
                    }
                    else if(typeof propValue == "number"){
                        newQuery[propKey] = new RegExp('.*' +  propValue + '.*', 'i');
                    }
                }
                catch(e){  // string && empty array && Already sent as array
                    if(typeof queueValues[0] == 'string'){
                        var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
                        if(checkForHexRegExp.test(queueValues[0]) == true || propKey == "gender" || propKey == "birthDate"){  // check if field is ObjectId
                            newQuery[propKey] =  queueValues[0];
                        }
                        else{
                            newQuery[propKey] = new RegExp('.*' +  queueValues[0] + '.*', 'i');
                        }
                    }
                    else if(typeof queueValues[0] == 'object'  && Array.isArray(queueValues[0]) && queueValues[0].length > 0){
                        newQuery[propKey] = {$all: queueValues[0]};
                    }
                    else{
                        if(queueValues[0].hasOwnProperty('__range'))
                        {
                            var range = queueValues[0]["__range"];
                            var arr= range.split(":");
                            var part1=  arr[0];
                            var part2=  arr[1];
                            if(part1 != null && part1.length >0 && part2 != null && part2.length >0)
                            {
                                newQuery[queue[0]] = { $gte: part1, $lte: part2 };
                            }
                            else if(part1 != null && part1.length > 0 && part2 != null && part2.length == 0)
                            {
                                newQuery[queue[0]] = { $gte: part1};
                            }
                            else if(part1 != null && part1.length == 0 && part2 != null && part2.length > 0)
                            {
                                newQuery[queue[0]] = {$lte: part2 };
                            }
                        }
                        else{
                            for(var k in queueValues[0]){
                                queue.push(queue[0] + "." + k);
                                queueValues.push(queueValues[0][k]);
                            }
                        }
                    }
                }
            }
            catch(e){
            }
            queue.shift();
            queueValues.shift();
        }
    }
    return newQuery;
};
