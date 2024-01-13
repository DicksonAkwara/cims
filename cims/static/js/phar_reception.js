const pcardNo =  document.querySelector('#pCardNo');
const search_item =  document.querySelector('#search_item');
const pat_type =  document.querySelector('#pat_type');

const drugtableBody = document.querySelector('.drugtableBody'); 
const requestTableBody = document.querySelector('.requestTableBody'); 
const tbpendprescBody = document.querySelector('.tbpendprescBody'); 

const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;



$('#navbtnpend').on('click',function(){
  //fetchpendpresc();
})

$(document).ready(function(){  
  fetch("/finance/checkshift/",{      
     method: "POST",
 })
 .then((res)=>res.json())
 .then((data)=>{
   var jdata=data;  
   jdata.forEach(element => { 
   document.querySelector('#shftlabel').innerHTML=element.shiftno;
   })
 }) 
})

/* var datalist=document.querySelector('#storeitems')
$('#pharm_stores').on('change', function(){
  var store=$(this).val();

  fetch("/pharm/itemlist/",{
    body:JSON.stringify({ searchText:itname,storeId:storeId }),
    method: "POST",
})
.then((res)=>res.json())
.then((data)=>{  
  $('#storeitems').empty();
  var jdata=data;        
  jdata.forEach(element => {  
     datalist.innerHTML+=`<option value="${item.sub_county}">${item.sub_county}</option>`                 
  }); 
  
})
}) */



$('#patient_id').on('keyup',function(){

    var pid = $(this).val();
    var pt=$('#pat_type').val();
    var store=$('#pharm_stores').val();
    if(pid.trim().length>0 && store !=0){
        
        fetch("/consult/cons_pat_search/",{
        body:JSON.stringify({ searchText:pid,ptype:pt }),
        method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
        
        if(data.length===0){
            //tableOutput.innerHTML='<tr><td colspan="4">No records found </td></tr>';
            document.querySelector('#pname').value='';
            document.querySelector('#last_visit').value=''; 
            document.querySelector('#visitNo').value=''; 
            document.querySelector('#paymode').value=''; 
            document.querySelector('#pymode2').value=''; 
            document.querySelector('#patfind').innerHTML='patient not found'; 
            requestTableBody.innerHTML='';
            
            
        }
        else{
          var jdata=data;                  
          var pid
          jdata.forEach(element => { 
          pid =element.pid;    
          document.querySelector('#patfind').innerHTML='';      
          document.querySelector('#pname').value=element.fname;
          document.querySelector('#last_visit').value=pid;
          document.querySelector('#visitNo').value=element.vno;
          document.querySelector('#paymode').value=element.scheme_type+"("+element.scheme_name+")";
          document.querySelector('#pymode2').value=element.scheme_name;
          })         
          //retrieve_prescription(pid);
          
         }
      })
    }
    else{
      alert('select store to dispense from');
      document.querySelector('#patient_id').value='';
    }
    });

  
 


$('#pname').on('keyup',function(){
  var store=$('#pharm_stores').val();
    if(store==0){
      alert('select store to dispense from');
      document.querySelector('#pname').value='';
    }

})


$('#pat_type').on('change',function(){
  var ptype=$(this).val();

  if(ptype !=='In-Patient'){      
    $('#btnreqpat').prop('disabled',true);
    $('#btndispense').prop('disabled',true);
  }
  else{
    $('#btndispense').prop('disabled',false);
    $('#btnreqpat').prop('disabled',true);
  }

  if(ptype=='Walk-In'){
    $('#patient_id').prop('disabled', true);
    $('#pname').prop('readonly', false);
    $('#wlkmodal').modal('show');
  }
  else{
    $('#patient_id').prop('disabled', false);
    $('#pname').prop('readonly', true);
  }
 // document.querySelector('#last_visit').value='';
  //document.querySelector('#patient_id').value='';
  //document.querySelector('#pname').value='';
 // document.querySelector('#paymode').value='';
 // document.querySelector('#pymode2').value='';
})



$("#dlvitem").keyup(function(){ 
  var search = $(this).val();
  var str = $('#pharm_stores').val();
  if(search != ""){ 
     $.ajax({ 
       url: '/stores/searchItem/', 
       type: 'post', 
       data: JSON.stringify({searchText:search,str:str}), 
       dataType: 'json', 
       success:function(response){ 
         var len = response.length; 
         $("#searchResult").empty(); 
         for( var i = 0; i<len; i++){ 
            var id = response[i]['itid'];  
            var itname = response[i]['itname'];
            
            $("#searchResult").append("<li value='"+id+"'>"+itname+"</li>"); 
         }            // binding click event to li 
         $("#searchResult li").bind("click",function(){
            itemdetails(this); 
         }); 
       } 
     }); 
   } 
 });

 // Set Text to search box and get details 
function itemdetails(element){ 
  var value = $(element).text(); 
  var itid = $(element).val();
  var str = $('#pharm_stores').val(); 
  $("#dlvitem").val(''); 
  $("#searchResult").empty(); 
  
  // Request Item Details 
  $.ajax({ 
     url: '/stores/itemdetails/', 
     type: 'post', 
     data:JSON.stringify({itid:itid,str:str}), 
     dataType: 'json', 
     success: function(response){ 
        var len = response.length; 
        //$("#userDetail").empty(); 
        if(len > 0){ 
           var itname = response[0]['itname']; 
           var itid = response[0]['itid'];
           var bal = response[0]['bal'];
           var price = response[0]['price'];

           $('#requestTable tbody:last-child').append(`
              <tr>
                <td style="display:none;">${itid}</td>
                <td>${itname}</td>
                <td contenteditable='true'>1</td>
                <td contenteditable='true' id="frq">OD</td>
                <td contenteditable='true'>1</td>
                <td>${bal}</td>
                <td contenteditable='true' class='text-center svc_qnt'>1</td>
                <td>${price}</td>
                <td>${price}</td>        
                <td style="display:none;">none</td>
                <td><button class="btn btn-warning btn-sm btnOs">OS</button></td>
                <td><button class="btn btn-danger btn-sm btnRemove">&times</button></td> 
                <td style="display:none;">added</td>       
              </tr>
            `); 

            //get total bill
            billed_sum();
        } 
     } 
  }); 
}

