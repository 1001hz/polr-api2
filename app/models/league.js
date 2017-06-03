var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MembersSchema = new Schema({
    userId: { type: String }
});

var LeagueSchema = new Schema({
    name: { type: String, required: true },
    startDate: { type: String, required: true },
    frequency: { type: String, required: true },
    mediaType: { type: String, required: true },
    members: [MembersSchema],
    ownerId: { type: String, required: true }
});

LeagueSchema.methods.updateFields = function (clientLeague) {
    return {
        name: clientLeague.name ? clientLeague.name : this.name,
        startDate: clientLeague.startDate ? clientLeague.startDate : this.startDate,
        frequency: clientLeague.frequency ? clientLeague.frequency : this.frequency,
        mediaType: clientLeague.mediaType ? clientLeague.mediaType : this.mediaType
    };
};
module.exports = mongoose.model('League', LeagueSchema);