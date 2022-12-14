export default {
    methods: {
        prefered: function (){
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
                console.log('54 prefered dark')
                return "dark"
            } else {
                if (localStorage.getItem('user-theme')){
                    return localStorage.getItem('user-theme')
                } else {
                    return "dq"
                }
            }
        }
    }
}