$("#requestTable").on('click', '.btnRemove', function() {  
  var currentRow=$(this).closest("tr");
  var svs_name=currentRow.find("td:eq(1)").text(); 
  if(confirm(`Discard( ${svs_name} )from bill?`)){     
      $(this).closest('tr').remove();   
      billed_sum();           
  }
})


$("#requestTable").on('click', '.btnOs', function() { 
  var currentRow=$(this).closest("tr");   
  var svs_name=currentRow.find("td:eq(1)").text(); 
  if(confirm(`confirm( ${svs_name} )is unavailable?`)){ 
    var pno=$('#visitNo').val();
    var store=$('#pharm_stores').val();
    var vno=$('#visitNo').val();
  
     
    var itcode=currentRow.find("td:eq(0)").text(); 
    var bal=currentRow.find("td:eq(5)").text(); 
    
    var refn=currentRow.find("td:eq(9)").text();
    var qnt=currentRow.find("td:eq(6)").children[0].value;
    var data=[]
    /* data.push({
      pno:pno,
      vno:vno,
      store:store,
      item:itcode,
      rfno:refn,
    })

    var formdata=JSON.stringify(data);
    $.ajax({
      url: "/pharm/item_os/",
      data: formdata, 
      method:'POST',       
      dataType: 'json',
      success: function (data) {
        $(this).closest('tr').remove();   
        billed_sum();        
      },
      error: function(jqXHR, exception) {
        if(jqXHR.status === 500) {
            alert('Internal Server Error occurred.'+exception);
        }
      }
    }); */
               
  }
})



$('#requestTable').on('keyup','.svc_qnt',function(){
  
  var currenRow=$(this).closest("tr");   
  var qnt = parseFloat(currenRow.find("td:eq(6)").text().trim());
  if(isNaN(qnt)){}
  else{  
    if(qnt>0){
    var price=parseFloat(currenRow.find("td:eq(7)").text());
    var aqnt=parseFloat(currenRow.find("td:eq(5)").text());//available
          if(qnt>aqnt){
            swal('','cannot bill or dispense more than available','info');
            currenRow.find("td:eq(6)").html('').append('1')   
            currenRow.find("td:eq(8)").html('').append(price)   
            billed_sum();           
          }
          else{
            var total =parseFloat(qnt*price);      
            currenRow.find("td:eq(8)").html('').append(total)
            billed_sum();
          }            
    }  
  else{
    swal('','incorrect quantity entry','error');
    resetAmount();
  }   
  
}

})

function billed_sum(){
  //setTimeout(function() {
    var table = document.querySelector(".requestTable"),
    sumVal = 0.0;
    var rw_length=table.rows.length
    if(rw_length>1){
      for (var i = 1; i < rw_length; i++) {
        sumVal +=parseFloat(table.rows[i].cells[8].innerHTML.trim());
      }    
      document.querySelector("#bill_amt").value =sumVal;
     
    }
    else{
      document.querySelector("#bill_amt").value =sumVal
      
    }
  //},1500)
    
  }
  function billed_sum_disp(){
    //setTimeout(function() {
      var table = document.querySelector(".dispTable"),
      sumVal = 0.0;
      var rw_length=table.rows.length
      if(rw_length>1){
        for (var i = 1; i < rw_length; i++) {
          sumVal +=parseFloat(table.rows[i].cells[8].innerHTML);
        }    
        document.querySelector("#bill_amt").value =sumVal;
       
      }
      else{
        document.querySelector("#bill_amt").value =sumVal
        
      }
    //},1500)
     
    }

  function resetAmount(){
    document.querySelector("#bill_amt").value =0.0;      
  }

 




$('#phaction').on('click',function(){
  var pno =$('#last_visit').val();
  if(pno==''){
    alert('search for patient first');
    $(this).prop('selectedIndex',0);    
  }
  else{
    controlbtn();
  }
}) 

function controlbtn(){
  var act =$('#phaction').val();
  if(act=='raise'){
    $('#btnreqpat').prop('disabled',false);
    $('#btnsearchdrug').prop('disabled',false);
    $('#receiptno').prop('readonly',true);
    $('#btndispense').prop('disabled',true);
    $('#divtbraise').show();
    $('#divtbdisp').hide()
  }
  else if(act=='dispense'){
    $('#btnreqpat').prop('disabled',true);
    $('#btnsearchdrug').prop('disabled',true);
    $('#receiptno').prop('readonly',false);
    $('#btndispense').prop('disabled',false);
    $('#divtbraise').hide();
    $('#divtbdisp').show();
  }
  else{
    $('#btnreqpat').prop('disabled',true);
    $('#receiptno').prop('readonly',true);
    $('#btndispense').prop('disabled',true);
    $('#btnsearchdrug').prop('disabled',true);
     $('#divtbraise').show();
     $('#divtbdisp').hide();
  }
}




$('#nav-profile-tab').on('click', function(){
    loaditemdispensed(); 
})

$('.btn_ref_list').on('click', function(){
  loaditemdispensed(); 
})
function loaditemdispensed(){
  var disptblistbody=document.querySelector('#disptblistbody');
  var storeid=$('#pharm_stores').val();
  var fdate=$('#datefrom').val();
  var tdate=$('#dateto').val();
  if(storeid=='0'){
    swal('','select pharmacy counter first','info');
  }
  else{
    fetch("/pharm/dispenselist/",{    
      method: "POST",
      body:JSON.stringify({stid:storeid,fdate:fdate,tdate:tdate})
    })
  .then((res)=>res.json())
  .then((data)=>{
    disptblistbody.innerHTML='';
    var jdata=data; 
    if(data.length===0){
      disptblistbody.innerHTML+=
        `<tr><td colspan='9'> No dispensation done for the period or counter</td></tr>`;
    }
    else{
      jdata.forEach(element => {              
        disptblistbody.innerHTML+=
        `<tr>
            <td>${element.date}</td>
            <td>${element.pno}</td>
            <td>${element.pname}</td>
            <td>${element.itemname}</td>
            <td>${element.qnt}</td>         
            <td>${element.ttp}</td>         
            <td>${element.stt}</td>
            <td>${element.staff}</td>          
            <td>${element.dspdate}</td>  
        </tr>`                 
      });
    }       
     
  })
  }    
}

