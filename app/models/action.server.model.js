'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Action Schema
 */
var ActionSchema = new Schema({
	// Action model fields   
	// ...
    _id: String,
    name: {
        type: String,
        default: '',
        required: 'Please fill Action name',
        unique:'There is already an Action with that name',
        trim: true
    },
    order: {
        type: Number
    },
    _module:{
        type:String,
        ref:'Module'
    }
});

/**
 * register mongoose module
 */
var Action=mongoose.model('Action', ActionSchema);

/**
 * Init Actions data
 */
//region Roles Actions
///Create_Role Action..
Action.findOneAndUpdate({_id:'create_role'}, {name: 'Create Role', order:1, _module:'roles'}, {upsert:true}, function(err){
    if(err){
        console.log('Error Creating "Create Role" Action'+JSON.stringify(err));
        return;
    }
});
///Update_Role Action..
Action.findOneAndUpdate({_id:'edit_role'}, {name: 'Edit Role', order:2, _module:'roles'}, {upsert:true}, function(err){
    if(err){
        console.log('Error Creating "Edit Role" Action: '+JSON.stringify(err));
        return;
    }
});
///Delete_Role Action..
Action.findOneAndUpdate({_id:'delete_role'}, {name: 'Delete Role', order:3, _module:'roles'}, {upsert:true}, function(err){
    if(err){
        console.log('Error Creating "Delete Role" Action: '+JSON.stringify(err));
        return;
    }
});
///List_Roles Action..
Action.findOneAndUpdate({_id:'list_roles'}, {name: 'List Roles', order:4, _module:'roles'}, {upsert:true}, function(err){
    if(err){
        console.log('Error Creating "List Roles" Action: '+JSON.stringify(err));
        return;
    }
});
///View_Role Action..
Action.findOneAndUpdate({_id:'view_role'}, {name: 'View Role', order:5, _module:'roles'}, {upsert:true}, function(err){
    if(err){
        console.log('Error Creating "View Role" Action: '+JSON.stringify(err));
        return;
    }
});
///Search_Roles Action..
Action.findOneAndUpdate({_id:'search_roles'}, {name: 'Search Roles', order:6, _module:'roles'}, {upsert:true}, function(err){
    if(err){
        console.log('Error Creating "Search Roles" Action: '+JSON.stringify(err));
        return;
    }
});
//endregion Roles Actions

//region Users Actions
///Create_User Action..
Action.findOneAndUpdate({_id:'create_user'}, {name: 'Create User', order:1, _module:'users'}, {upsert:true}, function(err){
    if(err){
        console.log('Error Creating "Create User" Action'+JSON.stringify(err));
        return;
    }
});
///Update_User Action..
Action.findOneAndUpdate({_id:'edit_user'}, {name: 'Edit User', order:2, _module:'users'}, {upsert:true}, function(err){
    if(err){
        console.log('Error Creating "Edit User" Action: '+JSON.stringify(err));
        return;
    }
});
///Delete_User Action..
Action.findOneAndUpdate({_id:'delete_user'}, {name: 'Delete User', order:3, _module:'users'}, {upsert:true}, function(err){
    if(err){
        console.log('Error Creating "Delete User" Action: '+JSON.stringify(err));
        return;
    }
});
///List_Users Action..
Action.findOneAndUpdate({_id:'list_users'}, {name: 'List Users', order:4, _module:'users'}, {upsert:true}, function(err){
    if(err){
        console.log('Error Creating "List Users" Action: '+JSON.stringify(err));
        return;
    }
});
///View_User Action..
Action.findOneAndUpdate({_id:'view_user'}, {name: 'View User', order:5, _module:'users'}, {upsert:true}, function(err){
    if(err){
        console.log('Error Creating "View User" Action: '+JSON.stringify(err));
        return;
    }
});
///Search_Users Action..
Action.findOneAndUpdate({_id:'search_users'}, {name: 'Search Users', order:6, _module:'users'}, {upsert:true}, function(err){
    if(err){
        console.log('Error Creating "Search Users" Action: '+JSON.stringify(err));
        return;
    }
});
//endregion Users Actions

//region Patients Actions
///Create_Patient Action..
Action.findOneAndUpdate({_id:'create_patient'}, {name: 'Create Patient', order:1, _module:'patients'}, {upsert:true}, function(err){
    if(err){
        console.log('Error Creating "Create Patient" Action'+JSON.stringify(err));
        return;
    }
});
///Update_Patient Action..
Action.findOneAndUpdate({_id:'edit_patient'}, {name: 'Edit Patient', order:2, _module:'patients'}, {upsert:true}, function(err){
    if(err){
        console.log('Error Creating "Edit Patient" Action: '+JSON.stringify(err));
        return;
    }
});
///Delete_Patient Action..
Action.findOneAndUpdate({_id:'delete_patient'}, {name: 'Delete Patient', order:3, _module:'patients'}, {upsert:true}, function(err){
    if(err){
        console.log('Error Creating "Delete Patient" Action: '+JSON.stringify(err));
        return;
    }
});
///List_Patients Action..
Action.findOneAndUpdate({_id:'list_patients'}, {name: 'List Patients', order:4, _module:'patients'}, {upsert:true}, function(err){
    if(err){
        console.log('Error Creating "List Patients" Action: '+JSON.stringify(err));
        return;
    }
});
///View_Patient Action..
Action.findOneAndUpdate({_id:'view_patient'}, {name: 'View Patient', order:5, _module:'patients'}, {upsert:true}, function(err){
    if(err){
        console.log('Error Creating "View Patient" Action: '+JSON.stringify(err));
        return;
    }
});
//endregion Patients Actions

//region Examinations Actions
///Create_Examination Action..
Action.findOneAndUpdate({_id:'create_examination'}, {name: 'Create Examination', order:1, _module:'examinations'}, {upsert:true}, function(err){
    if(err){
        console.log('Error Creating "Create Examination" Action'+JSON.stringify(err));
        return;
    }
});
///Update_Examination Action..
Action.findOneAndUpdate({_id:'edit_examination'}, {name: 'Edit Examination', order:2, _module:'examinations'}, {upsert:true}, function(err){
    if(err){
        console.log('Error Creating "Edit Examination" Action: '+JSON.stringify(err));
        return;
    }
});
///Delete_Examination Action..
Action.findOneAndUpdate({_id:'delete_examination'}, {name: 'Delete Examination', order:3, _module:'examinations'}, {upsert:true}, function(err){
    if(err){
        console.log('Error Creating "Delete Examination" Action: '+JSON.stringify(err));
        return;
    }
});
///List_Examinations Action..
Action.findOneAndUpdate({_id:'list_examinations'}, {name: 'List Examinations', order:4, _module:'examinations'}, {upsert:true}, function(err){
    if(err){
        console.log('Error Creating "List Examinations" Action: '+JSON.stringify(err));
        return;
    }
});
///View_Examination Action..
Action.findOneAndUpdate({_id:'view_examination'}, {name: 'View Examination', order:5, _module:'examinations'}, {upsert:true}, function(err){
    if(err){
        console.log('Error Creating "View Examination" Action: '+JSON.stringify(err));
        return;
    }
});
//endregion Examinations Actions