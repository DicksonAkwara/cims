$('#mchclinc').on('change',function(){
    var cln=$(this).val().trim();    
      
     if(cln==1){
        document.querySelector('#clinicheader').innerHTML='Antenatal clinic details';
        $('.anc').show();
        $('.pnc').hide(); $('.imm').hide();$('.cwc').hide();$('.pmtc').hide(); $('.family').hide();
      
     }
    else if(cln==2){
        document.querySelector('#clinicheader').innerHTML='Postnatal clinic details';
        $('.pnc').show();
        $('.anc').hide(); $('.imm').hide();$('.cwc').hide();$('.pmtc').hide(); $('.family').hide();
    }
    else if(cln==3){
        document.querySelector('#clinicheader').innerHTML='Immunization clinic details';
        $('.imm').show();
        $('.anc').hide();$('.pnc').hide();$('.cwc').hide();$('.pmtc').hide(); $('.family').hide();
    }
    else if(cln==4){
        document.querySelector('#clinicheader').innerHTML='Child welafare clinic details';
        $('.cwc').show();
        $('.anc').hide();$('.pnc').hide();$('.imm').hide();$('.pmtc').hide(); $('.family').hide();
    }
    else if(cln==5){
        document.querySelector('#clinicheader').innerHTML='PMCT clinic details';
        $('.pmtc').show();
        $('.anc').hide();$('.pnc').hide();$('.imm').hide();$('.cwc').hide(); $('.family').hide();
    }
    else if(cln==6){
        document.querySelector('#clinicheader').innerHTML='Family planning details';
        $('.family').show();
        $('.anc').hide();$('.pnc').hide();$('.imm').hide();$('.cwc').hide(); $('.pmtc').hide();
    }
})

$('#visittype').on('change',function(){
    var change=$(this).val().trim();
    var pid=$('#pid').val().trim();
    if(pid !==''){  
    if(change=='profile'){
        var pid=$('#pid').val();
        //hide othe divs and only show antenatal
       $('.mtprofileDiv').show();
       $('.firstvisitDiv').hide();
       $('.othervisitDiv').hide();
       document.querySelector('#ancno').value=pid
       document.querySelector('#kmhfl').value=pid;
       document.querySelector('#cardNo').value=pid;
    }
    else if(change=='first'){
        $('.mtprofileDiv').hide();
        $('.firstvisitDiv').show();
        $('.othervisitDiv').hide();
        searchAncProleNo();
        document.querySelector('#cardNo2').value=pid;
        document.querySelector('#cardNo3').value=pid;
        
    }
    else if(change=='second'||change=='third'||change=='fourth'||change=='fifth'||change=='sixth'||change=='seventh'){
        $('.mtprofileDiv').hide();
        $('.firstvisitDiv').hide();
        $('.othervisitDiv').show();
        document.querySelector('#cardno4').value=pid;
        document.querySelector('#vstcnt').value=change;
        searchAncProleNo();
    }
}
else{
        alert('select patient first');
        $(this).prop('selectedIndex',0);
    }
})

$('#searmch').on('keyup',function(){
    var pid = $(this).val();
    
    if(pid.trim().length>0){     
        fetch("/consult/cons_pat_search/",{
        body:JSON.stringify({ searchText:pid }),
        method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
        
        if(data.length===0){
            //tableOutput.innerHTML='<tr><td colspan="4">No records found </td></tr>';
            document.querySelector('#pname').value='';
            document.querySelector('#page').value=''; 
            document.querySelector('#pgender').value=''; 
            document.querySelector('#pymode').value=''; 
            
        }
        else{
          var jdata=data;          
          var pid
          jdata.forEach(element => { 
          pid =element.pid;         
          document.querySelector('#pname').value=element.fname;
          document.querySelector('#pid').value=pid; 
          document.querySelector('#page').value=element.age;
          document.querySelector('#pgender').value=element.gender;
          document.querySelector('#pymode').value=element.scheme_type+"("+element.scheme_name+")";
          document.querySelector('#pymode2').value=element.scheme_name;
          })
          loadyears();
         }
      })
    }
})

