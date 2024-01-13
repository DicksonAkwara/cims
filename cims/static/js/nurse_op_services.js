
$('#patward').on('change',function(){
  var clinic=$(this).val();
  outpatentlist(clinic);
});

var ptriageBody=document.querySelector('#ptriageBody');
function inpatentlist(pt){
  var ptype=pt;
  ptriageBody.innerHTML='';
  fetch("/nurse/inpatient_list/",{
    body:JSON.stringify({ptype:ptype }),
    method: "POST",
})
.then((res)=>res.json())
.then((data)=>{
    if(data.length===0){
      ptriageBody.innerHTML=`
      <tr>
        <td colspan='9'>No admissions found</td>
      </tr>`;
    }
    else{
      data.forEach((item)=>{
        ptriageBody.innerHTML +=`
        <tr>
          <td>${item.adate}</td>
          <td>${item.atime}</td>
          <td>${item.pno}</td>
          <td>${item.pname}</td>
          <td>${item.page}</td>
          <td>${item.pgend}</td>
          <td>${item.pward}</td>
          <td>${item.pmode}</td>
          <td>${item.urg}</td>
          <td style='display:none'>${item.vno}</td>
          <td style='display:none'>In-Patient</td>
        </tr>`;
      })
      
    }
})

}

function outpatentlist(clinic){
  ptriageBody.innerHTML='';
  fetch("/nurse/outpatient_list/",{
    body:JSON.stringify({clinic:clinic }),
    method: "POST",
})
.then((res)=>res.json())
.then((data)=>{
    if(data.length===0){
      ptriageBody.innerHTML=`
      <tr>
        <td colspan='9'>No patients found</td>
      </tr>`;
    }
    else{
      data.forEach((item)=>{
        ptriageBody.innerHTML +=`
        <tr>
          <td>${item.adate}</td>
          <td>${item.atime}</td>
          <td>${item.pno}</td>
          <td>${item.pname}</td>
          <td>${item.page}</td>
          <td>${item.pgend}</td>
          <td>${item.pward}</td>
          <td>${item.pmode}</td>
          <td>${item.urg}</td>
          <td style='display:none'>${item.vno}</td>
          <td style='display:none'>Out-Patient</td>
        </tr>`;
      })
      
    }
})

}

/*$('#pCardNo').on('keyup',function(){

    var pid = $(this).val();
    var pt=$('#pat_type').val();
    if(pid.trim().length>0){       
        fetch("/consult/cons_pat_search/",{
        body:JSON.stringify({ searchText:pid,ptype:pt }),
        method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
        
        if(data.length===0){
            //tableOutput.innerHTML='<tr><td colspan="4">No records found </td></tr>';
            document.querySelector('.txtsearch').innerHTML='patient not found';
            document.querySelector('#pname').innerHTML='';
            document.querySelector('#last_visit').innerHTML=''; 
            document.querySelector('#pymode').innerHTML=''; 
            document.querySelector('#patid').innerHTML='';
            
           
            
        }
        else{          
           data.forEach((item)=>{
            document.querySelector('.txtsearch').innerHTML='';
            document.querySelector('#pname').innerHTML=item.fname;
            document.querySelector('#pat_age').innerHTML=item.age;
            document.querySelector('#pgender').innerHTML=item.gender;
            document.querySelector('#last_visit').innerHTML=item.pid; 
            document.querySelector('#patid').value=item.pid;
            document.querySelector('#vno').value=item.vno;
            document.querySelector('#urgency').innerHTML=item.urg; 
            document.querySelector('#pymode').innerHTML=item.scheme_type+"("+item.scheme_name+")";
        })        
        }
      })
    }
    else{
      document.querySelector('.txtsearch').innerHTML='';
    }

})*/


