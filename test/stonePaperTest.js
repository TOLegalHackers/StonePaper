var assert = require('assert');
var Embark = require('embark');
var EmbarkSpec = Embark.initTests();
var web3 = EmbarkSpec.web3;

describe("StonePaper Tests", function() {
  before(function(done) {
    var contractsConfig = {
      "SimpleStorage": {
        args: [100]
      },
      "StonePaper":{
        "gas": 3000000,
      }
    };
    EmbarkSpec.deployAll(contractsConfig, done);
  });



  it("Set God User", function(done) {
    StonePaper.addSupervisor(0, function() {
        done();
      });
  });

  //var tx = {from: web3.eth.accounts[1]};
  var primaryWallet;


  it("Check If God User is set", function(done) {

    StonePaper.getGod( function(err, result) {
      primaryWallet = result;

      assert.notEqual(primaryWallet, 0);
      done();
    });

  });

  it("Assign a name to the Lawyer", function(done) {
    StonePaper.assignLawyer("Lawyer McLawyerFace", function() {
      StonePaper.getLawyer(web3.toHex(primaryWallet), function(err, result) {
        if (err){
          console.log(err);
          fail();
        }else{
          done();
        }

      });
    });
  });


  it("Assign a URL to the database", function(done) {
    StonePaper.assignDatabase("www.urlstore.com/getID?=",0, function() {
      StonePaper.getDatabase(0, function(err, result) {
        assert.equal(result, "www.urlstore.com/getID?=");
        done();
      });
    });
  });


  it("Create a Paper", function(done) {
    StonePaper.createPaper("Test Paper",web3.sha3('A Signiture'),0,[],{gas: 3000000}, function(err) {
      if (err){
        console.log(err);
        fail();
      }else{
        StonePaper.getPapers(0, function(err, result) {

          if (err){
            console.log(err);
            fail();
          }else{
            console.log(result);
          done();
          }
            });
      }
    });
  });

  it("Create a Meta", function(done) {
      StonePaper.assignMeta("Test Meta",1,{gas: 3000000}, function(err) {

        if (err){
          console.log(err);
          fail();
        }else{


        done();
        }
      });
  });



  it("Create a Paper With Meta", function(done) {
    StonePaper.createPaper("Test Paper with Meta",web3.sha3('A Signiture'),0,[1],{gas: 3000000}, function(err) {
      if (err){
        console.log(err);
        fail();
      }else{
        StonePaper.getPaperFromMeta(1,0, function(err, result) {
          if (err){
            console.log(err);
            fail();
          }else{
            console.log(result);
          done();
          }
            });
      }
    });
  });















/*
  it("should set constructor value", function(done) {
    SimpleStorage.storedData(function(err, result) {
      assert.equal(result.toNumber(), 100);
      done();
    });
  });

  it("set storage value", function(done) {
    SimpleStorage.set(150, function() {
      SimpleStorage.get(function(err, result) {
        assert.equal(result.toNumber(), 150);
        done();
      });
    });
  });
*/
});