function loadyears(){
    for(i=new Date().getFullYear();i>2000;i--){
        $('#yob').append($('<option />').val(i).html(i));
    }
}

/*
$('#lmp').change(function(){
   
    var selDate=$(this).val();
    var secdate=selDate.setMonth( selDate.getMonth() + 2 );;
    alert(selDate);
    $("#edd").val(secdate);
})*/

$('#navbtnMP').on('click', function(){
    var pid=$('#pid').val().trim();
    if(pid.trim().length>0){     
        fetch("/consult/searchMatProfile/",{
        body:JSON.stringify({ searchText:pid }),
        method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
        if(data.length===0){
            $('#BtnSaveMP').prop('disabled',false);
            $('#BtnSaveMSH').prop('disabled',false);
            $('#buttonsavePrevp').prop('disabled',false);  
            $('#BtneditMP1').prop('disabled',true);
            $('#BtneditMSH1').prop('disabled',true);
            $('#buttoneditPrevp').prop('disabled',true);
        }
        else{
          var jdata=data;  
                  
          jdata.forEach(element => { 
          document.querySelector('#kmhfl').value=element.kmcode;
          document.querySelector('#ancno').value=element.ancno; 
          document.querySelector('#gravida').value=element.grav;
          document.querySelector('#parity').value=element.parity;
          document.querySelector('#height').value=element.height;
          document.querySelector('#weight').value=element.weight;
          document.querySelector('#lmp').value=element.lmp;
          document.querySelector('#edd').value=element.edd; 
          document.querySelector('#sop').value=element.sop; 
          document.querySelector('#diab').value=element.diab; 
          document.querySelector('#htn').value=element.hp; 
          document.querySelector('#bldtrans').value=element.bld; 
          document.querySelector('#tb').value=element.tb;
          document.querySelector('#allergy').value=element.allg;
          document.querySelector('#otherallg').value=element.allgo;
          document.querySelector('#ftwins').value=element.ft;
          document.querySelector('#ancnotes').value=element.notes;
          document.querySelector('#profid').value=element.pfid;                       
          document.querySelector('#profid2').value=element.pfid               
          document.querySelector('#profidpp').value=element.pfid      
          
          })

          $('#BtnSaveMP').prop('disabled',true);
          $('#BtnSaveMSH').prop('disabled',true);
          $('#buttonsavePrevp').prop('disabled',true);
          $('#BtneditMP1').prop('disabled',false);
          $('#BtneditMSH1').prop('disabled',false);          
          $('#buttoneditPrevp').prop('disabled',false);
          
         }

    })

    }

})

$('#BtnSaveMP').on('click', function(){   
    var formdata = $("#motherProfForm").serialize();  
        $.ajax({
          url: '/consult/saveMatProfile/',
          data: formdata, 
          method:'POST',       
          dataType: 'json',
          success: function (data) {               
            if(data.length===0){}
            else{              
                alert(data.msg); 
                document.querySelector('#profid').value=data.id                
                document.querySelector('#profid2').value=data.id                
                document.querySelector('#profidpp').value=data.id                
            }             
            //$('form#motherProfForm').trigger("reset");              
          },
          error: function(jqXHR, exception) {
            if(jqXHR.status === 500) {
                alert('Internal Server Error occurred. try again');
            }
          }
      });
})

$('#BtnSaveMSH').on('click', function(){   
    var formdata = $("#motherMSHForm").serialize();  
        $.ajax({
          url: '/consult/saveMSHProfile/',
          data: formdata, 
          method:'POST',       
          dataType: 'json',
          success: function (data) {               
            if(data.length===0){}
            else{              
                alert(data.msg); 
                //document.querySelector('#profid').value=data.id                
            }             
            //$('form#motherProfForm').trigger("reset");              
          },
          error: function(jqXHR, exception) {
            if(jqXHR.status === 500) {
                alert('Internal Server Error occurred. try again');
            }
          }
      });
})