function loadstockbalance(){
  var stavailbody=document.querySelector('#stavailbody');
  var stid=$('#bal_stores').val();
  $("#stavail > tbody").empty();
  $('#spinners').show();
    fetch("/pharm/stockbalance/",{    
        method: "POST",
        body:JSON.stringify({stid:stid})
      })
    .then((res)=>res.json())
    .then((data)=>{
      $('#spinners').hide();
      stavailbody.innerHTML='';
      var jdata=data;          
      jdata.forEach(element => { 
                     
        stavailbody.innerHTML+=
        `<tr>
            <td style='display:none'>${element.itcode}</td>
            <td>${element.itname}</td>
            <td>${element.qnt}</td>         
            <td>${element.np}</td>         
            <td>${element.sp}</td>
            <td>${element.store}</td>                                  
        </tr>`                 
      }); 
      
    })
}
$("#dispsearch").on("keyup", function() {
  var value = $(this).val().toLowerCase();
  $("#disptblist tbody tr").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});

$('#btnloadbal').on('click',function(){
  loadstockbalance();
})

$("#stsearchitem").on("keyup", function() {
  var value = $(this).val().toLowerCase();
  $("#stavail tbody tr").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});

$('#btnpcard').on('click',function(){   
  var pid=$('#last_visit').val();
  var pname=$('#pname').val();
  if(pid==''){
    alert('load patient details first');
  }
  else{
  document.querySelector('#pcardTitle').innerHTML='Patient Name:'+pname+"(CardNumber: "+pid+')';
  var pcardbody=document.querySelector('#pcardbody')

   fetch("/consult/patcard/",{
      body:JSON.stringify({ searchText:pid}),
      method: "POST",
  })
  .then((res)=>res.json())
  .then((data)=>{
    pcardbody.innerHTML='';
    if(data.length===0){
      pcardbody.innerHTML+='<tr><td colspan="6"> no medical history found</td></tr>';
    }
    else{
      var jdata=data;          
      jdata.forEach(element => {                      
        pcardbody.innerHTML+=
        `<tr>
            <td style='display:none'>${element.vno}</td>
            <td>${element.vdate}</td>
            <td>History:${element.hist} .Physical Exam:${element.phe}</td>         
            <td>Provisional:${element.pdiag} Confirmed:${element.cdiag}</td>         
            <td>${element.invst}</td>
            <td>${element.presc}</td>
            <td>${element.doc}</td>
            <td>${element.disp}</td>                                  
            <td>${element.phar}</td>                                  
        </tr>`                 
      });
    }
  })
    $('#patcard').modal('show');
  }
   
})

$('#btnppresc').on('click', function(){
  var pid=$('#last_visit').val();
  var pname=$('#pname').val();
  var act=$('#phaction').val();
  if(pid==''){
    alert('load patient details first');
  }
  else if(act=='raise' && pid !==''){
    var tb=document.querySelector('#requestTable'); 
    var rw_count = tb.tBodies[0].rows.length;
    if(rw_count>0){
      for(var i=1;i<=rw_count;i++){        
        /* disp.push({
              pno:pno,
              dscode:tb.rows[i].cells[0].innerHTML,  //disp code  
              item:tb.rows[i].cells[2].innerHTML,                 
              qnt:tb.rows[i].cells[7].innerHTML,                 
              st:tb.rows[i].cells[9].innerHTML,                 
          });   */          
      }
    }
    else{
      alert('no item to print');
    }
  }
  else{
    alert('select raise bill action first');
}
})

 function fetchpendpresc(){
  var category=$('#pat_type').val();
  var counter=$('#pharm_stores').val();

  if(counter !=='0'){
    formdata={
      pcat:category,
      counter:counter
    }
    
    fetch("/pharm/pendpresc/",{
      body:JSON.stringify(formdata),
      method: "POST",
      headers: {'X-CSRFToken': csrftoken},
  })
  .then((res)=>res.json())
  .then((data)=>{
    tbpendprescBody.innerHTML='';
    if(data.length===0){
      tbpendprescBody.innerHTML+='<tr><td colspan="10"> no pending prescription found</td></tr>';
    }
    else{
      var jdata=data;          
      jdata.forEach(element => {   
        tbpendprescBody.innerHTML+=
          `<tr>            
              <td>${element.pdate}(${element.ptime})</td>
              <td>${element.pno}</td>
              <td>${element.fname}</td>
              <td>${element.age}</td>                                  
              <td>${element.sex}</td>                                  
              <td>${element.precno}</td>                                  
              <td>${element.doc}</td>                                  
              <td>${element.pmode}</td>                                  
              <td style='display:none'>${element.vno}</td>                                  
              <td><button class="btn btn-primary btn-sm btnpresc">load</button></td>
              <td><button class="btn btn-info btn-sm btncard">card</button></td>                                  
          </tr>`             
      });
    }
  })

  }
  else{
    swal('','first select your pharmacy counter','info');
  }
 }
$('#btnpendrefresh').on('click', function(){
   fetchpendpresc();
})


