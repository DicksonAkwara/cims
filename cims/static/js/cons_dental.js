$('#btnwaitlist').on('click', function(){
    $('#waitlist').modal('show');
    var ptype=$('#pat_type').val();
    loadwaitlist(ptype);
})
var listTableBody=document.querySelector('#listTableBody');
function loadwaitlist(ptype){
    var ptype=ptype;
    listTableBody.innerHTML='';

    fetch("/consult/waitlist_dental/",{
      body:JSON.stringify({ searchText:ptype }),
      method: "POST",
  })
  .then((res)=>res.json())
  .then((data)=>{
      if(data.length===0){
        listTableBody.innerHTML='<tr><td colspan="6">No patient waiting </td></tr>'
      }
      else{  
       
        var jdata=data;            
            jdata.forEach(element => {              
                listTableBody.innerHTML+=
              `<tr> 
                    <td>${element.vdate}(${element.vtime})</td>            
                    <td>${element.pname}</td>            
                    <td>${element.pno}</td>            
                    <td>${element.age}</td>            
                    <td>${element.gender}</td>
                    <td>${element.pmode}</td>                                                 
                    <td style='display:none'>${element.subname}</td> 
                    <td style='display:none'>${element.vno}</td> 
              </tr>`             
            });            
      }
  })


}

$('#pCardNo').on('keyup',function(){
  var value = $(this).val().toLowerCase();
  $("#listTable tbody tr").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});

$('#listTable tbody').on('click','tr', function(){
  var currentRow=$(this).closest("tr"); 
  currentRow.addClass('bg-warning').siblings().removeClass('bg-warning'); 
  var pnm=currentRow.find("td:eq(1)").text().toUpperCase();
  var pn=currentRow.find("td:eq(2)").text().toUpperCase();
  var age=currentRow.find("td:eq(3)").text()
  var gnd=currentRow.find("td:eq(4)").text().toUpperCase();
  var pmd=currentRow.find("td:eq(5)").text()
  var pmd2=currentRow.find("td:eq(6)").text()
  var vno=currentRow.find("td:eq(7)").text()

  //document.querySelector('#fname').innerHTML=
  $('#fname').val(pnm);
  document.querySelector('#fname2').innerHTML=pnm;
  $('#cardno').val(pn);
  $('#ptage').val(age);
  $('#ptgender').val(gnd);
  $('#pmode').val(pmd);
  $('#pmode2').val(pmd2);
  $('#vno').val(vno); 

  $('#spid1').val(pn);
  $('#sclname1').val(pmd2);

  $('#waitlist').modal('hide');
  $('#btn_pat_det').trigger('click');
  receive_patient(pn)
})



function receive_patient(pn){
  formdata ={
    pid:pn,
    cname:'Eye'
  }
  $.ajax({
    url: '/consult/receive_patient/',
    data: formdata, 
    method:'POST',       
    dataType: 'json',
    success: function (data) {
      $('#consnumber').val(data.consno)
    },
    error: function(jqXHR, exception) {
      if(jqXHR.status === 500) {
        swal("Sorry!!","Internal Server Error occurred. try again", "error");
      }
    }
  });

}



$('#btn_triage_det').on('click', function(){
  find_triage();
})

var triageTableBody=document.querySelector('.triageTableBody');
function find_triage(){
  var pid=$('#cardno').val();  
  if(pid==""){
      e.preventDefault()
      alert('ERROR!! please select patient first');
  }
  else{
    triageTableBody.innerHTML='';
    fetch("/consult/triage_search/",{
      body:JSON.stringify({ searchText:pid }),
      method: "POST",
  })
  .then((res)=>res.json())
  .then((data)=>{
      if(data.length===0){
        triageTableBody.innerHTML='<tr><td colspan="7">No triage details found </td></tr>'
      }
      else{  
       
        var jdata=data;            
            jdata.forEach(element => {              
              triageTableBody.innerHTML+=
              `<tr> 
                    <td>${element.date}   ${element.time}</td>            
                    <td>${element.urg}</td>            
                    <td>${element.temp}</td>            
                    <td>${element.press}</td>            
                    <td>${element.pulse}</td>
                    <td>${element.wgt}</td>
                    <td>${element.hgt}</td>                                                 
              </tr>`             
            });
            $('.triageTable td:contains("Critical")').parent('tr').css('background-color', 'red');
            $('.triageTable td:contains("Mild")').parent('tr').css('background-color', 'yellow');
      }
  })

  

  }
}

