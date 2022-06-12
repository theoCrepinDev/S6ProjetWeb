const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const db = mysql.createConnection({
    host: '192.168.1.50',
    user: 'DESKTOP-TBN8G57',
    password: 'Tekxover123?',
    database: 'db_projetweb'
});

db.connect(function(err){
    if(err) throw err
    console.log("Connecté à la base de données! ")
})

//Enregistrement d'un nouvel utilisateur
router.post('/register', async (req, res) => {
    const nom = req.body.nom
    const prenom = req.body.prenom
    const email = req.body.email
    const password = req.body.motDePasse
    const hash = await bcrypt.hash(password, 10);
    var type
    if(req.body.admin === true){
        type = 'admin'
    }else{
        type = 'user'
    }

    //on regarde si cet utilisateur existe déjà
    var sql ='SELECT * FROM user WHERE email= ?'
    var value = [email]
    await db.query(sql, [value], async (err,result, fields) => {
        if (err) throw err;
        if(result.length > 0){
            res.json({
                message: 'Utilisateur déjà enregistré, essayez de vous connecter !'
            })
            return
        }
        else{
            var sql = 'INSERT INTO user (nom, prenom, email, password, type) VALUES ?'    
            var value =[[nom, prenom, email, hash, type]];            
            await db.query(sql, [value], function(err,result) {
                if (err) throw err;
                res.send('ok')
            })
            return true
        }
    })
})
    
router.post('/login', async (req, res) => {
    const email = req.body.email
    const password = req.body.motDePasse

    if(typeof email !== 'string' || typeof password !== 'string' || email === '' || password === ''){
        res.status(400).json({message : 'Vérifier les informations que vous avez saisies. ssvp'});
        return
      }
      let promiseQuery = new Promise(async (resolve, reject ) =>{
        var emailConnexion = [[email]];
        db.query('SELECT * FROM user WHERE email = ? ', [emailConnexion], async (err, res) => {
          if (err) reject(err);
          else{
              if(res.length <= 0){
                reject()
              }else{
                let cryptPassword = res[0].password;
                let samePAssword = await bcrypt.compare(password, cryptPassword);
                if(samePAssword){
                  req.session.userId = res[0].iduser
                  //on a connecté l'utilisateur on va maintenant vérifier si il a un panier
                  getPanier(res[0].iduser)
                    .then(panierUser => {
                        resolve({
                            id : res[0].iduser,
                            email: res[0].email,
                            nom: res[0].nom,
                            prenom: res[0].prenom,
                            type: res[0].type,
                            id_panier: panierUser[1],
                            panier: panierUser[0]
                        });
                  })
                  
                }else{
                  reject();
                }
              } 
          }
        })
    })
    
    try{
        let requete = await promiseQuery;
        let response = {}
        response.data = requete;
        res.json(response)
    }catch (err){
        console.log(err)
        res.status(401).json({
        message : err
        })
    }
})

//Route pour récupérer les livres dans la DB
router.get('/livres', (req, res) => {
    db.query("SELECT * FROM livres", function(err, result){
        if (err) throw err;
        res.json(result)
    })
})

//Route de rechercher livre
router.get('/livres/recherche/:nomLivreRecherche', async (req, res) =>  {
    var titreCherche = req.params.nomLivreRecherche
    db.query("SELECT * FROM livres WHERE titre LIKE '%" + titreCherche + "%'", function(err, result) {
        if(err) throw err;
        res.json(result)
    })
})

//Router pour mettre à jour un livre
router.put('/livres/', async (req, res) => {
    var value = [[req.body.titre, req.body.auteur, req.body.resume, req.body.image, req.body.quantit ]]
    var id = req.body.id
    db.query("UPDATE livres SET titre='" + req.body.titre + "', auteur='" + req.body.auteur + "', resume=?, image='" + req.body.image + "', quantite=" + req.body.quantit + " WHERE idlivre=" + id, [req.body.resume], function(err, result) {
        if(err) throw err;
        res.status(201)
        res.json("Livre mis à jour.")
    })
})

//Route pour supprimer un livre de la bdd
router.delete('/livres/:livreId', async (req, res) => {
    db.query('DELETE FROM livres WHERE idlivre="' + req.params.livreId + '"', function(err, result) {
        if(err) throw err;
        res.status(201)
        res.json('Livre Supprimé')
    })
})

