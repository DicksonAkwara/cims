$('#btnviewlist').on('click',function(){
    $('#dischargeModal').modal('show');
})


$('#patwards').on('change',function(){
   var ward=$(this).val();
   if(ward !=='none'){
    dischargelist(ward);
   }
})


var tbliplistbody=document.querySelector('#tbliplistbody');
function dischargelist(ward){
  var ward=ward;
  tbliplistbody.innerHTML='';
  fetch("/nurse/dischlist/",{
    body:JSON.stringify({ward:ward }),
    method: "POST",
})
.then((res)=>res.json())
.then((data)=>{
    if(data.length===0){
      tbliplistbody.innerHTML=`
      <tr>
        <td colspan='9'>No discharge found</td>
      </tr>`;
    }
    else{
      data.forEach((item)=>{
        tbliplistbody.innerHTML +=`
        <tr>
          <td>${item.pno}</td>
          <td>${item.pname}</td>
          <td>${item.page}</td>
          <td>${item.pgend}</td>
          <td>${item.adate}(${item.atime})</td>
          <td>${item.ddate}(${item.dtime})</td>          
          <td>${item.dischby}</td>
          <td>0</td>
          <td><button type="button" class="btn btn-primary btn-sm btnviewnotes">Summary</button></td>
          <td><button type="button" class="btn btn-info btn-sm btnloadpat">View</button></td>
        </tr>`;
      })
      
    }
})
}