$('#tbpendpresc tbody').on('click','.btnpresc',function(){
 
  var currentRow=$(this).closest("tr");
  var cardno=currentRow.find("td:eq(1)").text(); 
  var fname=currentRow.find("td:eq(2)").text(); 
  var age=currentRow.find("td:eq(3)").text(); 
  var gend=currentRow.find("td:eq(4)").text();   
  var prescno=currentRow.find("td:eq(5)").text(); 
  var doc=currentRow.find("td:eq(6)").text();
  var pmode=currentRow.find("td:eq(7)").text();
  var vno=currentRow.find("td:eq(8)").text();

 fetch("/pharm/search_prescription/",{
    body:JSON.stringify({prescno:prescno}),
    method: "POST",
    headers: {'X-CSRFToken': csrftoken},
})
.then((res)=>res.json())
.then((data)=>{
    
    if(data.length===0){
      requestTableBody.innerHTML='';
    }
    else{
      var freq={'OD':1,'BD':2,'TID':3,'QID':4,'Stat':1,'Prn':'1'}
      requestTableBody.innerHTML='';

      $('#prno').val(prescno);
      $('#ptname').val(fname);
      $('#pid').val(cardno);
      $('#ptage').val(age);
      $('#ptgend').val(gend);
      $('#ptpmode').val(pmode);
      $('#visitNo').val(vno);


   
      
      var jdata=data;
      jdata.forEach(element => { 
         var fr=freq[element.fq];
         var quant=0;
         if(element.dy=='once'){
           quant=parseInt(element.dos)*parseInt(fr)*parseInt(1);
         }
         else{
           quant=parseInt(element.dos)*parseInt(fr)*parseInt(element.dy);
         }
         
        requestTableBody.innerHTML +=
        `<tr>                  
              <td style="display:none;">${element.itid}</td>
              <td>${element.itname}</td>
              <td>${element.dos}</td>
              <td>${element.fq}</td>
              <td>${element.dy}</td>
              <td>${element.bal}</td>                               
              <td contenteditable='true' id="txt_area_qnt" class='text-center svc_qnt'>${quant}</td>
              <td>${element.cost}</td>
              <td>${element.cost*quant}</td>
              <td style="display:none;">${element.prn}</td>
              <td><button class="btn btn-warning btn-sm btnOs">OS</button></td>
              <td><button class="btn btn-danger btn-sm btnRemove">&times</button></td>
      </tr>`;        
      
      })  
      
      billed_sum();      
      $('#pendprescmodal').modal('show');
      check_paymode();
     }
  }) 

})



//<td><textarea rows="1" cols="1" class='form-control svc_qnt' id="txt_area_qnt">${element.qt}</textarea></td>
function calc_quantity(){

  var table = document.querySelector(".requestTable"),
    sumVal = 0.0;
    var rw_length=table.rows.length
    if(rw_length>1){
      for (var i = 1; i < rw_length; i++) {
        sumVal +=parseFloat(table.rows[i].cells[8].innerHTML.trim());
      }    
      document.querySelector("#bill_amt").value =sumVal;
     
    }
    else{
      document.querySelector("#bill_amt").value =sumVal
      
    }

}

function check_paymode(){ //check paymode and pat type

  var pym=$('#ptpmode').val().trim();
  var ptype=$('#pat_type').val().trim();

  if(pym=='non-scheme' && ptype !=='In-Patient'){
    $('#btnreqpat').prop('disabled',false);
    $('#btndispense').prop('disabled',true);
  }
  else{
    $('#btnreqpat').prop('disabled',true);
    $('#btndispense').prop('disabled',false);

  }

}

$('#btnreqpat').on('click', function(){
  var bill=[];
  var tb=document.querySelector('#requestTable');    

  var pno=$('#pid').val();
  var vno=$('#visitNo').val();
  var pty=$('#pat_type').val();
  var store=$('#pharm_stores').val();
  

  var rw_count = tb.tBodies[0].rows.length;
  if(rw_count>0){
    for(var i=1;i<=rw_count;i++){        
      bill.push({
          pno:pno,
          vno:vno,            
          pym:'cash',
          pty:pty,
          st:store,
          itcode:tb.rows[i].cells[0].innerHTML.trim(),  //item code
          itname:tb.rows[i].cells[1].innerHTML,  //item name
          dos:replacebr(tb.rows[i].cells[2].innerHTML.trim()),//.children[0].value,
          freq:replacebr(tb.rows[i].cells[3].innerHTML.trim().toUpperCase()),//.children[0].value,
          dys:replacebr(tb.rows[i].cells[4].innerHTML.trim()),//.children[0].value,
          qnt:replacebr(tb.rows[i].cells[6].innerHTML.trim()),//.children[0].value,
          ttp:tb.rows[i].cells[8].innerHTML.trim(),              
          prescno:tb.rows[i].cells[9].innerHTML.trim(),   //prescription reference number           
      });            
  }
  
  raisebill(bill);
  }
  else{
    swal('','no item to raise bill',info);
  }
 

})

function replacebr(str){
  var rtn=str.replace(/<br>(?=(?:\s*<[^>]*>)*$)|(<br>)|<[^>]*>/gi, (x,y) => y ? ' & ' : '');
  return rtn;
}

function raisebill(data){
  var ttb=$('#bill_amt').val();
  
  if(ttb==='' || ttb==='0'){
    alert('Please enter drug/item to bill');     
  }
  else{
    var formdata = JSON.stringify(data);
    
     $.ajax({
      url: "/pharm/pharmcashBill/",
      data: formdata, 
      method:'POST',       
      dataType: 'json',
      success: function (data) {
        swal('',data.msg,'success');
        clearfield();
      },
      error: function(jqXHR, exception) {
        if(jqXHR.status === 500) {
            swal('','Internal Server Error occurred.'+exception,'error');
        }
      }
    });
  }
  
}

$('#btndispense').on('click',function(){
  var disp=[];
  var pno =$('#pid').val();
  var store =$('#pharm_stores').val();
  var pattype=$('#pat_type').val();
  var vno= $('#visitNo').val();
  var pmode= $('#ptpmode').val();

  var tb=document.querySelector('#requestTable'); 
  var rw_count = tb.tBodies[0].rows.length;
  if(rw_count>0){
    for(var i=1;i<=rw_count;i++){        
      disp.push({
            pno:pno, 
            itemid:tb.rows[i].cells[0].innerHTML.trim(),                 
            itemname:tb.rows[i].cells[1].innerHTML,                 
            dos:replacebr(tb.rows[i].cells[2].innerHTML.trim()),                 
            frq:tb.rows[i].cells[3].innerHTML.trim().toUpperCase(),                 
            days:replacebr(tb.rows[i].cells[4].innerHTML.trim()),
            qnt:replacebr(tb.rows[i].cells[6].innerHTML.trim()),                 
            cost:replacebr(tb.rows[i].cells[8].innerHTML.trim()),                 
            prescno:tb.rows[i].cells[9].innerHTML.trim(), //primary key on prescription model 
            st:store, 
            ptype:pattype,
            vno:vno,
            pmode:pmode               
        });            
    }
    var formdata = JSON.stringify(disp);
     
   $.ajax({
     url: "/pharm/pharmDispScheme/",
     data: formdata, 
     method:'POST',       
     dataType: 'json',
     headers: {'X-CSRFToken': csrftoken},
     success: function (data) {
       swal('',data.msg,'success');
       clearfield();
     },
     error: function(jqXHR, exception) {
       if(jqXHR.status === 500) {
           swal('','Internal Server Error occurred.'+exception,'error');
       }
     }
   }); 
  } 
 else{
  swal('blank','no item selected to dispense','error');
 }
  
})

