const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;


$('#buttonAddSupp').on('click',function(){   
    var formdata=$("#supplierAdd").serialize();
    $.ajax({
        url: '/stores/addsupplier/',
        data: formdata, 
        method:'POST',       
        dataType: 'json',
        success: function (data) {               
          if(data.length===0){}
          else{              
              alert(data.msg); 
              $('form#supplierAdd').trigger("reset");
                            
          }                    
        },
        error: function(jqXHR, exception) {
          if(jqXHR.status === 500) {
              alert('Internal Server Error occurred. try again');
          }
        }
    })
})
///start of store item script///////////////////////
$('#buttonAddItem').on('click',function(){   
    var formdata=$("#storeItemAdd").serialize();
    $.ajax({
        url: '/stores/addstoreItem/',
        data: formdata, 
        method:'POST',       
        dataType: 'json',
        success: function (data) {               
          if(data.length===0){}
          else{              
              alert(data.msg); 
              $('form#storeItemAdd').trigger("reset");
              location.reload();
                            
          }                    
        },
        error: function(jqXHR, exception) {
          if(jqXHR.status === 500) {
              alert('Internal Server Error occurred. try again');
          }
        }
    })
})

$('#buttonEditItem').on('click',function(){   
  var formdata=$("#storeItemAdd").serialize();
  if(confirm('Update item details?')){
    $.ajax({
      url: '/stores/editstoreItem/',
      data: formdata, 
      method:'POST',       
      dataType: 'json',
      success: function (data) {               
        if(data.length===0){}
        else{              
            alert(data.msg); 
            $('form#storeItemAdd').trigger("reset");
                          
        }                    
      },
      error: function(jqXHR, exception) {
        if(jqXHR.status === 500) {
            alert('Internal Server Error occurred. try again');
        }
      }
  })
  }
  
})
//
$('#itemsearch').on('keyup',function(){
    var value = $(this).val().toLowerCase();
    $("#tblitems tbody tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
})

$('#tblitems tbody').on('click','tr',function(){
      var currentRow=$(this).closest("tr");
        
      var id=currentRow.find("td:eq(0)").text(); 
      var nme=currentRow.find("td:eq(2)").text();
      var desc=currentRow.find("td:eq(3)").text();
      var catg=currentRow.find("td:eq(4)").text();
      var strg=currentRow.find("td:eq(5)").text();
      var price=currentRow.find("td:eq(7)").text();
      var pkg=currentRow.find("td:eq(8)").text();

      document.querySelector('#itemid').value=id;
      document.querySelector('#id_itemName').value=nme;
      document.querySelector('#id_itemDescp').value=desc;
      document.querySelector('#id_itemCategory').value=catg;
      document.querySelector('#id_strength').value=strg;
      document.querySelector('#id_price').value=price;
      document.querySelector('#id_package').value=pkg;
  
})


///start of store  script///////////////////////
$('#buttonAddStore').on('click',function(){
    $('#spinners').show();   
    var formdata=$("#storeAdd").serialize();
    $.ajax({
        url: '/stores/addstores/',
        data: formdata,       
        method:'POST',       
        dataType: 'json',
        success: function (data) {                         
          if(data.length===0){}
          else{              
              alert(data.msg); 
              //$('form#storeAdd').trigger("reset");
              location.reload();                            
          }                    
        },
        complete:function(){
          $('#spinners').hide();
        },
        error: function(jqXHR, exception) {
          $('#spinners').hide();
          if(jqXHR.status === 500) {
              alert('Internal Server Error occurred. try again');
          }
        }
    })
})

////////////// item order ///////////////////




const pharSearchTbBodyS=document.querySelector('.pharSearchTbBody');
$('#searchStoreItem').on('keyup',function(){
  var item =$(this).val().trim();  
  var stto=$('#stto').val().trim();

      fetch("/consult/cons_pharm_search/",{
      body:JSON.stringify({ searchText:item,store:stto}),
      method: "POST",
  })
  .then((res)=>res.json())
  .then((data)=>{
      //console.log('data',data);
      if(data.length===0){
          pharSearchTbBodyS.innerHTML='<tr><td colspan="3">Item not found </td></tr>';                     
      }
      else{
        
        data.forEach((item)=>{
          pharSearchTbBodyS.innerHTML+=
            `<tr>
            <td style="display:none;">${item.item_code}</td>             
            <td>${item.item_name}(${item.strength})</td>            
            <td>${item.balance}</td>                                
            </tr>`
        });
      }
    })
  

})

const searchtbody=document.querySelector('.searchtbody');
$('#itemsearchItem').on('keyup',function(){
  var item =$(this).val().trim(); 
  var orcat=document.querySelector('#category').value;
   var stfrom=document.querySelector('#storefr').value;
   var stto=document.querySelector('#storeto').value;
   
   if(stfrom=='none'||orcat=='none'||stto=='none'){    
    document.querySelector('#itemsearchItem').value='';  
    alert('please select all fields approprietly')  
   }
   else{
    if(item !== ''){
      fetch("/stores/searchItem/",{
      body:JSON.stringify({ searchText:item,str:stto}),
      method: "POST",
      })
      .then((res)=>res.json())
      .then((data)=>{
          $('#divtbsearch').show();
          if(data.length===0){
              searchtbody.innerHTML='<tr><td colspan="3">No item found </td></tr>';                     
          }
          else{
            searchtbody.innerHTML='';     
            data.forEach((item)=>{
              
              searchtbody.innerHTML+=
                `<tr>
                <td style="display:none;">${item.itid}</td>             
                <td>${item.itname}(${item.strg})</td> 
                <td style="display:none;">${item.pkg}</td>           
                <td style="display:none;">${item.bal}</td> 
                </tr>`
            });
          }
        }) 
      }
      else{
        searchtbody.innerHTML='';
      }         
   }    

})

$('.searchtbody tr').hover(function() {
  $(this).css('cursor','pointer');
});

const tblitemsbody=document.querySelector('#tblitemsbody');
$('#searchtb tbody').on('click','tr', function() {
  var currentRow=$(this).closest("tr");
        
      var id=currentRow.find("td:eq(0)").text(); 
      var nme=currentRow.find("td:eq(1)").text();      
      var pkg=currentRow.find("td:eq(2)").text();
      var bal=currentRow.find("td:eq(3)").text();
      
      $('#divtbsearch').hide();
     

      tblitemsbody.innerHTML+=
      `<tr>              
      <td style="display:none;">${id}</td>      
      <td>${nme}</td>    
      <td>${bal}</td>   
      <td><textarea rows="1" cols="10" class='itm_qnt text-center' id="txt_area_qnt">0</textarea></td>
      <td>
          <select class='urgency form-control'>           
            <option value="normal">Normal</option>
            <option value="urgent">urgent</option>
          </select>
      </td>  
      <td><input class="btn btn-danger p-1" type="button" id="itemremoveorder" value="X" ></td>    
  
  </tr>`;
     
});


$("#tblitems").on('click', '#itemremoveorder', function() {  
  var currentRow=$(this).closest("tr");
  var svs_name=currentRow.find("td:eq(1)").text(); 
  if(confirm(`Are you sure you want to remove( ${svs_name} )from order?`)){       
      $(this).closest('tr').remove();      
  }
})


$("#tblitems").on('keyup', '#txt_area_qnt', function() {  
  var currentRow=$(this).closest("tr");
  var bal=currentRow.find("td:eq(2)").text(); 
  var qnt=$(this).val(); 
  if(parseFloat(qnt)>parseFloat(bal)){       
      alert('cannot order more than available')
      $(this).val('0');      
  }
})

$('#storeto').on('change',function(){
   var stf=$('#storefr').val();
   var stt=$(this).val();
   if(stt==stf){
    alert('Sorry!! cannot order from the same store requesting');
    $('#storeto').prop('selectedIndex',0);
   }
})

var plist=document.querySelector('#pendorder')
$('#storefr').on('change',function(){
  
  var stf=$(this).val();
  if(stf !== ''){
    fetch("/stores/pendorders/",{
    body:JSON.stringify({str:stf}),
    method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
      $("#pendorder").empty();
        if(data.length===0){
          plist.innerHTML+=`<option value='none'>-------------</option>`
        }
        else{
          plist.innerHTML+=`<option value='none'>-------------</option>`
          data.forEach((item)=>{            
            plist.innerHTML+=`<option value='${item.rqid}'>${item.rqid}</option>`
          });
        }
      }) 
    }
  
})

var tblpendbody=document.querySelector('#tblpendbody')
$('#pendorder').on('change',function(){  
  var pdno=$(this).val();
  if(pdno !== ''){
    fetch("/stores/fetchpendorders/",{
    body:JSON.stringify({pdno:pdno}),
    method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
      $("#tblpend > tbody").empty();
        if(data.length===0){         
        }
        else{ 
          document.querySelector('#pendTitle').innerHTML=`Pending Orders. Request Number ${pdno}`;         
          data.forEach((item)=>{    
            tblpendbody.innerHTML+=
            `<tr>
            <td >${item.rqdate}</td>             
            <td>${item.itname}</td>            
            <td>${item.qnt}</td>                                
            <td>${item.str}</td>                                
            <td>${item.staff}</td>                                
            <td>${item.status}</td>                                
            </tr>`
          });
          $('#pendmodal').modal('show');
        }
      }) 
    }
  
})

$('#pditemsearch').on('keyup',function(){
  var value = $(this).val().toLowerCase();
  $("#tblpend tbody tr").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
})

$('#btnConfirm').on('click',function(){
  var disp=[];
  var ortype =$('#category').val();
  var strf =$('#storefr').val();
  var strt =$('#storeto').val();

  var tb=document.querySelector('#tblitems');
  var rw_count = tb.tBodies[0].rows.length;  
  if(rw_count>0){
    for(var i=1;i<=rw_count;i++){        
      disp.push({
            ort:ortype,
            strf:strf,
            strt:strt,
            itcode:tb.rows[i].cells[0].innerHTML,  //item code  
            qnt:tb.rows[i].cells[3].children[0].value,                 
            urg:tb.rows[i].cells[4].children[0].value,                 
        });            
    }
    var formdata = JSON.stringify(disp);
    $.ajax({
     url: "/stores/confirmitemorder/",
     data: formdata, 
     method:'POST',       
     dataType: 'json',
     success: function (data) {
       alert(data.msg);
       $("#tblitems > tbody").empty();
     },
     error: function(jqXHR, exception) {
       if(jqXHR.status === 500) {
           alert('Internal Server Error occurred.'+exception);
       }
     }
   });
  } 
 else{
  alert('no item to order');
 }
  
})

///////////////////receiving stock script////////////////////
$('#itmperpkg').on('keyup', function(){
   var ppkg=$(this).val().trim()
   var pkgcount=$('#pkgcount').val().trim()
   var total=parseFloat(pkgcount*ppkg);
   document.querySelector('#dlvttitem').value=total;
   document.querySelector('#spttitems').innerHTML='Total Items:'+total;
})

$('#pkgprice').on('keyup', function(){
  var pprice=$(this).val().trim()
  var ttitems=$('#dlvttitem').val().trim()
  var itpr=parseFloat(pprice/ttitems);
  document.querySelector('#itemprice').value=itpr;
  document.querySelector('#spitemprice').innerHTML='Price per item:'+itpr;
})


$("#dlvitem").keyup(function(){ 
  var search = $(this).val();
  var str = $('#storerec').val();
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
  var stid = $('#storerec').val(); 
  $("#dlvitem").val(value); 
  $("#itemid").val(itid); 
  $("#searchResult").empty(); 

  fetch("/stores/itemdetails/",{
    body:JSON.stringify({str:stid,itid:itid}),
    method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
      $("#itbal").val();
        if(data.length===0){
          $("#itbal").val();
        }
        else{          
          data.forEach((item)=>{            
            $("#itbal").val(item.bal);
          });
        }
      })
 
}


$('#newbal').on('keyup',function(){
  this.value=this.value.replace(/\D/g,'');    
  $(this).val(this.value);
})


$('#btnsavereconcile').on('click',function(){
  if(confirm('Is the amount enterred corect?')){
    var itbal=$("#newbal").val();
    var itid=$("#itemid").val();
    var stid=$('#storerec').val();

    $.ajax({ 
      url: '/stores/reconcile_item/', 
      type: 'post', 
      data: JSON.stringify({itbal:itbal,itid:itid,stid:stid}), 
      dataType: 'json', 
      headers: {'X-CSRFToken': csrftoken},
      success:function(data){ 
        swal('Item Reconciliation',data.msg,'success')
        $("#itbal").val('');
        $("#itemid").val('');
        $("#newbal").val('');
        $("#dlvitem").val('');
      },
      error: function(jqXHR, exception) {
        if(jqXHR.status === 500) {
            swal('Balance error','Internal Server Error occurred. try again','error');
        }
      }
    }); 
  }
})

$('#btnstockbal').on('click',function(){
  $('#').modal('show');
  //load store bal

})




$('.rcvstock').on('click', function(){
   
  //form validation
  

  //collect field value 
  var supplier=$('#supplier').val();
  var itemid=$('#itemid').val();
  var storerec=$('#storerec').val();
  var batchno=$('#batchno').val();
  var pkgUnit=$('#pkgUnit').val();
  var pkgcount=$('#pkgcount').val();
  var itmperpkg=$('#itmperpkg').val();
  var dlvttitem=$('#dlvttitem').val();
  var pkgprice=$('#pkgprice').val();
  var itemprice=$('#itemprice').val();
  var expdate=$('#expdate').val();
  var dlvno=$('#dlvno').val();
  var lpono=$('#lpono').val();
  var dldate=$('#dldate').val();
  var dlvby=$('#dlvby').val();
  var inpector=$('#inpector').val();

  var formdata=JSON.stidingify({supplier:supplier,itemid:itemid,storerec:storerec,batchno:batchno,
    pkgUnit:pkgUnit,pkgcount:pkgcount,itmperpkg:itmperpkg,dlvttitem:dlvttitem, itemprice:itemprice,
    pkgprice:pkgprice,expdate:expdate,dlvno:dlvno,lpono:lpono,dldate:dldate,dlvby:dlvby,inpector:inpector,
  });
  
  $.ajax({
      url: '/stores/receivestockitem/',
      data: formdata, 
      method:'POST',       
      dataType: 'json',
      headers: {'X-CSRFToken': csrftoken},
      success: function (data) {               
        if(data.length===0){}
        else{              
            swal('Success!!',data.msg,'success'); 
            //refreshreclist();
            clearform();
        }                    
      },
      error: function(jqXHR, exception) {
        if(jqXHR.status === 500) {
            swal('error!!','Internal Server Error occurred. try again','error');
        }
      }
  })
})
function clearform(){
  
  $('#itemid').val('');  
  $('#batchno').val('');
  $('#pkgUnit').prop('selectedIndex',0);
  $('#pkgcount').val('');
  $('#itmperpkg').val('');
  $('#dlvttitem').val('');
  $('#pkgprice').val('');
  $('#itemprice').val('');
  $('#spttitems').text('');
  $('#spitemprice').text('');
  
  var date = new Date(today); 
    date.setFullYear(date.getFullYear() + 5);
    var month2=(date.getMonth() + 1);
    var day2 = date.getDate();
    if (month2 < 10) 
        month2 = "0" + month2;
    if (day2 < 10) 
        day2 = "0" + day2;
    var plus = date.getFullYear() + '-' + month2 + '-' + day2;

    $('#expdate').val(plus);

}
const tblrecitems =document.querySelector('#tblrecitemsbody');

function refreshreclist(deln){ 
  var dllno=deln;
  fetch("/stores/refreshreclist/",{
    body:JSON.stringify({delv:dllno}),
    method: "POST",
    headers: {'X-CSRFToken': csrftoken},
    })
    .then((res)=>res.json())
    .then((data)=>{     
      if(data.length===0){          
        tblrecitems.innerHTML='<tr><td colspan="10">No items found </td></tr>';                     
    }
    else{           
        tblrecitems.innerHTML='';
        var jdata=data;
        var stnumber=0;
        var splname=0;
        jdata.forEach(element => {  
        tblrecitems.innerHTML+=
          `<tr>                  
          <td style="display:none;">${element.dlid}</td>
          <td style="display:none;">${element.itemId}</td>
          <td style="word-wrap:break-word;">${element.spname}</td>         
          <td style="word-wrap:break-word;">${element.itname}</td> 
          <td >${element.pkgunit}</td>             
          <td>${element.pkgcount}</td>
          <td >${element.itperpkg}</td>
          <td>${element.dvprice}</td>          
          <td >${element.lpono}</td>
          <td >${element.batch}</td>
          <td>${element.exdate}</td>
          <td><input class="btn btn-sm btn-warning" type="button" id="btnupdate" value="edit" ></td>                                         
          <td><input class="btn btn-sm btn-danger" type="button" id="btnrm" value="&times;" ></td>  
          <td style="display:none;">${element.ttitems}</td>
          <td style="display:none;">${element.ctperitem}</td>                                      
        </tr>`;
        stnumber=element.stid ;
        splname=element.spname ;
        });

        $('#storerec').val(stnumber);         
        $('#supplier').val(splname);         
    }
      }) 
}


$('#tblrecitems tbody').on('click','#btnupdate', function() {
  var currentRow=$(this).closest("tr");        
       var dvid=currentRow.find("td:eq(0)").text();
       var pkgcount=currentRow.find("td:eq(4)").text();
       var pkgprice=currentRow.find("td:eq(6)").text();
       var expdate=currentRow.find("td:eq(7)").text();
       var batchno=currentRow.find("td:eq(8)").text();
       var pkgUnit=currentRow.find("td:eq(9)").text();       
       var itmperpkg=currentRow.find("td:eq(10)").text();
       var dlvttitem=currentRow.find("td:eq(11)").text(); 
       var itemprice=currentRow.find("td:eq(12)").text();
       var storerec=currentRow.find("td:eq(15)").text();
  
  })

  $('#tblrecitems tbody').on('click','#btnrm', function() {
    if(confirm('remove this entry?')){ 
      var currentRow=$(this).closest("tr");
      var dlid=currentRow.find("td:eq(0)").text();
      var delno=$('#penddelv').val();
      $.ajax({
        url: '/stores/removestockitem/',
        data: JSON.stringify({dlid:dlid}), 
        method:'POST',       
        dataType: 'json',
        headers: {'X-CSRFToken': csrftoken},
        success: function (data) {               
          if(data.length===0){}
          else{
              refreshreclist(delno);
              $(this).closest('tr').remove();
          }                    
        },
        error: function(jqXHR, exception) {
          if(jqXHR.status === 500) {
              swal('Remove error!!','Internal Server Error occurred. try again later');
          }
        }
    })

       
    }
    

  })

  $('.amdstock').on('click', function(){
    var formdata=$("#reciveStockForm").serialize();
    $.ajax({
        url: '/stores/amendstockitem/',
        data: formdata, 
        method:'POST',       
        dataType: 'json',
        success: function (data) {               
          if(data.length===0){}
          else{              
              alert(data.msg); 
              refreshreclist();
              $('form#reciveStockForm').trigger("reset");
          }                    
        },
        error: function(jqXHR, exception) {
          if(jqXHR.status === 500) {
              alert('Internal Server Error occurred. try again');
          }
        }
    })
  })


   $('.cnfdelivery').on('click', function(){
    if(confirm('Confirm delivery of Items?')){
        var delidarray=[];
    var tb = document.getElementById('tblrecitems');
    var str=$('#storerec').val();
    var delvn=$('#penddelv').val();
    var rw_count = tb.tBodies[0].rows.length;   
      if(rw_count>0){
        for(var i=1;i<=rw_count;i++){        
            delidarray.push({
                dlid:tb.rows[i].cells[0].innerHTML,          
                itid:tb.rows[i].cells[1].innerHTML,          
                ttit:tb.rows[i].cells[13].innerHTML,          
                stid:str,          
            });
        }
        var data_json=JSON.stringify({delidarray});    
          $.ajax({
              url: '/stores/confirmreclist/',
              method:'POST',
              data: data_json,
              dataType: 'json',
              headers: {'X-CSRFToken': csrftoken},
              success: function (data) {               
                if(data.length===0){}
                else{              
                    swal('Confirm Deliverly success',data.msg,'success'); 
                    $("#tblrecitems > tbody").empty();
                    penddelnote(); 
                    //generate GRN /Delivery Note 
                    //generategrn();              
                }                    
              },
              error: function(jqXHR, exception) {
                if(jqXHR.status === 500) {
                    swal('Confirm deliverly error!!','Internal Server Error occurred. try later','error');
                }
              }
            });
      }
      else{
        alert('no items selected to confirm')
      }
    } 
  })

$('#itemdelsearch').on('keyup',function(){
    var value = $(this).val().toLowerCase();
    $("#tblrecitems tbody tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
   
})

$('.delview').on('click',function(e){
  e.preventDefault();
  var str=$('#storerec').val(); 
  if(str=='none' ||str==null){
    swal('Receiving store','Please select the store receiving','error')
  }
  else{
    penddelnote();
    $("#divpendtable").show();
    $("#divreceiveitem").hide();
  }
     
})

$('#btnback').on('click',function(e){
  e.preventDefault();
  $("#divpendtable").hide();
  $("#divreceiveitem").show();
})


function penddelnote(){    
    var store=$('#storerec').val(); //and username
    if(store !== ''){
      fetch("/stores/penddelnote/",{
      body:JSON.stringify({str:store}),
      method: "POST", 
      headers: {'X-CSRFToken': csrftoken},
      })
      .then((res)=>res.json())
      .then((data)=>{
        var jdata=data;  
        document.querySelector('#penddelv').innerHTML='';  
        document.querySelector('#penddelv').innerHTML+=`<option value="none">------------</option>`;  
           
        var jdata=data;              
        jdata.forEach(element => {          
            document.querySelector('#penddelv').innerHTML+=`<option value="${element.dlvno}">${element.dlvno}</option>`;
          })          
        }) 
      }
}

$('#penddelv').on('change', function(){
  var dlno=$(this).val();
  
  refreshreclist(dlno);
})

$('#cpitem').on('click',function(){
 // formdata=JSON.stringify({stid:6})
  $.ajax({
    url: '/stores/copy/',
    data: formdata, 
    method:'POST',       
    dataType: 'json',
    success: function (data) {               
      if(data.length===0){}
      else{              
          alert(data.msg);
      }                    
    },
    error: function(jqXHR, exception) {
      if(jqXHR.status === 500) {
          alert('Internal Server Error occurred. try again');
      }
    }
})

})


//////////////// issue stock //////////////////////////
var rqstno=document.querySelector('#rqstno')
$('#rqstore').on('change', function(){
  var stf=$(this).val();
  if(stf !== ''){
    fetch("/stores/pendorders/",{
    body:JSON.stringify({str:stf}),
    method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
      $("#rqstno").empty();
        if(data.length===0){
          rqstno.innerHTML+=`<option value='none'>none pending</option>`
        }
        else{
          rqstno.innerHTML+=`<option value='none'>-------------</option>`
          data.forEach((item)=>{            
            rqstno.innerHTML+=`<option value='${item.rqid}'>${item.rqid}</option>`
          });
        }
      }) 
    }
})

$('#isstore').on('change', function(){
  var stf=$('#rqstore').val();
  var stt=$(this).val();
  if(stf==stt){
    alert('Sorry!! store to issue cannot be same as store requesting');
    $(this).prop('selectedIndex',0);
  }
})


$('#rqstno').on('change', function(){
  fetchrqitems();

})
function fetchrqitems(){
  var rqno=$('#rqstno').val();
  var stid=$('#isstore').val();
  var requesttbbody=document.querySelector('#requesttbbody');
  if(rqno !== '' || rqno !=='none' || stid !=='none'){
    fetch("/stores/fetchrqitems/",{
    body:JSON.stringify({rqno:rqno,stid:stid}),
    method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
      $("#requesttb > tbody").empty();
        if(data.length===0){         
        }
        else{ 
          data.forEach((item)=>{    
            requesttbbody.innerHTML+=
            `<tr>
            <td style='display:none'>${item.orno}</td>             
            <td style='word-wrap:break-word'>${item.date}</td>            
            <td>${item.rqno}</td>                                
            <td style='word-wrap:break-word'>${item.itname}</td>                                
            <td>${item.rqnt}</td>                                
            <td>${item.avqnt}</td>                                
            <td>${item.rqby}</td>                                
            <td><textarea rows="1" type='text' cols="10" class='iss_qnt text-center' id="iss_qnt">${item.rqnt}</textarea></td>
            <td><textarea rows="1" type='text' cols="10" class='iss_to text-center' id="iss_to">${item.rqby}</textarea></td>
            <td><input class="btn btn-success" type="button" id="btnissue" value="Issue" ></td>                                
            <td><input class="btn btn-danger" type="button" id="btnissos" value="O.S" ></td> 
            <td style='display:none'>${item.itid}</td>                                

            </tr>`
          });          
        }
      }) 
    }

}
$('#requesttb').on('keyup','.iss_qnt',function(e){
  //tb.rows[i].cells[2].children[0].value
  
  var currenRow=$(this).closest("tr");   
  var qnt = parseFloat(e.target.value);
  var aval=parseFloat(currenRow.find("td:eq(5)").text());
  if(isNaN(qnt) || qnt <=0){
    alert('please enter a valid number')
    $(this).val('');
  }
  else if(qnt>aval){  
    alert('issue cannot be greater than available'); 
    $(this).val('0');
  }
})

$("#requesttb").on('click', '#btnissos', function() { 
  var currentRow=$(this).closest("tr");   
  var pk=currentRow.find("td:eq(0)").text(); 
  
  var itname=currentRow.find("td:eq(3)").text();
  var avlq=currentRow.find("td:eq(5)").text();
  
  if(confirm('Record('+itname+') with balance('+avlq+') as out of stock?')){
    //send the entry number
    formdata=JSON.stringify({entno:pk})
    $.ajax({
      url: '/stores/confirm_os/',
      data: formdata, 
      method:'POST',       
      dataType: 'json',
      success: function (data) {               
        if(data.length===0){}
        else{              
            alert(data.msg);
            //fetchrqitems();
            currentRow.remove();
        }                    
      },
      error: function(jqXHR, exception) {
        if(jqXHR.status === 500) {
            alert('Internal Server Error occurred. try again');
        }
      }
  })
  
  }

})


$("#requesttb").on('click', '#btnissue', function() { 
  var rqstore=$('#rqstore').val();
  var isstore=$('#isstore').val();

  var currentRow=$(this).closest("tr"); 

  var pk=currentRow.find("td:eq(0)").text();   
  var itname=currentRow.find("td:eq(3)").text();
  var itid=currentRow.find("td:eq(11)").text();
  var isqnt=currentRow.find("td:eq(7)").children(0).val();  
  var isto=currentRow.find("td:eq(8)").children(0).val();

  if(confirm('issue('+itname+') Amount ('+isqnt+') to '+isto+'?')){
    //send the entry number
    formdata=JSON.stringify({
      stf:rqstore,
      stt:isstore,
      entno:pk,
      itid:itid,
      isqnt:isqnt,
      isto:isto
    })
    $.ajax({
      url: '/stores/confirm_issue/',
      data: formdata, 
      method:'POST',       
      dataType: 'json',
      success: function (data) {               
        if(data.length===0){}
        else{              
            alert(data.msg);
            //fetchrqitems();
            currentRow.remove();
        }                    
      },
      error: function(jqXHR, exception) {
        if(jqXHR.status === 500) {
            alert('Internal Server Error occurred. try again');
        }
      }
  }) 
  
  }
})

/////////////// stock prices ///////////////////////
var tblpricesbody=document.querySelector('#tblpricesbody');
/*$('#stridprice').on('change',function(){
  var itname = $('#itempsearch').val();
  var stid = $(this).val();
  if(stid !=='' || stid !=='none'){
    $('#spinners').show();
    fetch("/stores/fetchprices/",{
      body:JSON.stringify({stid:stid,itname:itname}),
      method: "POST",
      })
      .then((res)=>res.json())
      .then((data)=>{
        $('#spinners').hide();

        $("#tblprices > tbody").empty();
          if(data.length===0){         
          }
          else{ 
            data.forEach((item)=>{    
              tblpricesbody.innerHTML+=
              `<tr>
                  <td style="display:none;">${item.entn}</td>                 
                  <td style='word-wrap:break-word'>${item.itname}</td>                                         
                  <td>${item.np}</td>                                             
                  <td>${item.sp}</td> 
                  <td>${item.itcat}</td>                                            
                  <td>${item.staff}</td>
                  <td><input class="btn btn-success" type="button" id="btnupdprice" value="Update" ></td>
             </tr>`
            });          
          }
        })
  }
})

$('#itempsearch').on('keyup',function(){
  var value = $(this).val().toLowerCase();
    $("#tblprices tbody tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
}) */

$('#itempsearch').on('keyup',function(){
  var itname = $(this).val();
  var stid = $('#stridprice').val();
  if(stid !=='' || stid !=='none'){
    $('#spinners').show();
    fetch("/stores/fetchprices/",{
      body:JSON.stringify({stid:stid,itname:itname}),
      method: "POST",
      })
      .then((res)=>res.json())
      .then((data)=>{
        $('#spinners').hide();

        $("#tblprices > tbody").empty();
          if(data.length===0){         
          }
          else{ 
            data.forEach((item)=>{    
              tblpricesbody.innerHTML+=
              `<tr>
                  <td style="display:none;">${item.entn}</td>                 
                  <td style='word-wrap:break-word'>${item.itname}</td>                                         
                  <td contenteditable>${item.np}</td>                                             
                  <td contenteditable>${item.sp}</td> 
                  <td>${item.itcat}</td>                                            
                  <td>${item.staff}</td>
                  <td><input class="btn btn-success" type="button" id="btnupdprice" value="Update" ></td>
             </tr>`
            });          
          }
        })
  }
})

$("#tblprices").on('click', '#btnupdprice', function() { 
  var currentRow=$(this).closest("tr"); 

  var pk=currentRow.find("td:eq(0)").text();   
  var np=parseFloat(currentRow.find("td:eq(2)").text());
  var sp=parseFloat(currentRow.find("td:eq(3)").text());
  
    if(isNaN(np) ||isNaN(sp)){
      alert('enter prices appropriately');
    }
    else{
      if(np=='' || sp =='' || np<0||sp<0){
        alert('enter prices appropriately');
      }
      else{
        var fdata=JSON.stringify({ent:pk,np:np,sp:sp});
        $.ajax({
          url: '/stores/changeprice/',
          data: fdata, 
          method:'POST',       
          dataType: 'json',
          success: function (data) {               
            if(data.length===0){}
            else{              
                alert(data.msg);
            }                    
          },
          error: function(jqXHR, exception) {
            if(jqXHR.status === 500) {
                alert('Internal Server Error occurred. try again');
            }
          }
      })
      }
    }
  

})