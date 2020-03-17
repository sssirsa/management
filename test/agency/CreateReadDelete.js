var assert = require('assert');
var request = require('request');
var fs = require('fs');

describe('Create, Read, Delete', function(){
    this.timeout(5000);
    it('should create a new Agency, read it, & delete it', function(done) {
        // Build and log the path 
        var path = "https://" + process.env.AGENCY_ENDPOINT + "/agency";

        // Fetch the comparison payload
        require.extensions['.txt'] = function(module, filename){
            module.exports = fs.readFileSync(filename, 'utf8');
        };

        var desiredPayload = require('./data/newAgency.json');

        // Create a new Agency
        var options = {'url' :path, 'form': JSON.stringify(desiredPayload)};
        request.post(options, function(err, res, doby){
            if(err){
                    throw new Error(' Create call failed: ' + err);
            }
            assert.equal(200, res.statusCode, 'Create Status Code != 200 ('+ res.statusCode + ')');
            var agency = JSON.parse(res.body);
            // Read the item
            var specificPath = path + '/' + agency.id;
            request.get(path, function (err, res, body){
                if(err){
                    throw new Error('Read call failed: ' + err);
                }
                assert.equal(200, res.statusCode, 'Read Staatuss Code != 200 ('+ res.statusCode +')');

                var List = JSON.parse(res.body);
                if(List.text = desiredPayload.text) {
                    // Item found, delete it
                    request.del(specificPath, function(err, res, body){
                        if(err){
                            throw new Error('Delete call failed: ' + err);
                        }
                        assert.equal(200, res.statusCode, 'Delete Status Code !=200 (' + res.statusCode +')');
                    });
                } else {
                    // Item not found, fail test
                    assert.equal(true, false, 'New item not found in list.');
                    done();
                }
            });
        });
    });
});