function clearfield(){
  setTimeout(function() { 

    $('#prno').val('');
    $('#ptname').val('');
    $('#pid').val('');
    $('#ptage').val('');
    $('#ptgend').val('');
    $('#ptpmode').val('');
    $('#visitNo').val('');

    $("#requestTable > tbody").empty();
    $('#pendprescmodal').modal('hide');
    fetchpendpresc();

    //refresh pending payment

  },2000);
}


var dispTableBody=document.querySelector('.dispTableBody');
$('#btnpaidrefresh').on('click', function(){
   fetchpaidprescription();

})

function fetchpaidprescription(){

  var category=$('#pat_type').val();
  var counter=$('#pharm_stores').val();

  if(counter !=='0'){
    formdata={
      pcat:category,
      counter:counter
    }
    
    fetch("/pharm/paidpresc/",{
      body:JSON.stringify(formdata),
      method: "POST",
      headers: {'X-CSRFToken': csrftoken},
  })
  .then((res)=>res.json())
  .then((data)=>{

    dispTableBody.innerHTML='';
    if(data.length===0){
      dispTableBody.innerHTML+='<tr><td colspan="8"> no pending paid prescription found</td></tr>';
    }
    else{
      var jdata=data;          
      jdata.forEach(element => {   
        dispTableBody.innerHTML+=
          `<tr>            
              <td>${element.pdate}</td>
              <td>${element.rno}</td>
              <td>${element.pno}</td>
              <td>${element.fname}</td>
              <td>${element.age}</td>                                  
              <td>${element.sex}</td>                                 
              <td>${element.doc}</td>                                 
              <td style='display:none'>${element.vno}</td>                                  
              <td><button class="btn btn-info btn-sm" id='viewpay'>show</button></td>                                 
          </tr>`             
      });
    }
  })

  }
  else{
    swal('','first select your pharmacy counter','info');
  }

}


$('#receiptno').on('keyup',function(){
  var value = $(this).val().toLowerCase();
  $("#dispTable tbody tr").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});

var paidrequestTableBody=document.querySelector('.paidrequestTableBody');

$('#dispTable tbody').on('click','#viewpay',function(){

  var currentRow=$(this).closest("tr"); 

  var rcpt=currentRow.find("td:eq(1)").text(); 
  var pno=currentRow.find("td:eq(2)").text(); 
  var fname=currentRow.find("td:eq(3)").text(); 
  var age=currentRow.find("td:eq(4)").text(); 
  var gend=currentRow.find("td:eq(5)").text();
  var vno=currentRow.find("td:eq(7)").text();
  
  fetch("/pharm/search_receipt/",{
      body:JSON.stringify({ searchText:rcpt,pno:pno }),
      method: "POST",
    })
  .then((res)=>res.json())
  .then((data)=>{

    if(data.length===0){
      paidrequestTableBody.innerHTML='';
    }
    else{     
      paidrequestTableBody.innerHTML='';

      //$('#pprno').val(prescno);
      $('#pptname').val(fname);
      $('#ppid').val(pno);
      $('#pptage').val(age);
      $('#pptgend').val(gend);
      $('#pptpmode').val('non-scheme');
      $('#pvisitNo').val(vno);

      var jdata=data;   
      jdata.forEach(element => { 
       $('#paidprescmodal').modal('show');             
       paidrequestTableBody.innerHTML+=
        `<tr> 
              <td style="display:none;">${element.itemc}</td>
              <td>${element.itemname}</td>
              <td>${element.dos}</td>
              <td>${element.freq}</td>         
              <td>${element.dys}</td>         
              <td>${element.bal}</td>         
              <td>${element.qty}</td>         
              <td>${element.ttp/element.qty}</td> 
              <td>${element.ttp}</td> 
              <td >${element.rptno}</td>        
              <td style="display:none;">${element.stre}</td> 
              <td style="display:none;">${element.dsid}</td>                                          
              <td style="display:none;">${element.pbref}</td>                                          
         </tr>`                
      });

    }
  
  
    receipt_total();     
  })
}) 

function receipt_total(){
  //setTimeout(function() {
    var table = document.querySelector("#paidrequestTable"),
    sumVal = 0.0;
    var rw_length=table.rows.length
    if(rw_length>1){
      for (var i = 1; i < rw_length; i++) {
        sumVal +=parseFloat(table.rows[i].cells[8].innerHTML);
      }    
      document.querySelector("#pbill_amt").value =sumVal;
      document.querySelector("#pdbill_amt").value =sumVal;
     
    }
    else{
      document.querySelector("#pbill_amt").value =sumVal
      document.querySelector("#pdbill_amt").value =sumVal
      
    }
  //},1500)
   
  }


$('#btndispensepd').on('click',function(){
  var disp=[];
  var store =$('#pharm_stores').val();

  var tb=document.querySelector('#paidrequestTable'); 
  var rw_count = tb.tBodies[0].rows.length;
  if(rw_count>0){
    for(var i=1;i<=rw_count;i++){        
      disp.push({ 
            st:store, 
            itemid:tb.rows[i].cells[0].innerHTML.trim(), 
            qnt:tb.rows[i].cells[6].innerHTML.trim(),
            rcptno:tb.rows[i].cells[9].innerHTML.trim(),
            dsid:tb.rows[i].cells[11].innerHTML.trim(),
            pbref:tb.rows[i].cells[12].innerHTML.trim(),                         
        });            
    }
    var formdata = JSON.stringify(disp);
     
   $.ajax({
     url: "/pharm/pharmDispCash/",
     data: formdata, 
     method:'POST',       
     dataType: 'json',
     headers: {'X-CSRFToken': csrftoken},
     success: function (data) {
       swal('',data.msg,'success');
       clearpaidfield();
     },
     error: function(jqXHR, exception) {
       if(jqXHR.status === 500) {
           swal('','Internal Server Error occurred.'+exception,'error');
       }
     }
   }); 
  } 
 else{
  swal('blank','no item selected to dispense','error');
 }
  
})