$('#buttonsavePrevp').on('click', function(){ 
     
    var formdata = $("#prevPregForm").serialize();  
        $.ajax({
          url: '/consult/saveprevPregnancy/',
          data: formdata, 
          method:'POST',       
          dataType: 'json',
          success: function (data) {               
            if(data.length===0){}
            else{              
                alert(data.msg); 
                //document.querySelector('#profid').value=data.id                
            }             
            //$('form#motherProfForm').trigger("reset");              
          },
          error: function(jqXHR, exception) {
            if(jqXHR.status === 500) {
                alert('Internal Server Error occurred. try again');
            }
          }
      });
})





//method to such the profile number for anc visits
function searchAncProleNo(){
    var pid=$('#pid').val().trim();
    if(pid.trim().length>0){     
        fetch("/consult/searchMatProfile/",{
        body:JSON.stringify({ searchText:pid }),
        method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
        if(data.length===0){
            alert('please ensure ANC profile exists');
        }
        else{
            var jdata=data;                    
            jdata.forEach(element => { 
            document.querySelector('#profidAnc').value=element.pfid
            document.querySelector('#profidAnc2').value=element.pfid
            document.querySelector('#profid4').value=element.pfid
        })            
        }
    })
}

}
//save anch first visit physical examination form
$('#buttonSavePEX').on('click', function(){ 
    
    var formdata = $("#ancfstVisitForm").serialize();  
        $.ajax({
          url: '/consult/saveancfirstVisit/',
          data: formdata, 
          method:'POST',       
          dataType: 'json',
          success: function (data) {               
            if(data.length===0){}
            else{              
                alert(data.msg); 
                              
            }             
            //$('form#motherProfForm').trigger("reset");              
          },
          error: function(jqXHR, exception) {
            if(jqXHR.status === 500) {
                alert('Internal Server Error occurred. try again');
            }
          }
      });
})

$('#buttonsaveANTP').on('click', function(){
    var formdata = $("#ancAntProfForm").serialize();  
    $.ajax({
      url: '/consult/saveAntprofVisit/',
      data: formdata, 
      method:'POST',       
      dataType: 'json',
      success: function (data) {               
        if(data.length===0){}
        else{              
            alert(data.msg); 
                          
        }             
        //$('form#motherProfForm').trigger("reset");              
      },
      error: function(jqXHR, exception) {
        if(jqXHR.status === 500) {
            alert('Internal Server Error occurred. try again');
        }
      }
  })
})

$('#buttonSaveSubVisit').on('click', function(){
    var formdata = $("#subvisitForm").serialize();  
    $.ajax({
      url: '/consult/savesubseqAncVisit/',
      data: formdata, 
      method:'POST',       
      dataType: 'json',
      success: function (data) {               
        if(data.length===0){}
        else{              
            alert(data.msg); 
                          
        }             
        //$('form#motherProfForm').trigger("reset");              
      },
      error: function(jqXHR, exception) {
        if(jqXHR.status === 500) {
            alert('Internal Server Error occurred. try again');
        }
      }
  })
})



///diagonistic result viewing 

const resOutputSvsBody=document.querySelector('.resOutputSvsBody');

