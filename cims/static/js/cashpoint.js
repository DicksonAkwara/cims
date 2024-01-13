const tblSearchBody=document.querySelector('.tblSearchBody');
const tblServicesBody=document.querySelector('.tblServicesBody');
const cardNo=document.querySelector('#cardNo');



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

$('#pat_type').on('change', function(){
  var pt=$(this).val();
  clearfield();
  if(pt=='Walk-In'){
    $('#cardNo').val('wlk');
  }
  
  else{
    $('#cardNo').val('');
  }
})


cardNo.addEventListener('keyup',(e)=>{

    var pid = e.target.value;
    var pt=$('#pat_type').val();
    if(pid.trim().length>0){
      if(pt=='Walk-In'){
        search_walkin(pid);
      }
      else{
        fetch("/consult/cons_pat_search/",{
          body:JSON.stringify({ searchText:pid,ptype:pt }),
          method: "POST",
      })
      .then((res)=>res.json())
      .then((data)=>{
          
          if(data.length===0){
              //tableOutput.innerHTML='<tr><td colspan="4">No records found </td></tr>'; 
              document.querySelector('#pname').value='';
              document.querySelector('#pid').value=''; 
              document.querySelector('#visitno').value=''; 
              document.querySelector('#ppaymode').value=''; 
              document.querySelector('#pcat').value=''; 
              document.querySelector('#pAge').value=''; 
              document.querySelector('#mobnumber').value=''; 
              document.querySelector('#patSearchStatus').innerHTML='patient not found'; 
              $('#tblServices tbody tr').remove();
              document.querySelector('#tbill').value='';
              
          }
          else{
            var jdata=data;          
            var pid
            jdata.forEach(element => { 
            pid =element.pid;         
            document.querySelector('#pname').value=element.fname;
            document.querySelector('#pid').value=pid; 
            document.querySelector('#visitno').value=element.vno; 
            document.querySelector('#pAge').value=element.age; 
            document.querySelector('#mobnumber').value='0'+element.phone;
            document.querySelector('#ppaymode').value=element.scheme_name;
            document.querySelector('#pcat').value=element.pcat; 

            })
            document.querySelector('#patSearchStatus').innerHTML='';
            //checkAge();
            checkCategory();
            if(pt=='In-Patient'){
              retrieveipBill(pid);
            }
            else{
              retrieveBill(pid);
            }            
           }
        })
      }     
    }
    else{
      document.querySelector('#patSearchStatus').innerHTML=''; 
    }

})


function search_walkin(id){
var pid=id;
  fetch("/consult/search_walkin/",{
    body:JSON.stringify({ searchText:pid}),
    method: "POST",
})
.then((res)=>res.json())
.then((data)=>{
    
    if(data.length===0){
        //tableOutput.innerHTML='<tr><td colspan="4">No records found </td></tr>';
        document.querySelector('#pname').value='';
        document.querySelector('#pid').value=''; 
        document.querySelector('#visitno').value=''; 
        document.querySelector('#ppaymode').value=''; 
        document.querySelector('#pAge').value=''; 
        document.querySelector('#patSearchStatus').innerHTML='patient not found'; 
        $('#tblServices tbody tr').remove();
        document.querySelector('#tbill').value='';
        
    }
    else{
      var jdata=data;          
      var pid
      jdata.forEach(element => { 
      pid =element.pid;         
      document.querySelector('#pname').value=element.fname;
      document.querySelector('#pid').value=pid;          
      document.querySelector('#ppaymode').value='cash';
      })
      document.querySelector('#patSearchStatus').innerHTML='';
      retrieveBill(pid);
     }
  })

}

function checkCategory(){
    
  var pcat=$('#pcat').val();

  if(pcat=='Prisoner' || pcat=='SGBV'){
      $('#btnExempt').prop('disabled', false);
  }
  else{
     checkAge()
      //$('#btnExempt').prop('disabled', true);
  }
}

function checkAge(){
    
    var pmode=document.querySelector('#ppaymode').value;
    var age=parseInt(document.querySelector('#pAge').value);

    if(pmode=='cash' && age <=5){
        $('#btnExempt').prop('disabled', false);
    }
    else{
        $('#btnExempt').prop('disabled', true);
    }

}

