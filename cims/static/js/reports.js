$('#dpt').on('change',function(){
    
    var depname=$(this).val();    
    var repname=document.querySelector('#dptrep');
    $("#dptrep").empty();
    fetch("/reports/report_name/",{
        body:JSON.stringify({ searchText:depname }),
        method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{       
        if(data.length===0){    
            
        }
        else{            
            repname.innerHTML=`<option value="">---Report Name--</option>`;         
            data.forEach((item)=>{
            repname.innerHTML+=`
            <option value="${item.id}">${item.reportName}</option>
            `;
            
          })
        }
    })
 })

 $('#dptrep').on('change',function(){
    var rpn=$(this).val();
    if(rpn==146||rpn==71){
        $('#storeModal').modal('show');
    }
    else{
        $('#datefrom').prop('disabled',false);
        $('#dateto').prop('disabled',false);
    }

 })

 $('#itemsearch').on('keyup', function(){
    var skey=$(this).val().toLowerCase();
    $("#reptableid tbody tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(skey) > -1)
    });

 })



 var tblhead=document.querySelector('#repthead');reptableid
 var tblbody=document.querySelector('#reptablebody');
 var tblid=document.querySelector('#reptableid');


$('#btngenerate').on('click', function(){
    var repname=$('#dptrep').val();
    var datefrom=$('#datefrom').val();
    var dateto=$('#dateto').val();       
    var stid=$('#rpstore').val();       
    var data=JSON.stringify({repname:repname,dtf:datefrom,dtt:dateto,stid:stid});
    $('#spinners').show();
    fetch("/reports/generate_report/",{
        body:data,
        method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
        $('#spinners').hide();
        tblbody.innerHTML='';
        if(data.length===0){    
            tblhead.innerHTML='';
            tblbody.innerHTML+=
                  `<tr><td>No entry found</td></tr>`; 
        }
        else{   
            tblbody.innerHTML='';
            tblhead.innerHTML='';
            if(repname=='1'){}
            else if(repname=='2'){
                tblhead.innerHTML+=
                `<tr>
                    <th  class="text-center" colspan='26'>MOH 204A under 5yrs register ${datefrom} and ${dateto}</th>                    
                </tr>`;

                tblhead.innerHTML+=
                `<tr>
                    <th colspan='5'>Op under 5 register</th>
                    <th colspan='2'>Health Facility:</th>
                    <th colspan='5'>Facility Name</th>
                    <th colspan='9'></th>
                    <th>Month:</th>
                    <th colspan='2'>Monthname</th>                    
                    <th>Year</th>                                      
                    <th>Year</th>
                </tr>`;
                

                tblbody.innerHTML+=
                `<tr>
                    <th>Sno</th>
                    <th>Date</th>
                    <th>Patient No</th>
                    <th>CWC no</th>
                    <th>Revisit</th>                    
                    <th>Fullname</th>                                      
                    <th>Age Yrs</th>
                    <th>sex</th>
                    <th>village</th>
                    <th>Phone</th>
                    <th>weight</th>
                    <th>height</th>
                    <th>temp</th>
                    <th>Danger Signs</th>
                    <th>Duration of illness</th>
                    <th>Diagnosis</th>
                    <th>Given:Vaccine</th>
                    <th>Hiv canceled/tested</th>
                    <th>Hiv Status</th>
                    <th>Nutrition</th>
                    <th>Treatment/prescription</th>
                    <th>Follow up(y/n)</th>
                    <th>Paid amount</th>
                    <th>receipt no</th>
                    <th>referral</th>
                    <th>remarks</th>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <th>#</th>
                    <th>A</th>
                    <th>B</th>
                    <th>C</th>
                    <th>D</th>
                    <th>E</th>                    
                    <th>F</th>                                      
                    <th>G</th>
                    <th>H</th>
                    <th>I</th>
                    <th>J</th>
                    <th>K</th>
                    <th>L</th>
                    <th>M</th>
                    <th>N</th>
                    <th>O</th>
                    <th>P</th>
                    <th>Q</th>
                    <th>R</th>
                    <th>S</th>
                    <th>T</th>
                    <th>U</th>
                    <th>V</th>
                    <th>W</th>
                    <th>X</th>
                    <th>Y</th>
                </tr>`;

                var ttv=0;
                var ptcnt=0;

                var jdata=data; 
                jdata.forEach(element => {                          
                tblbody.innerHTML+=
                  `<tr></tr>` 
                  //ttv= element.ttd; 
                  //ptcnt= element.ptcnt;             
                });
            }
            else if(repname=='3'){
                tblhead.innerHTML+=
                `<tr>
                    <th  class="text-center" colspan='22'>MOH 204B Over 5 Yrs Register ${datefrom} and ${dateto}</th>                    
                </tr>`;

                tblhead.innerHTML+=
                `<tr>
                    <th colspan='5'>OP OVER 5 REGISTER</th>
                    <th colspan='2'>HEALTH FACILITY:</th>
                    <th colspan='5'>Facility Name</th>
                    <th colspan='5'></th>
                    <th>MONTH:</th>
                    <th colspan='2'>Monthname</th>                    
                    <th>YEAR</th>                                      
                    <th>Year</th>
                </tr>`;
                

                tblbody.innerHTML+=
                `<tr>
                    <th>Sno</th>
                    <th>Date</th>
                    <th>Patient No</th>
                    <th>Revisit</th>                    
                    <th>Fullname</th>                                      
                    <th>Age Yrs</th>
                    <th>sex</th>
                    <th>village</th>
                    <th>Phone</th>
                    <th>weight</th>
                    <th>height</th>
                    <th>Temp</th>
                    <th>Visual Acuity</th>
                    <th>Hiv canceled/tested</th>
                    <th>Hiv Status</th>
                    <th>Nutrition</th>
                    <th>Diagnosis</th>
                    <th>Treatment/prescription</th>
                    <th>Paid amount</th>
                    <th>receipt no</th>
                    <th>referral</th>
                    <th>remarks</th>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <th>#</th>
                    <th>A</th>
                    <th>B</th>
                    <th>C</th>
                    <th>D</th>
                    <th>E</th>                    
                    <th>F</th>                                      
                    <th>G</th>
                    <th>H</th>
                    <th>I</th>
                    <th>J</th>
                    <th>K</th>
                    <th>L</th>
                    <th>M</th>
                    <th>N</th>
                    <th>O</th>
                    <th>P</th>
                    <th>Q</th>
                    <th>R</th>
                    <th>S</th>
                    <th>T</th>
                    <th>U</th>
                </tr>`;

                var ttv=0;
                var ptcnt=0;

                var jdata=data; 
                jdata.forEach(element => {                          
                tblbody.innerHTML+=
                  `<tr></tr>` 
                  //ttv= element.ttd; 
                  //ptcnt= element.ptcnt;             
                });
            }
            else if(repname=='4'){
                tblhead.innerHTML+=
                `<tr>
                    <th  class="text-center" colspan='18'>IN-PATIENT REGISTER MOH 301${datefrom} and ${dateto}</th>                    
                </tr>`;

                tblhead.innerHTML+=
                `<tr>
                    <th colspan='5'>IN PATIENT REGISTER</th>
                    <th colspan='2'>HEALTH FACILITY:</th>
                    <th colspan='3'>Facility Name</th>
                    <th colspan='3'></th>
                    <th>MONTH:</th>
                    <th colspan='2'>Monthname</th>                    
                    <th>YEAR</th>                                      
                    <th>Year</th>
                </tr>`;
                

                tblbody.innerHTML+=
                `<tr>
                    <th>Sno</th>
                    <th>Admission Date</th>
                    <th>Patient No</th>                   
                    <th>Fullname</th>                                      
                    <th>Age Yrs</th>
                    <th>sex</th>
                    <th>Sub-Location</th>
                    <th>village</th>
                    <th>Phone</th>
                    <th>Hiv canceled/tested</th>
                    <th>Hiv Status</th>
                    <th>Nutrition</th>
                    <th>Diagnosis</th>
                    <th>Treatment/prescription</th>
                    <th>Discharge Date</th>
                    <th>OutCome</th>
                    <th>Referral</th>
                    <th>Remarks</th>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <th>#</th>
                    <th>A</th>
                    <th>B</th>
                    <th>C</th>
                    <th>D</th>
                    <th>E</th>                    
                    <th>F</th>                                      
                    <th>G</th>
                    <th>H</th>
                    <th>I</th>
                    <th>J</th>
                    <th>K</th>
                    <th>L</th>
                    <th>M</th>
                    <th>N</th>
                    <th>O</th>
                    <th>P</th>
                    <th>Q</th>
                </tr>`;

                var ttv=0;
                var ptcnt=0;

                var jdata=data; 
                jdata.forEach(element => {                          
                tblbody.innerHTML+=
                  `<tr></tr>` 
                  //ttv= element.ttd; 
                  //ptcnt= element.ptcnt;             
                });
            }
            else if(repname=='5'){}
            else if(repname=='6'){}
            else if(repname=='7'){}
            else if(repname=='8'){}
            else if(repname=='9'){}
            else if(repname=='10'){}
            else if(repname=='11'){}
            else if(repname=='12'){}
            else if(repname=='13'){}
            else if(repname=='14'){
                tblhead.innerHTML+=
                `<tr>
                    <th  class="text-center" colspan='15'>MONTHLY WORKLOAD REPORT BETWEEN ${datefrom} and ${dateto}</th>                    
                </tr>`;

                tblhead.innerHTML+=
                `<tr>                    
                    <th colspan='2'>HEALTH FACILITY:</th>
                    <th colspan='3'>Facility Name</th>
                    <th colspan='2'>SUB-COUNTY</th>
                    <th colspan='2'>subcounty:</th>
                    <th colspan='2'>COUNTY</th>                    
                    <th colspan='2'>county name</th>                                     
                    <th>today's date</th>
                    <th>MOH 717</th>
                </tr>`;                

                tblbody.innerHTML+=
                `<tr>
                    <th colspan='15'>A. OUTPATIENT SERVICES</th>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <th colspan='9'>A1.GENERAL OUTPATIENTS(FILTER-CLINICS)</th>
                    <th colspan='2'>NEW</th>
                    <th colspan='2'>RE-ATT</th>
                    <th colspan='2'>TOTAL</th>
                </tr>`;


                tblbody.innerHTML+=
                `<tr>
                    <td colspan='2'>A.1.1</td>
                    <td colspan='7'>Over 5 male</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                </tr>`;
                tblbody.innerHTML+=
                `<tr>
                    <td colspan='2'>A.1.2</td>
                    <td colspan='7'>Over 5 female</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='2'>A.1.3</td>
                    <td colspan='7'>Children under 5 male</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='2'>A.1.4</td>
                    <td colspan='7'>Children under 5 female</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='2'>A.1.5</td>
                    <td colspan='7'>Over 60 years</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <th colspan='2'>A.1.6</th>
                    <th colspan='7'>TOTAL GENERAL OUTPATIENTS</th>
                    <th colspan='2'></th>
                    <th colspan='2'></th>
                    <th colspan='2'></th>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <th colspan='2'>A.2</th>
                    <th colspan='7'>CASUALTY</th>
                    <th colspan='2'></th>
                    <th colspan='2'></th>
                    <th colspan='2'></th>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <th colspan='15'>A3.SPECIAL CLINICS(if recorded separately from general filter clinics)</th>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='2'>A.3.1</td>
                    <td colspan='7'>E.N.T Clinic</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='2'>A.3.2</td>
                    <td colspan='7'>Eye Clinic</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='2'>A.3.3</td>
                    <td colspan='7'>TB and Leprosy</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='2'>A.3.4</td>
                    <td colspan='7'>Comprehensive Care Clinic</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='2'>A.3.5</td>
                    <td colspan='7'>Psychiatry</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='2'>A.3.6</td>
                    <td colspan='7'>Othopaedic Clinic</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='2'>A.3.7</td>
                    <td colspan='7'>Occupational Therapy Clinic</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='2'>A.3.8</td>
                    <td colspan='7'>Physiotherapy Clinic</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='2'>A.3.9</td>
                    <td colspan='7'>Medical Clinic</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='2'>A.3.10</td>
                    <td colspan='7'>Surgical Clinic</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='2'>A.3.11</td>
                    <td colspan='7'>Paediatric Clinic</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='2'>A.3.12</td>
                    <td colspan='7'>Gynaecological Clinic</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='2'>A.3.13</td>
                    <td colspan='7'>Nutritional Clinic</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='2'>A.3.14</td>
                    <td colspan='7'>Oncology Clinic</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='2'>A.3.15</td>
                    <td colspan='7'>Renal Clinic</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='2'>A.3.16</td>
                    <td colspan='7'>All other Special Clinic</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <th colspan='2'>A.3.17</th>
                    <th colspan='7'>TOTAL SPECIAL CLINICS</th>
                    <th colspan='2'></th>
                    <th colspan='2'></th>
                    <th colspan='2'></th>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <th colspan='15'>A.4 MCH/FP CLIENTS</th>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='2'>A.4.1</td>
                    <td colspan='7'>CWC Attendance</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='2'>A.4.2</td>
                    <td colspan='7'>ANC Attendance</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='2'>A.4.3</td>
                    <td colspan='7'>PNC Attendance</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='2'>A.4.4</td>
                    <td colspan='7'>FP Attendance</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <th colspan='2'>A.4.5</th>
                    <th colspan='7'>TOTAL MCH/FP</th>
                    <th colspan='2'></th>
                    <th colspan='2'></th>
                    <th colspan='2'></th>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <th colspan='15'>A.5 DENTAL CLINIC</th>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='2'>A.5.1</td>
                    <td colspan='7'>Dental Attendance(excluding filling and extractions)</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='2'>A.5.2</td>
                    <td colspan='7'>Fillings</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='2'>A.5.3</td>
                    <td colspan='7'>Extractions</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <th colspan='2'>A.5.4</th>
                    <th colspan='7'>Total Dental services</th>
                    <th colspan='2'></th>
                    <th colspan='2'></th>
                    <th colspan='2'></th>
                </tr>`;
                
                tblbody.innerHTML+=
                `<tr>
                    <th colspan='9'>A.6 Total Outpatient services(=A.1.6+A.2+A.3.7+A.4.5+A.5.4)</th>
                    <th colspan='2'></th>
                    <th colspan='2'></th>
                    <th colspan='2'></th>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <th colspan='9'>A.7 MEDICAL EXAMINATION(Except p3)</th>
                    <th colspan='2'></th>
                    <th colspan='2'>A.11 INJECTIONS</th>
                    <th colspan='2'></th>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <th colspan='9'>A.8 MEDICAL REPORTS(incl.p3,compesation,insurance,etc)</th>
                    <th colspan='2'></th>
                    <th colspan='2'>A.12 STITCHING</th>
                    <th colspan='2'></th>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <th colspan='9'>A.9 DRESSINGS</th>
                    <th colspan='2'></th>
                    <th colspan='2'>A.13 P.O.P</th>
                    <th colspan='2'></th>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <th colspan='9'>A.10 REMOVAL OF STICHES</th>
                    <th colspan='2'></th>
                    <th colspan='2'></th>
                    <th colspan='2'></th>
                </tr>`;
                
                //inpatient part
                tblbody.innerHTML+=
                `<tr>
                    <th colspan='2'>B.1 INPATIENTS</th>
                    <th>MEDICAL</th>
                    <th>SURGICAL</th>
                    <th>OBST/GNY</th>
                    <th>PAED</th>
                    <th>MATERNITY</th>
                    <th>EYE</th>
                    <th>NBU</th>
                    <th>ORTHO</th>
                    <th>ISOLATION</th>
                    <th>AMENITY</th>
                    <th>PSYCH</th>
                    <th>OTHER</th>
                    <th>TOTAL</th>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>B.1.1</td>
                    <td>Discharges</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>B.1.2</td>
                    <td>Deaths</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>B.1.3</td>
                    <td>Deaths due to confirmed malaria</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>B.1.4</td>
                    <td>Abscondees</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>`;
            
                tblbody.innerHTML+=
                `<tr>
                    <th>B.1.5 </th>
                    <th>TOTAL DISCHARGES,DEATHS, etc</th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <th>B.1.6</th>
                    <th colspan='14'>Admissions</th>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>B.1.6a</td>
                    <td>0-28 days</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>B.1.6b</td>
                    <td>Under five</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>B.1.6c</td>
                    <td>Over 5</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>B.1.6d</td>
                    <td>Under five with severe malaria</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>B.1.6e</td>
                    <td>over five with sever malaria</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>B.1.7</td>
                    <td>Paroles</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>B.1.8</td>
                    <td>Occupied beds-scheme members</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>B.1.9</td>
                    <td>Occupied beds-non-scheme memebers</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>B.1.10</td>
                    <td>Well person days</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>B.1.11</td>
                    <td>Beds Authorized</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>B.1.12</td>
                    <td>Beds-Actual Physical</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>B.1.13</td>
                    <td>Cots Authorised</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>B.1.14</td>
                    <td>Cots-Actual Physical</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>B.1.15</td>
                    <td>Incubator-Authorized</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>B.1.16</td>
                    <td>Cots -incubator Physical</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>`;


                tblbody.innerHTML+=
                `<tr>
                    <th colspan='3'>B.2 MATERNITY SERVICES </th>
                    <th colspan='2'>Number</th>
                    <th></th>
                    <th colspan='5'>B.3 OPERATIONS</th>
                    <th colspan='2'>NO.BOOKED</th>
                    <th colspan='2'>NO.operated</th>                
                </tr>`; 
                
                tblbody.innerHTML+=
                `<tr>
                    <td>B.2.1 </td>
                    <td colspan='2'>Normal Deliveries </td>
                    <td colspan='2'></td>
                    <td></td>
                    <td colspan='5'>B.3.1 Minor surgeries(excluding circumcision)</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>                
                </tr>`; 

                tblbody.innerHTML+=
                `<tr>
                    <td>B.2.2 </td>
                    <td colspan='2'>Caesirian sections </td>
                    <td colspan='2'></td>
                    <td></td>
                    <td colspan='5'>B.3.1.1 Emergencies</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>                
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>B.2.3 </td>
                    <td colspan='2'>Breech deliveries </td>
                    <td colspan='2'></td>
                    <td></td>
                    <td colspan='5'>B.3.1.2 Cold cases</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>                
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>B.2.4 </td>
                    <td colspan='2'>Assisted varginal deliveries </td>
                    <td colspan='2'></td>
                    <td></td>
                    <td colspan='5'>B.3.2 Circumcisions</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>                
                </tr>`;


                tblbody.innerHTML+=
                `<tr>
                    <td>B.2.5a </td>
                    <td colspan='2'>BBA(Born Before Arrival)</td>
                    <td colspan='2'></td>
                    <td></td>
                    <td colspan='5'>B.3.3 Major Surgeries</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>                
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>B.2.5b </td>
                    <td colspan='2'>Maternal Deaths</td>
                    <td colspan='2'></td>
                    <td colspan='11'></td>                
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>B.2.6 </td>
                    <td colspan='2'>Maternal Deaths Audited</td>
                    <td colspan='2'></td>
                    <td colspan='11'></td>                
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>B.2.7 </td>
                    <td colspan='2'>Live births</td>
                    <td colspan='2'></td>
                    <td colspan='11'></td>                
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>B.2.8 </td>
                    <td colspan='2'>Still births</td>
                    <td colspan='2'></td>
                    <td colspan='11'></td>                
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>B.2.9 </td>
                    <td colspan='2'>Neonatal Deaths</td>
                    <td colspan='2'></td>
                    <td colspan='11'></td>                
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>B.2.10 </td>
                    <td colspan='2'>Low birth weight babies(under 2500g)</td>
                    <td colspan='2'></td>
                    <td colspan='11'></td>                
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>B.2.11 </td>
                    <td colspan='2'>Total Discharges:new born</td>
                    <td colspan='2'></td>
                    <td colspan='11'></td>                
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <th colspan='5'>C.SPECIAL SERVICES(includes both inpatients and outpatients) </th>
                    <th colspan='2'>NUMBER</th>
                    <th colspan='4'></th>
                    <th colspan='2'>NUMBER</th>
                    <th colspan='2'>TOTAL</th>                
                </tr>`;
                
                tblbody.innerHTML+=
                `<tr>
                    <td>c.1</td>
                    <td colspan='2'>laboratory-number of tests </td>
                    <td colspan='2'>Routine</td>
                    <td></td>
                    <td colspan='5'>Special</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>                
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>c.2</td>
                    <td colspan='2'>Radiology-number of Examinations </td>
                    <td colspan='2'>Plain Without enhancement</td>
                    <td></td>
                    <td colspan='5'>Enhanced with constast media</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>                
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td></td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                    <td></td>
                    <td colspan='5'>Special with magnetic process(MRI,CT scan)</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>                
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td></td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>
                    <td></td>
                    <td colspan='5'>Total radiological reports</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>                
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>c.3</td>
                    <td colspan='2'>Physiotherapy-number of treatments</td>
                    <td colspan='2'>Private</td>
                    <td></td>
                    <td colspan='5'>Non private</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>                
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>c.4</td>
                    <td colspan='2'>Occupational Therapy-number of treatments</td>
                    <td colspan='2'>Private</td>
                    <td></td>
                    <td colspan='5'>Non private</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>                
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td>c.5</td>
                    <td colspan='2'>Orthopaedic technology-number of items prepared and issued</td>
                    <td colspan='2'>Private</td>
                    <td></td>
                    <td colspan='5'>Non private</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>                
                </tr>`;


                tblbody.innerHTML+=
                `<tr>
                    <td>c.6</td>
                    <td colspan='2'>Orthopaedic technology-number of items issued</td>
                    <td colspan='2'>Private</td>
                    <td></td>
                    <td colspan='5'>Non private</td>
                    <td colspan='2'></td>
                    <td colspan='2'></td>                
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <th colspan='3'>D.PHARMACY</th>
                    <th>No of Prescriptions</th>
                    <th></th>
                    <th colspan='2'>E.MORTUARY</th>
                    <th colspan='2'>NUMBER</th>
                    <th></th>
                    <th colspan='3'>F.MEDICAL RECORDS ISSUED</th> 
                    <th colspan='2'>NUMBER</th>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='3'>D.1 Common drugs</td>
                    <td></td>
                    <td></td>
                    <td colspan='2'>E.1 body days</td>
                    <td colspan='2'></td>
                    <td></td>
                    <td colspan='3'>F.1 new files/folders</td> 
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='3'>D.2 Antibiotics</td>
                    <td></td>
                    <td></td>
                    <td colspan='2'>E.2 Embalment</td>
                    <td colspan='2'></td>
                    <td></td>
                    <td colspan='3'>F.2 Outpatient cards/Booklet</td> 
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='3'>D.3 Special drugs</td>
                    <td></td>
                    <td></td>
                    <td colspan='2'>E.3 Post moterm</td>
                    <td colspan='2'></td>
                    <td colspan='6'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='3'>D.4 Drugs for children</td>
                    <td></td>
                    <td></td>
                    <td colspan='2'>E.4 Unclaimed bodies days</td>
                    <td colspan='2'></td>
                    <td colspan='6'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <th colspan='4'>G.FINANCE</th>
                    <td colspan='3'>G2. Clients waived</td>
                    <td colspan='2'></td>
                    <td colspan='4'>G4.Clients excempted</td>
                    <td colspan='2'></td>
                </tr>`;                

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='3'>G1.Available financing(ksh)</td>
                    <td colspan='1'></td>
                    <td colspan='3'>G3.Total waived(ksh)</td>
                    <td colspan='2'></td>
                    <td colspan='4'>G5.Total excempted(ksh)</td>
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='15'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <th colspan='5'>NAME</th>
                    <th colspan='4'>DESIGNATION</th>
                    <th colspan='4'>DATE</th>
                    <th colspan='2'>SIGNATURE</th>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='5'>Prepared by:</td>
                    <td colspan='4'></td>
                    <td colspan='4'></td>
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='5'>Checked by:</td>
                    <td colspan='4'></td>
                    <td colspan='4'></td>
                    <td colspan='2'></td>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <td colspan='5'>Received by:</td>
                    <td colspan='4'></td>
                    <td colspan='4'></td>
                    <td colspan='2'></td>
                </tr>`;


              

                var ttv=0;
                var ptcnt=0;

                var jdata=data; 
                jdata.forEach(element => {                          
                tblbody.innerHTML+=
                  `<tr></tr>`;
                  //ttv= element.ttd; 
                  //ptcnt= element.ptcnt;             
                });
            }
            else if(repname=='15'){}
            else if(repname=='16'){
                tblhead.innerHTML+=
                `<tr>
                    <th  class="text-center" colspan='12'>List of Visits between ${datefrom} and ${dateto}</th>                    
                </tr>`;
                tblhead.innerHTML+=
                `<tr>
                    <th>Date</th>
                    <th>Card No</th>
                    <th>Patient Name</th>
                    <th>Age</th>
                    <th>Gender</th>                    
                    <th>Phone No</th>
                    <th>Id number</th>                    
                    <th>NoK Phone</th>
                    <th>Residence</th>
                    <th>Clinic</th>
                    <th>Paymode</th>
                    <th>RegisteredBy</th>
                </tr>`;

                var ttv=0;
                var cash=0;
                var sch=0;
                var pcnt=0;
                var newp=0;
                var revp=0;

                var jdata=data; 
                jdata.forEach(element => {                          
                tblbody.innerHTML+=
                  `<tr>
                      <td style='word-wrap:break-word'>${element.date}(${element.time})</td>
                      <td>${element.cardno}</td>
                      <td>${element.name}</td>
                      <td>${element.age}</td>         
                      <td>${element.gend}</td>         
                      <td>${element.phone}</td>
                      <td>${element.idno}</td>           
                      <td>${element.nokph}</td>                                  
                      <td>${element.resd}</td>                                  
                      <td>${element.cli}</td>                                  
                      <td>${element.pym}</td>                                  
                      <td>${element.reg}</td>                                  
                  </tr>` 
                  ttv= element.ttv;             
                  cash= element.cash;             
                  sch= element.sch;             
                  pcnt= element.pcnt;             
                  newp= element.newp;             
                  revp= element.revp;             
                });
                /* setTimeout(function(){
                    var rowCount = $("#reptableid >tbody >tr").length;
                    alert(rowCount);
                },2000) 
                var counts=$(jdata).get(-1); //get the last element of an array
                */
           
               tblbody.innerHTML+=
                  `<tr>
                        <td>Total Visits:</td>                                  
                        <td><b>${ttv}</b></td> 
                        <td>New Cards:</td>                                  
                        <td><b>${newp}</b></td>
                        <td>Revisits:</td>                                  
                        <td><b>${revp}</b></td>
                        <td>Cash:</td>                                  
                        <td><b>${cash}</b></td> 
                        <td>Scheme:</td>                                 
                        <td><b>${sch}</b></td> 
                        <td>Total Patients:</td>                                 
                        <td><b>${pcnt}</b></td>
                  </tr>`

                

            }
            else if(repname=='17'){}

            else if(repname=='18'){
                var clinics=[];
                var fclinics=[];
                var dates=[];
                var fdates=[];
                var counts=[];
                var jdata=data.counts; 
                jdata.forEach(element => {
                    clinics.push(element.clinic);
                    dates.push(element.dte);
                    counts.push(element.cnt);

                 })
                 clinics.forEach(element => {
                    if (!fclinics.includes(element)) {
                        fclinics.push(element);
                    }
                });
                dates.forEach(element => {
                    if (!fdates.includes(element)) {
                        fdates.push(element);
                    }
                });

                /* console.log(fclinics);
                console.log(fdates);
                console.log(counts);
                console.log(fdates.length); */

                const group = [];
                const num=fdates.length;
                for (let i = 0; i < counts.length; i += num) {
                    group.push(counts.slice(i, i + num));
                }
                //console.log(group[0]);
                var i=0;
                while(i<fdates.length){
                    var dte=fdates[i];
                    for(let j=0;j<group[i].length;j++){
                       var m=group[i]; 
                        console.log(dte+'--'+m);                       
                        }
                                                           
                   i++;
                }
                

                
                tblhead.innerHTML=
                `<tr>
                    <th>Date</th>
                    <th>Card No</th>
                    <th>Patient Name</th>
                    <th>Age</th>
                    <th>Gender</th>                    
                    <th>Phone No</th>
                    <th>Id number</th>                    
                    <th>NoK Phone</th>
                    <th>Residence</th>
                    <th>Clinic</th>
                    <th>Paymode</th>
                    <th>RegisteredBy</th>
                </tr>`;

            }
            else if(repname=='19'){
                tblhead.innerHTML+=
                `<tr>
                    <th  class="text-center" colspan='12'>List of Admissions between ${datefrom} and ${dateto}</th>                    
                </tr>`;

                tblhead.innerHTML+=
                `<tr>
                    <th>Date</th>
                    <th>Patient No</th>
                    <th>Patient Name</th>
                    <th>Age</th>
                    <th>Gender</th>                    
                    <th>Phone No</th>                                      
                    <th>NoK Phone</th>
                    <th>Residence</th>
                    <th>Ward</th>
                    <th>Adm.Type</th>
                    <th>Paymode</th>
                    <th>RegisteredBy</th>
                </tr>`;

                var ttv=0;
                var nadm=0;
                var radm=0;
                var ptcnt=0;

                var jdata=data; 
                jdata.forEach(element => {                          
                tblbody.innerHTML+=
                  `<tr>
                      <td style='word-wrap:break-word'>${element.date}(${element.time})</td>
                      <td>${element.cardno}</td>
                      <td>${element.name}</td>
                      <td>${element.age}</td>         
                      <td>${element.gend}</td>         
                      <td>${element.phone}</td>                                
                      <td>${element.nokph}</td>                                  
                      <td>${element.resd}</td>                                  
                      <td>${element.cli}</td>                                  
                      <td>${element.atype}</td>                                  
                      <td>${element.pym}</td>                                  
                      <td>${element.reg}</td>                                  
                  </tr>` 
                  ttv= element.ttadm;             
                  nadm= element.nadm;             
                  radm= element.radm;             
                  ptcnt= element.ptcnt;             
                });
                /* setTimeout(function(){
                    var rowCount = $("#reptableid >tbody >tr").length;
                    alert(rowCount);
                },2000) 
                var counts=$(jdata).get(-1); //get the last element of an array
                */
           
               tblbody.innerHTML+=
                  `<tr>
                        <td>Total Visits:</td>                                  
                        <td colspan='2'><b>${ttv}</b></td> 
                        <td colspan='2'>New Admissions:</td>                                  
                        <td><b>${nadm}</b></td> 
                        <td colspan='2'>Re-admissions:</td>                                 
                        <td><b>${radm}</b></td> 
                        <td colspan='2'>Total Patients:</td>                                 
                        <td><b>${ptcnt}</b></td>
                  </tr>`
            }
            else if(repname=='20'){
                tblhead.innerHTML+=
                `<tr>
                    <th  class="text-center" colspan='11'>Discharged Patients between ${datefrom} and ${dateto}</th>                    
                </tr>`;

                tblhead.innerHTML+=
                `<tr>
                    <th>Date</th>
                    <th>Patient No</th>
                    <th>Patient Name</th>
                    <th>Age</th>
                    <th>Gender</th>                    
                    <th>Phone No</th>                                      
                    <th>NoK Phone</th>
                    <th>Residence</th>
                    <th>Ward</th>
                    <th>Discharge Status</th>
                    <th>DischargeBy</th>
                </tr>`;

                var ttv=0;
                var ptcnt=0;

                var jdata=data; 
                jdata.forEach(element => {                          
                tblbody.innerHTML+=
                  `<tr>
                      <td style='word-wrap:break-word'>${element.date}(${element.time})</td>
                      <td>${element.cardno}</td>
                      <td>${element.name}</td>
                      <td>${element.age}</td>         
                      <td>${element.gend}</td>         
                      <td>${element.phone}</td>                                
                      <td>${element.nokph}</td>                                  
                      <td>${element.resd}</td>                                  
                      <td>${element.cli}</td>                                 
                      <td>${element.cnd}</td>            
                      <td>${element.reg}</td>                                  
                  </tr>` 
                  ttv= element.ttd; 
                  ptcnt= element.ptcnt;             
                });
                /* setTimeout(function(){
                    var rowCount = $("#reptableid >tbody >tr").length;
                    alert(rowCount);
                },2000) 
                var counts=$(jdata).get(-1); //get the last element of an array
                */
           
               tblbody.innerHTML+=
                  `<tr>
                        <td>Discharges:</td>                                  
                        <td colspan='2'><b>${ttv}</b></td> 
                        <td colspan='2'>Patients:</td>                                 
                        <td><b>${ptcnt}</b></td>
                  </tr>`
            }
            else if(repname=='21'){}
            else if(repname=='22'){}
            else if(repname=='23'){}
            else if(repname=='24'){}
            else if(repname=='25'){}
            else if(repname=='26'){}
            else if(repname=='27'){}
            else if(repname=='28'){}
            else if(repname=='29'){}
            else if(repname=='30'){}
            else if(repname=='31'){}
            else if(repname=='32'){}
            else if(repname=='33'){}
            else if(repname=='34'){}
            else if(repname=='35'){}
            else if(repname=='36'){

                tblhead.innerHTML+=
                `<tr>
                    <th  class="text-center" colspan='8'>Cashier Receipt List between ${datefrom} and ${dateto}</th>                    
                </tr>`;
                tblhead.innerHTML+=
                `<tr>
                    <th>Cashier</th>
                    <th>Date</th>  
                    <th>receipt No</th> 
                    <th>Patient No</th>  
                    <th>Patient Name</th>  
                    <th>Service</th>  
                    <th>Qnty</th>  
                    <th>Paid</th> 
                </tr>`;
                var ttcash=0;

                var jdata=data; 
                jdata.forEach(element => {                          
                tblbody.innerHTML+=
                  `<tr>                                                      
                      <td>${element.staff}</td>            
                      <td>${element.date}</td>            
                      <td>${element.rctno}</td>            
                      <td>${element.ptno}</td>            
                      <td>${element.ptname}</td>            
                      <td>${element.svs}</td>            
                      <td>${element.qnt}</td>            
                      <td>${parseInt(element.ttp).toLocaleString()}</td>                                  
                  </tr>` 
                  ttcash= element.ttsum;              
                });
                tblbody.innerHTML+=
                `<tr>                                 
                      <td colspan='8'class="text-right">Total Collection: <b>${parseInt(ttcash).toLocaleString()}</b></td>
                </tr>`

            }
            else if(repname=='37'){// total shifts

                tblhead.innerHTML+=
                `<tr>
                    <th  class="text-center" colspan='2'>Total Cash Collection between ${datefrom} and ${dateto}</th>                    
                </tr>`;
                tblhead.innerHTML+=
                `<tr>
                    <th>Cashier Username</th>
                    <th>Collected Amount(Ksh.)</th>                    
                </tr>`;
                var ttcash=0;

                var jdata=data; 
                jdata.forEach(element => {                          
                tblbody.innerHTML+=
                  `<tr>                                                      
                      <td>${element.cashier}</td>            
                      <td>${parseInt(element.ttrev).toLocaleString()}</td>                                  
                  </tr>` 
                  ttcash= element.ttsum;              
                });
                tblbody.innerHTML+=
                `<tr>
                      <td>Total Collection:</td>                                 
                      <td><b>${parseInt(ttcash).toLocaleString()}</b></td>
                </tr>`

            }
            else if(repname=='38'){

                tblhead.innerHTML+=
                `<tr>
                    <th  class="text-center" colspan='8'>Cashier Receipt List between ${datefrom} and ${dateto}</th>                    
                </tr>`;
                tblhead.innerHTML+=
                `<tr>                   
                    <th>Date</th>  
                    <th>receipt No</th> 
                    <th>Patient No</th>  
                    <th>Patient Name</th>   
                    <th>Paid</th> 
                    <th>Pay mode</th> 
                    <th>Tx number</th> 
                    <th>Cashier</th>
                </tr>`;
                var ttcash=0;

                var jdata=data; 
                jdata.forEach(element => {                          
                tblbody.innerHTML+=
                  `<tr> 
                      <td>${element.date}</td>            
                      <td>${element.rctno}</td>            
                      <td>${element.ptno}</td>            
                      <td>${element.ptname}</td>           
                      <td>${parseInt(element.ttp).toLocaleString()}</td> 
                      <td>${element.pmode}</td>                                 
                      <td>${element.tid}</td>                                 
                      <td>${element.staff}</td>                                 
                  </tr>` 
                  ttcash= element.ttsum;              
                });
                tblbody.innerHTML+=
                `<tr>                                 
                      <td colspan='6'class="text-right">Total Collection: <b>${parseInt(ttcash).toLocaleString()}</b></td>
                      <td></td>
                </tr>`

            }
            else if(repname=='39'){}
            else if(repname=='40'){}
            else if(repname=='41'){}
            else if(repname=='42'){// departmental revenue
                var ttcash=0;
                tblhead.innerHTML+=
                `<tr>
                    <th  class="text-center" colspan='2'>Departmental Cash Collection between ${datefrom} and ${dateto}</th>                    
                </tr>`;
                tblhead.innerHTML+=
                `<tr>
                    <th>Department Name</th>
                    <th>Collected Amount(Ksh.)</th>                    
                </tr>`;

                for (const [key, value] of Object.entries(data)) {
                    tblbody.innerHTML+=
                  `<tr>                                                      
                      <td>${key}</td>            
                      <td>${parseInt(value).toLocaleString()}</td>                                  
                  </tr>` 
                  //ttcash= data.ttsum;
                }              


            }
            else if(repname=='43'){}
            else if(repname=='44'){}
            else if(repname=='45'){}
            else if(repname=='46'){}
            else if(repname=='47'){}
            else if(repname=='48'){}
            else if(repname=='49'){}
            else if(repname=='50'){}
            else if(repname=='51'){}
            else if(repname=='52'){ //lab register moh 204
                tblhead.innerHTML+=`<tr>
                    <th  class="text-center" colspan='20'>Laboratory Register between ${datefrom} and ${dateto}</th>                    
                </tr>`;
                tblhead.innerHTML+=
                `<tr>
                    <th>Date</th>
                    <th>Visit No</th>  
                    <th>Card No</th>  
                    <th>Patient Name</th> 
                    <th>Phone</th> 
                    <th>Age(yrs)</th>  
                    <th>Sex</th>  
                    <th>Residence</th>  
                    <th>Diagnosis</th> 
                    <th>Specimen Type</th>  
                    <th>Investigation</th>  
                    <th>Collection Date</th>
                    <th>Request By</th>
                    <th>Result Date</th> 
                    <th>Charged</th> 
                    <th>Lab Officer</th> 
                    <th>Results</th> 
                </tr>`;
                var tests=0;
                var pat=0;

                var jdata=data; 
                jdata.forEach(element => {                          
                tblbody.innerHTML+=
                `<tr>           
                    <td>${element.rdate}</td>            
                    <td>${element.vno}</td>            
                    <td>${element.pno}</td>            
                    <td>${element.pname}</td>            
                    <td>${element.phone}</td>            
                    <td>${element.age}</td>            
                    <td>${element.gend}</td>            
                    <td>${element.resd}</td>            
                    <td>${element.diag}</td>            
                    <td>${element.stype}</td>            
                    <td>${element.test}</td>
                    <td>${element.recvdate}(${element.rtime})</td>                                  
                    <td>${element.doctor}</td>                                  
                    <td>${element.resdate}(${element.restime})</td>                                  
                    <td>${element.price}</td>                                  
                    <td>${element.lbtech}</td>                                  
                    <td><button class='btn btn-sm btn-secondary'>view</button></td> 
                    <td style='display:none'>${element.res}</td>                                   
                  </tr>`             
                  pat= element.ttpat;              
                  tests= element.tests;              
                });
                tblbody.innerHTML+=
                  `<tr>                                 
                        <td class='text-right' colspan='10'>Tests Done:<b>${parseInt(tests).toLocaleString()}</b></td>                                 
                        <td class='text-right' colspan='10'>Patients:<b>${parseInt(pat).toLocaleString()}</b></td>                                 
                      
                  </tr>`


            }
            else if(repname=='53'){}
            else if(repname=='54'){}
            else if(repname=='55'){}
            else if(repname=='56'){}
            else if(repname=='57'){}
            else if(repname=='58'){}
            else if(repname=='59'){}
            else if(repname=='60'){ //radiology register moh 209
                tblhead.innerHTML+=
                `<tr>
                    <th  class="text-center" colspan='17'>RADIOLOGY REGISTER MOH 209 ${datefrom} and ${dateto}</th>                    
                </tr>`;

                tblhead.innerHTML+=
                `<tr>
                    <th colspan='4'>RADIOLOGY REGISTER</th>
                    <th colspan='2'>HEALTH FACILITY:</th>
                    <th colspan='3'>Facility Name</th>
                    <th colspan='3'></th>
                    <th>MONTH:</th>
                    <th colspan='2'>Monthname</th>                    
                    <th>YEAR</th>                                      
                    <th>Year</th>
                </tr>`;
                

                tblbody.innerHTML+=
                `<tr>
                    <th>Sno</th>
                    <th>Date</th>
                    <th>Patient No</th>                   
                    <th>Rad.No</th>                                      
                    <th>Fullname</th>                                      
                    <th>Age Yrs</th>
                    <th>Sex</th>
                    <th>village</th>
                    <th>Phone</th>
                    <th>Examination</th>
                    <th>On Radiotherapy(y/n)</th>
                    <th>Interventional Radiotherapy</th>
                    <th>Referral</th>
                    <th>Referral Reason</th>
                    <th>Paid Amount</th>
                    <th>Receipt no</th>
                    <th>Remarks</th>
                </tr>`;

                tblbody.innerHTML+=
                `<tr>
                    <th>#</th>
                    <th>A</th>
                    <th>B</th>
                    <th>C</th>
                    <th>D</th>
                    <th>E</th>                    
                    <th>F</th>                                      
                    <th>G</th>
                    <th>H</th>
                    <th>I</th>
                    <th>J</th>
                    <th>K</th>
                    <th>L</th>
                    <th>M</th>
                    <th>N</th>
                    <th>O</th>
                    <th>P</th>
                </tr>`;

                var ttv=0;
                var ptcnt=0;

                var jdata=data; 
                jdata.forEach(element => {                          
                tblbody.innerHTML+=
                  `<tr></tr>` 
                  //ttv= element.ttd; 
                  //ptcnt= element.ptcnt;             
                });
            }
            else if(repname=='61'){ 
                tblhead.innerHTML+=`<tr>
                    <th  class="text-center" colspan='15'>Radiology between ${datefrom} and ${dateto}</th>                    
                </tr>`;
                tblhead.innerHTML+=
                `<tr>
                    <th>Receive Date</th>
                    <th>Visit No</th>  
                    <th>Card No</th>  
                    <th>Patient Name</th> 
                    <th>Phone</th> 
                    <th>Age(yrs)</th>  
                    <th>Sex</th>  
                    <th>Residence</th>  
                    <th>Diagnosis</th>                    
                    <th>Examination</th>                     
                    <th>Request by</th>                     
                    <th>Charged</th> 
                    <th>Radiologist</th> 
                    <th>Result Date</th>
                    <th>Signature</th> 
                </tr>`;
                var tests=0;
                var pat=0;

                var jdata=data; 
                jdata.forEach(element => {                          
                tblbody.innerHTML+=
                `<tr>           
                    <td>${element.rdate}</td>            
                    <td>${element.vno}</td>            
                    <td>${element.pno}</td>            
                    <td>${element.pname}</td>            
                    <td>${element.phone}</td>            
                    <td>${element.age}</td>            
                    <td>${element.gend}</td>            
                    <td>${element.resd}</td>            
                    <td>${element.diag}</td>
                    <td>${element.test}</td>       
                    <td>${element.doctor}</td>                                                    
                    <td>${element.price}</td>                                  
                    <td>${element.rdtech}</td>
                    <td>${element.resdate}(${element.restime})</td>                                  
                    <td>${element.sign}</td>                                  
                  </tr>`             
                  pat= element.ttpat;              
                  tests= element.tests;              
                });
                tblbody.innerHTML+=
                  `<tr>                                 
                        <td class='text-right' colspan='7'>Exams Done:<b>${parseInt(tests).toLocaleString()}</b></td>                                 
                        <td class='text-right' colspan='8'>Patients:<b>${parseInt(pat).toLocaleString()}</b></td>                                 
                      
                  </tr>`
            }
            
            else if(repname=='62'){}
            else if(repname=='63'){//prescriptions
                tblhead.innerHTML+=`<tr>
                    <th  class="text-center" colspan='11'>Doctor's Prescriptions between ${datefrom} and ${dateto}</th>                    
                </tr>`;
                tblhead.innerHTML+=
                `<tr>
                    <th>Date</th>
                    <th>CardNo</th>  
                    <th>Patient Name</th> 
                    <th>Age</th>  
                    <th>Drug/item</th> 
                    <th>dosage</th>  
                    <th>Freq</th>  
                    <th>Days</th>                     
                    <th>Qnt</th>                      
                    <th>Store</th> 
                    <th>Doctor</th>  
                </tr>`;
                var ttpat=0;

                var jdata=data; 
                jdata.forEach(element => {                          
                tblbody.innerHTML+=
                `<tr>           
                    <td>${element.pdate}(${element.ptime})</td>            
                    <td>${element.pno}</td>            
                    <td>${element.pname}</td>            
                    <td>${element.age}</td>            
                    <td>${element.drug}</td>            
                    <td>${element.dos}</td>            
                    <td>${element.freq}</td>            
                    <td>${element.days}</td>            
                    <td>${element.qnt}</td>
                    <td>${element.store}</td>
                    <td>${element.staff}</td>                                  
                  </tr>`             
                  ttpat= element.ttpresc;              
                });
            
                tblbody.innerHTML+=
                  `<tr>                                 
                        <td class='text-right' colspan='4'>Prescriptions:<b>${parseInt(ttpat).toLocaleString()}</b></td>                                 
                      
                  </tr>`

            }
            else if(repname=='64'){//out of stock dispensation
                tblhead.innerHTML+=
                `<tr>
                    <th  class="text-center" colspan='8'>Drugs/Items Delclared as Out of Stock between ${datefrom} and ${dateto}</th>                    
                </tr>`;
                tblhead.innerHTML+=
                `<tr>
                    <th>Date</th>
                    <th>CardNo</th>  
                    <th>Patient Name</th> 
                    <th>Age</th>  
                    <th>Drug/item</th>                      
                    <th>Qnt</th>                      
                    <th>Store</th> 
                    <th>Pharmacist</th>  
                </tr>`;
                var ttpat=0;
                var ttcash=0;

                var jdata=data; 
                jdata.forEach(element => {                          
                tblbody.innerHTML+=
                `<tr>           
                      <td>${element.ddate}</td>            
                      <td>${element.pno}</td>            
                      <td>${element.pname}</td>            
                      <td>${element.age}</td>            
                      <td>${element.drug}</td>
                      <td>${element.qnt}</td> 
                      <td>${element.store}</td>
                      <td>${element.staff}</td>                                  
                  </tr>`             
                  ttpat= element.ttpat;              
                });
            
                tblbody.innerHTML+=
                  `<tr>                                 
                        <td class='text-right' colspan='4'>Total Patients:<b>${parseInt(ttpat).toLocaleString()}</b></td>                                 
                      
                  </tr>` 
            }
            else if(repname=='65'){ //pharmacy dispensation
                tblhead.innerHTML+=
                `<tr>
                    <th  class="text-center" colspan='14'>Dispensed Drugs/Items between ${datefrom} and ${dateto}</th>                    
                </tr>`;
                tblhead.innerHTML+=
                `<tr>
                    <th>Date</th>
                    <th>CardNo</th>  
                    <th>Patient Name</th> 
                    <th>Age</th>  
                    <th>Drug/item</th>  
                    <th>dosage</th>  
                    <th>Freq</th>  
                    <th>Days</th>  
                    <th>Qnt</th> 
                    <th>Price</th> 
                    <th>Receipt</th> 
                    <th>Invoice</th> 
                    <th>Store</th> 
                    <th>Pharmacist</th>  
                </tr>`;
                var ttpat=0;
                var ttcash=0;

                var jdata=data; 
                jdata.forEach(element => {                          
                tblbody.innerHTML+=
                `<tr>           
                      <td>${element.ddate}</td>            
                      <td>${element.pno}</td>            
                      <td>${element.pname}</td>            
                      <td>${element.age}</td>            
                      <td>${element.drug}</td>            
                      <td>${element.dos}</td>            
                      <td>${element.freq}</td>            
                      <td>${element.days}</td>            
                      <td>${element.qnt}</td>            
                      <td>${parseInt(element.price).toLocaleString()}</td>                                   
                      <td>${element.rcp}</td>
                      <td>${element.inv}</td>
                      <td>${element.store}</td>
                      <td>${element.staff}</td>                                  
                  </tr>` 
                  ttcash= element.ttrev;              
                  ttpat= element.ttpat;              
                });
            
                tblbody.innerHTML+=
                  `<tr>                                 
                        <td class='text-right' colspan='7'>Total Patients:<b>${parseInt(ttpat).toLocaleString()}</b></td> 
                        <td class='text-right' colspan='7'>Value Dispensed:<b>${parseInt(ttcash).toLocaleString()}</b></td>                                 
                      
                  </tr>`
                

            }
            else if(repname=='66'){}
            else if(repname=='67'){}
            else if(repname=='68'){}
            else if(repname=='69'){}
            else if(repname=='70'){}
            else if(repname=='71'){//stock prices
                var stname=$('#rpstore option:selected').text();
                tblhead.innerHTML+=
                `<tr>
                    <th  class="text-center" colspan='12'>Stock Prices for ${stname} as at ${dateto}</th>                    
                </tr>`;
                tblhead.innerHTML+=
                `<tr>
                    <th>Item Name</th>
                    <th>Non-scheme price</th>
                    <th>Scheme price</th>
                </tr>`;

                var jdata=data; 
                jdata.forEach(element => {                          
                tblbody.innerHTML+=
                  `<tr> 
                      <td>${element.itname}</td>
                      <td>${element.cprice}</td>
                      <td>${element.sprice}</td>                                                     
                  </tr>`;                            
                });


            }
            else if(repname=='72'){// store deliveries
                tblhead.innerHTML+=
                `<tr>
                    <th  class="text-center" colspan='14'>Items Delivered between ${datefrom} and ${dateto}</th>                    
                </tr>`;
                tblhead.innerHTML+=
                `<tr>
                    <th>Date</th>
                    <th>Store</th>  
                    <th>Supplier</th>  
                    <th>Drug/item</th>  
                    <th>Package</th>  
                    <th>Package Count</th>  
                    <th>items/pkg</th>  
                    <th>Cost</th> 
                    <th>Delivery Note</th> 
                    <th>Delivered by</th> 
                    <th>Received by</th>  
                </tr>`;
                var ttcash=0;

                var jdata=data; 
                jdata.forEach(element => {                          
                tblbody.innerHTML+=
                `<tr>           
                      <td>${element.ddate}</td>            
                      <td>${element.store}</td>            
                      <td>${element.supp}</td>            
                      <td>${element.itname}</td>            
                      <td>${element.pkg}</td>            
                      <td>${element.pkgc}</td>            
                      <td>${element.pkgcn}</td>            
                      <td>${element.pval}</td>            
                      <td>${element.dnote}</td>                                   
                      <td>${element.delby}</td>
                      <td>${element.recby}</td>                                  
                  </tr>` 
                  ttcash= element.ttval;             
                });
            
                tblbody.innerHTML+=
                  `<tr>                                 
                        <td class='text-right' colspan='11'>Total Value :<b>${parseInt(ttcash).toLocaleString()}</b></td>  
                  </tr>`

            }
            else if(repname=='73'){}
            else if(repname=='74'){}
            else if(repname=='75'){}
            else if(repname=='76'){}
            else if(repname=='77'){}
            else if(repname=='78'){}
            else if(repname=='79'){}
            else if(repname=='80'){}
            else if(repname=='81'){}
            else if(repname=='82'){}
            else if(repname=='83'){}
            else if(repname=='84'){}
            else if(repname=='85'){}
            else if(repname=='86'){}
            else if(repname=='87'){}
            else if(repname=='88'){}
            else if(repname=='89'){}
            else if(repname=='90'){}
            else if(repname=='91'){}
            else if(repname=='92'){}
            else if(repname=='93'){}
            else if(repname=='94'){}
            else if(repname=='95'){}
            else if(repname=='96'){}
            else if(repname=='97'){}
            else if(repname=='98'){}
            else if(repname=='99'){}
            else if(repname=='101'){}
            else if(repname=='102'){}
            else if(repname=='103'){}
            else if(repname=='104'){}
            else if(repname=='105'){}
            else if(repname=='106'){}
            else if(repname=='107'){}
            else if(repname=='108'){}
            else if(repname=='109'){}
            else if(repname=='110'){}
            else if(repname=='111'){}
            else if(repname=='112'){}
            else if(repname=='113'){}
            else if(repname=='114'){}
            else if(repname=='115'){}
            else if(repname=='116'){}
            else if(repname=='117'){}
            else if(repname=='118'){}
            else if(repname=='119'){}
            else if(repname=='120'){}
            else if(repname=='121'){}
            else if(repname=='122'){}
            else if(repname=='123'){}
            else if(repname=='124'){}
            else if(repname=='125'){}
            else if(repname=='126'){}
            else if(repname=='127'){}
            else if(repname=='128'){}
            else if(repname=='129'){}
            else if(repname=='130'){}
            else if(repname=='131'){}
            else if(repname=='132'){}
            else if(repname=='133'){}
            else if(repname=='134'){}
            else if(repname=='135'){}
            else if(repname=='136'){}
            else if(repname=='137'){}
            else if(repname=='138'){}
            else if(repname=='139'){}
            else if(repname=='140'){}
            else if(repname=='141'){}
            else if(repname=='142'){}
            else if(repname=='143'){}
            else if(repname=='144'){}
            else if(repname=='145'){}
            else if(repname=='146'){// stock balances      
                var stname=$('#rpstore option:selected').text();
                tblhead.innerHTML+=
                `<tr>
                    <th  class="text-center" colspan='12'>Stock balances for ${stname} as at ${dateto}</th>                    
                </tr>`;
                tblhead.innerHTML+=
                `<tr>
                    <th style='display:none'>Code</th>
                    <th>Item Name</th>
                    <th>Balance</th>
                    <th>Reorder Level</th>
                    <th></th>
                </tr>`;

                var jdata=data; 
                jdata.forEach(element => {                          
                tblbody.innerHTML+=
                  `<tr>                      
                      <td style='display:none;'>${element.itid}</td>
                      <td>${element.itname}</td>
                      <td>${element.bal}</td>
                      <td>${element.reord}</td> 
                      <td><button class="btn btn-warning btn-sm btnledger">Transactions</button></td>                                 
                  </tr>`;                            
                });
            }
            else if(repname=='147'){}
            else if(repname=='148'){}
            else if(repname=='149'){}
            else if(repname=='150'){}
            
            
            
          
        }
    })


})
function html_table_to_excel(type)
    {
        var data = tblid;
        var rpname=$( "#dptrep option:selected" ).text();

        var file = XLSX.utils.table_to_book(data, {sheet: "sheet1"});

        XLSX.write(file, { bookType: type, bookSST: true, type: 'base64' });

        XLSX.writeFile(file, rpname+'.' + type);
    }

$('#exportexcel').on('click',function(){
    html_table_to_excel('xlsx');
})
$('#rpstore').on('change',function(){    
    $('#datefrom').prop('disabled',true);
    $('#dateto').prop('disabled',true);
    $('#storeModal').modal('hide')

})
