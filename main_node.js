'use strict';

const rp = require('request-promise')

let getData = new Promise((resolve, reject) => {
  rp('https://api.github.com/users/octocat/orgs')
    .then(html => {
      console.log(html)
    })
})

