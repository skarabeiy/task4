function getIndex(list, id) {
    for (var i = 0; i < list.length; i++ ) {
        if (list[i].id === id) {
            return i;
        }
    }

    return -1;
}


var messageApi = Vue.resource('/message{/id}');

Vue.component('message-form', {
    props: ['message', 'messages', 'messageAttr'],
    data: function() {
        return {
            status: '',
            firstVisit: '',
            soc: '',
            number: '',
            creationDate: '',
            name: '',
            id: ''
        }
    },
    watch: {
        messageAttr: function(newVal, oldVal) {
            this.status = newVal.status;
            this.firstVisit = newVal.firstVisit;
            this.soc = newVal.soc;
            this.number = newVal.number;
            this.creationDate = newVal.creationDate;
            this.name = newVal.name;
            this.id = newVal.id;
        }
    },
    template:
        '<div>' +
        '<input type="button" value="Enter into the table" @click="save" />' +
        '<div><br></div>' +
        '&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp<b>ID</b>&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp <b>NAME</b>&nbsp &nbsp &nbsp &nbsp &nbsp<b>SOC</b> &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp <b>FIRST VISIT</b>&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp <b>lAST VISIT</b> &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp <b>STATUS</b>'+
        '<div><hr></div>' +
        '</div>',
    methods: {
        save: function() {
            var message = { name: this.name, creationDate: this.creationDate, number: this.number,soc: this.soc,firstVisit: this.firstVisit, status: this.status};//?
            if (this.id) {
                messageApi.update({id: this.id}, message).then(result =>
                result.json().then(data => {
                    var index = getIndex(this.messages, data.id);

                this.messages.splice(index, 1, data);
                this.status=''
                this.firstVisit=''
                this.soc=''
                this.number = ''
                this.creationDate = ''
                this.name = ''
                this.id = ''
            })
            )
            } else {
                messageApi.save({}, message).then(result =>
                result.json().then(data => {
                    this.messages.push(data);

                    this.firstVisit=''
                this.soc = ''
                this.number = ''
                this.creationDate = ''
                this.status = ''
                this.name = ''
            })
            )
            }

        }
    }
});




Vue.component('message-row', {
    props: ['message', 'editMethod', 'messages'],
    template: '<div>' +
        '{{message.number}} &nbsp &nbsp &nbsp &nbsp'+ '{{ message.name }}&nbsp &nbsp &nbsp &nbsp'+ ' {{ message.soc }}&nbsp &nbsp &nbsp &nbsp'+ ' {{ message.firstVisit }}&nbsp &nbsp &nbsp &nbsp'+ ' {{ message.creationDate }}&nbsp &nbsp &nbsp &nbsp'+ ' {{ message.status }}&nbsp &nbsp &nbsp &nbsp' +
        '<span style="position: absolute; right: 0">' +
        //'<input type="button" value="Edit" @click="edit" />' +
        '<input type="button" value="Block" @click="block" />' +
        '<input type="button" value="Unblock" @click="unblock" />' +
        '<input type="button" value="Delete" @click="del" />' +
        '</span>' +

        '<div><hr></div>' +
        '</div>',
    methods: {

        block: function() {

        },

        edit: function() {
            this.editMethod(this.message);
        },
        del: function() {
            messageApi.remove({id: this.message.id}).then(result => {
                if (result.ok) {
                this.messages.splice(this.messages.indexOf(this.message), 1)
            }
        })
        }
    }
});

Vue.component('messages-list', {
    props: ['messages'],
    data: function() {
        return {
            message: null
        }
    },
    template:
        '<div style="position: relative; width: 1100px;">' +
        '<message-form :messages="messages" :messageAttr="message" />' +
        '<message-row v-for="message in messages" :key="message.id" :message="message" ' +
        ':editMethod="editMethod" :messages="messages" />' +
        '</div>',
    methods: {
        editMethod: function(message) {
            this.message = message;
        }
    }
});

var app = new Vue({
    el: '#app',
    template:
        '<div>' +
        '<div v-if="!profile">Login with <a href="/login">Google</a> </div>' +
        '<div><br></div>' +
        '<div v-if="!profile">Login with <a href="/login">GitHub</a> </div>' +
        '<div><br></div>' +
        '<div v-if="!profile">Login with <a href="/login">Vkontakte</a> </div>' +
        '<div v-else>' +
        '<div>{{profile.name}}&nbsp;<a href="/logout">Logout</a></div>' +
        '<div><br></div>' +
        '<messages-list :messages="messages" />' +
        '</div>' +
        '</div>',
    data: {
        messages: frontendData.messages,
        profile: frontendData.profile
    },
    created: function() {
//    messageApi.get().then(result =>
//        result.json().then(data =>
//            data.forEach(message => this.messages.push(message))
//        )
//    )
    },
});