$('#btnLabRes').on('click',function(){
    var cardNo=$('#pid').val();
    document.querySelector('#resDept').value='lab';
  
    if(cardNo !==''){
      if(cardNo.trim().length>0){
        //console.log(pid);
        //tableOutput.innerHTML=''; //for table refresh
        fetch("/lab/consLabResSearch/",{
        body:JSON.stringify({ searchText:cardNo }),
        method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
        if(data.length===0){          
          resOutputSvsBody.innerHTML='<tr><td colspan="5">No verified results found </td></tr>'; 
      }
      else{                  
          resOutputSvsBody.innerHTML='';
          var jdata=data;          
          jdata.forEach(element => {              
            resOutputSvsBody.innerHTML+=
            `<tr> 
                  <td style='display:none';>${element.sampID}</td>
                  <td>${element.rdate}</td>               
                  <td>${element.service}</td>                                                                   
                  <td>${element.status}</td>                                                                   
                                                                                  
            </tr>` 
                    
          });         
  
        //color_code();
      }
  
    })
    }
  }
  
  else{
      alert('select patient first');
    }
  })
  
  $('#btnRadRes').on('click',function(){
    var cardNo=$('#pid').val();
    document.querySelector('#resDept').value='rad';
    
    if(cardNo !==''){
      if(cardNo.trim().length>0){     
        //tableOutput.innerHTML=''; //for table refresh
        
        fetch("/rad/consResultSearch/",{
        body:JSON.stringify({ searchText:cardNo }),
        method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
     if(data.length >0){
      //console.log(data);
      resOutputSvsBody.innerHTML='';
      data.forEach((item)=>{
  
        resOutputSvsBody.innerHTML+=
          `<tr>
          <td style="display:none;">${item.ex_no}</td>       
          <td>${item.rdate}</td>
          <td>${item.service}</td>
          <td>${item.status}</td>
          <td style="display:none;">${item.dept}</td>                              
          </tr>`
      });
     }
     else{
      resOutputSvsBody.innerHTML='<tr><td colspan="4">no item found/request not received</td></tr>';  
     
     }
      
    })
    }
  }
  
  else{
      alert('select patient first');
    }
  })
  
  $(".resOutputSvsBody").on('click', 'tr', function() {
   var ptype=document.querySelector("#resDept").value;
   var pname=document.querySelector("#pname").value;
   
    var currentRow=$(this).closest("tr");       
    var reffNo=currentRow.find("td:eq(0)").text(); 
    var service=currentRow.find("td:eq(2)").text(); 
    var status=currentRow.find("td:eq(3)").text();  
    
    if(status=='in-progress'){
      alert('No results. Examination in progress');
    }
    else if(status=='complete' && ptype=='lab'){
      alert('No results.Test complete but not verified');
    }
    else if(status=='complete' && ptype=='rad'){
        var formdata={        
          reffNo:reffNo
        }
        
          if(Object.keys(formdata).length>0){   //getting the length of the object  
              fetch("/rad/consResultNotes/",{
              body:JSON.stringify({ reffNo:reffNo }),
              method: "POST",
            })
            .then((res)=>res.json())
            .then((data)=>{
            if(data.length >0){
                     
              data.forEach((item)=>{
                document.querySelector('#radHeader').innerHTML=item.notes_by +"'s notes for [" +service+" ]";
                document.querySelector('#radResNotes').value=item.exam_notes;
                document.querySelector('#radResDetails').value='Result Date: '+item.exam_notes_date+' Result time: '+item.exam_notes_time;
                $('#radNotesModal').modal('show');
              
              });
            }
  
          })
        }
      }
  
  
    else if(status=='verified' && ptype=='lab'){
      if(reffNo.trim().length>0){   
        fetch("/lab/labSearchResult/",{
        body:JSON.stringify({ searchText:reffNo }),
        method: "POST",
      })
      .then((res)=>res.json()) 
      .then((data)=>{
        
        tableVerifiedBody.innerHTML='';  
        data.forEach(element => {
          resV=element.result_value;
          recDate=element.receive_date;
          recTime=element.receive_time;
          resDate=element.results_date;
          restime=element.results_time;
          perfby=element.performed_by;
          verby=element.confirmed_by;
          comment=element.testComment;
          
          tableVerifiedBody.innerHTML+=
            `<tr>                  
                  <td><b>Receive Date:</b> ${recDate}</td>            
                  <td><b>Receive Time:</b> ${recTime}</td>                                                                           
            </tr>
            <tr>                  
                <td><b>Parameter</b> </td>            
                <td><b>Result</b> </td>                                                                           
             </tr>`;
  
          resV.forEach(para => {
            tableVerifiedBody.innerHTML+=
            `<tr>                  
                  <td >${para.name}</td>            
                  <td >${para.res}</td>                                                                    
            </tr>`
          });
  
          tableVerifiedBody.innerHTML+=
            `
            <tr>                  
                <td colspan='2'><b>Test Comment:</b> ${comment}</td>                                                                                     
           </tr>
            <tr>                  
                  <td><b>Result Date:</b> ${recDate}</td>            
                  <td><b>Result Time:</b> ${recTime}</td>                                                                           
            </tr>
            <tr>                  
                <td><b>Performed By:</b> ${perfby}</td>            
                <td><b>Confirmed By:</b> ${verby}</td>                                                                           
            </tr>`;
    
        });
        document.querySelector('#testVerDetails').innerHTML='Name: '+pname+' (Test: '+service+')';    
        $('#verifiedModal').modal('show');
          
      })
      }
  
    }
   
    })

    $('#vaccinename').on('change',function(){        
        var cnt = $(this).val();
        if(cnt.trim().length>0){    
          fetch("/consult/loadVaccineTime/",{
          body:JSON.stringify({ searchText:cnt }),
          method: "POST",
      })
      .then((res)=>res.json())
      .then((data)=>{
           if(data.length===0){  
            document.querySelector('#vaccineprd').innerHTML+=`<option value="">no period found</option>`           
          }
          else{
            $("#vaccineprd").empty();
            data.forEach((item)=>{              
                document.querySelector('#vaccineprd').innerHTML+=`<option value="${item.vaccinePeriod}">${item.vaccinePeriod}</option>`
                document.querySelector('#admethod').innerHTML=item.apllicationMethod;
                document.querySelector('#bpart').innerHTML=item.bodyPart;
            });
          }
        })
      }
        
      })


