var assert = require('assert');
var request = require('request');
var fs = require('fs');
describe('Create, Update, Delete', function() {
        this.timeout(5000);
    it('should create a new Agency, update it, verify the update, & delete it', function(done) {
        // Build and log the path
        var path = "https://" + process.env.AGENCY_ENDPOINT + '/agency';

        // Fetch the comparison payload
        require.extensions['.txt'] = function (module, filename) {
            module.exports = fs.readFileSync(filename, 'utf8' );
        };
        var desirePayload = require('./data/newAgency.json');

        // Create the new agency
        var options = {'url' : path, 'form': JSON.stringify(desirePayload)};
        request.post(options, function (err, res, body){
            if(err){
                throw new Error('Create call failed: ' + err);
            }
            assert.equal(200, res.statusCode, 'Create Status Code != 200 (' + res.statusCode + ')');
            var agency = JSON.parse(res.body);

            // Fetch the second payload
            require.extensions['txt'] = function(module, filename){
                module.exports = fs.readFileSync(filename, 'utf8');
            }
            var updatePayload = require('./data/updateAgency.json');
            var specificPath = path + '/' + agency.id;

            //Update the item
            var putOptions = {'url' : specificPath, 'form': JSON.stringify(updatePayload)};
            var updateAgency = JSON.parse(res.body);

            res.put(putOptions, function(err,res,body){
                if(updateAgency.text = updatePayload.text) {
                // Item updated, delete it
                request.del(specificPath, function (err,res, body){
                    if(err){
                        throw new Error('Delete call failed: ' + err);
                    }
                    assert.equal(200, res.statusCode, 'Delete Status Code !=200 (' + res.statusCode + ')');
                    done();
                    });
                }
                else{
                // Item not found, fail test
                assert.equal(true, false, 'New item not found in list.');
                done();
                }   
            });
        });
    });
});