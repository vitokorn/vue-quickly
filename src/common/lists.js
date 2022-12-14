export const Lists = {
    Ls: function(artists){
        //переделать в миксин
        const names = artists.map(({
                                       name
                                   }) => name);
        const finalName = names.pop();
        return names.length ?
            names.join(', ') + ' & ' + finalName :
            finalName;
    }
}