const tblebabylistbody=document.querySelector('.tblebabylistbody');     
$('#buttonImmOpen').on('click', function(){
    var cardNo=$('#pid').val();  
    if(cardNo !==''){
      if(cardNo.trim().length>0){
        //console.log(pid);
        //tableOutput.innerHTML=''; //for table refresh
        fetch("/consult/listmaidenbaby/",{
        body:JSON.stringify({ searchText:cardNo }),
        method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
        if(data.length===0){          
          tblebabylistbody.innerHTML='<tr><td colspan="4">No baby record found </td></tr>'; 
      }
      else{                  
          tblebabylistbody.innerHTML='';
          var jdata=data;          
          jdata.forEach(element => {              
            tblebabylistbody.innerHTML+=
            `<tr> 
                  <td style='display:none';>${element.babyId}</td>
                  <td>${element.babyname}</td>
                  <td>${element.gender}</td>               
                  <td>${element.Dateofbirth}</td>                                           
                  <td>${element.placeofbirth}</td>                                                                   
                                                                                  
            </tr>`;                        
                 
          });         
         
      }
  
    })
    }
  }
  
  else{
      alert('select maiden details first');
    }

})

const tblebabylist2body=document.querySelector('.tblebabylist2body');     
$('.btnloadbabyPnc').on('click', function(){
    var cardNo=$('#pid').val();  
    
    if(cardNo !==''){
      if(cardNo.trim().length>0){
        //console.log(pid);
        //tableOutput.innerHTML=''; //for table refresh
        fetch("/consult/listmaidenbaby/",{
        body:JSON.stringify({ searchText:cardNo }),
        method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
        if(data.length===0){          
          tblebabylist2body.innerHTML='<tr><td colspan="4">No baby record found </td></tr>'; 
      }
      else{                  
          tblebabylist2body.innerHTML='';
          var jdata=data;          
          jdata.forEach(element => {              
            tblebabylist2body.innerHTML+=
            `<tr> 
                  <td style='display:none';>${element.babyId}</td>
                  <td>${element.babyname}</td>
                  <td>${element.gender}</td>               
                  <td>${element.Dateofbirth}</td>                                           
                  <td>${element.placeofbirth}</td>                                                                   
                                                                                  
            </tr>`;                        
                 
          });         
         
      }
  
    })
    }
  }
  
  else{
    //document.querySelector('#collapsedivbaby').addClass('collapse').siblings().removeClass('show');
      alert('select maiden details first');
    }

})