$('#ptriage tbody').on('click','tr', function(){
  var ptype=$('#pat_type').val();
  if (ptype !==''){  
    //check for consultation payment first
    var currentRow=$(this).closest("tr"); 
    var pid=currentRow.find("td:eq(2)").text();

    if (ptype =='Out-Patient'){ 
      fetch("/nurse/check_cons_payment/",{
        body:JSON.stringify({pid:pid}),
        method: "POST",
      })
    .then((res)=>res.json())
    .then((data)=>{
      var msg='';

      data.forEach((item)=>{
        msg=item.msg;
      })


      if (msg=='paid'){ //load triage modal
        currentRow.addClass('bg-info').siblings().removeClass('bg-info');
        //document.querySelector('.txtsearch').innerHTML='';
        document.querySelector('#pname').innerHTML=currentRow.find("td:eq(3)").text().toUpperCase();
        document.querySelector('#pat_age').innerHTML=currentRow.find("td:eq(4)").text();
        document.querySelector('#pgender').innerHTML=currentRow.find("td:eq(5)").text().toLowerCase();
        document.querySelector('#last_visit').innerHTML=currentRow.find("td:eq(2)").text(); 
        document.querySelector('#patid').value=pid
        document.querySelector('#vno').value=currentRow.find("td:eq(9)").text();
        document.querySelector('#urgency').innerHTML=currentRow.find("td:eq(8)").text(); 
        document.querySelector('#pymode').innerHTML=currentRow.find("td:eq(7)").text();    
        $('#triageFormModal').modal('show');
      }
      else{
        currentRow.siblings().removeClass('bg-info');
        swal('','Consultation fee not paid','info')
      }
    })
     }
    else{

        currentRow.addClass('bg-info').siblings().removeClass('bg-info');
        //document.querySelector('.txtsearch').innerHTML='';
        document.querySelector('#pname').innerHTML=currentRow.find("td:eq(3)").text().toUpperCase();
        document.querySelector('#pat_age').innerHTML=currentRow.find("td:eq(4)").text();
        document.querySelector('#pgender').innerHTML=currentRow.find("td:eq(5)").text().toLowerCase();
        document.querySelector('#last_visit').innerHTML=currentRow.find("td:eq(2)").text(); 
        document.querySelector('#patid').value=pid
        document.querySelector('#vno').value=currentRow.find("td:eq(9)").text();
        document.querySelector('#urgency').innerHTML=currentRow.find("td:eq(8)").text(); 
        document.querySelector('#pymode').innerHTML=currentRow.find("td:eq(7)").text();    
        $('#triageFormModal').modal('show');
    }   
  }
  else{
    swal('','Sorry!!select patient type first','error');
  }
})


$('#pCardNo').on('keyup',function(){
  var value = $(this).val().toLowerCase();
  $("#ptriage tbody tr").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});





$('#pCardNo2').on('keyup',function(){

  var pid = $(this).val();
  var pt=$('#pat_type2').val();
  if(pid.trim().length>0){       
      fetch("/consult/cons_pat_search/",{
      body:JSON.stringify({ searchText:pid,ptype:pt }),
      method: "POST",
  })
  .then((res)=>res.json())
  .then((data)=>{
      
      if(data.length===0){
          //tableOutput.innerHTML='<tr><td colspan="4">No records found </td></tr>';
          document.querySelector('.txtsearch2').innerHTML='patient not found';
          document.querySelector('#pname2').value='';
          document.querySelector('#last_visit2').value=''; 
          document.querySelector('#pymode2').value=''; 
          //document.querySelector('#patid2').value='';
          document.querySelector('#ppymode').value='';
         
          
      }
      else{          
         data.forEach((item)=>{
          document.querySelector('.txtsearch2').innerHTML='';
          document.querySelector('#pname2').value=item.fname;
          document.querySelector('#pat_age2').value=item.age;
          document.querySelector('#pgender2').value=item.gender;
          document.querySelector('#last_visit2').value=item.pid;        
          document.querySelector('#vno2').value=item.vno;
          document.querySelector('#urgency2').value=item.urg; 
          document.querySelector('#pymode2').value=item.scheme_type+"("+item.scheme_name+")";
          document.querySelector('#ppymode').value=item.scheme_name;
          
      })   
      checkpaymode(); 
      
       }
    })
  }
  else{
    document.querySelector('.txtsearch2').innerHTML='';
  }
})
function checkpaymode(){
  setTimeout(function(){
    var pym=$('#ppymode').val();
    if(pym=='cash'){
      $('.btnraiseBill').prop('disabled',false);
      $('.btnadminsvs').prop('disabled',true);
    }
    else{
      $('.btnraiseBill').prop('disabled',true);
      $('.btnadminsvs').prop('disabled',false);
    }
  },1500)
   
  
}


