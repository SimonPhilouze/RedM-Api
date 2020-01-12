const express = require('express');
const router = express.Router();
const userModel = require('../models/user');
const inventoryModel = require('../models/inventory');

const defaultInventory = [];

router.get('/:steamId', (req, res) => {
  if(req.params) {
    const { steamId } = req.params;
    if(!steamId){
      res.sendStatus(400);
    } else {
      userModel.find({"steamId": steamId}, function(err, user) {
        if(err) {
          res.sendStatus(400);
        } else {
          if(user.length > 0) {
            res.status(200).send(user);
          } else {
            res.sendStatus(404);
          }
        }
      })
    }
  } else {
    res.sendStatus(400);
  }
});

router.post('/', (req, res) => {
  if(req.body) {
    const {steamId, firstName, lastName, money, status, skin, position } = req.body;
    if(!steamId || !firstName || !lastName || !money || !status || !skin || !position) {
      res.sendStatus(400);
    } else {
      const user = new userModel({
        steamId: steamId,
        firstName: firstName,
        lastName: lastName,
        money: money,
        jobs: [],
        status: status,
        skin: skin,
        position: position
      });
      console.log(user);
      user.save(function (err, user) {
        if(err) {
          res.sendStatus(400);
        } else {
          let inventory = new inventoryModel({
            userId: steamId,
            inventory: defaultInventory
          });
          inventory.save(function(err, inventory) {
            if(err) {
              res.sendStatus(400);
            } else {
              res.sendStatus(200);
              console.log(`${user.firstName} ${user.lastName} inventory has been created`);
            }
          })
          console.log(`${user.firstName} ${user.lastName} has been created`);
        }
      });
    }
  } else {
    res.sendStatus(400);
  }
})

module.exports = router;