//tblServicesBody
function retrieve_inpatientbill(id){
  var pno=id;
  var ptype=$('#pat_type').val(); 
  var vno=$('#visitno').val();
  var formdata={pno:pno,vno:vno,ptype:ptype}   

  tblServicesBody.innerHTML='';
  fetch("/finance/loadbill/",{
      body:JSON.stringify(formdata),
      method: "POST",
  })
  .then((res)=>res.json())
  .then((data)=>{
      if(data.length===0){
          //tblServicesBody.innerHTML='<tr><td colspan="5">No pending bill</td></tr>';
          
      }
      else{    
        result = [];
        refarray=[];
        var ttsum=0;
        var ttdep=0;
        data.forEach(function (item) {
          ttsum=item.ttsum;
          ttdep=item.ttdep;//deposits
          //ref _number
          if (!this[item.service]) {
              this[item.service] = { service: item.service, dept: item.dept, qnty: item.qnty, cost: item.cost };
              result.push(this[item.service]);
              return;
          }
          this[item.service].qnty += item.qnty;
          this[item.service].cost += item.cost;
      }, Object.create(null));
          var sum=0;
          tblServicesBody.innerHTML='';
          result.forEach((item)=>{
          sum+=item.cost;           

          tblServicesBody.innerHTML+=
          `<tr>                  
          <td style='display:none';>0</td>            
            <td >${item.service}</td>
            <td>${item.qnty}</td>
            <td >${(item.cost)/(item.qnty)}</td>  
            <td >${item.cost}</td>                                                                   
            <td >0</td>                                                                   
            <td >${item.dept}</td>
            <td style='display:none';>0</td>                                                                     
                                                                             
      </tr>`;
      //reff number  index 7
      //{element.scode} index 0
      //${element.wvamount} index 5
      // <td ><button class='btn btn-sm btn-danger btnRemove'>X</button></td> 
        }); 
        
        $('#tdep').val(ttdep);
      }

      findTotal();

    })
  
}


function retrieveBill(id){  
    var ptype=$('#pat_type').val(); 
    var vno=$('#visitno').val(); 
    $.ajax({
      url: '/finance/retrieveBill/',
      data: JSON.stringify({ pid:id,ptype:ptype,vno:vno}), 
      method:'POST',       
      dataType: 'json',
      success: function (data) {
        tblServicesBody.innerHTML='';
        if(data.length===0){
            
         // tblServicesBody.innerHTML='<tr><td colspan="5">No pending bill</td></tr>';                     
        }
        else{           
            tblServicesBody.innerHTML='';
            var ttdep=0;
            var jdata=data;            
            jdata.forEach(element => { 
              //<td><textarea rows="1" cols="3" class='svc_qnt text-center' id="txt_area_qnt">${element.qnt}</textarea></td>          
             
                tblServicesBody.innerHTML+=
                `<tr>                  
                      <td style='display:none';>${element.scode}</td>            
                      <td >${element.sname}</td>
                      <td contenteditable='true' id="txt_area_qnt" class='svc_qnt text-center' >${element.qnt}</td>  
                      <td >${element.nprice}</td>  
                      <td >${element.tprice}</td>                                                                   
                      <td >${element.wvamount}</td>                                                                   
                      <td >${element.spoint}</td>
                      <td style='display:none';>${element.reff_no}</td>                                                                     
                      <td style='display:none';>${element.wvid}</td>                                                                     
                      <td style='display:none';>${element.store}</td>                                                                     
                      <td ><button class='btn btn-sm btn-danger btnRemove'>X</button></td>                                                                   
                </tr>`;                            
            });
            $('#tdep').val(ttdep);
            findTotal();
           //color_code();
        }
      }
    });
  
  }

  function retrieveipBill(id){  
    var ptype=$('#pat_type').val(); 
    var vno=$('#visitno').val(); 
    $.ajax({
      url: '/finance/retrieveBill/',
      data: JSON.stringify({ pid:id,ptype:ptype,vno:vno}), 
      method:'POST',       
      dataType: 'json',
      success: function (data) {
        if(data.length===0){            
            //tblServicesBody.innerHTML='<tr><td colspan="5">No pending bill</td></tr>';;                     
        }
        else{           
            tblServicesBody.innerHTML='';
            var ttdep=0;
            var jdata=data; 

            jdata.forEach(element => { 
                         
                tblServicesBody.innerHTML+=
                `<tr>                  
                      <td style='display:none';>${element.scode}</td>            
                      <td >${element.sname}</td>
                      <td>${element.qnt}</td>          
                      <td >${element.nprice}</td>  
                      <td >${element.tprice}</td>                                                                   
                      <td >${element.wvamount}</td>                                                                   
                      <td >${element.spoint}</td>
                      <td style='display:none';>${element.reff_no}</td>
                      <td style='display:none';>${element.wvid}</td>                                                                   
                      <td style='display:none';>${element.store}</td>                                                                   
                </tr>`;                            
            });
            $('#tdep').val(ttdep);
            findTotal();
           //color_code();
        }
      }
    });
  
  }

