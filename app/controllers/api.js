module.exports = {

    getMessage: function(req, res){
        res.send('API');
    },

    getError: function(req, res){
        var error = new Error("The error message");
        error.http_code = 404;
        console.log(error);
        res.status(500).json(error);
    }

}