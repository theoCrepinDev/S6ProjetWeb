<template>
    
</template>

<script>
module.exports = {
    props:{
        user:{type: Object},
        utilisateurConnecte:{type: Number},
        nomUtilisateurConnecte:{type: String},
        prenomUtilisateurConnecte:{type:String}
    },
    data(){

        return{

        }
    },
    async mounted(){
        this.$emit('deconnexion')
        this.$router.push('/loginsingup')
    },
    methods:{

    },
    components:{
        
    }
}

</script>