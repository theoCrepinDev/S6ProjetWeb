<template>
    <div>
        <div id="cadre">
            <div id="connexionInscription">
                <button @click="switchConnexionInscription('connexion')" class="bouttonChoixConnexionFormulaire" id="bouttonChoixConnexion" :style="{color:couleurBtnConnexion}">Connexion</button>
                <p> | </p>
                <button @click="switchConnexionInscription('inscription')" class="bouttonChoixInscriptionFormulaire" id="bouttonChoixInscription" :style="{color:couleurBtnInscription}">Inscription</button>
            </div>   
            <div id="formulaireInscrition" v-if="choixConnexionInscription === 'inscription'">
                <form id="formInscription" @submit.prevent="inscriptionPersonne">
                    <div id="divNomInscription">
                        <label for="nomInscription">Nom :</label>
                        <input type="text" name="nomInscription" id="nomInscription" placeholder="Entrer votre nom" v-model="personneInscription.nom" required>
                    </div>
                    <div id="divPrenomInscription">
                        <label for="prenomInscription">Prénom :</label>
                        <input type="text" name="prenomInscription" id="prenomInscription" placeholder="Entrer votre prénom" v-model="personneInscription.prenom" required>
                    </div>
                    <div id="divEmailInscription">
                        <label for="emailInscription">Addresse email :</label>
                        <input type="text" name="emailInscription" id="emailInscription " placeholder="Entrer votre addresse email" v-model="personneInscription.email" required>
                    </div>
                    <div id="divPasseInscription">
                        <label for="passeInscription">Mot de passe</label>
                        <input type="password" name="passeInscription" id="passeInscription" placeholder="Choisissez un mot de passe" v-model="personneInscription.motDePasse" required>
                    </div>
                    <button type="submit" id="bouttonInscription" class="bouttonSubmitConnexionInscription">Inscription</button>
                </form>
            </div>
            <div id="formulaireConnexion" v-else>
                <form id="formConnexion" @submit.prevent="login">
                    <div id="divEmailConnexion">
                        <label for="emailConnexion">Email :</label>
                        <input type="text" name="emailConnexion" id="emailConnexion" placeholder="Entrer votre addresse email" v-model="personneConnexion.email" required>
                    </div>
                    <div id="divPassConnexion">
                        <label for="passeConnexion">Mot de passe :</label>
                        <input type="password" name="passeConnexion" id="passeConnexion" placeholder="Entrer votre mot de passe" v-model="personneConnexion.motDePasse" required>
                    </div>
                    <button id="bouttonConnexion" type="submit" class="bouttonSubmitConnexionInscription">Connexion</button>
                </form>
            </div>
        </div> 
    </div>

</template>

<script>
module.exports = {
    props:{
        user:{type: Object}
    },
    data(){
        return{
            choixConnexionInscription : "connexion",
            personneConnexion: {
                email:'',
                motDePasse:''
            },
            personneInscription: {
                email:'',
                motDePasse: '',
                nom:'',
                prenom:'',
                admin:'false'
            },
            couleurBtnConnexion: 'rgb(255, 254, 254)',
            couleurBtnInscription: 'rgb(190, 190, 190)'
        }
    },
    methods:{
        //Méthode qui met la variable choixConnexionInscription à la valeur connexion ou inscription
        switchConnexionInscription(choix){
            if(choix === "connexion"){
                this.couleurBtnConnexion = 'rgb(255, 254, 254)';
                this.couleurBtnInscription =  'rgb(190, 190, 190)';
                this.choixConnexionInscription = "connexion";
            }else{
                this.couleurBtnInscription = 'rgb(254, 254, 254)';
                this.couleurBtnConnexion =  'rgb(190, 190, 190)';
                this.choixConnexionInscription = "inscription";
            }
        },
        async login(){
            this.$emit('login', this.personneConnexion)
        },
        async inscriptionPersonne(){
            let res = await axios.post('/api/register/', this.personneInscription)
            if(res.data.message === "Utilisateur déjà enregistré, essayez de vous connecter !"){
                alert("Utilisateur déjà enregistré, essayez de vous connecter !")
            }else{
            
                alert('Vous êtes inscrit, connectez vous pour accéder au site !')
                this.$router.push("./loginsingup")
                this.choixConnexionInscription = "connexion"
            }
        }
    },
    components:{

    }
}
</script>

<style scoped>
*{
    font-family: Verdana, Geneva, Tahoma, sans-serif;
}

/* Cadre */
#cadre{
    border: solid 1px black;
    width: 35%;
    min-width: 550px;
    background-color: rgb(10, 0, 40) ;
    border-radius: 2px;
    margin: auto;
    box-shadow: 8px 4px 4px black ;
}

/* Décoration Bouttons */
#cadre button{
    text-decoration: none;
    border: none;
    text-transform: uppercase;
    font-weight: bold;
}

/* Choix Connexion ou inscription */
#connexionInscription{
    display: flex;
    flex-direction: row;
    width: 45%;
    justify-content: space-between;
    padding-left: 15%;
    padding-top: 30px;
    padding-bottom: 30px;
}

#connexionInscription > p {
    color: rgb(177, 176, 176);
}

#connexionInscription > button{
    cursor: pointer;
    background: none;
}

.bouttonSubmitConnexionInscription{
    background-color: rgb(255, 167, 99);
    align-content: center;
    width: 70%;
    margin-left: 15%;
    margin-top: 40px;
    margin-bottom: 25px;
    color: rgb(10, 0, 40);
}

.bouttonSubmitConnexionInscription:hover{
    cursor: pointer;
    color: white;
}

/* Champs de saisie Connexion */

#formConnexion, #formInscription{
    display: flex;
    flex-direction: column;
    height: 60%;
    justify-content: space-between;
}
#formConnexion > div, #formInscription > div{
    margin-bottom: 10px;
}

#divEmailConnexion, #divPassConnexion, #divEmailInscription, #divPasseInscription, #divPrenomInscription, #divNomInscription, #divEstAdmin{
    display: flex;
    flex-direction: column;
    width:70%;
    margin-left:15%;
}

#divEmailConnexion label, #divPassConnexion label, #divEmailInscription label, #divPasseInscription ,#divPrenomInscription label, #divNomInscription label,#divEstAdmin label{
    color: white;
}


</style>