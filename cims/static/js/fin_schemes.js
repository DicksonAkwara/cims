var tblunfinBody=document.querySelector('#tblunfinBody');
$('#patschemes').on('change', function(){
    var fdate=$('#datepick').val();    
    var sname=$(this).val(); 
    schemeChange(fdate,sname);   
 
})

function schemeChange(fdate,sname){
  tblunfinBody.innerHTML=''; //for table refresh
  fetch("/finance/schemebill/",{
  body:JSON.stringify({scname:sname,fdate:fdate}),
  method: "POST",
})
.then((res)=>res.json())
.then((data)=>{
if(data.length===0){
  tblunfinBody.innerHTML='<tr><td colspan="5">No bills found</td></tr>';                     
}
else{        
  data.forEach((item)=>{
    tblunfinBody.innerHTML+=
      `<tr>
      <td>${item.sdate}</td>
      <td>${item.pid}</td>
      <td>${item.pname}</td>        
      <td>${item.scname}</td>
      <td><input type="button" class="btn btn-primary btn-sm" id="chkbox" value="view"></td>
      </tr>`;
  });
}
})
}

$('#schpatsearch').on('keyup', function(){
    var value = $(this).val().toLowerCase();
    $("#tblunfin tbody tr").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
})



var tblInvDetBody=document.querySelector('#tblInvDetBody');
$('#tblunfin tbody').on('click','#chkbox', function(){
  var currentRow=$(this).closest("tr");
  //if($(this).is(':checked')){
    var pno=currentRow.find("td:eq(1)").text();
    var pname=currentRow.find("td:eq(2)").text();
    var scname=currentRow.find("td:eq(3)").text();
    var bdate=$('#datepick').val();

    $('#patnumber').text(pno);
    $('#patname').text(pname);
    $('#patscheme').text(scname);
    

     fetch("/finance/patientSchemeBill/",{
        body:JSON.stringify({pno:pno,scname:scname,bdate:bdate}),
        method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
      tblInvDetBody.innerHTML='';
      if(data.length===0){
        tblInvDetBody.innerHTML='<tr><td colspan="5">No bills found</td></tr>';                     
      }
      else{        
        data.forEach((item)=>{
          tblInvDetBody.innerHTML+=
            `<tr>
            <td style='display:none'>${item.refno}</td>
            <td>${item.sdate}</td>
            <td>${item.service}</td>
            <td>${item.qnt}</td>            
            <td>${item.price}</td>
            <td>${item.tprice}</td>
            <td><button class="btn btn-sm btn-danger" id="rmbill">&times;</button></td>
            </tr>`;
        });
        $('#inv_details').modal('show');
        findTotal();
      }
    })

        
  //}
})

$("#tblInvDet tbody").on('click', '#rmbill', function() {  
  var currentRow=$(this).closest("tr");
  var refno=currentRow.find("td:eq(0)").text(); 
  var svs_name=currentRow.find("td:eq(2)").text(); 
  var ttp=currentRow.find("td:eq(5)").text(); 
  if(confirm(`Are you sure you want to remove( ${svs_name} )from bill?`)){       
      $(this).closest('tr').remove();  
      //var bal=parseFloat(tt_inv)-parseFloat(ttp);
      //$('#invoiceamt').text(bal);   
      console.log(refno);
      //update cancelled entry to cancelled
      $.ajax({
        url: '/finance/removebill/',
        data: JSON.stringify({'refno':refno}), 
        method:'POST',       
        dataType: 'json',
        success: function (data) {
          swal('',data.msg,'info'); 
          findTotal(); 
        },
        error: function(jqXHR, exception) {
          if(jqXHR.status === 500) {
              swal('','Internal Server Error occurred.'+exception,'error');
          }
        }
      }) 
  }
})

function findTotal(){
  //var tb = document.getElementById('tblInvDet');
  var sum=0;
  $("#tblInvDet tbody tr").each(function(){
      var self=$(this);
      var ttp=parseFloat(self.find("td:eq(5)").text().trim());
      sum+=ttp;
  })
  $('#invoiceamt').text(sum);

}

$('#finalizebill').on('click', function(){
  if(confirm('Is the invoice bill okay?')){
    var reffno=[]
    $("#tblInvDet tbody tr").each(function(){
      var self=$(this); 
      reffno.push({
        rfn:self.find("td:eq(0)").text().trim()
      })
    })

  $.ajax({
    url: '/finance/finalizePatBill/',
    data: JSON.stringify(reffno), 
    method:'POST',       
    dataType: 'json',
    success: function (data) {
      swal('',data.msg,'success');
      $('#inv_details').modal('hide');
      refreshList();   
    },
    error: function(jqXHR, exception) {
      if(jqXHR.status === 500) {
          swal('','Internal Server Error occurred.'+exception,'error');
      }
    }
  })
  }  
})

function refreshList(){
  var fdate=$('#datepick').val();    
  var sname=$('#patschemes').val(); 
  schemeChange(fdate,sname);
}


//finalized invoices page

var tblunfinBody=document.querySelector('#tblunfinBody');
$('#schfname').on('change', function(){
    var fdate=$('#datepicker2').val();    
    var sname=$(this).val(); 
    var ptype=$('#schfpat').val();
    schemefinChange(fdate,sname,ptype);   
 
})