$('#paymode').on('change', function(){
    var ptype=$(this).val().trim();
        if(ptype=='cash'){
            $('#paidAmount').prop('readonly', false);
            $('#mbtrans').hide();
            $('#chqtrans').hide();
        }
        else if(ptype=='mobile'){
            $('#paidAmount').prop('readonly', true);   
            $('#mbtrans').show();
            $('#chqtrans').hide();
        }
        else if(ptype=='Cheque'){
          $('#paidAmount').prop('readonly', false);   
          $('#mbtrans').hide();
          $('#chqtrans').show();
      }

})



$('.btnAddSvs').on('click',function(){
  var ptype=$('#pat_type').val();
  var pno=$('#pid').val();
  if(pno !==''){
    if(ptype !=='In-Patient'){
      $('#billModal').modal('show');
    }
    else{
      swal('Unexpected operation','Consider billing','info');
    }
  }
  else{
    swal('Wrong Procedure','no patient selected','error');
  }
  
   /*  var pmode=document.querySelector('#ppaymode').value;    
    if(pmode=='cash'){        
    }
    else{
        alert('Patient using scheme payment mode')
    } */
    
})

$('#cpsearch').on('keyup',function(){
    var svsName =$(this).val().trim();    
        tblSearchBody.innerHTML=''; //for table refresh
        fetch("/finance/cpSearchService/",{
        body:JSON.stringify({ searchText:svsName }),
        method: "POST",
    })
    .then((res)=>res.json())
  .then((data)=>{
      //console.log('data',data);
      if(data.length===0){
        tblSearchBody.innerHTML='<tr><td colspan="2">No such service found </td></tr>';                     
      }
      else{        
        data.forEach((item)=>{
          tblSearchBody.innerHTML+=
            `<tr>              
            <td>${item.service_name}</td>
            <td >${item.normal_rate}</td>                      
            <td style="display:none;">${item.scode}</td>
            <td  style="display:none;">${item.service_point}</td>
            </tr>`
            //insert into patient bill and update reff no with status=paid...also checkgeneral billing
        });
      }
    })
})

$('#tblSearch').on('click','tr',function(){
    var currentRow=$(this).closest("tr");

    currentRow.addClass('bg-info').siblings().removeClass('bg-info');    
    var sname=currentRow.find("td:eq(0)").text();
    var nprice=currentRow.find("td:eq(1)").text();
    var scode=currentRow.find("td:eq(2)").text();
    var spoint=currentRow.find("td:eq(3)").text();
    //  <td><textarea rows="1" cols="3" class='svc_qnt text-center' id="txt_area_qnt">1</textarea></td>
    var row = document.createElement('tr');        
    row.innerHTML=`
          <td style='display:none';>${scode}</td>            
          <td >${sname}</td>        
          <td contenteditable='true' id="txt_area_qnt" class='svc_qnt text-center'>1</td>           
          <td >${nprice}</td>  
          <td >${nprice}</td>                                                                   
          <td >0</td>                                                                   
          <td >${spoint}</td>     
          <td style='display:none';>none</td>
          <td style='display:none';>none</td>               
          <td style='display:none';>2</td>               
          <td ><button class='btn btn-sm btn-danger btnRemove'>X</button></td>
    `;
    var table = document.querySelector('.tblServicesBody');
    table.appendChild(row);    
    findTotal();
})

