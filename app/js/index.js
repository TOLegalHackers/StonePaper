/*globals $, SimpleStorage, document*/

var addToLog = function(id, txt) {
  $(id + " .logs").append("<br>" + txt);
};

// ===========================
// Blockchain example
// ===========================
$(document).ready(function() {

  $("#blockchain button.setGod").click(function() {
    StonePaper.addSupervisor(0, {gas: 3000000});
    addToLog("#blockchain", "User has been set as God" );
  });

  var godAddress;

  $("#blockchain button.getGod").click(function() {
    StonePaper.getGod({gas: 3000000}).then(function(value) {
      godAddress = value;
      $("#blockchain .godValue").html(value);
      addToLog("#blockchain", "Address of God has been returned");
    });
  });


  $("#blockchain button.setLawyer").click(function() {
    var value = $("#blockchain input.lawyerName").val();
    StonePaper.assignLawyer(value, {gas: 3000000});
    addToLog("#blockchain", "Set Lawyer Name" );
  });


  $("#blockchain button.getLawyer").click(function() {
    StonePaper.getLawyer(godAddress,{gas: 3000000}).then(function(value) {
      $("#blockchain .lawyerValue").html(value);
      addToLog("#blockchain", "Got Lawyer Name");
    });
  });


  $("#blockchain button.setUrl").click(function() {
    var value = $("#blockchain input.urlName").val();
    StonePaper.assignDatabase(value,0, {gas: 3000000});
    addToLog("#blockchain", "Database URL set" );
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
    StonePaper.createPaper(value1,web3.sha3(value2), 0, [],godAddress, {gas: 3000000});
    addToLog("#blockchain", "Paper saved to URL" );
  });


  $("#blockchain button.getPaper").click(function() {
    var index = $("#blockchain input.indexV").val();
    StonePaper.getPapers(index,{gas: 3000000}).then(function(value) {
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

    });
  });







});