$('#btnsave').on('click',function(){   
    var formdata = $("#triageForm").serialize();
    var pname =document.querySelector('#pname').innerHTML;
        $.ajax({
          url: '/nurse/save_triage/',
          data: formdata, 
          method:'POST',       
          dataType: 'json',
          success: function (data) {
              if (data.user) {             
                alert(data.user.msg +"for ["+pname+"] saved successfully")

                $('#triageFormModal').modal('hide');
                $('form#triageForm').trigger("reset");
                document.querySelector('#pname').innerHTML="";
                document.querySelector('#pat_age').innerHTML="";
                document.querySelector('#pgender').innerHTML="";
                document.querySelector('#last_visit').innerHTML="";                 
                document.querySelector('#pymode').innerHTML="";
                document.querySelector('#urgency').innerHTML="";

              }
          }
      });
      
  
  })
/*
  $('#btemp').on('keyup', function(){
    var tmp =$(this).val();
    if(tmp>=40){
      $('#bbtemp').addClass('bg-danger');
      $('#paturgency').prop('selectedIndex', 3);
    }
    else if(tmp>=35 && tmp<=39){
      $('#bbtemp').removeClass('bg-danger').addClass('bg-success');
      $('#bbtemp').removeClass('bg-info').addClass('bg-success');
      $('#paturgency').prop('selectedIndex', 1);
    }
    else if(tmp>=31 && tmp<35){
      $('#bbtemp').removeClass('bg-danger').addClass('bg-warning');
      $('#bbtemp').removeClass('bg-success').addClass('bg-warning');
      $('#paturgency').prop('selectedIndex', 2);
    }
    else if(tmp<=30){
      $('#bbtemp').removeClass('bg-warning').addClass('bg-danger');
      $('#bbtemp').removeClass('bg-success').addClass('bg-danger');
      $('#paturgency').prop('selectedIndex', 3);
    }
   
  })

  $('#bweight').on('keyup', function(){
    var tmp =$(this).val();
    if(tmp>=300){      
      $('#bbweight').removeClass('bg-success').addClass('bg-danger');
     
    }
    else if(tmp<=0){
      $('#bbweight').removeClass('bg-success').addClass('bg-danger');;
    }
    else{
      $('#bbweight').removeClass('bg-danger').addClass('bg-success');;
    }
  
   
  })

  $('#bheight').on('keyup', function(){
    var tmp =$(this).val();
    if(tmp>=200){      
      $('#bbheight').removeClass('bg-success').addClass('bg-danger');
     
    }
    else if(tmp<=0){
      $('#bbheight').removeClass('bg-success').addClass('bg-danger');;
    }
    else{
      $('#bbheight').removeClass('bg-danger').addClass('bg-success');;
    }
  
   
  })*/

  $('#btntgreport').on('click',function(){
    loadtriage();
    $('#triagemodal').modal('show');
  })

var trgtable=document.querySelector('#trgtableBody');

function loadtriage(){
    var dtf=$('#datefrom').val();
    var dtt=$('#dateto').val();

    fetch("/nurse/triagelist/",{
      body:JSON.stringify({ dtf:dtf,dtt:dtt }),
      method: "POST",
    })
  .then((res)=>res.json())
  .then((data)=>{
    trgtable.innerHTML='';
    var jdata=data; 
    var pt=0;           
    var cnt=0;        
    jdata.forEach(element => { 
      trgtable.innerHTML+=
      `<tr>     
                  <td>${element.tdate}:${element.ttime}</td>
                  <td>${element.pno}</td>
                  <td>${element.pname}</td>
                  <td>${element.age}</td>
                  <td>${element.tp}</td>         
                  <td>${element.bp}</td>         
                  <td>${element.pul}</td>         
                  <td>${element.ht}</td> 
                  <td >${element.wt}</td>
            </tr>`;
            pt= element.ptcount;                
            cnt= element.wkcount;                
    });
    trgtable.innerHTML+=
      `<tr>               
        <td colspan='2'>Total Patients:</td> 
        <td colspan='2'>${pt}</td> 
        <td colspan='2'>Triage Count:</td> 
        <td colspan='2'>${cnt}</td>
      </tr>`;
  })
  }

  $('#btnvlist').on('click', function(){
    loadtriage();
  })

  $("#searchtxt").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#trgtable tbody tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });


  /******  nurse operations methods******/
  var tblnsopsbody=document.querySelector('#tblnsopsbody');
  $('#nsoperation').on('change', function(){
    var ops =$(this).val();
    var pymode=$('#ppymode').val();
    var pid=$('#last_visit2').val();
    var vno=$('#vno2').val();

    if(ops=='requests' && pid !==''){  
      fetch("/nurse/doctorequest/",{
        body:JSON.stringify({ pid:pid,vno:vno }),
        method: "POST",
      })
    .then((res)=>res.json())
    .then((data)=>{
      tblnsopsbody.innerHTML='';
      var jdata=data;         
      jdata.forEach(element => { 
        tblnsopsbody.innerHTML+=
        `<tr>     
            <td style='display:none'>${element.rfn}</td>
            <td>${element.tdate}:</td>
            <td>${element.item}</td>
            <td>${element.inst}</td>
            <td contenteditable id='qnt'>${element.qnt}</td>
            <td id='ttp'>${element.cost}</td>                     
            <td>${element.pstt}</td> 
            <td>${element.stt}</td> 
            <td>${element.by}</td> 
            <td><button type="button" class="btn btn-danger btn-sm btnRemove"><span aria-hidden="true">&times;</span></button></td>
            <td style='display:none'>${element.type}</td>
            <td style='display:none'>${element.itcode}</td>
            <td style='display:none'>${element.cost}</td>
        </tr>`;               
      });   
    })
    }
  })

