// const ChatModel = require('./models/chat.model');
const userModel = require('./../user/model/user.model');
const helper = require('./../../utils/helper');
const { ObjectId } = require('mongodb');
// const logger = require("../config/winston");
module.exports = function (io, Users) {

    const users = new Users();

    io.on('connection', async (socket) => {
        console.log("Hello");
        //logger.info("Connected");
        socket.on('join', async (params, callback) => {

            if (typeof params == "string") params = await JSON.parse(params);
            socket.join(params.room);
            console.log(params, "params");
            users.AddUserData(socket.id, params.name, params.room);
            /* let where = {};

            where.room_id = ObjectId(params.room);
            where.is_group = true;
            where.is_deleted = false;
            let getChat = await ChatModel.getGroupChatList(where);
            //console.log(getChat,"getChat")

            let userWhere = {}
            userWhere.project_id = ObjectId(params.room);
            let planWhere = {}
            planWhere.project_id = ObjectId(params.room);
            let notificationUsers = []
            if (params.type == 'task') {
                const taskRs = await taskModel.getTaskListById(ObjectId(params.room));
                if (taskRs && taskRs.project_id) {
                    userWhere.project_id = ObjectId(taskRs.project_id);
                    planWhere.project_id = ObjectId(taskRs.project_id);

                    if(taskRs.assigee_id){
                        if(!notificationUsers.includes(taskRs.assigee_id.toString())){
                            notificationUsers.push(taskRs.assigee_id.toString())
                        }
                    }
                }
            }

            if (params.type == 'plan') {
                const planRs = await planModel.getPlanById(ObjectId(params.room))
                
                if (planRs.project_id) {
                    userWhere.project_id = ObjectId(planRs.project_id);
                    planWhere.project_id = ObjectId(planRs.project_id);
                }
            }


            userWhere.invitation_accepted = true;
            userWhere.is_deleted = false;
            userWhere["$or"] = [{ "is_leaved": { "$exists": false } }, { "is_leaved": false }]
            let getUsersRs = await projectModel.getProjectUsersRoleWise(userWhere);
            let projectUsers = [];

            if (getUsersRs && getUsersRs.length > 0) {
                for (let pu in getUsersRs) {
                    projectUsers.push(getUsersRs[pu].project_users)
                }
            }

           
            let planList = await planModel.getPlanList(planWhere);

            let initMsg = {
                user_list: users.GetUsersList(params.room),
                messages: getChat,
                project_users: projectUsers,
                plan_list: planList
            } */
            io.to(socket.id).emit('notificationList', {user:1});

            //callback();
        });

        socket.on('createMessage', async (message, callback) => {

            if (typeof message == "string") message = await JSON.parse(message);
            let notificationUsers = [];
            let getUser = await userModel.getUserById(message.sender);
            let chatTypeData = null;
            let insObj = {
                sender_id: ObjectId(message.sender),
                receiver_id: null,
                room_id: ObjectId(message.room),
                read_by:[ObjectId(message.sender)],
                is_group: true,
                chat_from: message.chat_from && message.chat_from != "" ? message.chat_from : "project",
                message: message.text ? message.text : null,
                files: message.files ? message.files : []
            }
            
            if(message.chat_from == "task"){
                const taskRs = await taskModel.getTaskListById(ObjectId(message.room));
                if(taskRs){
                    chatTypeData = taskRs;
                    if(taskRs.assigee_id && !notificationUsers.includes(taskRs.assigee_id.toString())){
                        notificationUsers.push(taskRs.assigee_id.toString());
                    }

                    if(taskRs.watchers && taskRs.watchers.length > 0){
                        taskRs.watchers.forEach(w=>{
                            if(!notificationUsers.includes(w.toString())){
                                notificationUsers.push(w.toString())
                            }
                        });
                    }
                }
            }else if(message.chat_from == "project"){
                const projectRs = await projectModel.getProjectById(message.room);
                chatTypeData = projectRs;
                if(projectRs && projectRs.users && projectRs.users.length > 0){
                    projectRs.users.forEach(pu=>{
                        if(!notificationUsers.includes(pu.toString())){
                            notificationUsers.push(pu.toString())
                        }
                    });
                }
            }
            
            if(notificationUsers && notificationUsers.length > 0 && (message.chat_from == "project" || message.chat_from == "task")){
                for(let nu of notificationUsers){
                    if(nu == message.sender) continue;
                    let deviceWheres = {};
                    deviceWheres.user_id = ObjectId(nu);
                    deviceWheres.is_active = true;
                    deviceWheres.is_deleted = false;
                    let getDevicesToken = await deviceModel.getActiveToken(deviceWheres);
                    let notificationReq = {}
                    let push = {}
                    push.title = `${chatTypeData.title || chatTypeData.name} | ${message.chat_from == "task" ? message.chat_from : "Group Chat"}`;
                    push.message = `${getUser.first_name} ${getUser.last_name}: ${message.files && message.files.length > 0 ? "📁" : message.text}`;
                    push.data_message = {
                        "data": {
                            ...message,
                            _id:ObjectId(chatTypeData._id)
                        },
                        "notification_type": `${message.chat_from}_chat`,
                        title: push.title,
                        message: push.message
                    };
                    
                    if(message.chat_from == "task"){
                        let createObjs = {
                            ...push,
                            project_id:ObjectId(chatTypeData.project_id),
                            is_read: false,
                            user_id: ObjectId(message.sender),
                            receiver_id:ObjectId(nu)
                        }
                        let insNotiRs = notificationModel.createNotification(createObjs);
                    }
                        
                    if(getDevicesToken && getDevicesToken.device_token){
                        push.device_type = getDevicesToken.os ? getDevicesToken.os : "android";
                        push.device_id = [getDevicesToken.device_token];
                        notificationReq.push = push;
                        let notificationRs = helper.notification(notificationReq);
                    }
                    
                }
            }            

            let addMessage = await ChatModel.saveChat(insObj);
            // console.log(notificationUsers, "notificationUsers")
            if(addMessage && addMessage._id){
                io.to(message.room).emit('newMessage', {
                    text: message.text,
                    room: message.room,
                    from: message.sender,
                    _id:addMessage._id,
                    read_by:addMessage.read_by,
                    chat_from: message.chat_from && message.chat_from != "" ? message.chat_from : "project",
                    files: message.files ? message.files : [],
                    createdAt: new Date(),
                    user_data: {
                        first_name: getUser["first_name"] ? getUser["first_name"] : "",
                        last_name: getUser["last_name"] ? getUser["last_name"] : "",
                        profile: getUser["profile"] ? getUser["profile"] : ""
                    }
                });
            }
            //callback();
        });

        socket.on('onRead', async (message, callback) => {
            if (typeof message == "string") message = await JSON.parse(message);
            if(message && message.chat_id && Array.isArray(message.chat_id) && message.chat_id.length > 0 && message.read_by){
                let getChats = await ChatModel.getChatListByKey({
                    _id:{$in:message.chat_id.map(cd=>ObjectId(cd))},
                    is_deleted:false
                });
                if(getChats && getChats.length > 0){
                    for(let cht of getChats){
                        let newUsers = Array.isArray(cht.read_by) ? cht.read_by : []
                        newUsers.push(ObjectId(message.read_by));
                        let updTaskRs = await ChatModel.updateChat({
                            read_by:newUsers
                        },{
                            _id:ObjectId(cht._id)
                        });
                    }
                }
            }
        });

        socket.on('disconnect', () => {
            var user = users.RemoveUser(socket.id);

            if (user) {
                io.to(user.room).emit('usersList', users.GetUsersList(user.room));
            }
        })
    });
}