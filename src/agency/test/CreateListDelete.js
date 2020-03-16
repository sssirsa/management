var assert = require('assert');
var request = require('request');
var fs = require('fs');

descrice('Create, List, Delete', function() {
        this.timeout(5000);
    it('should create a new Tod, list it, & delete it', function(done) {
        // Build and log the path
        var path = "https://" + process.env.TODOS_ENDPOINT + '/agency';

        // Fetch the comparison payload
        require.extensions['.txt'] = function (module, filename){
            module.exports = fs.readFileSync(filename, 'utf8');
        };
        var desiredPayload = require('./data/newAgency.json');

        // Create the new agency
        var options = {'url': path, 'form': JSON.stringify(desiredPayload)};
        request.post(options, function(err,res,body){
            if(err){
                throw new Error('List call failed: ' + err);
            }
            assert.equal(200, res.statusCode, 'List Status Code !=200 ('+ res.statusCode +')');
            var List = JSON.parse(res.body);
				if(List[List.length-1].text = desiredPayload.text)	{
					// Item found, delete it
					var deletePath = path + "/" + List[List.length-1].id;
		 			request.del(deletePath, function (err, res, body){ 
						if(err){
							throw new Error("Delete call failed: " + err);
						}
						assert.equal(200, res.statusCode, "Delete Status Code != 200 (" + res.statusCode + ")"); 
						done();   
		  			});
				} else {
					// Item not found, fail test
					assert.equal(true, false, "New item not found in list."); 
					done();
				} 
        });
    });
});