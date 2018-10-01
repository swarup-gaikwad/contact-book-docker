var express = require('express');
var contactController = require('./contactController');

var router = express.Router();

router.get('/', contactController.getHome);
router.get('/logout', contactController.getLogout);
router.get('/contacts', ensureAuthenticated, contactController.fetchContacts);
router.get('/contact/add', ensureAuthenticated, contactController.addContact);
router.post('/contact/addContact', ensureAuthenticated, contactController.addContactToDB);
router.delete('/contact/delete/:id', ensureAuthenticated, contactController.deleteContact);
router.get('/contact/edit/:id', ensureAuthenticated, contactController.editContact);
router.put('/contact/update/:id', ensureAuthenticated, contactController.updateContact);

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/')
}

module.exports = router;