var tblfinBody=document.querySelector('#tblfinBody')
function schemefinChange(fdate,sname,ptype){
  tblfinBody.innerHTML=''; //for table refresh
  fetch("/finance/finalinvlist/",{
  body:JSON.stringify({scname:sname,fdate:fdate,ptype:ptype}),
  method: "POST",
})
.then((res)=>res.json())
.then((data)=>{
if(data.length===0){
  tblfinBody.innerHTML='<tr><td colspan="5">No invoices found</td></tr>';                     
}
else{        
  data.forEach((item)=>{
    tblfinBody.innerHTML+=
      `<tr>
      <td>${item.sdate}</td>
      <td>${item.invno}</td>
      <td>${item.pid}</td>        
      <td>${item.pname}</td>        
      <td>${item.scname}</td>
      <td><button class="btn btn-sm btn-primary" id='btnfinview'>View</button></td>
      <td><button class="btn btn-sm btn-danger" id='btninvreset'>Reset</button></td>
      <td style='display:none'>${item.nid}</td>
      </tr>`;
  });
}
})
}


$('#fnpatsearch').on('keyup', function(){
  var value = $(this).val().toLowerCase();
  $("#tblfin tbody tr").filter(function() {
  $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
});
})



var tblfnmodalBody=document.querySelector('#tblfnmodalBody');
$('#tblfin tbody').on('click','#btnfinview', function(){
var currentRow=$(this).closest("tr");
//if($(this).is(':checked')){
  var invdate=currentRow.find("td:eq(0)").text();
  var invno=currentRow.find("td:eq(1)").text();
  var pno=currentRow.find("td:eq(2)").text();
  var pname=currentRow.find("td:eq(3)").text();
  var scname=currentRow.find("td:eq(4)").text();
  var nid=currentRow.find("td:eq(7)").text();
  
  
  $('#invnumber').text(invno);
  $('#patfnnumber').text(pno);
  $('#patfnname').text(pname);
  $('#patfnscheme').text(scname);
  $('#patfnid').text(nid);
  

   fetch("/finance/patFinalInv/",{
      body:JSON.stringify({invno:invno}),
      method: "POST",
  })
  .then((res)=>res.json())
  .then((data)=>{
    var invdata=data.fndata;
    var ttsum=data.ttsum;
    var profile=data.profile;
    tblfnmodalBody.innerHTML='';
    if(invdata.length===0){
      tblfnmodalBody.innerHTML='<tr><td colspan="5">No details found</td></tr>';                     
    }
    else{ 
      var footer='';
      var user='';
      var bdate='';
      
      profile.forEach((item)=>{
        $('#fname').text(item.fname +'('+item.abbr+')')
        $('#address').text('Address: '+item.location)
        $('#contact').text('Contacts: '+item.phone +' Email:'+item.email)
        footer=item.abbr+' '+item.footer;
              
      });
      
      invdata.forEach((item)=>{
        user=item.invby;
        bdate=item.bdate;
        
        tblfnmodalBody.innerHTML+=
          `<tr>
          <td>${item.sdate}</td>
          <td>${item.service}</td>
          <td>${item.qnt}</td>            
          <td>${item.price}</td>
          <td>${item.tprice}</td>
          <td>${item.billby}</td>
          </tr>`;
          
      });

      $('#invdate').text(bdate);

      tblfnmodalBody.innerHTML+=
          `<tr>
            <td colspan='3'></td>
            <td>Total</td>          
            <td><b>${ttsum}</b></td>          
            <td>----</td>          
          </tr>`;

      tblfnmodalBody.innerHTML+=
      `<tr class="mt-2">  
        <td colspan='6'>Prepared by: ${user}</td>          
      </tr>`;

      
      $('#fininvmodal').modal('show');
    }
  })

      
//}
})

$('#tblfin tbody').on('click','#btninvreset', function(){
  var currentRow=$(this).closest("tr");
  var invno=currentRow.find("td:eq(1)").text();
  if(confirm('Do you really want to unfinalize invoice:'+invno)){ 
    $.ajax({
      url: '/finance/unfinalizeBill/',
      data: JSON.stringify({'invno':invno}), 
      method:'POST',       
      dataType: 'json',
      success: function (data) {
        swal('',data.msg,'success');  
      },
      error: function(jqXHR, exception) {
        if(jqXHR.status === 500) {
            swal('','Internal Server Error occurred.'+exception,'error');
        }
      }
    })
  }  
})

$('#prtinvoice').on('click', function() {
  /* var printContents = document.getElementById("divinvoice").innerHTML;
  var originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents; */



  //location.reload(true);
  //clear fields
  //
    

var printContents = document.getElementById("divinvoice").innerHTML;

// Create a new iframe
var iframe = document.createElement('iframe');
iframe.style.display = 'none';

// Append the iframe to the body
document.body.appendChild(iframe);

// Get the iframe's document and write the content to it
var iframeDoc = iframe.contentWindow.document;
iframeDoc.open();
iframeDoc.write('<html><head><title>Print</title>');

// Copy and apply the styles from the original document's head
//styles not picking at the printing part
var styles = document.head.getElementsByTagName("link");
for (var i = 0; i < styles.length; i++) {
    iframeDoc.head.appendChild(styles[i].cloneNode(true));
}

iframeDoc.write('</head><body>');
iframeDoc.write(printContents);
iframeDoc.write('</body></html>');
iframeDoc.close();

// Print the iframe's content
iframe.contentWindow.print();

// Remove the iframe after printing
iframe.remove();



})