function clearpaidfield(){
  setTimeout(function() { 

    $('#pptname').val('');
    $('#ppid').val('');
    $('#pptage').val('');
    $('#pptgend').val('');
    $('#pptpmode').val('');
    $('#pvisitNo').val('');

    $("#paidrequestTable > tbody").empty();
    $('#paidprescmodal').modal('hide');
    fetchpaidprescription();

    //refresh pending payment

  },2000);
}
////////////////////////////////// patient card ///////////////////////////////////
$('.btnptcard').on('click', function(){
  $('#patcard').modal('show');

})

$('#pdfgenerate').on('click', function(){
  var pno=$('#pid').val();
  var fdate=$('#pcfdate').val();
  var tdate=$('#pctdate').val();
  var ptype=$('#pat_type').val();
  var chkdate;
  if(pno==''){
    swal('','select patient first','info');
  }
  else{
    if($('#chkdate').is(":checked")){
      chkdate='checked';
    }
    else{
      chkdate='all';
    }
    var data=JSON.stringify({pno:pno,fdate:fdate,tdate:tdate,chkdate:chkdate,ptype:ptype})
    patientcardpdf(data);
  }
})


var pcardpdfbody=document.querySelector('#pcardpdfbody')

function patientcardpdf(data){
  
  fetch("/consult/patcard/",{
    body:data,
    method: "POST",
})
.then((res)=>res.json())
.then((data)=>{
  pcardpdfbody.innerHTML='';
  if(data.length===0){
    pcardpdfbody.innerHTML+='<tr><td colspan="6"> no medical history found</td></tr>';
  }
  else{
    pcardpdfbody.innerHTML+=`<tr>
          <td colspan='2'><b>Patient Name:</b>${$('#ptname').val()}</td>       
          <td><b>Hosp No:</b>${$('#pid').val()}</td>       
          <td><b>Age:</b>${$('#ptage').val()}</td>
          <td><b>Gender:</b>${$('#ptgend').val()}</td>
          </tr>`
    var jdata=data;  

    jdata.forEach(element => {      
      
      pcardpdfbody.innerHTML+=
      `<tr><td colspan='5'><b>Seen On: </b>${element.cdate}@${element.ctime}</td> </tr>`
      pcardpdfbody.innerHTML+=`<tr>    
          <td>Doctor/Clinician Notes:</td>
          <td colspan='3'><b>Chief Complain</b>:${element.ccomplain}<br><b>History</b>:${element.hist}<br><b>Physical Exam</b>:${element.phnotes}<br><b>Continuation Notes</b>:${element.cnotes}</td>
          <td>${element.doc}</td>
          </tr>` 
      pcardpdfbody.innerHTML+=`<tr>
          <td><b>Diagnosis:</b></td>       
          <td colspan='2'><b>Provisional</b>:${element.pdiag}</td>
          <td colspan='2'><b>Confirmed</b>:${element.cdiag}</td>
          </tr>`

      pcardpdfbody.innerHTML+=`<tr>
         <td><b>Service Requested:</b></td>
          <td colspan='3'>${element.svs}</td>
          <td>${element.doc}</td>
          </tr>`

       pcardpdfbody.innerHTML+=`<tr>
          <td><b>Prescription:</b></td>
          <td colspan='3'>${element.presc}</td>
          <td>${element.doc}</td>
          </tr>`

       pcardpdfbody.innerHTML+=`<tr>
          <td><b>Dispensed:</b></td>
          <td colspan='3'>${element.disp}</td>                                  
          <td>${element.pharmacist}</td>   
      </tr>`                 
    });
  }

  
})
}


///// walkin operations

$("#wlkdlvitem").keyup(function(){ 
  var search = $(this).val();
  var str = $('#pharm_stores').val();
  if(search != ""){ 
     $.ajax({ 
       url: '/stores/searchItem/', 
       type: 'post', 
       data: JSON.stringify({searchText:search,str:str}), 
       dataType: 'json', 
       success:function(response){ 
         var len = response.length; 
         $("#wlksearchResult").empty(); 
         for( var i = 0; i<len; i++){ 
            var id = response[i]['itid'];  
            var itname = response[i]['itname'];
            
            $("#wlksearchResult").append("<li value='"+id+"'>"+itname+"</li>"); 
         }            // binding click event to li 
         $("#wlksearchResult li").bind("click",function(){
            itemdetails(this); 
         }); 
       } 
     }); 
   } 
 });

 // Set Text to search box and get details 
function itemdetails(element){ 
  var value = $(element).text(); 
  var itid = $(element).val();
  var str = $('#pharm_stores').val(); 
  $("#wlkdlvitem").val(''); 
  $("#wlksearchResult").empty(); 
  
  // Request Item Details 
  $.ajax({ 
     url: '/stores/itemdetails/', 
     type: 'post', 
     data:JSON.stringify({itid:itid,str:str}), 
     dataType: 'json', 
     success: function(response){ 
        var len = response.length;
        //$("#userDetail").empty(); 
        if(len > 0){ 
           var itname = response[0]['itname']; 
           var itid = response[0]['itid'];
           var bal = response[0]['bal'];
           var price = response[0]['price'];
           var itemcat = response[0]['itemcat'];

           $('#wlkrequestTable tbody:last-child').append(`
              <tr>
                <td style="display:none;">${itid}</td>
                <td>${itname}</td>
                <td contenteditable='true' id='dos'>1</td>
                <td contenteditable='true' id="frq">OD</td>
                <td contenteditable='true' id='days'>1</td>
                <td>${bal}</td>
                <td contenteditable='true' class='text-center svc_qnt'>1</td>
                <td>${price}</td>
                <td>${price}</td>        
                <td style="display:none;">none</td>                
                <td><button class="btn btn-danger btn-sm btnRemove">&times</button></td> 
                <td style="display:none;">added</td>       
                <td style="display:none;" id='itcat'>${itemcat}</td>       
              </tr>
            `); 

            //get total bill
            billed_sum_wlk();
        } 
     } 
  }); 
}