$('#denpatcat').on('change', function(){
    var dental_cat=$(this).val();
    $('#thselect').val('');//clearing tooth selected field
    if(dental_cat=='Adult'){   
        $('#denUpperAdult').prop('selectedIndex',0);     
        $('#denLowerAdult').prop('selectedIndex',0);     
        $('#denUpperAdldiv').show();
        $('#denLowerAdldiv').show();       

        $('#denUpperPeaddiv').hide();
        $('#denLowerPeaddiv').hide();
    }
    else if(dental_cat=='peads'){
        $('#denUpperAdldiv').hide();
        $('#denLowerAdldiv').hide();

        $('#denUpperPead').prop('selectedIndex',0);     
        $('#denLowerPead').prop('selectedIndex',0);
        $('#denUpperPeaddiv').show();
        $('#denLowerPeaddiv').show();
    }
    else{
        $('#denUpperAdldiv').hide();
        $('#denLowerAdldiv').hide();
        $('#denUpperPeaddiv').hide();
        $('#denLowerPeaddiv').hide()

    }
})

$('#denUpperAdult').on('change',function(){
    var thid=$(this).val();
    tooth_selected(thid);
})

$('#denLowerAdult').on('change',function(){
    var thid=$(this).val();
    tooth_selected(thid);
})

$('#denUpperPead').on('change',function(){
    var thid=$(this).val();
    tooth_selected(thid);
})

$('#denLowerPead').on('change',function(){
    var thid=$(this).val();
    tooth_selected(thid);
})


function tooth_selected(thid){
    var slc=thid;
      var ttval=$('#thselect').val();
      if(ttval==''){
      document.querySelector('#thselect').value=slc;
      }
      else{
        document.querySelector('#thselect').value=ttval+","+slc;
    }
  }



  //department to request service from select buttion
$("#operation").on('change',function(){   
    var patno=$('#cardno').val();  
    if(patno==null || patno==''){
      swal("Error!!","please select patient first","info") 
      $('#operation').prop('selectedIndex',0);    
    }
  
    else{
      const opt = $(this).val();
    
      if(opt==1||opt==2||opt==3||opt==7){
      $('#serviceModal').modal('show');
    
      $('#billOutputSvs').show();
      $('#pharOuttable').hide();
      $('#admdiv').hide();
      $('#clinicBook').hide();
    
        if(opt==1){
          modal_header.innerHTML="";
          modal_header.innerHTML+="Nursing procedure Request";
        }
        if(opt==2){
          modal_header.innerHTML="";
          modal_header.innerHTML+="Laboratory Test Request";
        }
        if(opt==3){
          modal_header.innerHTML="";
          modal_header.innerHTML+="Radiology Image Request";
        }
      }
      else if(opt==4){  
        //first check if diagnosis is enterred
        var formdata ={ pid:patno }
          $.ajax({
            url: '/consult/eye_diagnosis_entry/',
            data: formdata, 
            method:'POST',       
            dataType: 'json',
            success: function (data) {
              data.forEach(element => {
                 var cd=element.cd;  
                 if(cd !=='none'){
                  $('#billOutputSvs').hide();
                  $('#admdiv').hide();
                  $('#clinicBook').hide();
                  $('#pharOuttable').show();
                  $('#pharmacyModal').modal('show');
                 }
                 else{
                  swal("Error!!","Diagnosis not found. clerk patient and select condition first","info") 
                  $('#operation').prop('selectedIndex',0);
                  
                 }
               })          
            }
          });  
           
      }
      else  if(opt==5){
        $('#billOutputSvs').hide();
        $('#pharOuttable').hide();
        $('#clinicBook').hide();
        $('#admdiv').show();
        
      }
      else  if(opt==6){
        $('#billOutputSvs').hide();
        $('#pharOuttable').hide();
        $('#admdiv').hide();
        $('#clinicBook').show();
        //date picker method
        //loaddate();
        
      }
  
    }
  
  })

  //searching service to request
