/*globals $, SimpleStorage, document*/

var addToLog = function(id, txt) {
  $(id + " .logs").append("<br>" + txt);
};


var signaturePad;
var signaturePadS;
var signaturePadB;
var signaturePadL;





//var canvas = document.querySelector("canvas");


function enthalpy(dataLength)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < dataLength; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


function resizeCanvas(){
  var ratio = Math.max(window.devicePixelRatio || 1,1);
  //canvas.width = canvas.offsetWidth * ratio;
  //canvas.height = canvas.offsetHeight * ratio;
  //canvas.getContext("2d").scale(ratio,ratio);


  canvasS = document.getElementById('SellerC');
  canvasB = document.getElementById('BuyerC');
  canvasL = document.getElementById('WitnessC');

  var allCanvas = [canvasS,canvasB,canvasL];



  for (var i =0; i<allCanvas.length;i++){
    if (!allCanvas[i]){continue;}
    allCanvas[i].width=allCanvas[i].offsetWidth * ratio;
    allCanvas[i].height = allCanvas[i].offsetHeight * ratio;
    allCanvas[i].getContext("2d").scale(ratio,ratio);
  }
}

function changeData(){

  canvasS = document.getElementById('SellerC');
  canvasB = document.getElementById('BuyerC');
  canvasL = document.getElementById('WitnessC');

  signaturePadS = new SignaturePad(canvasS);
  signaturePadB = new SignaturePad(canvasB);
  signaturePadL = new SignaturePad(canvasL);




}




