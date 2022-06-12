<template>
    <div id="divCatalogue">
        <div id="recherche">   
            <form @submit.prevent="rechercherLivre" >
                <label for="nomRecherche">Titre du livre cherché :</label>
                <input type="text" name="nomRecherche" id="nomRecherche" v-model="nomLivreRecherche" placeholder="Entrer le nom du livre recherché ..." required>
                <button type="submit" id="bouttonRechercher">Recherhcher</button>
                <button type="button" @click="annulerRecherche" id="bouttonRechercher">Annuler</button>
            </form>
        </div>
        <div id="tableauCatalogue">
            <table>
                <thead>
                    <tr>
                        <th id="colCouverture">Couverture</th>
                        <th id="colTitre">Titre</th>
                        <th id="colAuteur">Auteur</th>
                        <th id="colResume">Résumé</th>
                        <th id="colDisponibilite">Disponibilité</th>
                        <th id="colAction">Actions</th>
                    </tr>
                </thead>   
                <tbody>
                    <tr v-for="livre,index in livres" :key="livre.idlivre" :class="{'table-light':index % 2 == 0}" v>
                        <td v-if="livre.idlivre !== editterLivre.id"><img :src="livre.image" alt="image de couverture"></td>
                        <td v-if="livre.idlivre === editterLivre.id"><input type="text" v-model="editterLivre.image"></td>
                        <td v-if="livre.idlivre !== editterLivre.id"><span v-text="livre.titre"></span></td>
                        <td v-if="livre.idlivre === editterLivre.id"><input type="text" v-model="editterLivre.titre"></td>
                        <td v-if="livre.idlivre !== editterLivre.id"><span v-text="livre.auteur"></span></td>
                        <td v-if="livre.idlivre === editterLivre.id"><input type="text" v-model="editterLivre.auteur"></td>
                        <td v-if="livre.idlivre !== editterLivre.id"><span v-text="livre.resume"></span></td>
                        <td v-if="livre.idlivre === editterLivre.id"><textarea v-model="editterLivre.resume" maxlength="10000" style="height: 166px; width: 519px;"></textarea></td>
                        <td v-if="livre.idlivre !== editterLivre.id"><span v-text="livre.quantite"></span></td>
                        <td v-if="livre.idlivre === editterLivre.id"><input type="number" v-model="editterLivre.quantit"></td>
                        <td v-if="livre.idlivre !== editterLivre.id" class="tdButtonsCatalogues">
                            <button type="button" @click="ajouter(livre)" v-if="livre.quantite !== 0">Ajouter</button>
                            <button type="button"  @click="modifier(livre)" v-if="user.type === 'admin'">Modifier</button>
                        </td>
                        <td v-if="livre.idlivre === editterLivre.id" class="tdButtonsCatalogues">
                            <button type="button" @click="enregistrerModif()" >Enregister</button>
                            <button type="button"  @click="supprimerLivre(livre.idlivre)" v-if="user.type === 'admin'">Supprimer</button>
                        </td>
                    </tr>   
                </tbody> 
            </table>
        </div>
        <button type="button" @click="switchAjouterLivre(true)" id="bouttonAjouterLivre" v-if="user.type === 'admin'" >Ajouter un Livre</button>
        <div id="ajoutLivre" v-if="veuxAjouterLivre === true">
            <div id="Bloc1">
                <div>
                    <h2 id="Ajoutlivre"> Ajouter un nouveau livre </h2>
                </div>
                <form>
                    <label id="titre" for="ititre"> Titre </label>
                    <input type="text" size="55" id="ititre" name="ititre" v-model="ajoutLivreCatalogue.titre" required/>
                    <br/>
                    <label id="auteur" for="iauteur"> Auteur </label>
                    <input type="text" size="55" id="iauteur" name="iauteur" v-model="ajoutLivreCatalogue.auteur" required>
                    <br/>
                    <label id="edition" for="resume"> Résume </label>
                    <textarea type="text" maxlength="10000" style="height: 166px; width: 519px;" id="resume" required name="resume" v-model="ajoutLivreCatalogue.resume"></textarea>
                    <br/>
                    <label id="description" for="quantite"> Quantite </label>
                    <input type="number" min="1" id="quantite" name="quantite" v-model="ajoutLivreCatalogue.quantite" required>
                    <br/>
                    <label id="image"> Image du livre </label>
                    <input type="text" size="55" id="iimage" name="iimage" v-model="ajoutLivreCatalogue.image" required>
                    <br/>
                    <button @click.prevent="ajouterLivreCatalogue" class="bouttonsAjoutLivre"> Ajouter </button>
                    <button type="button" class="bouttonsAjoutLivre" @click="switchAjouterLivre(False)">Annuler</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>