$('#nsaddsvc').on('click', function(){
  var stn=$('#nstation').val();
  var pid=$('#last_visit2').val();
  if(stn=='none'){
    alert('select nurse station first');    
  }
  else{
    if(pid==''){
      alert('please search patient first');
    }
    else{
      $('#servicenModal').modal('show');
    }
    
  }
})


$("#tblnsopsbody").on('click', '.btnRemove', function() {
  var currentRow=$(this).closest("tr");
  var svs_name=currentRow.find("td:eq(2)").text(); 
  if(confirm(`Are you sure you want to remove( ${svs_name} )from bill?`)){       
      $(this).closest('tr').remove();      
  }
})

var searchtbbody=document.querySelector('#resultTablenBody');
$('#search_nservice').on('keyup', function(){
  var svs=$(this).val();
  if(svs !==''){
    fetch("/nurse/servicesearch/",{
      body:JSON.stringify({ svsname:svs}),
      method: "POST",
    })
  .then((res)=>res.json())
  .then((data)=>{
    searchtbbody.innerHTML='';
    var jdata=data;         
    jdata.forEach(item => { 
      searchtbbody.innerHTML+=
      `<tr>     
          <td>${item.service_name}</td>
          <td>${item.normal_rate}</td>
          <td>${item.scheme_rate}</td>
          <td style="display:none;">${item.scode}</td>
          <td style="display:none;">${item.service_type}</td>
      </tr>`;               
    });   
  })

  }
})

$('#resultTablenBody').on('click','tr',function(){
  var pymode=$('#ppymode').val();

  var currentRow=$(this).closest("tr");  
  var svs_name=currentRow.find("td:eq(0)").text();
  var scode=currentRow.find("td:eq(3)").text();
  var stype=currentRow.find("td:eq(4)").text();
  var cost=0;var stp='';
  if (pymode=='cash'){
    cost=currentRow.find("td:eq(1)").text();
  }
  else{
    cost=currentRow.find("td:eq(2)").text();
  }
  if (stype=='item'){
    stp='drg';
  }
  else{
    stp='svs';
  }
  //get today date
  var now = new Date();
    var month = (now.getMonth() + 1);               
    var day = now.getDate();
    if (month < 10) 
        month = "0" + month;
    if (day < 10) 
        day = "0" + day;
    var today = now.getFullYear() + '-' + month + '-' + day;
    var username=$('#username').val();
  //add details to the request table
  tblnsopsbody.innerHTML+=
        `<tr>     
            <td style='display:none'>${scode}</td>
            <td>${today}</td>
            <td>${svs_name}</td>
            <td>${svs_name}</td>
            <td contenteditable id='qnt'>1</td>
            <td id='ttp'>${cost}</td>         
            <td>pending</td> 
            <td>pending</td> 
            <td>${username}</td> 
            <td><button class="btn btn-danger btn-sm btnRemove" value='X'></td>
            <td><button type="button" class="btn btn-danger btn-sm btnRemove"><span aria-hidden="true">&times;</span></button></td>
            <td style='display:none'>${stp}</td>
            <td style='display:none'>${cost}</td>
        </tr>`;       
})

