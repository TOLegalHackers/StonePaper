var assert = require('assert');
var Embark = require('embark');
var EmbarkSpec = Embark.initTests();
var web3 = EmbarkSpec.web3;

describe("StonePaper Tests", function() {
  before(function(done) {
    var contractsConfig = {
      "StonePaper":{
        "gas": 'auto',
      },
      "GasReceipt":{
        "gas": 'auto',
      },
      "HumanID":{
        "args":["$StonePaper"],
        "gas": 'auto',
      }
    };
    EmbarkSpec.deployAll(contractsConfig, done);
  });


  var defaultAccount;


  web3.eth.getAccounts(function(error, result){
    //console.log(result);
    defaultAccount= result[0];
  });

  it("Check If God User is set", function(done) {

    StonePaper.getGod( function(err, result) {
      primaryWallet = result;
      assert.equal(primaryWallet, defaultAccount);
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
    StonePaper.createPaper("Test Paper",web3.sha3('A Signiture'),0,[],0,[],{gas: 3000000}, function(err) {
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
    StonePaper.createPaper("Test Paper with Meta",web3.sha3('A Signiture'),0,[1],0,[],{gas: 3000000}, function(err) {
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


  it("Create HumanID", function(done) {

    StonePaper.assignMeta("HumanID",2,{gas: 3000000}, function(err) {

      if (err){
        console.log(err);
        fail();
      }else{
      }
    });

    StonePaper.assignDatabase("HumanID",2, function() {});


    var aGas = "Human Data";
    HumanID.createID(defaultAccount,aGas,web3.sha3(aGas),{gas: 3000000}, function(err) {
      if (err){
        console.log(err);
        fail();
      }else{
        StonePaper.createPaper("Human Data",0,2,[2], HumanID.address,[],{gas: 3000000}, function(err) {
          if (err){
            console.log(err);
            fail();
          }else{
            StonePaper.getPaperFromMeta(2,0, function(err, result) {
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

      }
    });
  });




  it("Create GasReceipt", function(done) {

    StonePaper.assignMeta("Gas Recipt",3,{gas: 3000000}, function(err) {

      if (err){
        console.log(err);
        fail();
      }else{
      }
    });

    StonePaper.assignDatabase("Gas Recipt",3, function() {});


    var aGas = "Gas Recipt";
    GasReceipt.createReceipt(defaultAccount,aGas,{gas: 3000000}, function(err) {
      if (err){
        console.log(err);
        fail();
      }else{

        StonePaper.createPaper("Gas Recipt",0,3,[3], GasReceipt.address,[],{gas: 3000000}, function(err) {

          if (err){
            console.log(err);
            fail();
          }else{
            GasReceipt.getReceipt(defaultAccount,0,{gas: 3000000}, function(err,result) {
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
      }
    });
  });
















});