const tblevstVaccineBody=document.querySelector('.tblevstVaccineBody');
$('.tblebabylist tbody').on('click','tr',function(){
    var currentRow=$(this).closest("tr"); 
    currentRow.addClass('bg-success').siblings().removeClass('bg-success');     
    var bbno=currentRow.find("td:eq(0)").text();
    $('#bno').val(bbno);
    var pid=$('#pid').val();
    $('#mdno').val(pid);   
    
    if(bbno.trim()!==''){        
          fetch("/consult/listVaccVisit/",{
          body:JSON.stringify({ searchText:bbno }),
          method: "POST",
      })
      .then((res)=>res.json())
      .then((data)=>{
          if(data.length===0){          
            tblevstVaccineBody.innerHTML='<tr><td colspan="2">No immunization found </td></tr>'; 
        }
        else{                  
            tblevstVaccineBody.innerHTML='';
            var jdata=data;          
            jdata.forEach(element => {              
              tblevstVaccineBody.innerHTML+=
              `<tr> 
                    <td style='display:none';>${element.id}</td>
                    <td>${element.vdate}</td>
                    <td>${element.vname}</td>                                       
                    <td>${element.vperiod}</td>                                       
              </tr>` 
                      
            });         
    
          //color_code();
        }
    
      })
      }

})

/*
checking if input fields are empty in a field
$('#formid input').blur(function(){
    if($(this).val().length===0){
        $(this).parents('p').addClass('warning');
    }
})

*/
$('#btnAdministerVacc').on('click',function(){   

    var formdata = $("#immbabyForm").serialize();  
    $.ajax({
      url: '/consult/saveImmunization/',
      data: formdata, 
      method:'POST',       
      dataType: 'json',
      success: function (data) {               
        if(data.length===0){}
        else{              
            alert(data.msg); 
                          
        }             
        //$('form#motherProfForm').trigger("reset");              
      },
      error: function(jqXHR, exception) {
        if(jqXHR.status === 500) {
            alert('Internal Server Error occurred. try again');
        }
      }
  })
})


$('#btndivopeneffect').on('click', function(){

  var cardNo=$('#pid').val();    
 
  if(cardNo !==''){  
      fetch("/consult/listmaidenbaby/",{
      body:JSON.stringify({ searchText:cardNo }),
      method: "POST",
  })
  .then((res)=>res.json())
  .then((data)=>{
      if(data.length===0){          
        document.querySelector('#bbyname').innerHTML=`<option value="">No baby found</option>`;
    }
    else{ 
      document.querySelector('#mddno').value=cardNo;                 
      document.querySelector('#bbyname').innerHTML='';
      
        var jdata=data;              
        jdata.forEach(element => {          
          document.querySelector('#bbyname').innerHTML+=`<option value="${element.babyId}">${element.babyname}</option>`;
        })     
    }
  })  
}

else{
    alert('select maiden details first');
  }

})


$('#btnSaveEffect').on('click',function(){   
  var formdata = $("#vacveffectForm").serialize();  
  $.ajax({
    url: '/consult/saveImmEffect/',
    data: formdata, 
    method:'POST',       
    dataType: 'json',
    success: function (data) {               
      if(data.length===0){}
      else{              
          alert(data.msg); 
          $('form#vacveffectForm').trigger("reset");
                        
      }             
      //$('form#motherProfForm').trigger("reset");              
    },
    error: function(jqXHR, exception) {
      if(jqXHR.status === 500) {
          alert('Internal Server Error occurred. try again');
      }
    }
})
})


$('.tblebabylist2 tbody').on('click','tr',function(){
  var currentRow=$(this).closest("tr"); 
  currentRow.addClass('bg-success').siblings().removeClass('bg-success');     
  var bbno=currentRow.find("td:eq(0)").text();
  $('#babynumber').val(bbno);
  var pid=$('#pid').val(); 
  $('#mdnnumber2').val(pid);  
})

$('.btndivpncmaiden').on('click', function(){
  var pid=$('#pid').val();
  if(pid!=='') {
    $('#mdnnumber').val(pid);
  }
  else{alert('load maiden details first')}
})

$('#pncvisit').on('change', function(){
  var choice=$(this).val();
  document.querySelector('#vperiod').value=choice;
  document.querySelector('#vperiod2').value=choice;
})


