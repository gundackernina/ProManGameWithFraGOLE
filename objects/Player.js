/**
 * @Author: Michael Bauer
 * @Date:   2017-06-04T10:48:10+02:00
 * @Email:  mb@bauercloud.de
 * @Project: Fragole - FrAmework for Gamified Online Learning Environments
 * @Last modified by:   Michael Bauer
 * @Last modified time: 2017-08-31T11:27:08+02:00
 * @License: MIT
 * @Copyright: Michael Bauer
 */

/** @module Player */
const GameObject = require('./GameObject.js').GameObject;
const Collection = require('./Collection.js').Collection;
const PlayerModel = require('../model/player.js').PlayerModel;

/** Class Player
* @extends {module:GameObject~GameObject}
* logical representation of a Player
* has an Inventory => Collection of GameObject
*/
class Player extends GameObject {
    constructor(id) {
        super(id);
        this.number = ++Player.playerNumber;
        this.joined = false;
        this.session = undefined; // will be set by GameController.joinPlayer
        this.name = undefined;    // will be set by GameController.joinPlayer
        this.inventory = new Collection();
        this.inventory.owner = this;
        this.skipTurns = 0;
    }

    /** initialise a Player
    * this is called automatically by the GameController
    * @param {string} name - the name of the Player
    * @param {Eureca.ClientProxy} session - RPC-ClientProxy of the player
    */
    init(name, session) {
        this.name = name;
        this.session = session;
        this.storage = new PlayerModel(name);
    }

    /** add a GameObject to the Players inventory
    * chainable
    */
    addInventory(item) {
        this.inventory.addItem(item);
        item.owner = this;
        return this;
    }

    addInventoryEx(items) {
        items.forEach((item) => this.addInventory(item));
        return this;
    }

    /** get a Item / List of Items from the players inventory
    * either by id or filtered by category
    */
    getInventory({id='', category=''}) {
        if (id) {
            return this.inventory.getItem(id);
        } else if (category) {
            return this.inventory.getCategory(category);
        }
    }

    /** remove an Item from the players Inventory */
    removeInventory(item) {
        this.inventory.deleteItem(item.id);
        item.owner = undefined;
        return this;
    }

}
Player.playerNumber = 0;
module.exports.Player = Player;
