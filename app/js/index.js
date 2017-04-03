/*globals $, SimpleStorage, document*/

var addToLog = function(id, txt) {
  $(id + " .logs").append("<br>" + txt);
};

var serverAddress = "http://stonepapergaestorage.appspot.com";
//var serverAddress = "http://localhost:41080";

var signaturePad;
var signaturePadS;
var signaturePadB;
var signaturePadL;

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



  $("#fileAffidavit").click(function() {

    aData = JSON.stringify(
      {
        Title:$('#nameA').val(),
        Affidavit:$('#ContractA').val(),
        DateCreated:Date(),
        Enthalpy:enthalpy(32)
      }
    );
    $.post( serverAddress+"/GrabInfo", {
      ID:aData,Key:web3.sha3(aData)
    }, function(data){
      var name = $('#nameA').val();
      var hash = web3.sha3(aData);
      StonePaper.createPaper(name,hash, 0, [],54321,[], {gas: 3000000}).then(function(){
        clearAllPaper();
      },
      function(){
        alert("Error creating document");
      });
      $(".theReturnA").html("Your Affidavit has been saved in the Blockchain, you can read is Briefcase.");
    } );



  });


  $("#fileContractLawyer").click(function() {
    aData = JSON.stringify(
      {
        Title:$('nameC').val(),
        ContractText:$('#ContractC').val(),
        SignitureSeller:signaturePadS.toDataURL(),
        SignitureBuyer:signaturePadB.toDataURL(),
        SignitureLawyer:signaturePadL.toDataURL(),
        DateCreated:Date(),
        Enthalpy:enthalpy(32)
      }
    );
    $.post( serverAddress+"/GrabInfo", {
      ID:aData,Key:web3.sha3(aData)
    }, function(data){
      var name = $('#nameC').val();
      var sellGo = $(".WalletG option:selected").val();
      var buyGo = $(".WalletH option:selected").val();
      var lawyerGo = $(".WalletF option:selected").val();
      var hash = web3.sha3(aData);
      StonePaper.createPaper(name,hash, 0, [],12345,[], {gas: 3000000}).then(function(){clearAllPaper();});
      $(".theReturnC").html("Your contract has been saved in the Blockchain, you can read it in your briefcase" );
    } );
  });

  function generateContractNoSigHTML(data){
    return "<div>"+ data.Title+ "</div>" +"<div>"+ data.ContractText+ "</div><div>Contract Created On - "+ data.DateCreated+ "</div>";


  }



  function generateContractHTML(data){
    return "<div>"+ data.Title+ "</div>" +"<div>"+ data.ContractText+ "</div><div><p>Seller Signiture</p><br><img width=600 src='"+ data.SignitureSeller+ "'></div><div><p>Seller Buyer</p><br><img width=600 src='"+ data.SignitureBuyer+ "'></div><div><p>Seller Laywer</p><br><img width=600 src='"+ data.SignitureLawyer+ "'></div><div>Contract Created On - "+ data.DateCreated+ "</div>";

  }

  function generateAffidavit(data){
    return "<div>"+ data.Title+ "</div>" + "<div>"+ data.Affidavit+ "</div>" + "<div>Contract Created On - "+ data.DateCreated+ "</div>";
  }

  $("#getByToken").click(function() {
    $.get( serverAddress+"/GrabInfo?Key="+$('#lookUpToken').val(),
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
    var targetAddress = $("getByAddressAndIndexC").val();
    StonePaper.getPapers(index,{from: targetAddress}).then(function(value) {
      var aHash = value[1];
      var aContract = value[6];
      if (aContract=="0x0000000000000000000000000000000000003039"){
        $.get( serverAddress+"/GrabInfo?Key="+aHash,
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
    var buyerAddress = $(".WalletI option:selected").val();
    var sellerAddress = $(".WalletJ option:selected").val();

    var aData = JSON.stringify(
      {
        Title:$('#nameNL').val(),
        ContractText:$('#ContractNL').val(),
        AddressSeller:sellerAddress,
        AddressBuyer:buyerAddress,
        DateCreated:Date(),
        Enthalpy:enthalpy(32)
      }
    );
    $.post( serverAddress+"/GrabInfo", {
      ID:aData,Key:web3.sha3(aData)
    }, function(data){
      TwoPersonContract.deploy([buyerAddress,sellerAddress,web3.sha3(aData)], {}).then(function(newContract) {
        newContractToBeSigned = newContract;
        StonePaper.createPaper($('#nameNL').val(),web3.sha3(aData), 0,[],newContract.address,[buyerAddress,sellerAddress], {gas: 3000000}).then(function(){
          alert("Contract Placed into Blockchain");
          clearAllPaper();
        },function(){
          alert("Something Went Wrong");
        });
        $(".theReturnNL").html("Your contract has been saved 'unsigned' in the Blockchain, you can download the contract <a href=http://stonepapergaestorage.appspot.com/GrabInfo?Key="+web3.sha3(aData)+">here</a> and in your briefcase.");
      });
    } );
  });

  $("#signBNL").click(function() {
    var buyerAddress = $(".WalletK option:selected").val();
    if (newContractToBeSigned){
      newContractToBeSigned.signOne({from:buyerAddress}).then(function(){
      });
    }
  });

  $("#signSNL").click(function() {
    var sellerAddress = $(".WalletL option:selected").val();
    if (newContractToBeSigned){
      newContractToBeSigned.signTwo({from:sellerAddress}).then(function(){
      });
    }
  });

  $("#isSignedSNL").click(function() {
    if (newContractToBeSigned){

      newContractToBeSigned.isSigned({}).then(function(data){
        if (data==3){

          var name = $('#nameNL').val();
          var buyerAddress = $(".WalletK option:selected").val();
          var sellerAddress = $(".WalletL option:selected").val();
          //var hash = web3.sha3(aData);

          newContractToBeSigned.getInfo({}).then(function(data){
            var name = $('#nameNL').val();
            StonePaper.createPaper(name,data[0], 0,[],data[3],[data[1],data[2]], {from:data[1],gas: 3000000}).then(function(){

              clearAllPaper();
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

  //
  //UserSocieties UserSocietiesAdd UserSocietiesRemove

  //Run At Start up to set up all the wallets
  var countMe=0;
  var getAllUsers = function(index){
    StonePaper.getUser(index).then(function(value){
      if (value[0]=="0x0000000000000000000000000000000000000000"){
        console.log(value[2].toNumber());
        //End Loop
      } else {

        $(".UserSocieties").append($('<option></option>').attr("value",value[0]).text(value[1]));
        $(".UserSocietiesAdd").append($('<option></option>').attr("value",value[0]).text(value[1]));
        $(".UserSocietiesRemove").append($('<option></option>').attr("value",value[0]).text(value[1]));

        /*

        $(".WalletA").append($('<option></option>').attr("value",value[0]).text(value[1]));
        $(".WalletB").append($('<option></option>').attr("value",value[0]).text(value[1]));
        $(".WalletLawyer").append($('<option></option>').attr("value",value[0]).text(value[1]));
        $(".WalletLawyerGet").append($('<option></option>').attr("value",value[0]).text(value[1]));
        $(".FromAddress").append($('<option></option>').attr("value",value[0]).text(value[1]));
        $(".ToAddress").append($('<option></option>').attr("value",value[0]).text(value[1]));*/
        $(".WalletF").append($('<option></option>').attr("value",value[0]).text(value[1]));
        $(".WalletG").append($('<option></option>').attr("value",value[0]).text(value[1]));
        $(".WalletH").append($('<option></option>').attr("value",value[0]).text(value[1]));
        $(".WalletI").append($('<option></option>').attr("value",value[0]).text(value[1]));
        $(".WalletJ").append($('<option></option>').attr("value",value[0]).text(value[1]));
        $(".WalletK").append($('<option></option>').attr("value",value[0]).text(value[1]));
        $(".WalletL").append($('<option></option>').attr("value",value[0]).text(value[1]));
        $(".LookUpAddress").append($('<option></option>').attr("value",value.userAddress).text(value.userName));
        countMe++;
        getAllUsers(countMe);
      }
    },function(value){
    });
  };

  var clearAllUsers =function(){

    $(".UserSocieties").empty();
    $(".UserSocietiesAdd").empty();
    $(".UserSocietiesRemove").empty();
    /*
    $(".WalletA").empty();
    $(".WalletB").empty();
    $(".WalletLawyer").empty();
    $(".WalletLawyerGet").empty();
    $(".FromAddress").empty();
    $(".ToAddress").empty();
    */
    $(".WalletF").empty();
    $(".WalletG").empty();
    $(".WalletH").empty();
    $(".WalletI").empty();
    $(".WalletJ").empty();
    $(".WalletK").empty();
    $(".WalletL").empty();
    $(".LookUpAddress").empty();
    countMe = 0;
    getAllUsers(0);

  };

  //Run At Start Up to Get All Papers
  var countPaper=0;
  var papers = {};
  var getAllPapers= function(index){
    StonePaper.getPaper(index).then(function(value){
      if (value[0]==""){
        //End Loop
      } else {
        papers[countPaper]=value;
        $(".PapersPlease").append($('<option></option>').attr("value",countPaper).text(value[0]));
        countPaper++;
        getAllPapers(countPaper);
      }
    },function(value){
    });
  };

  var clearAllPaper = function(){
    countPaper=0;
    papers = {};
    $(".PapersPlease").empty();
    $(".PapersPlease").append($('<option></option>').attr("value","Ninja").text("Briefcase"));
    getAllPapers(0);

  };

  var countSocieties=0;
  var getAllSocieties = function(index){
    SocietyList.getSociety(index).then(function(value){
      if (value[1]==""){
        console.log(value[2].toNumber());
        //End Loop
      } else {
        $(".Societies").append($('<option></option>').attr("value",value[0]).text(value[1]));
        $(".SocietiesAdd").append($('<option></option>').attr("value",value[0]).text(value[1]));
        $(".SocietiesRemove").append($('<option></option>').attr("value",value[0]).text(value[1]));
        countSocieties++;
        getAllSocieties(countSocieties);
      }

    },function(value){

    });
  };

  function startUp(){

    clearAllPaper();
    getAllSocieties(0);
    getAllUsers(0);

  }

  //startUp();


  $("#verifyUser").click(function(){
    var sAddress = $(".Societies option:selected").val();
    var userAddress = $(".UserSocieties option:selected").val();

    var aSociety = web3.eth.contract(Society.abi);
    var aSocietyInstance = aSociety.at(sAddress);
    var result = aSocietyInstance.isVerified(userAddress);


    if (result){
      $("#Verifier").html("User Verified");
    } else {
      $("#Verifier").html("User Not Verified");
    }

  });

  $("#setSociety").click(function(){
    var value = $("#societyName").val();
    SocietyList.createNewSociety(value,{gas: 3000000}).then(function(){console.log('success');},function(){console.log('Fail');});
  });

  $("#SocietiesAddB").click(function(){

    var sAddress = $(".SocietiesAdd option:selected").val();
    var userAddress = $(".UserSocietiesAdd option:selected").val();

    var aSociety = web3.eth.contract(Society.abi);
    var aSocietyInstance = aSociety.at(sAddress);
    var result = aSocietyInstance.verify(userAddress);

  });

  $("#SocietiesRemoveB").click(function(){

    var sAddress = $(".SocietiesRemove option:selected").val();
    var userAddress = $(".UserSocietiesRemove option:selected").val();

    var aSociety = web3.eth.contract(Society.abi);
    var aSocietyInstance = aSociety.at(sAddress);
    var result = aSocietyInstance.deVerify(userAddress);




  });

  $("#addSomeTests").click(function() {
    startUp();
    /*
    web3.eth.getAccounts(function(error, result){
    var allAccounts = result;
    var names = ['Andrew','Betsy','Calvin','Danny','Edgar','Farah','Greg','Heather','Ian','Julie'];
    for (var counter = 0; counter< allAccounts.length; counter++){
    StonePaper.assignLawyer(names[counter],{from:allAccounts[counter]}).then(function(){
    });
    }
    StonePaper.setDatabase("http://localhost:41080/GrabInfo?Key=",0,{});

    SocietyList.createNewSociety("Member of Legal Hackers",{}).then(function(){console.log('success');},function(){console.log('Fail');});
    SocietyList.createNewSociety("International Refugee",{}).then(function(){console.log('success');},function(){console.log('Fail');});
    SocietyList.createNewSociety("Local Member of Credit Union",{}).then(function(){console.log('success');},function(){console.log('Fail');});
    });
    */

  });

  $("#setLawyerName").click(function() {
   var value = $("#lawyerName").val();
   var checkThis = $("#lawyerName");
   StonePaper.assignLawyer(value,{gas: 3000000}).then(
    function(){
      clearAllUsers(0);
      alert("You name has been changed");
    }, function(){
      alert("For security reasons the name can not be blank");
    });
   });

  $('.PapersPlease').on('change', function(){
    var theIndex = this.value;
    if (this.value=="Ninja"){
      var targetData = $("#HumanRead");
      targetData.empty();
      return;
    }
    var thePaper = papers[theIndex];
    $("#NameV").html(thePaper[0]);
    $("#HashV").html(thePaper[1]);
    StonePaper.getDatabase(thePaper[2].toNumber()).then(function(value3) {
      $("#UrlV").html(value3+thePaper[1]);
    });
    var data = new Date(thePaper[3].toNumber()*1000);
    $("#TimeV").html(data);
    StonePaper.getLawyer(thePaper[4]).then(function(value4) {
      $("#LawyerV").html(value4);
    });
    if (thePaper[6]==54321){
      $.get(serverAddress+"/GrabInfo?Key="+thePaper[1],
      {},
      function(data){
        var targetData = $("#HumanRead");
        targetData.empty();
        targetData.html(generateAffidavit(data));
      });
    }else if (thePaper[6]==12345){
      $.get(serverAddress+"/GrabInfo?Key="+thePaper[1],
      {},
      function(data){
        var targetData = $("#HumanRead");
        targetData.empty();
        targetData.html(generateContractHTML(data));
      });
    }else{
      $.get(serverAddress+"/GrabInfo?Key="+thePaper[1],
      {},
      function(data){
        var targetData = $("#HumanRead");
        targetData.empty();
        targetData.html(generateContractNoSigHTML(data));
      });
    }
  });
  $("#blockchain button.setUrl").click(function() {
    var value = $("#blockchain input.urlName").val();
    StonePaper.assignDatabase(value,0).then(
      function(){
        addToLog("#blockchain", "Database URL set" );
      }, function(){
        alert("You can't change the database URL once it's been assigned");
      });
    });

  $("#blockchain button.getUrl").click(function() {
      StonePaper.getDatabase(0).then(function(value3) {
        $("#blockchain .urlValue").html(value3);
        addToLog("#blockchain", "Database URL Gotten");
      });
    });

  $("#blockchain button.setPaper").click(function() {
      var value1 = $("#blockchain input.docName").val();
      var value2 = $("#blockchain input.docText").val();
      var fromAddress = $(".FromAddress option:selected").val();
      var targetAddress = $(".ToAddress option:selected").val();

      StonePaper.createPaper(value1,web3.sha3(value2), 0, [],0 ,[targetAddress], {gas: 3000000});
      clearAllPaper();

      addToLog("#blockchain", "Paper saved to URL" );
    });

  $(".setGasRecipt").click(function() {
      var targetAddress = $(".WalletA option:selected").val();
      var value2 = $(".ReciptName").val();
      GasReceipt.createReceipt(targetAddress,value2, {}).then(function(){
        StonePaper.getLastPaperFromContract(targetAddress,GasReceipt.address,{}).then(function(result){
          if (result){
          }else {
          }
        },function(){
          var indexV = new web3.BigNumber(123);
          StonePaper.getMeta(indexV).then(function(result){
            if (result){
            }else{
              var indexV = new web3.BigNumber(123);
              StonePaper.assignMeta("Gas Recipts",indexV,{}).then(function(){
              },function(){
              });
            }
          });
          StonePaper.getDatabase(indexV, function(err, result) {
            if (result){
            } else {
              var indexV = new web3.BigNumber(123);
              StonePaper.assignDatabase("Gas Recipt",indexV,{}).then(function(){
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
    var targetAddress = $(".WalletB option:selected").val();
    var indexCount = -1;
    var data = [];
    var circularCall = function(recived){
      indexCount++;
      if (recived){
        data.push(recived);
      }
      GasReceipt.getReceipt(targetAddress,indexCount,{}).then(circularCall,function(){
        $(".Results").empty();
        for (var counter = 0; counter<data.length; counter++){
          $(".Results").append($('<option></option>').attr("value",data[counter]).text(data[counter]));
        }
      });
    };
    circularCall();
  });
});
