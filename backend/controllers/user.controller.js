const db = require("../models");
const User = db.users;
// const Op = db.Sequelize.Op;
const axios = require('axios');
// const {response} = require("express");


const client_id = process.env.client_id
const client_secret = process.env.client_secret
const redirect_uri = process.env.redirect_uri

// Create and Save a new User
exports.scode = (req, res) => {
    let code = req.query.code
    console.log('15 ' + code)
    let url = 'https://accounts.spotify.com/api/token'
    const params = new URLSearchParams()
    params.append('grant_type','authorization_code')
    params.append('code',code)
    params.append('redirect_uri',redirect_uri)
    params.append('client_id',client_id)
    params.append('client_secret',client_secret)
    let access_token
    let refresh_token
    let username
    return axios.post(url,params
    )
        .then(response =>{
            console.log(response.data)
            access_token = response.data['access_token']
            refresh_token = response.data['refresh_token']
            let headers = {
                'Authorization': 'Bearer ' + access_token,
                'scope': 'user-read-private user-read-email'
            }
            console.log(headers)
            axios({
                url:'https://api.spotify.com/v1/me',
                method:'get',
                headers:headers
            })
                .then(response =>{
                console.log(response.data)
                let r = response.data
                    username = r['id']

                User.findOrCreate({where:{spotyid:r['id'],country:r['country'],display_name:r['display_name']},defaults:{
                        access_token:access_token,refresh_token:refresh_token
                    }}).then(res.cookie('username',username),res.cookie('access_token',access_token),
                    res.redirect('/')).catch(error =>{
                    console.log('47 ' + error)
                })
            })
                .catch(error =>{
                    console.log('52 ' + error)
                })
        })
        .catch(error =>{
            console.log('33 ' + error)
        })

};

exports.refresh = (req,res) => {
    let username = req.params.username
    console.log(username)
    // let current_time = new Date().getTime()
    // let one_day = current_time.setHours(current_time.getHours() - 1)
    let url = 'https://accounts.spotify.com/api/token'
    return User.findOne({ where: { spotyid: username } }).then(function (user) {
        const params = new URLSearchParams()
        params.append('grant_type','refresh_token')
        params.append('refresh_token',user.refresh_token)
        params.append('client_id',client_id)
        params.append('client_secret',client_secret)
        axios.post(url,params)
            .then(response =>{
                let r = response.data
                user.update({access_token: r['access_token']})
                res.cookie('access_token',r['access_token'])
                res.status(200)
            })
            .catch(error => error.response)
    }).catch(error => console.log(error));

}

// // Retrieve all User from the database.
// exports.findAll = (req, res) => {
//
// };
//
// // Find a single User with an id
// exports.findOne = (req, res) => {
//     const id = req.params.id;
//
//     User.findByPk(id)
//         .then(data => {
//             res.send(data);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: "Error retrieving User with id=" + id
//             });
//         });
// };
//
// // Update a User by the id in the request
// exports.update = (req, res) => {
//     const id = req.params.id;
//
//     User.update(req.body, {
//         where: { id: id }
//     })
//         .then(num => {
//             if (num == 1) {
//                 res.send({
//                     message: "User was updated successfully."
//                 });
//             } else {
//                 res.send({
//                     message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
//                 });
//             }
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: "Error updating User with id=" + id
//             });
//         });
// };
//
// // Delete a Tutorial with the specified id in the request
// exports.delete = (req, res) => {
//
// };