//Pharmaceuticals
//Non-Pharmaceuticals

$("#wlkrequestTable").on('click', '.btnRemove', function() {  
  var currentRow=$(this).closest("tr");
  var svs_name=currentRow.find("td:eq(1)").text(); 
  if(confirm(`Discard( ${svs_name} )from bill?`)){     
      $(this).closest('tr').remove();   
      billed_sum_wlk();
                
  }
})

function billed_sum_wlk(){
  //setTimeout(function() {
    var table = document.querySelector("#wlkrequestTable"),
    sumVal = 0.0;
    var rw_length=table.rows.length
    if(rw_length>1){
      for (var i = 1; i < rw_length; i++) {
        sumVal +=parseFloat(table.rows[i].cells[8].innerHTML.trim());
      }    
      document.querySelector("#wlkbill_amt").value =sumVal;
     
      checkcategory();
    }
    else{
      document.querySelector("#wlkbill_amt").value =sumVal
      
    }
  //},1500)
    
  }


function checkcategory() {
  $("#wlkrequestTable tbody tr").each(function(){      
  var itcat = $(this).find('#itcat').text();
  console.log(itcat);
  if (itcat=='Non-Pharmaceuticals') {
      //newqnt.contentEditable = false;
      $(this).find('#dos').text("-");
      $(this).find('#frq').text("-");
      $(this).find('#days').text("-");
  }
   else {}
  })
}


  $('#wlkrequestTable').on('keyup','.svc_qnt',function(){
  
    var currenRow=$(this).closest("tr");   
    var qnt = parseFloat(currenRow.find("td:eq(6)").text().trim());
    if(isNaN(qnt)){}
    else{  
      if(qnt>0){
      var price=parseFloat(currenRow.find("td:eq(7)").text());
      var aqnt=parseFloat(currenRow.find("td:eq(5)").text());//available
            if(qnt>aqnt){
              swal('','cannot bill or dispense more than available','info');
              currenRow.find("td:eq(6)").html('').append('1')   
              currenRow.find("td:eq(8)").html('').append(price)   
              billed_sum_wlk();           
            }
            else{
              var total =parseFloat(qnt*price);      
              currenRow.find("td:eq(8)").html('').append(total)
              billed_sum_wlk();
            }            
      }  
    else{
      swal('','incorrect quantity entry','error');
      billed_sum_wlk();
    }   
    
  }
  
  })

  $('#wlkpaymode').on('change', function(){
    var pmode=$(this).val();
    $("#wlkpaid_amt").val('');
    if(pmode=='cash'){
      $("#divphoneno").hide();
      $("#divsendstk").hide();
      $("#divrefstk").hide();
      $("#divbanktxno").hide();
      $("#wlkpaid_amt").prop('disabled',false);
    }
    else if(pmode=='mobile'){
      $("#divphoneno").show();
      $("#divsendstk").show();
      $("#divrefstk").show();
      $("#divbanktxno").hide();
      $("#wlkpaid_amt").prop('disabled',true);
    }
    else if(pmode=='bank-card'){
      $("#divphoneno").hide();
      $("#divsendstk").hide();
      $("#divrefstk").hide();
      $("#divbanktxno").show();
      $("#wlkpaid_amt").prop('disabled',false);
    }

  })



  $('#btnsendstk').on('click',(e)=>{
    e.preventDefault();
  
    var nbill=$('#wlkbill_amt').val();
  
    if(nbill=='' || nbill=='0'){
      swal('Net Amount cannot be empty or zero','','error');
    }
    else{
      phone=$('#wlkphone').val();
      vphone=validatePhoneNumber(phone);
         
      var formdata={
        phonenumber:vphone,
         amount:nbill
        }
  
     $.ajax({
        url: '/finance/stkpush/',
        data:JSON.stringify(formdata), 
        method:'POST',       
        dataType: 'json',
        headers: {'X-CSRFToken': csrftoken},
        success: function (data) {
          if(data.CheckoutID){
            swal('successfully sent request to',phone,'success');
            $('#wlkcheckoutid').val(data.CheckoutID);
          } 
          else if(data.error){
            swal("failed to push request "+data.error,"","error");
          }            
        },
        error: function(jqXHR, exception) {
          if(jqXHR.status === 400) {
            swal("failed to push request","","error");
          }
        }
  
    });
  
    }
            
  });
  
  function validatePhoneNumber(phoneNumber) {
    // Remove any non-numeric characters from the input
    const numericPhoneNumber = phoneNumber.replace(/\D/g, '');
    // Check if the number starts with the Kenyan country code "+254"
    const kenyanCountryCode = '0';
    if (!numericPhoneNumber.startsWith(kenyanCountryCode)) {
      swal('Ensure phone number starts with 0','','error');
    }
    // Check if the remaining part of the number consists of 9 digits
    const subscriberNumber = numericPhoneNumber.slice(kenyanCountryCode.length);
    if (!/^\d{9}$/.test(subscriberNumber)) {
      swal('Ensure phone number is 10 digits starting with 0','','error');
    }
    // If all checks pass, the number is valid
    return '254'+subscriberNumber;
  }

  $('#wlkphone').on('keyup',function(){
    this.value=this.value.replace(/\D/g,'');    
    $(this).val(this.value); //.toLocaleString()  
  })

  // button to query the checkout id

