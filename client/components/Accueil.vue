<template>
    <div id="cadreAccueil">
        <h2>Bienvenue sur la bibliothèque de <span id="h1BleuEfrei">Efrei Paris</span></h2>
        <p>Sur ce site web, vous pouvez parcourir l'ensemble des ressources disponibles à la bibliothèque et sélectionner les éléments disponible pour commencer leur réservation.</p>
        <p>Une fois la réservation confirmée, vous n'avez plus qu'à venir récupérer vos documents sur site !</p>
        <h3>Bonne visite !</h3>
    </div>
</template>

<script>
module.exports = {
    props:{

    },
    data(){

        return{

        }
    },
    methods:{

    },
    components:{
        
    }
}

</script>

<style scoped>
#cadreAccueil{
    width: 80%;
    border: solid 0.3px black ;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    background-image: url('../images/fondAccueil.gif');
    color: white;
}

#h1BleuEfrei{
    color: #137bc0;
}
</style>