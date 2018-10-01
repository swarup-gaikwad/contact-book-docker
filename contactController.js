const Contact = require('./models/contact');

module.exports = {
    getHome: function (req, res) {
        res.render('home', {
            isLogin : req.user ? true : false
        });
    },
    getLogout: function (req, res) {
        req.logout();
        res.redirect('/');
    },
    fetchContacts: function (req, res) {
        Contact.find({
            userId: req.user.id
        }, (error, contacts) => {
            if (error) {
                console.error(error);
            }
            var hasContacts = contacts.length === 0;
            res.render('showContacts', {
                contacts: contacts,
                hasContacts: hasContacts,
                isLogin : req.user ? true : false
            });
        })
    },
    addContact: function (req, res) {
        res.render('addContact', {
            userName: req.user.displayName,
            userId: req.user.id,
            isLogin : req.user ? true : false
        });
    },
    addContactToDB: function (req, res) {
        var contact = new Contact(req.body);
        contact.save()
            .then(item => {
                res.redirect('/contacts');
            })
            .catch(err => {
                res.status(400).send(err);
            });
    },
    deleteContact: function (req, res) {
        Contact.deleteOne({_id: req.params.id
        }, (err, result) => {
          if (err) {
            console.log(err.message, 'Internal MongoDB error');
          }
          if (result.n === 0) {
            console.log('contact not found');
          }
          res.status(200).send('contact deleted successfully');
        });
    },
    editContact: function (req, res) {
        Contact.findById(req.params.id, (error, contact) => {
            if (error) {
              console.error(error);
            }
            res.render('editContact', {
                contact: contact,
                isLogin : req.user ? true : false
            });
          });
    },
    updateContact: function (req, res) {
        Contact.updateOne({
            _id: req.params.id
          }, {
            $set: req.body
          }, (err, result) => {
            if (err) {
              res.send(err, 'Internal MongoDB error');
            }
            if (result.n === 0) {
              res.send('contact not found');
            }
            res.status(200).send('contact updated');
          });
    }
}