module.exports = {
    props:{
        livres:{ type: Array, default: [] },
        user:{ type : Object }
    },
    data(){

        return{
            nomLivreRecherche:'',
            editterLivre:{
                id: -1,
                titre:'',
                auteur:'',
                resume:'',
                image:'',
                quantit:-1

            },
            ajoutLivrePanier:{
                id_livre:-1,
                id_panier:this.user.id_panier,
                quantite:1

            },
            ajoutLivreCatalogue:{
                titre:'',
                resume:'',
                auteur:'',
                quantite:0,
                image:'',
            },
            veuxAjouterLivre: false
        }
    },
    async mounted(){
       this.$emit('recuperer-tous-livres')
    },
    methods:{
        rechercherLivre(){
            this.$emit('rechercher-livre', this.nomLivreRecherche);
        },
        ajouter(livre){
            this.ajoutLivrePanier.id_livre = livre.idlivre;
            this.$emit('ajout-livre-panier', this.ajoutLivrePanier)
        },
        modifier(livre){
            this.editterLivre.id = livre.idlivre;
            this.editterLivre.titre = livre.titre;
            this.editterLivre.auteur = livre.auteur;
            this.editterLivre.resume = livre.resume;
            this.editterLivre.image = livre.image;
            this.editterLivre.quantit = livre.quantite;
        },
        annulerRecherche(){
            this.$emit('recuperer-tous-livres')
        },
        enregistrerModif(){
            this.$emit('mettre-a-jour-livre',this.editterLivre)
            this.editterLivre.id = -1
        },
        supprimerLivre(idlivre){
            this.$emit('supprimer-livre', idlivre)
        },
        switchAjouterLivre(choix){
            if(!choix){
                this.veuxAjouterLivre = choix
                this.ajoutLivreCatalogue.titre = ''
                this.ajoutLivreCatalogue.auteur = ''
                this.ajoutLivreCatalogue.resume = ''
                this.ajoutLivreCatalogue.quantite = 0
                this.ajoutLivreCatalogue.image = ''               
            }
            this.veuxAjouterLivre = choix
        },
        ajouterLivreCatalogue(){
            this.$emit('ajouter-livre-catalogue', this.ajoutLivreCatalogue)
            this.ajoutLivreCatalogue.titre = ''
            this.ajoutLivreCatalogue.auteur = ''
            this.ajoutLivreCatalogue.resume = ''
            this.ajoutLivreCatalogue.quantite = 0
            this.ajoutLivreCatalogue.image = ''
            this.switchAjouterLivre(false);
        }
    },

    components:{

    }
}

</script>

<style scoped>
#tableauCatalogue > table{
    border: 1.5px solid rgb(177, 176, 176);
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    border-collapse: collapse;
}

#tableauCatalogue > table thead{
    border: 1.5px solid rgb(177, 176, 176);
}

#colCouverture{
    width: 6%;
    border-right: solid 0.3px rgb(177, 176, 176);
}

#colResume{
    border-right: solid 0.3px rgb(177, 176, 176);
}

#colDisponibilite{
    width: 2%;
    border-right: solid 0.3px rgb(177, 176, 176);
}

#colAction{
    width: 4%;
}

#colTitre{
    width: 9%;
    border-right: solid 0.3px rgb(177, 176, 176);
}

#colAuteur{
    width: 7%;
    border-right: solid 0.3px rgb(177, 176, 176);
}

#tableauCatalogue  td{
    border-bottom: solid rgb(177, 176, 176) 0.5px;
    border-right: solid 0.3px rgb(177, 176, 176);
}
#tableauCatalogue  tr:last-child td{
    border-bottom: 0;
}

/* Style bare de recherche*/
#divCatalogue{
    display:flex;
    flex-direction: column;
}

#recherche{
    width:80%;
    margin-left: 10%;
    margin-bottom: 30px;
}

#recherche  button, .bouttonsAjoutLivre, #bouttonAjouterLivre, #tableauCatalogue button{
    background-color: rgb(255, 167, 99);
    align-content: center;
    width: 10%;
    margin-top: 40px;
    margin-bottom: 25px;
    color: rgb(10, 0, 40);
    border: none;
}

#tableauCatalogue button{
    width: 90%;
}

#bouttonAjouterLivre{
    margin-left: auto;
    margin-right: auto;
}

#recherche button:hover, .bouttonsAjoutLivre:hover, #bouttonAjouterLivre:hover,  #tableauCatalogue button:hover{
    cursor: pointer;
    color: white;
}

#recherche form input{
    width: 60%;
}

#recherche form label{
    width: 10%;
}

/* Style formulaite ajout livre */
#Bloc1{
    text-align: center;
    font-size: 100%;
    border: 3px solid white ;
    margin: 5% 30% 5% 30%;
    cursor: auto;
    
}

</style>