$('#btnrefstk').on('click',function(){
  //$('#mobile_modal').modal('show');
 // var mbn=$('#mobnumber').val();        
  //$('#mbnumber').val(mbn);
  var chid=$('#wlkcheckoutid').val();
  if(chid !==''){
    fetch("https://greencode.co.ke/stkphp/tokens.php",{
      body:JSON.stringify({ chid:chid }),
      method: "POST",
      headers: {'X-CSRFToken': csrftoken},
  })
  .then((res)=>res.json())
  .then((data)=>{
    //console.log('data',data);
    if(data.length===0){
      swal('Payment','Pending payment...please wait','info');                    
    }
    else{   
      //load the amout paid or payment result description
      var rscode=100;  
      var amt=0  
      var rsdesc='' 
      data.forEach((item)=>{
        rscode=parseInt(item.ResultCode);
        amt=parseInt(item.Amount);        
        rsdesc=item.ResultDesc;        
      });
      if(rscode==0){
        $('#wlkpaid_amt').val(item.amount);
        $('#mpesatxno').val(item.traxno);
      }
      else{swal('Incomplete!!',rsdesc,'info')}      
    }
  })

  }
  else{
    swal('Error!!','missing check out id .make sure to push payment request','info');
  }

})


$('#wlkbtndispense').on('click', function(){

  var ptype=$('#pat_type').val();
  var pno=$('#pid').val();
  var tb=$('#wlkbill_amt').val();
  var nb=$('#wlkbill_amt').val();
  var pb=$('#wlkpaid_amt').val();  
  var vno=$('#visitno').val();

  if(tb=='' ||tb==null|| tb==0){
    swal('','Patient has no bill','info');
  }
  else if(pb=='' ||pb==null){
    swal('','please enter amount paid by client','info');
  }
  else if(pb<nb && ptype=='Out-Patient'){
    swal('','cannot reveive less than total bill','error');
  } 
  else if(pb<nb && ptype=='In-Patient'){
    swal('','cannot reveive less than total bill.Waive/use patient deposits','info');
  } 
  else{
    var bill=[]; 
    var tb=document.querySelector('#wlkrequestTable');
    var shftno=document.querySelector('#shftlabel').innerHTML;
    var pym=$('#wlkpaymode').val();
    var mn=$('#wlkphone').val();
    var mnt=$('#mpesatxno').val();
    var pty=$('#pat_type').val();
    var store=$('#pharm_stores').val();

    var pname=$('#wlkptname').val();
    var page=$('#wlktage').val();
    var pgend=$('#wlkgend').val();
    var patdet=pname+' '+page+' '+' '+pgend;

    

    var mnb=0;
    var mtnt=0;
    var transtype='paid';

    if(mn=='mobile'){
      mnb=mn;
      mtnt=mnt;
      transtype='mobile';
    }
    else{}
    
    var rw_count = tb.tBodies[0].rows.length;   
    for(var i=1;i<=rw_count;i++){        
        bill.push({
            pdetails:patdet,
            vno:vno,
            sft:shftno,
            pym:pym,
            pty:pty,
            mn:mnb,
            mtn:mtnt,
            ttype:transtype,
            scode:tb.rows[i].cells[0].innerHTML,  //service code         
            //qnt:tb.rows[i].cells[2].children[0].value,
            qnt:parseInt(tb.rows[i].cells[6].innerHTML.trim()),
            ttp:tb.rows[i].cells[8].innerHTML,
            dpt:"pharmacy",        
            st:store,//patientbill reff number         
        });            
    }    
    save_transaction(bill);
   
    
  } 
 })



 function save_transaction(data){
  formdata=JSON.stringify(data);
  $.ajax({
    url: '/finance/save_walkin/',
    data: formdata, 
    method:'POST',       
    dataType: 'json',
    success: function (data) {
     //printreceipt
     console.log(data)
     document.querySelector('#trasnsdate').innerHTML=data.date;
     document.querySelector('#rcptno').innerHTML=data.rcptno;
     document.querySelector('#patid').innerHTML=$('#pid').val();
     document.querySelector('#patname').innerHTML=$('#pname').val();
     document.querySelector('#patage').innerHTML=$('#pAge').val();

     var rctbody=document.querySelector('.receiptbody');
     var tb=document.querySelector('#tblServices');
     var rw_count = tb.tBodies[0].rows.length;  
      
     var data=[];
     for(var i=1;i<=rw_count;i++){
      data.push({
        "service":tb.rows[i].cells[1].innerHTML,
       // "quantity":parseInt(tb.rows[i].cells[2].children[0].value),        
        "quantity":parseInt(tb.rows[i].cells[2].innerHTML),        
        "total":parseInt(tb.rows[i].cells[4].innerHTML)
      })      
     } 
     ///////////////////////////////////////////

        result = [];    
        data.forEach(function (item) {
          if (!this[item.service]) {
              this[item.service] = { service: item.service,quantity:item.quantity,total:item.total};
              result.push(this[item.service]);
              return;
          }
          this[item.service].quantity+= parseInt(item.quantity);
          this[item.service].total +=parseInt(item.total);
      }, Object.create(null));     

        rctbody.innerHTML='';
        result.forEach((item)=>{
          rctbody.innerHTML+=
            `<tr>                  
                  <td><small>${item.service}</small></td>            
                  <td><small>${item.quantity}</small></td>
                  <td><small>${(item.total)/(item.quantity)}</small></td>
                  <td><small>${item.total}</small></td>
            </tr>`;          
      });
      //////////////////////////////////////////////////////
     rctbody.innerHTML+=
      `<tr>           
            <td colspan="3"><small>Total Bill</small></td>
            <td><small>${$('#tbill').val()}</small></td> 
      </tr>`;
      rctbody.innerHTML+=
      `<tr>           
          <td colspan="3"><small>Waiver/exception</small></td>
          <td><small>${$('#wbill').val()}</small></td> 
      </tr>`
      rctbody.innerHTML+=
      `<tr>           
          <td colspan="3"><small>Amount Paid</small></td>
          <td><small>${$('#paidAmount').val()}</small></td> 
      </tr>`;
      printDivContent();
      //setTimeout(function(){location.reload();},2000)            
    },
    error: function(jqXHR, exception) {
      if(jqXHR.status === 500) {
          swal('','Internal Server Error occurred.'+exception,'error');
      }
    }
  });
 }
 function printDivContent() {
  var printContents = document.getElementById("divreceipt").innerHTML;
  var originalContents = document.body.innerHTML;
  document.body.innerHTML = printContentss;
  window.print();
  document.body.innerHTML = originalContents;
  location.reload(true);
  //clear fields
  //
    
}