//fonction pour récupérer panier
const getPanier = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM panier WHERE id_user ="'+id + '"', (err, result, fields) => {
            if (err) reject(err)
            else {
                if (result.length === 0) {
                    createPanierUser(id)
                        .then((res) => {
                            db.query('SELECT * FROM panier WHERE id_user ="'+id + '"', (err, result2, fields) =>{
                                if (err) reject(err);
                                resolve([[], result2[0].id_panier])
                            })
                        })
                } else {
                    //on sait que le user à un panier dans la bdd
                    //on a l'id du panier de l'user il reste a récupe les panier items

                    //on récupère tous les paniers items de ce panier
                    getPanierItems(result[0].id_panier)
                    .then((tab) => { 
                        resolve([tab, result[0].id_panier])
                    })
                }
            }
        })
    })
}

//fonction pour récupérer le contenu du panier avec l'id du panier
const getPanierItems = (id_panier) => {
    //let promise = 
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM panier_items WHERE id_panier='" + id_panier + "'", (err, result, fields) => {
            if(err) reject(err)
            if (result.length === 0) {
                return resolve([])
            }
            else{
                let tab = []
                for (let i of result) {
                    let json = {
                        id_livre: i.id_livre,
                        quantite: i.quantite
                    }
                    tab.push(json)
                }
                resolve(tab)
            }
        })
    })
}

//fonction pour créer un panier à l'utilisateur si il n'en a pas dans la bdd
const createPanierUser = (id_user) => {
    return new Promise((resolve, reject) =>{
        db.query("INSERT INTO panier (id_user) VALUES ?", [[[id_user]]], function(err, result) {
            if(err) reject(err)
            else{
                resolve('ok')
            }
        })
    })
}


//route pour ajouter un livre au panier
router.post('/panier/', async (req, res) => {
    const id_panier = req.body.id_panier;
    const id_livre = req.body.id_livre;
    const quantite = req.body.quantite;

    //on vérifie si l'article est déjà dans le panier
    db.query("SELECT * FROM panier_items WHERE id_livre=" + id_livre + " AND id_panier=" + id_panier, async (err, result, fields) => {
        if(err) throw err;
        if(result.length > 0){
            res.json({
                message:'Livre déjà dans le panier',
                code:1
            })
            return 1
        }else{
            db.query("INSERT INTO panier_items (id_livre, quantite, id_panier) VALUES ?",[[[id_livre, quantite, id_panier]]], function(err, result) {
                if (err) throw err;
                res.status(201).json({
                    message:'Livre ajouté dans le panier',
                    code:2
                })
            })
        }
    })    
})

//route pour mettre a jour le panier de l'user
router.get('/panier/:userId', async (req, res) => {
    getPanier(req.params.userId)
        .then(panierUser => {
            let response = {}
            response.data = panierUser[0]
            res.json(response)
        })
})

//route pour supprimer un livre du panier
router.delete('/panier/:idLivre/:idPanier', async (req, res) => {
    db.query("DELETE FROM panier_items WHERE id_livre=" + req.params.idLivre + " AND id_panier=" + req.params.idPanier , function (err, result) {

        if(err) throw err;
        res.status(201)
        res.json('Article supprimé')
    })
})

//route pour mettre a jour une quantité dans le panier
router.put('/panier/:idlivre/:idpanier/:quantite', async (req, res) => {
    db.query("UPDATE panier_items SET quantite=" + req.params.quantite + " WHERE id_panier=" + req.params.idpanier + " AND id_livre=" + req.params.idlivre, function(err, result) {
        if (err) throw err;
        res.status(201)
        res.json('Quantite mise à jour !')
    })
})

//route pour ajouter un livre au catalogue
router.post('/livres', async (req, res) => {
    const values = [[req.body.titre, req.body.auteur, req.body.resume, req.body.quantite, req.body.image]]
    db.query("INSERT INTO livres (titre, auteur, resume, quantite, image) VALUES ?", [values], function(err, result) {
        if(err) throw err;
        res.status(201)
        res.json('Livre ajouté !')
    })
})

//route pour mettre a jour les quantité dispo lors dela confirmation
router.post('/confirmation/:idUser',async (req, res) => {
    let livreAModifier = req.body
    for(let i of livreAModifier){
        db.query('UPDATE livres SET quantite=' + i[1] + ' WHERE idlivre=' + i[0], function (err,result) {
            if(err) throw err;
        })
    }
    //on vide ensuite le panier
    db.query('DELETE FROM panier WHERE id_user=' + req.params.idUser, async (err, res) => {
        if(err) throw err;
    })
    
    res.status(201)
    res.json('Réservation confirmé, déconnexion ...')
})

module.exports = router;