$('#buttonsavePNCM').on('click',function(){   
  var formdata = $("#pncmaidenForm").serialize();  
  $.ajax({
    url: '/consult/savemaidenpncVisit/',
    data: formdata, 
    method:'POST',       
    dataType: 'json',
    success: function (data) {               
      if(data.length===0){}
      else{              
          alert(data.msg); 
          $('form#pncmaidenForm').trigger("reset");
                        
      }                    
    },
    error: function(jqXHR, exception) {
      if(jqXHR.status === 500) {
          alert('Internal Server Error occurred. try again');
      }
    }
})
})

$('#btnsavebabypnc').on('click',function(){   
  var formdata = $("#pncbabyForm").serialize(); 
  var bno=$('#babynumber').val(); 
  var vp=$('#vperiod2').val(); 
  if(bno !=='' && vp !==''){
    $.ajax({
      url: '/consult/savebabypncVisit/',
      data: formdata, 
      method:'POST',       
      dataType: 'json',
      success: function (data) {               
        if(data.length===0){}
        else{              
            alert(data.msg); 
            $('form#pncbabyForm').trigger("reset");
                          
        }             
        //$('form#motherProfForm').trigger("reset");              
      },
      error: function(jqXHR, exception) {
        if(jqXHR.status === 500) {
            alert('Internal Server Error occurred. try again');
        }
      }
  })

  }
  else{
    alert('select visit count or baby details on table');
  }

})

//load active fp method plans
const tblefpbody=document.querySelector('.tblefpbody');
$('#buttonFpAdmOpen').on('click',function(){
  var pid=$('#pid').val();
  if(pid!==''){
    if(pid.trim()!==''){        
      fetch("/consult/listfpPlan/",{
      body:JSON.stringify({ searchText:pid }),
      method: "POST",
  })
  .then((res)=>res.json())
  .then((data)=>{
      if(data.length===0){          
        tblefpbody.innerHTML='<tr><td colspan="2">No plan found </td></tr>'; 
    }
    else{                  
        tblefpbody.innerHTML='';
        var jdata=data;          
        jdata.forEach(element => {              
          tblefpbody.innerHTML+=
          `<tr> 
                <td style='display:none';>${element.id}</td>
                <td>${element.method}</td> 
                <td>${element.date}</td>                                      
                <td>${element.status}</td>                                       
          </tr>` 
                  
        });         

      //color_code();
    }

  })
  }
  }
  else{
    alert('failed to fetch previous plans..load client details first');
  }  
  
 

})

$('#btnAdministerFP').on('click',function(){   
  var formdata = $("#fpadministerForm").serialize();  
  $.ajax({
    url: '/consult/administerFp/',
    data: formdata, 
    method:'POST',       
    dataType: 'json',
    success: function (data) {               
      if(data.length===0){}
      else{              
          alert(data.msg); 
          $('form#fpadministerForm').trigger("reset");
                        
      }                    
    },
    error: function(jqXHR, exception) {
      if(jqXHR.status === 500) {
          alert('Internal Server Error occurred. try again');
      }
    }
})
})


$('#btndiscontinueFP').on('click',function(){   
  var fpid = $('#fpno').val();  
  $.ajax({
    url: '/consult/discontinueFp/',
    data: fpid, 
    method:'POST',       
    dataType: 'json',
    success: function (data) {               
      if(data.length===0){}
      else{              
          alert(data.msg); 
          $('form#fpadministerForm').trigger("reset");
                        
      }                    
    },
    error: function(jqXHR, exception) {
      if(jqXHR.status === 500) {
          alert('Internal Server Error occurred. try again');
      }
    }
})
})


$('#btnSaveFpEffect').on('click',function(){   
  var formdata = $("#fpeffectForm").serialize();  
  $.ajax({
    url: '/consult/saveFpEffect/',
    data: formdata, 
    method:'POST',       
    dataType: 'json',
    success: function (data) {               
      if(data.length===0){}
      else{              
          alert(data.msg); 
          $('form#fpeffectForm').trigger("reset");
                        
      }                    
    },
    error: function(jqXHR, exception) {
      if(jqXHR.status === 500) {
          alert('Internal Server Error occurred. try again');
      }
    }
})
})