$('#btnadminsvs').on('click', function(){
  var tb = document.querySelector('#tblnsops');
  var rw_count = tb.tBodies[0].rows.length;  
  var pid=$('#last_visit2').val();
  var vno=$('#vno2').val();
  var station=$('#nstation').val();
  var rcpt=$('#rcptno').val();
  var bill=[]; 
  if(rw_count<=0 ){
    alert('Nothing to dispense');
  }
  else{
    if(station=='none'){
      alert('Select station first');
    }
    else{
      for(var i=1;i<=rw_count;i++){        
        bill.push({
            op_no:pid,
            vno:vno,  
            rcpt:rcpt,        
            rfno:tb.rows[i].cells[0].innerHTML,
            typ:tb.rows[i].cells[10].innerHTML,
            qnt:tb.rows[i].cells[4].innerHTML,
            total_price:tb.rows[i].cells[5].innerHTML,
            itcode:tb.rows[i].cells[11].innerHTML,
            sttn:station,
        });            
    }
    $.ajax({
      url: '/nurse/administer/',
      data: JSON.stringify({bill}), 
      method:'POST',       
      dataType: 'json',
      success: function (data) {          
            alert(data[0].msg)
      }
  });
    }
  }
 

})

//

$("#tblnsops").on('keyup', '#qnt', function() { 
  var currentRow=$(this).closest("tr");
  var qn=parseFloat(currentRow.find("td:eq(4)").text()); 
  var ctp=parseFloat(currentRow.find("td:eq(12)").text());//hidden total price

  if(isNaN(qn) || qn==0 ){
    currentRow.find("td:eq(4)").html('').append('1');
    currentRow.find("td:eq(5)").html('').append(ctp);
  }
  else{
    var ttp=qn*ctp
    currentRow.find("td:eq(5)").html('').append(ttp);
  }
});


$('#btnraiseBill').on('click', function(){
  var tb = document.querySelector('#tblnsops');
  var rw_count = tb.tBodies[0].rows.length;  
  var pid=$('#last_visit2').val();
  var vno=$('#vno2').val();
  var station=$('#nstation').val();
  var pym=$('#ppymode').val();
  var pty=$('#pat_type2').val();
  var bill=[]; 
  if(rw_count<=0 ){
    alert('Nothing to raise Bill for');
  }
  else{
    if(station=='none'){
      alert('Select station first');
    }
    else{
      //7 billed status
      //var status=tb.rows[i].cells[0].innerHTML;


      for(var i=1;i<=rw_count;i++){        
        bill.push({
            op_no:pid,
            vno:vno,  
            pym:pym,
            pty:pty,       
            rfno:tb.rows[i].cells[0].innerHTML,
            typ:tb.rows[i].cells[10].innerHTML,
            qnt:tb.rows[i].cells[4].innerHTML,
            total_price:tb.rows[i].cells[5].innerHTML,
            itcode:tb.rows[i].cells[11].innerHTML,
            sttn:station,
        });            
    }
    $.ajax({
      url: '/nurse/opraisebill/',
      data: JSON.stringify({bill}), 
      method:'POST',       
      dataType: 'json',
      success: function (data) {          
        alert(data[0].msg)
      }
  });
    }
  }

})


$('#rcptno').on('keyup',function(){
  var pno=$('#last_visit2').val();
  var rno=$(this).val();
  if(rno !==''){
    fetch("/nurse/search_receipt/",{
      body:JSON.stringify({rno:rno,pno:pno}),
      method: "POST",
    })
  .then((res)=>res.json())
  .then((data)=>{
    tblnsopsbody.innerHTML='';
    var jdata=data;         
    jdata.forEach(item => { 
      tblnsopsbody.innerHTML+=
        `<tr>     
          <td style='display:none'>${item.rfn}</td>
          <td>${item.tdate}:</td>
          <td>${item.item}</td>
          <td>${item.inst}</td>
          <td contenteditable id='qnt'>${item.qnt}</td>
          <td id='ttp'>${item.cost}</td>                     
          <td>${item.pstt}</td> 
          <td>${item.stt}</td> 
          <td>${item.by}</td> 
          <td><button type="button" class="btn btn-danger btn-sm btnRemove"><span aria-hidden="true">&times;</span></button></td>
          <td style='display:none'>${item.type}</td>
          <td style='display:none'>${item.itcode}</td>
          <td style='display:none'>${item.cost}</td>
      </tr>`;                
    });   
  })

  }
})

////////////////// new UI //////////////////////////////

$('#loadm').on('click', function(){
  $('#serviceModal').modal('show');
})

$('#ns_operation').on('change', function(){
  var station=$('#nurse_station').val();
  var op=$(this).val();
  if(op.trim() !=='' && station !=='none'){
    swal('',op,'info');

  }
  else{
    swal('','select nurse station first','error');
    $(this).prop('selectedIndex',0);

  }
})