var resultTableBody=document.querySelector('.resultTableBody');
$("#search_service").on('keyup',function(){

  var pid = $(this).val();
  var opt = $("#operation").val();
  
  if(pid.trim().length>0){
      //console.log(pid);
      resultTableBody.innerHTML=''; //for table refresh
      fetch("/consult/cons_service_search/",{
      body:JSON.stringify({ searchText:pid,opt:opt }),
      method: "POST",
  })
  .then((res)=>res.json())
  .then((data)=>{
      //console.log('data',data);
      if(data.length===0){
          resultTableBody.innerHTML='<tr><td colspan="4">No such service found </td></tr>';                     
      }
      else{
        data.forEach((item)=>{
            resultTableBody.innerHTML+=
            `<tr>              
            <td>${item.service_name}</td>
            <td>${item.normal_rate}</td>
            <td>${item.scheme_rate}</td>
            <td>${item.service_point}</td>
            <td style="display:none;">${item.scode}</td>                 
            </tr>`
        });
      }
    })
  }

})

var pharSearchTbBody=document.querySelector('.pharSearchTbBody');
var pharSearchTb=document.querySelector('#pharSearchTb');
var pharOuttableBody=document.querySelector('.pharOuttableBody');

$("#search_pharmacy").on('keyup',function(){

  var searchValue =$(this).val();  
  var pat_type=$('#pat_type').val();
  var stid = $("#prescstore").val();
  
  if(searchValue.trim().length>0){
      pharSearchTbBody.innerHTML=''; //for table refresh
      fetch("/consult/cons_pharm_search/",{
      body:JSON.stringify({ searchText:searchValue,pt:pat_type,stid:stid}),
      method: "POST",
  })
  .then((res)=>res.json())
  .then((data)=>{
      //console.log('data',data);
      if(data.length===0){
          pharSearchTbBody.innerHTML='<tr><td colspan="4">Item not found </td></tr>';                     
      }
      else{
        
        data.forEach((item)=>{
          pharSearchTbBody.innerHTML+=
            `<tr>
            <td style="display:none;">${item.item_code}</td>             
            <td>${item.item_name}(${item.strength})</td>
            <td>${item.price}</td>
            <td>${item.sprice}</td>
            <td>${item.storeName}</td>
            <td>${item.balance}</td>             
            <td style="display:none;">${item.servePoint}</td>                      
                                  
            </tr>`
        });
      }
    })
  }
  else{
    pharSearchTbBody.innerHTML='';
  }

})

$("#pharSearchTb tbody").on('click', 'tr', function() {
  var cost;
      var currentRow=$(this).closest("tr");      
      
      var normal_rate=currentRow.find("td:eq(2)").text(); 
      var special_rate=currentRow.find("td:eq(3)").text();   

      var servPnt=currentRow.find("td:eq(6)").text();
      const pym=$('#pmode2').val();

      if(pym.includes('cash')){
          cost=normal_rate;
      }
      else{
          cost=special_rate;
      }

     //storename column 2
     pharOuttableBody.innerHTML+=
      `<tr>              
      <td style="display:none;">${currentRow.find("td:eq(0)").text()}</td>      
      <td>${currentRow.find("td:eq(1)").text()}</td>   
      
      <td>
      <textarea rows="1" cols="3" class='svc_qnt text-center dos' id="dos">-----</textarea>
      </td>
      <td>
          <select class='freq'>
            <option value='0'>----</option>
            <option value="OD">OD</option>
            <option value="BD">BD</option>
            <option value="TID">TID</option>
            <option value="QID">QID</option>
            <option value="Stat">Stat</option>
            <option value="Prn">Prn</option>
        </select>
      </td>
      <td>
      <select class='days'>
        <option value='0'>----</option>
        <option value="once">once</option>
        <option value="1">1</option>
        <option value="3">3</option>
        <option value="5">5</option>
        <option value="7">7</option>
        <option value="10">10</option>
        <option value="14">14</option>
        <option value="30">30</option>
    </select>
  </td>  
  <td><textarea rows="1" cols="3" class='svc_qnt text-center' id="txt_area_qnt">1</textarea></td>
  <td>${currentRow.find("td:eq(5)").text()}</td>
  <td>${currentRow.find("td:eq(4)").text()}</td>
  <td style="display:none;">${currentRow.find("td:eq(5)").text()}</td>     
  <td><button class="btn btn-danger btn-sm btnRemove">&times;</button></td>
      </tr>`
});


