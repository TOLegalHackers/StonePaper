/*globals $, SimpleStorage, document*/

var addToLog = function(id, txt) {
  $(id + " .logs").append("<br>" + txt);
};

// ===========================
// Blockchain example
// ===========================
$(document).ready(function() {

  var allAccounts;
  var godAddress;

  web3.eth.getAccounts(function(error, result){
    allAccounts = result;
    godAddress = allAccounts[0];
    for (var counter = 0; counter< allAccounts.length; counter++){
      $(".WalletA").append($('<option></option>').attr("value",allAccounts[counter]).text(allAccounts[counter]));
      $(".WalletB").append($('<option></option>').attr("value",allAccounts[counter]).text(allAccounts[counter]));
      $(".WalletLawyer").append($('<option></option>').attr("value",allAccounts[counter]).text(allAccounts[counter]));
      $(".WalletLawyerGet").append($('<option></option>').attr("value",allAccounts[counter]).text(allAccounts[counter]));
      $(".PapersPlease").append($('<option></option>').attr("value",allAccounts[counter]).text(allAccounts[counter]));
      $(".FromAddress").append($('<option></option>').attr("value",allAccounts[counter]).text(allAccounts[counter]));
      $(".ToAddress").append($('<option></option>').attr("value",allAccounts[counter]).text(allAccounts[counter]));





    }



  });



  $("#blockchain button.setGod").click(function() {
    StonePaper.addSupervisor(0, {gas: 3000000}).then(function(){
      addToLog("#blockchain", "User has been set as God" );
    },function(){
      alert("You can't change God");
    });
  });



  $("#blockchain button.getGod").click(function() {
    StonePaper.getGod({gas: 3000000}).then(function(value) {
      godAddress = value;
      $("#blockchain .godValue").html(value);
      addToLog("#blockchain", "Address of God has been returned");
    });
  });


  $("#blockchain button.setLawyer").click(function() {
    var value = $("#blockchain input.lawyerName").val();
    var targetAddress = $(".WalletLawyerGet option:selected").text();
    StonePaper.assignLawyer(value, {gas: 3000000, from:targetAddress}).then(
      function(){
        addToLog("#blockchain", "Set Lawyer Name" );
      }, function(){
        alert("You only can't change your name once it's been assiged.");
      });
    });


    $("#blockchain button.getLawyer").click(function() {
      var targetAddress = $(".WalletLawyerGet option:selected").text();
      StonePaper.getLawyer(targetAddress,{gas: 3000000}).then(function(value) {
        $("#blockchain .lawyerValue").html(value);
        addToLog("#blockchain", "Got Lawyer Name");
      });
    });


    $("#blockchain button.setUrl").click(function() {
      var value = $("#blockchain input.urlName").val();
      StonePaper.assignDatabase(value,0, {gas: 3000000}).then(
        function(){
          addToLog("#blockchain", "Database URL set" );
        }, function(){
          alert("You only can't change the database URL once it's been assigned");
        });

      });


      $("#blockchain button.getUrl").click(function() {
        StonePaper.getDatabase(0,{gas: 3000000}).then(function(value3) {
          $("#blockchain .urlValue").html(value3);
          addToLog("#blockchain", "Database URL Gotten");
        });
      });


      $("#blockchain button.setPaper").click(function() {
        var value1 = $("#blockchain input.docName").val();
        var value2 = $("#blockchain input.docText").val();
        var fromAddress = $(".FromAddress option:selected").text();
        var targetAddress = $(".ToAddress option:selected").text();

        StonePaper.createPaper(value1,web3.sha3(value2), 0, [],0 ,targetAddress, {gas: 3000000,from:fromAddress});
        addToLog("#blockchain", "Paper saved to URL" );
      });







      $("#blockchain button.getPaper").click(function() {
        var index = $("#blockchain input.indexV").val();
        var targetAddress = $(".PapersPlease option:selected").text();
        StonePaper.getPapers(index,{gas: 3000000, from: targetAddress}).then(function(value) {
          $("#blockchain .NameV").html(value[0]);
          $("#blockchain .HashV").html(value[1]);


          StonePaper.getDatabase(value[2],{gas: 3000000}).then(function(value3) {
            $("#blockchain .UrlV").html(value3);
          });

          StonePaper.getLawyer(value[4],{gas: 3000000}).then(function(value4) {
            $("#blockchain .LawyerV").html(value4);
          });



          $("#blockchain .TimeV").html(value[3].toNumber());


          addToLog("#blockchain", "Paper at index " + index + " recieved" );

        },function(){
          alert('No Paper Found');
        });
      });



      $(".setGasRecipt").click(function() {
        var targetAddress = $(".WalletA option:selected").text();
        var value2 = $(".ReciptName").val();
        GasReceipt.createReceipt(targetAddress,value2, {gas: 3000000}).then(function(){
          StonePaper.getLastPaperFromContract(targetAddress,GasReceipt.address,{gas: 3000000}).then(function(result){
            if (result){
              }else {
            }
          },function(){
            console.log("Creating Doc");
            var indexV = new web3.BigNumber(123);
            StonePaper.getMeta(indexV).then(function(result){
              if (result){
              }else{
                var indexV = new web3.BigNumber(123);
                StonePaper.assignMeta("Gas Recipts",indexV,{gas: 3000000}).then(function(){
                },function(){
                });
              }
            });
            StonePaper.getDatabase(indexV, function(err, result) {
              if (result){
              } else {
                var indexV = new web3.BigNumber(123);
                StonePaper.assignDatabase("Gas Recipt",indexV,{gas: 3000000}).then(function(){
                },function(){
                }
              );
            }
          });
          StonePaper.createPaper("Gas Recipt",0, indexV, [indexV],GasReceipt.address,targetAddress, {gas: 3000000});
        });
      });
    });




    $(".WalletB").change(function() {
      var targetAddress = $(".WalletB option:selected").text();
      var indexCount = -1;
      var data = [];
      var circularCall = function(recived){
        indexCount++;
        if (recived){
        data.push(recived);
        }
        GasReceipt.getReceipt(targetAddress,indexCount,{gas: 3000000}).then(circularCall,function(){
          $(".Results").empty();
          for (var counter = 0; counter<data.length; counter++){
            $(".Results").append($('<option></option>').attr("value",data[counter]).text(data[counter]));
          }
        });
      };
      circularCall();
    });
  });