$("#tblServices").on('click', '.btnRemove', function() {  
    var currentRow=$(this).closest("tr");
    var svs_name=currentRow.find("td:eq(1)").text(); 
    if(confirm(`Are you sure you want to remove( ${svs_name} )from bill?`)){       
        $(this).closest('tr').remove();  
        findTotal();    
    }
  })


  $('#tblServices tbody').on('keyup','.svc_qnt',function(e){
    //tb.rows[i].cells[2].children[0].value
    
    var currenRow=$(this).closest("tr");   
    var qnt = parseFloat(currenRow.find("td:eq(2)").text());   
    
      if(isNaN(qnt)){
        $(this).val('1');
      }
      else{  
        if(qnt>0){
       
        var price=parseFloat(currenRow.find("td:eq(3)").text());
        var totPrice=parseFloat(qnt*price);

        currenRow.find("td:eq(4)").html('').append(totPrice); 
        findTotal();         
       
      }  
      else{
        swal('','incorrect quantity entry','error');
        $(this).val('1');
        //resetAmount();
      }      
    }    
  })

  function findTotal(){
    var tb = document.getElementById('tblServices');
    var sum=0;
    var waiv=0;
    $("#tblServices tbody tr").each(function(){
        var self=$(this);
        var ttp=parseFloat(self.find("td:eq(4)").text().trim());
        var ttw=parseFloat(self.find("td:eq(5)").text().trim());
        sum+=ttp;
        waiv+=ttw;
    })
     //var sumV=(Math.round(sum*100)/100).toLocaleString();
     //var sumW=(Math.round(waiv*100)/100).toLocaleString();
    
    document.querySelector('#tbill').value=sum;   
    document.querySelector('#wbill').value=waiv; 

    var ttb=$('#tbill').val();
    var ttw=$('#wbill').val();
    var ttdep=$('#tdep').val();
    //calculate net bill 
    var diff=parseFloat(ttb-ttw-ttdep);
    document.querySelector('#abill').value=diff//.toLocaleString();
    
  }
  $('#paidAmount').on('keyup',function(){
    this.value=this.value.replace(/\D/g,'');    
    $(this).val(this.value); //.toLocaleString()
    findBalance();
 })

 function findBalance(){
    var pmode=document.querySelector('#ppaymode').value;
    var paid =document.querySelector('#paidAmount').value;
    var tbill=parseInt(document.querySelector('#abill').value);

        if(paid.isNaN){}
        else if(paid>0){ 
            document.querySelector('#balance').value=parseInt(tbill-paid).toLocaleString();
        }
        else{
            document.querySelector('#balance').value='';
        }
    /* if(pmode=='cash'){
        
    }
    else{
        alert('Please check paymode. Client is a scheme member');
        document.querySelector('#paidAmount').value=0;
    } */

    
 }

 $('.btnReceiveCash').on('click', function(){
  var ptype=$('#pat_type').val();
  var pno=$('#pid').val();
  var tb=$('#tbill').val();
  var nb=$('#abill').val();
  var pb=$('#paidAmount').val();  
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
    var tb=document.querySelector('#tblServices');
    var shftno=document.querySelector('#shftlabel').innerHTML;
    var pym=$('#paymode').val();
    var mn=$('#mobnumber').val();
    var mnt=$('#transNumber').val();
    var pty=$('#pat_type').val();
    

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
            pno:pno,
            vno:vno,
            sft:shftno,
            pym:pym,
            pty:pty,
            mn:mnb,
            mtn:mtnt,
            ttype:transtype,
            scode:tb.rows[i].cells[0].innerHTML,  //service code         
            //qnt:tb.rows[i].cells[2].children[0].value,
            qnt:parseInt(tb.rows[i].cells[2].innerHTML.trim()),
            ttp:tb.rows[i].cells[4].innerHTML,
            wv:tb.rows[i].cells[5].innerHTML,
            dpt:tb.rows[i].cells[6].innerHTML,
            rfno:tb.rows[i].cells[7].innerHTML,//patientbill reff number         
            wvid:tb.rows[i].cells[8].innerHTML,//patientbill reff number         
            st:tb.rows[i].cells[9].innerHTML,//patientbill reff number         
        });            
    }    
    save_transaction(bill);
   
    
  } 
 })



 function save_transaction(data){
  formdata=JSON.stringify(data);
  $.ajax({
    url: '/finance/save_transaction/',
    data: formdata, 
    method:'POST',       
    dataType: 'json',
    success: function (data) {
     //printreceipt
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

 $('#btnExempt').on('click', function(){
    if(confirm('Are you sure to excempt this bill?')){      
      
      var pno=$('#pid').val();
      var vno=$('#visitno').val();   
      
        var bill=[]; 
        var tb=document.querySelector('#tblServices');
        var shftno=document.querySelector('#shftlabel').innerHTML;
        var pym=$('#paymode').val();
        var mn=$('#mobnumber').val();
        var mnt=$('#transNumber').val();
        var pty=$('#pat_type').val();
        
    
        var mnb=0;
        var mtnt=0;
        var transtype='exception';
    
        if(mn=='mobile'){
          mnb=mn
          mtnt=mnt
        }
        else{}
    
        var rw_count = tb.tBodies[0].rows.length;   
        for(var i=1;i<=rw_count;i++){        
            bill.push({
                pno:pno,
                vno:vno,
                sft:shftno,
                pym:pym,
                pty:pty,
                mn:mnb,
                mtn:mtnt,
                ttype:transtype,
                scode:tb.rows[i].cells[0].innerHTML,  //service code         
                qnt:tb.rows[i].cells[2].children[0].value.trim(),
                ttp:tb.rows[i].cells[4].innerHTML,
                wv:tb.rows[i].cells[5].innerHTML,
                dpt:tb.rows[i].cells[6].innerHTML,
                rfno:tb.rows[i].cells[7].innerHTML,//patientbill reff number         
            });            
        }    
        save_transaction(bill);
        //console.log(JSON.stringify(bill));      
      
    }
 })



 function clearfield(){
  setTimeout(function() {
    $("#cardNo").val('');
    $("#tbill").val('');
    $("#wbill").val('');
    $("#abill").val('');
    $("#mobnumber").val('');
    $("#transNumber").val('');
    $("#paidAmount").val('');
    $("#balance").val('');
    $("#exmpNo").val('');
    $("#pAge").val('');
    $("#ppaymode").val('');
    $("#pname").val('');
    $("#visitno").val('');
    $("#pid").val('');
    //document.querySelector("#cardNo").value="";

    $('#paymode').prop('selectedIndex',0);
    //$('#pat_type').prop('selectedIndex',0);
    $("#tblServices > tbody").empty();
  },1500);
  
 }


 function printDivContent() {
      var printContents = document.getElementById("divreceipt").innerHTML;
			var originalContents = document.body.innerHTML;
			document.body.innerHTML = printContents;
			window.print();
			document.body.innerHTML = originalContents;
      location.reload(true);
      //clear fields
      //
        
}

$('#btnprintcopy').on('click',function(){
  //alert('clicked')
   //var div=document.querySelector('#paycard');
   $('#divreceipt').print();
   //printDivContent();
})

$('#btninvoce').on('click', function(){
  loadsumminvoice();
})

var suminvoicebody=document.querySelector('#suminvoicebody')
function loadsumminvoice(){
    var vno=$('#visitno').val();
    var pno=$('#pid').val();
    var ptype=$('#pat_type').val();

    if(pno !==''){
      suminvoicebody.innerHTML='';
    fetch("/finance/loadbill/",{
        body:JSON.stringify({ pno:pno,vno:vno,ptype:ptype}),
        method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
        //console.log('data',data);
        if(data.length===0){
          suminvoicebody.innerHTML='<tr><td colspan="6">No bill found </td></tr>';
            
        }
        else{
          $('#invheader').text('Summarized Interim Invoice'); 
          
          result = [];
          var ttsum=0;
          var ttdep=0;
          data.forEach(function (item) {
            ttsum=item.ttsum;
            ttdep=item.ttdep;
            if (!this[item.service]) {
                this[item.service] = { service: item.service, dept: item.dept, qnty: item.qnty, cost: item.cost };
                result.push(this[item.service]);
                return;
            }
            this[item.service].qnty += item.qnty;
            this[item.service].cost += item.cost;
        }, Object.create(null));
        
        //console.log(result);
            var sum=0;
            suminvoicebody.innerHTML='';
            result.forEach((item)=>{
            sum+=item.cost;           

            suminvoicebody.innerHTML+=
              `<tr>
              <td>${item.dept}</td>
              <td>${item.service}</td>              
              <td>${item.qnty}</td>
              <td>${item.cost}</td>
              </tr>`;
          }); 
          
        var nbill=parseFloat(sum)-parseFloat(ttsum)
        var ntbill=nbill.toLocaleString('en-US',  {maximumFractionDigits:2})
        suminvoicebody.innerHTML+=
        `<tr>
            <td style='text-align: center;'><b>Total Bill: ${sum.toLocaleString('en-US',{maximumFractionDigits:2})}</b></td>
            <td style='text-align: center;'><b>Deposits: ${ttdep.toLocaleString('en-US',{maximumFractionDigits:2})}</b></td>
            <td style='text-align: center;'><b>Paid: ${ttsum.toLocaleString('en-US',{maximumFractionDigits:2})}</b></td>
            <td style='text-align: center;'><b>Net Bill: ${ntbill}</b></td>
        </tr>`;
        }
        $('#suminvoiceModal').modal('show');

      })
    }
    else{
        swal('sorry load patient first','','info');
    }
}


$('#billtype').on('change', function(){
  var trans_type=$(this).val();
  var pno=$('#pid').val();
  if(trans_type=='Deposit'){
    if(pno !==''){
      $('#depositmodal').modal('show');
    }
    else{
      swal('No patient','select patient first','info');
      $(this).prop('selectedIndex',0)
    }    
  }
  else{
    $('#depositmodal').modal('hide');
  }
})

$('#paydpmode').on('change', function(){
  var pmethod=$(this).val();
  
  if(pmethod=='mobile'){    
    $('#divdpsearchstk').show();
    $('#divpyamount').show();
    //$('#dpaidamt').prop('readonly','true');

  }
  else{
    //$('#dpaidamt').prop('readonly','false');   
    $('#divdpsearchstk').hide();
    $('#divpyamount').hide();
    
  }
  $('#dpaidamt').val('');
})

 

/*pat_type.addEventListener('change',(e)=>{
  var ptype=e.target.value;
  if(ptype=='Walk-In'){
    $('#patient_id').prop('disabled', true);
  }
  else{
    $('#patient_id').prop('disabled', false);

  }
}) */

//send stk push


const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

$('#stk_request_btn').on('click',(e)=>{
  e.preventDefault();

  var nbill=$('#abill').val();

  if(nbill=='' || nbill=='0'){
    swal('Net Amount cannot be empty or zero','','error');
  }
  else{
    phone=$('#mobnumber').val();
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
          $('#checkoutid').val(data.CheckoutID);
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

$('#dp_stk_pushd').on('click',(e)=>{
  e.preventDefault();
  var nbill=parseInt($('#stkamount').val());
  var phone=$('#dphone').val();

  if(nbill=='' || nbill==0){
    swal('Net Amount cannot be empty or zero','','error');
  }
  else{    
    var formdata={
      phonenumber:phone,
       amount:nbill
      }

   $.ajax({
      url: '/finance/stkpush/',
      data:JSON.stringify(formdata), 
      method:'POST',       
      dataType: 'json',
      //headers: {'X-CSRFToken': csrftoken},
      success: function (data) {
        if(data.msg='success'){
          swal('stk successfully sent to ',phone+' waiting response','success');
          //console.log(data.resdata);
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
$('#mbnumber').on('keyup',function(){
  this.value=this.value.replace(/\D/g,'');    
  $(this).val(this.value); //.toLocaleString()  
})

//refresh button mpesa tokens
var tbodytokens=document.querySelector('#tblSearchmbBody');
$('#btnrefresh').on('click',(e)=>{
        e.preventDefault();       

        var phone=$('#mbnumber').val();
        if(phone !==''){
            tbodytokens.innerHTML=''; //for table refresh
            fetch("https://greencode.co.ke/stkphp/tokens.php",{
            body:JSON.stringify({phn:phone}),
            method: "POST",
            //method: "GET",
        })
        .then((res)=>res.json())
        .then((data)=>{
             //console.log(data);
            if(data.length===0){
                tbodytokens.innerHTML='<tr><td colspan="3">Sorry..No token found </td></tr>';
                
            }
            else{
                //console.log(data);
                var phn='';
              data.forEach((item)=>{
                phn=item.phonenumber;
                var firstPart = phn.substr(0,6); 
                var lastPart = phn.substr(9,11,phn.length);
                var phn = firstPart+'***'+lastPart;

                  tbodytokens.innerHTML+=
                  `<tr>              
                  <td>${item.transactiondate}</td>
                  <td>${phn}</td>
                  <td>${item.transactionid}</td>                  
                  <td>${item.amount}</td>
                  <td>pending</td>
                  <td style="display:none;" >${item.id}</td>
                  <td style="display:none;" >${item.phonenumber}</td>
                  </tr>`
              });
            }
          })
        }
        else{
          swal('Phone number cannot be empty','(last 3 digits)','error');
        }
})




// button to query the checkout id

$('#vtoken_btn').on('click',function(){
  //$('#mobile_modal').modal('show');
 // var mbn=$('#mobnumber').val();        
  //$('#mbnumber').val(mbn);
  var chid=$('#checkoutid').val();
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
      if(rscode==0){$('#paidAmount').val(item.amount);}
      else{swal('Incomplete!!',rsdesc,'info')}      
    }
  })

  }
  else{
    swal('Error!!','missing check out id .make sure to push payment request','info');
  }

})


//refresh button mpesa tokens
var tbldpSearchmbBody=document.querySelector('#tbldpSearchmbBody');
$('#btndprefresh').on('click',(e)=>{
        e.preventDefault();  
        var phone=$('#dphone').val(); 
        phone = phone.substr(7,9,phone.length);
        console.log(phone);     
        if(phone !==''){
            tbldpSearchmbBody.innerHTML=''; //for table refresh
            fetch("https://greencode.co.ke/stkphp/tokens.php",{
            body:JSON.stringify({phn:phone}),
            method: "POST",
            //method: "GET",
        })
        .then((res)=>res.json())
        .then((data)=>{
             //console.log(data);
            if(data.length===0){
                tbldpSearchmbBody.innerHTML='<tr><td colspan="3">Sorry..No token found </td></tr>';
                
            }
            else{
                //console.log(data);
              data.forEach((item)=>{
                var phn=item.phonenumber;
                var firstPart = phn.substr(0,6); 
                var lastPart = phn.substr(9,11,phn.length);
                var phn = firstPart+'***'+lastPart;

                  tbldpSearchmbBody.innerHTML+=
                  `<tr>              
                  <td>${item.transactiondate}</td>
                  <td>${phn}</td>
                  <td>${item.transactionid}</td>                  
                  <td>${item.amount}</td>
                  <td>pending</td>
                  <td style="display:none;" >${item.id}</td>
                  <td style="display:none;" >${item.phonenumber}</td>
                  </tr>`
              });
            }
          })
        }
        else{
          swal('Phone number cannot be empty','(last 3 digits)','error');
        }
})

$('#tblSearchmb tbody').on('click','tr', function(){

  var currenRow=$(this).closest("tr");   
  var mpesaid = currenRow.find("td:eq(2)").text(); 
  var amt = currenRow.find("td:eq(3)").text(); 
  var id = currenRow.find("td:eq(5)").text();
  var phone = currenRow.find("td:eq(6)").text();  

  var data=[]
  data.push({
    'mpesaid':mpesaid,
    'amount':amt,
    'id':id,
    'phone':phone
  })

  console.log(data);

})