var billOutputSvsBody=document.querySelector('.billOutputSvsBody');
$(".resultTableBody").on('click', 'tr', function() {
  var cost;
      var currentRow=$(this).closest("tr"); 
      
      var svs_name=currentRow.find("td:eq(0)").text(); 
      var normal_rate=currentRow.find("td:eq(1)").text(); 
      var special_rate=currentRow.find("td:eq(2)").text(); 
      var dept=currentRow.find("td:eq(3)").text();
      var svs_code=currentRow.find("td:eq(4)").text();

      const pym=document.querySelector('#pmode2').value;

      if(pym.includes('cash')){
          cost=normal_rate;
      }
      else{
          cost=special_rate;
      }
      //var data=svs_code+"\n"+svs_name+"\n"+cost+"\n"+dept;
      //alert(data);
      billOutputSvsBody.innerHTML+=
      `<tr>              
      <td style="display:none;">${svs_code}</td>
      <td>${svs_name}</td>
      <td>${cost}</td>
      <td>${dept}</td>
      <td><button class="btn btn-danger btn-sm btnSvRemove">&times;</button></td>       
      </tr>`
});

$("#pharOuttable").on('click', '.btnRemove', function() {  
    var currentRow=$(this).closest("tr");
    var svs_name=currentRow.find("td:eq(1)").text(); 
    /*if(confirm(`Are you sure you want to remove( ${svs_name} )from bill?`)){       
        $(this).closest('tr').remove();      
    }*/

    swal({
        title: "Service request cancel",
        text: "Are you sure you want to remove( "+svs_name+" )from bill?",
        icon: "warning",
        buttons: [
          'No, cancel it!',
          'Yes, I am sure!'
        ],
        dangerMode: true,
      }).then(function(isConfirm) {
        if (isConfirm) {
            $(this).closest('tr').remove();
        } 
      })
  });

  
  $("#billOutputSvs tbody").on('click', '.btnSvRemove', function() {  
    var currentRow=$(this).closest("tr");
    var svs_name=currentRow.find("td:eq(1)").text(); 
    /*if(confirm(`Are you sure you want to remove( ${svs_name} )from bill?`)){       
        $(this).closest('tr').remove();      
    }*/

    swal({
        title: "Service request cancel",
        text: "Are you sure you want to remove( "+svs_name+" )from bill?",
        icon: "warning",
        buttons: [
          'No, Decline!',
          'Yes, I am sure!'
        ],
        dangerMode: true,
      }).then(function(isConfirm) {
        if (isConfirm) {
            currentRow.closest('tr').remove();
        } 
      })
  })


  $('#submitDental').on('click',function(){   
    var formdata = $("#dentalForm").serialize();  
    console.log($('#dencondition').val());
    console.log($('#denprocedure').val());

    
    $.ajax({
      url: '/consult/save_dental_notes/',
      data: formdata, 
      method:'POST',       
      dataType: 'json',
      success: function (data) {               
        if(data.length===0){}
        else{              
            swal("Success!!",data.msg, "success");
            $('form#dentalForm').trigger("reset");
            $('#btn_service').trigger('click');
                          
        }                    
      },
      error: function(jqXHR, exception) {
        if(jqXHR.status === 500) {
            swal("Sorry!!","Internal Server Error occurred. try again later", "error");
        }
      }
  })
  })