const path = require('path');
const express = require('express');
let router = express.Router();

const npm_dependencies = [
    {route: '/bootstrap.min.css', path: 'bootstrap/dist/css/bootstrap.min.css'},
    {route: '/bootstrap.bundle.min.js', path: 'bootstrap/dist/js/bootstrap.bundle.min.js'},
    {route: '/jquery.min.js', path: 'jquery/dist/jquery.min.js'}
];

for (let file of npm_dependencies) {
    router.get(file.route, (req, res) => {
        res.sendFile(path.join(__dirname, '../node_modules', file.path));
    });
}

module.exports = router;