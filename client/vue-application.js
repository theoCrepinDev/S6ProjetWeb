
const Login = window.httpVueLoader("./components/Login.vue")
const Catalogue = window.httpVueLoader("./components/Catalogue.vue")
const Accueil = window.httpVueLoader("./components/Accueil.vue")
const Deconnexion = window.httpVueLoader("./components/Deconnexion.vue")
const Panier = window.httpVueLoader("./components/Panier.vue")

const routes =[
    {path : '/catalogue', component: Catalogue, name: 'catalogue'},
    {path : '/rechercher', component: Catalogue, name: 'rechercher'},
    {path : '/loginsingup', component: Login, name: 'login'},
    {path: '/accueil', component: Accueil, name: 'accueil'},
    {path: '/deconnexion', component: Deconnexion, name: 'deconnexion'},
    {path : '/panier', component: Panier, name: 'panier'}
]

const router = new VueRouter({
    routes
})

var app = new Vue({
    router,
    el: '#app',
    data:{
        livres:[],
        utilisateurConnecte : -1,
        nomUtilisateurConnecte : '',
        prenomUtilisateurConnecte : '',
        user: {
            email:'',
            id:-1,
            nom:'',
            prenom:'',
            type:'',
            id_panier:-1,
            panier:[],
        },
        userPanierLivres:[],
        livreMajQuantite: {
            idlivre:-1,
            nouvelleQuantite: -1
        }
    },
    async mounted(){
        if(this.utilisateurConnecte === -1){
            router.replace('/loginsingup');
        }else{
            router.replace('/accueil')
        }
        const res = await axios.get('api/livres')
        this.livres = res.data
    },
    methods:{
        async login(data){
            await axios.post('/api/login', data).then(async response => {
                this.user = response.data.data;
                this.utilisateurConnecte = this.user.id
                this.nomUtilisateurConnecte = this.user.nom 
                this.prenomUtilisateurConnecte = this.user.prenom
                this.$router.push('/accueil')
            }).catch(error => {
                alert('Informations non valides !')
            });
        },
        async deconnexion(){
                
            this.user = {
                email:'',
                id:-1,
                nom:'',
                prenom:'',
                type:''
            }
            this.utilisateurConnecte = -1
            this.nomUtilisateurConnecte = ''
            this.prenomUtilisateurConnecte = ''
        },
        async recupererTousLivres(){
            const resRecherche = await axios.get('api/livres')
            this.livres = resRecherche.data
        },
        async rechercherLivre(data){
            const res = await axios.get('api/livres/recherche/' + data);
            this.livres = res.data
        },
        async mettreAJourLivre(data){
            await axios.put('api/livres/', data);
            this.recupererTousLivres();
            const livre = this.livres.find(a => a.id === data.id)
            livre.titre = data.titre
            livre.auteur = data.auteur
            livre.resume = data.resume
            livre.image = data.image
            livre.quantite = data.quantit

        },
        async supprimerLivre(data){
            await axios.delete('api/livres/' + data);
            this.recupererTousLivres();
        },
        async ajoutLivrePanier(data){
            const resAjout = await axios.post('api/panier/', data);
            this.recupererLivrePanier()
            if(resAjout.data.code === 1){
                alert('Livre déjà dans le panier')
            }else{
                alert('Livre ajouté au panier !')
            }
        },
        async recupererLivrePanier(){
            await axios.get('api/panier/' + this.user.id).then(async response =>{
                this.user.panier = response.data.data

                let panierLivre = [];
                for(let i of this.user.panier){
                    for(let j of this.livres){
                        if (i.id_livre === j.idlivre){
                            let temp = j
                            j.quantitePanier = i.quantite
                            panierLivre.push(temp)
                        }
                    }
                }
                this.userPanierLivres = panierLivre
            })
            
        },
        async supprimerLivrePanier(data){
            await axios.delete('api/panier/' + data.idlivre + '/' + data.idpanier);
            this.recupererLivrePanier()
        },
        async enregisterModif(data){
            await axios.put('api/panier/' + data.id + '/' + data.idpanier + '/' + data.quantite)
            this.recupererLivrePanier()
        },
        async ajouterLivreCatalogue(data){
            await axios.post('api/livres', data)
            this.recupererTousLivres();
        },
        async confirmerPanier(){
            let livreAModifier = [];
            for(i of this.user.panier){
                this.livreMajQuantite.idlivre = i.id_livre
                let quantiteActuelle = this.livres.find(a => a.idlivre === i.id_livre)
                let nouvelleQuantite = quantiteActuelle.quantite - i.quantite
                if(nouvelleQuantite < 0){
                    alert('Vérifier les quantités ....')
                    return
                }
                this.livreMajQuantite.nouvelleQuantite = nouvelleQuantite
                livreAModifier.push([i.id_livre, nouvelleQuantite])
            }
            
                //requete pour mettre a jour les quantite dispo et vider le panier puis déconnecter l'utilisateur
                await axios.post('/api/confirmation/' + this.user.id, livreAModifier)
                alert('La réservation est confirmée, vous allez être déconnecté....')
                this.$router.push('/deconnexion')

        }
    }
})