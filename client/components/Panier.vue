<template>
<div>
    <div id="tablePanier">
        <table>
            <thead>
                <tr>
                    <th id="colCouverture">Couverture</th>
                    <th id="colTitre">Titre</th>
                    <th id="colAuteur">Auteur</th>
                    <th id="colResume">Résumé</th>
                    <th id="colDisponibilite">Quantité</th>
                    <th id="colAction">Actions</th>
                </tr>
            </thead>   
            <tbody>
                <tr v-for="livre,index in userPanierLivres" :key="index" :class="{'table-light':index % 2 == 0}">
                    <td><img :src="livre.image" alt="image de couverture"></td>
                    <td><span v-text="livre.titre"></span></td>
                    <td><span v-text="livre.auteur"></span></td>
                    <td><span v-text="livre.resume"></span></td>
                    <td v-if="editterQuantitePanier.id !== livre.idlivre">
                        <span v-text="livre.quantitePanier" v-if="editterQuantitePanier.id !== livre.idlivre"></span>
                        <p id="quantiteMaxPanier" v-if="editterQuantitePanier.id !== livre.idlivre">quantité max : {{livre.quantite}}</p>
                    </td>
                    <td v-else>
                        <input type="number" v-model="editterQuantitePanier.quantite" min="0" v-if="editterQuantitePanier.id === livre.idlivre">
                        <p id="quantiteMaxPanier" v-if="editterQuantitePanier.id === livre.idlivre">quantité max : {{livre.quantite}}</p>
                    </td>
                    
                    <td>
                        <button type="button" @click="supprimerLivrePanier(livre)" >Supprimer</button>
                        <button type="button"  @click="modifierQuantite(livre)" v-if="editterQuantitePanier.id === -1">Modifier</button>
                        
                        <button type="button"  @click="enregisterModif()" v-if="editterQuantitePanier.id === livre.idlivre">Enregistrer</button>
                    </td>
                </tr>   
            </tbody> 
        </table>
    </div>
    <div id="confirmationPanier">
        <h3>Souhaitez vous confirmer le panier {{user.nom}} {{user.prenom}} ?</h3>
        <button type="button" @click="confirmerPanier" id="boutonConfirmationPanier">Confirmer et réserver </button>
    </div>
</div>
    
</template>

<script>
module.exports = {
    props:{
        user:{ type: Object },
        livres:{ type: Array, default: [] },
        userPanierLivres : { type: Array, default: [] }
    },
    data(){
        panier = this.user.panierLivres
        return{
            panier,
            editterQuantitePanier:{
                id:-1,
                quantite:0,
                quantiteMax:0,
                idpanier:0
            }
        }
    },
    async mounted(){    
        await this.$emit('recuperer-livre-panier')
    },
    methods:{
        //supprimer un livre du panier
        supprimerLivrePanier(livre){
            const data = {
                idlivre:livre.idlivre,
                idpanier:this.user.id_panier
            }
            this.$emit('supprimer-livre-panier', data);
        },
        modifierQuantite(livre){
            this.editterQuantitePanier.id = livre.idlivre
            this.editterQuantitePanier.quantite = livre.quantitePanier
            this.editterQuantitePanier.quantiteMax = livre.quantite
            this.editterQuantitePanier.idpanier = this.user.id_panier
        },
        enregisterModif(){
            if(this.editterQuantitePanier.quantite > this.editterQuantitePanier.quantiteMax){
                alert('quantité supèrieur à ce qui est disponible !')
            }else{
                this.$emit('modifier-quantite-panier', this.editterQuantitePanier)
                this.editterQuantitePanier.id = -1
            }
        },
        confirmerPanier(){
            this.$emit('confirmer-panier')
        }

    },
    components:{
        
    }
}

</script>


<style scoped>
#tablePanier > table{
    border: 1.5px solid rgb(177, 176, 176);
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    border-collapse: collapse;
}

#tablePanier > table thead{
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

#tablePanier  td{
    border-bottom: solid rgb(177, 176, 176) 0.5px;
    border-right: solid 0.3px rgb(177, 176, 176);
}
#tablePanier  tr:last-child td{
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

#recherche  button{
    background-color: rgb(255, 167, 99);
    align-content: center;
    width: 10%;
    margin-top: 40px;
    margin-bottom: 25px;
    color: rgb(10, 0, 40);
    border: none;
}

#recherche button:hover{
    cursor: pointer;
    color: white;
}

#recherche form input{
    width: 60%;
}

#recherche form label{
    width: 10%;
}
</style>