// ===========================
// Blockchain example
// ===========================
$(document).ready(function() {

  var allAccounts;
  var godAddress;

  //canvas = document.querySelector("canvas");

///Start

$( ".HasSigniture" ).click(function( event ) {

  setTimeout(resizeCanvas, 1000);
  setTimeout(changeData,900);
  resizeCanvas();

});


window.onresize = resizeCanvas;






$( "#clearContract" ).click(function( event ) {
  event.preventDefault();
  signaturePad.clear();
});

$("#clearSeller").click(function() {
  signaturePadS.clear();
});


$("#clearBuyer").click(function() {
  signaturePadB.clear();
});


$("#clearWitness").click(function() {
  signaturePadL.clear();
});

$("#fileContractLawyer").click(function() {
    aData = JSON.stringify(
      {
        ContractText:$('#ContractC').val(),
        SignitureSeller:signaturePadS.toDataURL(),
        SignitureBuyer:signaturePadB.toDataURL(),
        SignitureLawyer:signaturePadL.toDataURL(),
        DateCreated:Date(),
        Enthalpy:enthalpy(32)
      }
    );
    $.post( "http://stonepapergaestorage.appspot.com/GrabInfo", {
      ID:aData,Key:web3.sha3(aData)
    }, function(data){
      var name = $('#nameC').val();
      var sellGo = $(".WalletG option:selected").text();
      var buyGo = $(".WalletH option:selected").text();
      var lawyerGo = $(".WalletF option:selected").text();
      var hash = web3.sha3(aData);
      StonePaper.createPaper(name,hash, 5000, [],12345,[], {from:lawyerGo,gas: 3000000});
      $(".theReturnC").html("Your contract has been saved in the Blockchain, you can read download the contract at <a href=http://stonepapergaestorage.appspot.com/GrabInfo?Key="+hash+">here</a> or read it with the token " +hash);
    } );
});


$("#getByToken").click(function() {
  $.get( "http://stonepapergaestorage.appspot.com/GrabInfo?Key="+$('#lookUpToken').val(),
  {},
  function(data){


    var targetData = $("#resultContract");
    targetData.empty();
    targetData.append("<div>"+ data.ContractText+ "</div>");
    targetData.append("<div><p>Seller Signiture</p><br><img width=600 src='"+ data.SignitureSeller+ "'></div>");
    targetData.append("<div><p>Seller Signiture</p><br><img width=600 src='"+ data.SignitureBuyer+ "'></div>");
    targetData.append("<div><p>Seller Signiture</p><br><img width=600 src='"+ data.SignitureLawyer+ "'></div>");
    targetData.append("<div>Contract Created On - "+ data.DateCreated+ "</div>");

  });
});


$("#getByAddressAndIndexC").click(function() {


  var index = $("#indexC").val();
  var targetAddress = $("getByAddressAndIndexC").text();

  StonePaper.getPapers(index,{gas: 3000000, from: targetAddress}).then(function(value) {
    var aHash = value[1];
    var aContract = value[6];
    if (aContract=="0x0000000000000000000000000000000000003039"){
      $.get( "http://stonepapergaestorage.appspot.com/GrabInfo?Key="+aHash,
      {},
      function(data){
        var targetData = $("#resultContract");
        targetData.empty();
        targetData.append("<div>"+ data.ContractText+ "</div>");
        targetData.append("<div><p>Seller Signiture</p><br><img width=600 src='"+ data.SignitureSeller+ "'></div>");
        targetData.append("<div><p>Seller Signiture</p><br><img width=600 src='"+ data.SignitureBuyer+ "'></div>");
        targetData.append("<div><p>Seller Signiture</p><br><img width=600 src='"+ data.SignitureLawyer+ "'></div>");
        targetData.append("<div>Contract Created On - "+ data.DateCreated+ "</div>");

      });


    }




  });
});

var newContractToBeSigned;

$("#fileContractLawyerNL").click(function() {
  var buyerAddress = $(".WalletI option:selected").text();
  var sellerAddress = $(".WalletJ option:selected").text();

  var aData = JSON.stringify(
    {
      ContractText:$('#ContractNL').val(),
      AddressSeller:sellerAddress,
      AddressBuyer:buyerAddress,
      DateCreated:Date(),
      Enthalpy:enthalpy(32)
    }
  );
  $.post( "http://stonepapergaestorage.appspot.com/GrabInfo", {
    ID:aData,Key:web3.sha3(aData)
  }, function(data){
    TwoPersonContract.deploy([buyerAddress,sellerAddress,web3.sha3(aData)], {gas: 3000000}).then(function(newContract) {
      newContractToBeSigned = newContract;
      $(".theReturnNL").html("Your contract has been saved 'unsigned' in the Blockchain, you can download the contract <a href=http://stonepapergaestorage.appspot.com/GrabInfo?Key="+web3.sha3(aData)+">here</a> and sign it below");
    });

  } );






});

$("#signBNL").click(function() {
  var buyerAddress = $(".WalletK option:selected").text();
  if (newContractToBeSigned){
    newContractToBeSigned.signOne({from:buyerAddress ,gas: 3000000}).then(function(){
    });
  }
});

$("#signSNL").click(function() {
  var sellerAddress = $(".WalletL option:selected").text();
  if (newContractToBeSigned){
    newContractToBeSigned.signTwo({from:sellerAddress ,gas: 3000000}).then(function(){
    });
  }
});

$("#isSignedSNL").click(function() {
  if (newContractToBeSigned){

    newContractToBeSigned.isSigned({gas: 3000000}).then(function(data){
      if (data==3){

        var name = $('#nameNL').val();
        var buyerAddress = $(".WalletK option:selected").text();
        var sellerAddress = $(".WalletL option:selected").text();
        //var hash = web3.sha3(aData);

        newContractToBeSigned.getInfo({gas: 3000000}).then(function(data){
          var name = $('#nameNL').val();
          StonePaper.createPaper(name,data[0], 5000,[],data[3],[data[1],data[2]], {from:data[1],gas: 3000000}).then(function(){
            alert("Contract Signed and has been placed into briefcase of both accounts");
          },function(){
            alert("Something Went Wrong");
          });

        });
      }else if (data==2){
        alert("Only Seller Signed");
      } else if (data == 1){
        alert("Only Buyer Signed");
      } else if (data == 0){
        alert("No one Signed");
      }

    });
  }
});


















///End















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
      $(".WalletF").append($('<option></option>').attr("value",allAccounts[counter]).text(allAccounts[counter]));
      $(".WalletG").append($('<option></option>').attr("value",allAccounts[counter]).text(allAccounts[counter]));
      $(".WalletH").append($('<option></option>').attr("value",allAccounts[counter]).text(allAccounts[counter]));
      $(".WalletI").append($('<option></option>').attr("value",allAccounts[counter]).text(allAccounts[counter]));
      $(".WalletJ").append($('<option></option>').attr("value",allAccounts[counter]).text(allAccounts[counter]));
      $(".WalletK").append($('<option></option>').attr("value",allAccounts[counter]).text(allAccounts[counter]));
      $(".WalletL").append($('<option></option>').attr("value",allAccounts[counter]).text(allAccounts[counter]));

      $(".LookUpAddress").append($('<option></option>').attr("value",allAccounts[counter]).text(allAccounts[counter]));
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

        StonePaper.createPaper(value1,web3.sha3(value2), 0, [],0 ,[targetAddress], {gas: 3000000,from:fromAddress});
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
          StonePaper.createPaper("Gas Recipt",0, indexV, [indexV],GasReceipt.address,[targetAddress], {gas: 3000000});
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
